/**
 * Supabase Edge Function: order-confirmation
 *
 * Sends "Thank You for Your Order — SEVOURA" from SEVOURA <hello@sevoura.com> for PAID orders, at most once.
 *
 * Called by:
 *   - the database trigger orders_send_confirmation (when an order's payment_status becomes 'paid'):
 *       POST { "order_id": "<uuid>" }
 *   - the pg_cron job email-confirmation-retry (every 15 min) to retry anything that failed:
 *       POST { "sweep": true }
 *
 * Safety: the caller cannot choose the recipient or content. The function only ever emails the
 * registered address of a PAID, non-cancelled order, and public.email_claim() lets each order's
 * confirmation through exactly once (Resend's idempotency key is a second guard).
 *
 * Secrets (Supabase → Edge Functions → Secrets): RESEND_API_KEY. Optional: EMAIL_FROM, EMAIL_REPLY_TO.
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
 */
import { createClient } from "jsr:@supabase/supabase-js@2";
import { renderOrderConfirmation, type ConfirmationOrder } from "./template.ts";

const KIND = "order_confirmation";
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Outcome = "sent" | "already_sent" | "not_paid" | "no_recipient" | "failed" | "not_found";

async function sendEmail(to: string, msg: { subject: string; html: string; text: string }, idempotencyKey: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { ok: false as const, error: "email_not_configured" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({
        from: Deno.env.get("EMAIL_FROM") || "SEVOURA <hello@sevoura.com>",
        reply_to: Deno.env.get("EMAIL_REPLY_TO") || "hello@sevoura.com",
        to: [to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    const body = (await r.json().catch(() => ({}))) as { id?: string; name?: string; message?: string };
    if (r.ok && body.id) return { ok: true as const, id: body.id };
    return { ok: false as const, error: `${r.status} ${body.name ?? ""} ${body.message ?? ""}`.trim() };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? `${e.name}: ${e.message}` : "network_error" };
  }
}

async function confirm(orderId: string): Promise<Outcome> {
  const { data: order, error } = await sb
    .from("orders")
    .select(
      "id, order_number, created_at, user_id, customer_name, customer_email, ship_full_name, ship_phone, ship_house_number, ship_street_locality, ship_landmark, ship_city, ship_state, ship_pincode, subtotal_paise, shipping_paise, discount_paise, total_paise, status, payment_status, order_items(product_name, quantity, unit_price_paise, line_total_paise)",
    )
    .eq("id", orderId)
    .maybeSingle();
  if (error) throw error;
  if (!order) return "not_found";
  // only a confirmed payment — never pending, failed, abandoned or cancelled orders
  if (order.payment_status !== "paid" || order.status === "cancelled") return "not_paid";

  // the customer's registered account email; the checkout email only as a fallback
  let to: string | null = null;
  if (order.user_id) {
    const { data } = await sb.auth.admin.getUserById(order.user_id);
    to = data?.user?.email ?? null;
  }
  to = to || order.customer_email || null;
  if (!to) return "no_recipient";

  const { data: claimId, error: claimErr } = await sb.rpc("email_claim", { p_kind: KIND, p_ref_id: order.id, p_to: to });
  if (claimErr) throw claimErr;
  if (claimId === null || claimId === undefined) return "already_sent";

  const msg = renderOrderConfirmation({ ...(order as unknown as ConfirmationOrder), items: order.order_items ?? [] });
  const res = await sendEmail(to, msg, `${KIND}-${order.id}`);
  if (res.ok) {
    await sb.rpc("email_mark", { p_id: claimId, p_status: "sent", p_provider_id: res.id });
    console.log(`[order-confirmation] sent ${order.order_number}`);
    return "sent";
  }
  await sb.rpc("email_mark", { p_id: claimId, p_status: "failed", p_error: res.error });
  console.error(`[order-confirmation] failed ${order.order_number}: ${res.error}`);
  return "failed";
}

const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return reply({ error: "method_not_allowed" }, 405);
  let body: { order_id?: unknown; sweep?: unknown };
  try {
    body = await req.json();
  } catch {
    return reply({ error: "bad_json" }, 400);
  }
  try {
    if (body.sweep === true) {
      // retry recent confirmations that failed (e.g. sent before the key was configured)
      const { data: ids, error } = await sb.rpc("email_confirmations_due");
      if (error) throw error;
      const results: Record<string, Outcome> = {};
      for (const id of (ids as string[] | null) ?? []) results[id] = await confirm(id);
      return reply({ ok: true, retried: Object.keys(results).length, results });
    }
    const id = typeof body.order_id === "string" && /^[0-9a-f-]{36}$/i.test(body.order_id) ? body.order_id : null;
    if (!id) return reply({ error: "order_id_required" }, 400);
    return reply({ ok: true, outcome: await confirm(id) });
  } catch (e) {
    console.error("[order-confirmation] error", e instanceof Error ? e.message : e);
    return reply({ error: "internal_error" }, 500);
  }
});
