import { getServiceSupabase } from "@/lib/supabase/admin";
import { fetchRazorpayPayment, verifyWebhookSignature } from "@/lib/payments/razorpay";
import { errorCode, json } from "@/lib/payments/server";

/**
 * POST /api/payments/razorpay/webhook
 * Razorpay Dashboard → Account & Settings → Webhooks → URL
 *   https://www.sevoura.com/api/payments/razorpay/webhook
 * Events: payment.captured, payment.failed, payment.authorized, order.paid, refund.processed
 *
 * - Every request is rejected unless X-Razorpay-Signature matches RAZORPAY_WEBHOOK_SECRET.
 * - Each X-Razorpay-Event-Id is processed once (Razorpay may deliver an event more than once);
 *   the id is recorded only after successful processing, so a failed attempt is retried.
 * - The database functions are idempotent as well, so concurrent duplicates are harmless.
 */
type PaymentEntity = { id: string; order_id: string; amount: number; status: string; method?: string; error_description?: string | null };
type RefundEntity = { id: string; payment_id: string; amount: number };

export async function POST(req: Request) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return json({ error: "webhook_not_configured" }, 503);
  const sb = getServiceSupabase();
  if (!sb) return json({ error: "server_not_configured" }, 503);

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) return json({ error: "invalid_signature" }, 400);

  let event: { event?: string; payload?: { payment?: { entity?: PaymentEntity }; refund?: { entity?: RefundEntity } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return json({ error: "bad_json" }, 400);
  }
  const eventName = event.event ?? "unknown";
  const eventId = req.headers.get("x-razorpay-event-id");

  if (eventId) {
    const { data: seen } = await sb.rpc("rzp_event_seen", { p_event_id: eventId });
    if (seen === true) return json({ ok: true, duplicate: true });
  }

  const p = event.payload?.payment?.entity;
  const record = () =>
    eventId
      ? sb.rpc("rzp_record_event", {
          p_event_id: eventId,
          p_event: eventName,
          p_order: p?.order_id ?? null,
          p_payment: p?.id ?? event.payload?.refund?.entity?.payment_id ?? null,
        })
      : Promise.resolve();
  const summary = p ? { id: p.id, status: p.status, method: p.method ?? null, amount: p.amount, event: eventName } : { event: eventName };

  try {
    switch (eventName) {
      case "payment.captured":
      case "order.paid": {
        if (!p?.order_id) break;
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
        if (p?.order_id) await sb.rpc("rzp_mark_authorized", { p_rzp_order_id: p.order_id, p_rzp_payment_id: p.id });
        break;
      case "payment.failed":
        if (p?.order_id)
          await sb.rpc("rzp_mark_failed", {
            p_rzp_order_id: p.order_id,
            p_rzp_payment_id: p.id,
            p_reason: p.error_description ?? "Payment failed",
            p_raw: summary,
          });
        break;
      case "refund.processed": {
        const r = event.payload?.refund?.entity;
        if (!r?.payment_id) break;
        // Ask Razorpay for the authoritative refunded total rather than trusting the event alone.
        const pay = await fetchRazorpayPayment(r.payment_id);
        const refunded = pay.amount_refunded ?? r.amount;
        await sb.rpc("rzp_mark_refunded", {
          p_rzp_payment_id: r.payment_id,
          p_amount_refunded: refunded,
          p_full: refunded >= pay.amount,
          p_raw: { refund_id: r.id, amount_refunded: refunded, event: eventName },
        });
        break;
      }
    }
    await record();
    return json({ ok: true });
  } catch (e) {
    const code = errorCode(e);
    console.error("[razorpay/webhook]", eventName, code);
    // amount mismatches are written to the admin activity log by the database; retrying won't help
    if (/amount_mismatch/.test(code)) {
      await record();
      return json({ ok: false, error: "amount_mismatch" });
    }
    return json({ error: "processing_failed" }, 500);
  }
}
