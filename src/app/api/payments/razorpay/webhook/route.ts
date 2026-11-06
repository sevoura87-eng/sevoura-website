import { getServiceSupabase } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { errorCode, json } from "@/lib/payments/server";

/**
 * POST /api/payments/razorpay/webhook
 * Razorpay dashboard → Webhooks → URL https://www.sevoura.com/api/payments/razorpay/webhook
 * Events: payment.captured, payment.failed, payment.authorized, order.paid
 * Every event is rejected unless its X-Razorpay-Signature matches RAZORPAY_WEBHOOK_SECRET.
 * Handlers are idempotent, so Razorpay's automatic retries can't double-count a payment.
 */
type Entity = { id: string; order_id: string; amount: number; status: string; method?: string; error_description?: string | null };

export async function POST(req: Request) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return json({ error: "webhook_not_configured" }, 503);
  const sb = getServiceSupabase();
  if (!sb) return json({ error: "server_not_configured" }, 503);

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) return json({ error: "invalid_signature" }, 400);

  let event: { event?: string; payload?: { payment?: { entity?: Entity } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  const p = event.payload?.payment?.entity;
  if (!p?.order_id) return json({ ok: true, ignored: true });
  const summary = { id: p.id, status: p.status, method: p.method ?? null, amount: p.amount, event: event.event };

  try {
    switch (event.event) {
      case "payment.captured":
      case "order.paid": {
        const { error } = await sb.rpc("rzp_mark_paid", {
          p_rzp_order_id: p.order_id,
          p_rzp_payment_id: p.id,
          p_amount_paise: p.amount,
          p_signature: null,
          p_source: "webhook",
          p_raw: summary,
        });
        if (error && !/payment_not_found/.test(error.message)) throw error;
        break;
      }
      case "payment.authorized":
        await sb.rpc("rzp_mark_authorized", { p_rzp_order_id: p.order_id, p_rzp_payment_id: p.id });
        break;
      case "payment.failed":
        await sb.rpc("rzp_mark_failed", {
          p_rzp_order_id: p.order_id,
          p_rzp_payment_id: p.id,
          p_reason: p.error_description ?? "Payment failed",
          p_raw: summary,
        });
        break;
    }
    return json({ ok: true });
  } catch (e) {
    // amount mismatches are logged in the activity log by the database and must not be retried forever
    const code = errorCode(e);
    console.error("[razorpay/webhook]", code);
    if (/amount_mismatch/.test(code)) return json({ ok: false, error: "amount_mismatch" });
    return json({ error: "processing_failed" }, 500);
  }
}
