import { fetchRazorpayPayment } from "@/lib/payments/razorpay";
import { errorCode, json, ownedPayment, paymentContext } from "@/lib/payments/server";

/**
 * POST /api/payments/razorpay/failed   { razorpay_order_id, razorpay_payment_id }
 * Records a failed attempt reported by the checkout — but only after Razorpay confirms
 * the payment really failed. A failed attempt never overrides a successful payment.
 */
export async function POST(req: Request) {
  const ctx = await paymentContext(req, { gate: false });
  if (!ctx.ok) return ctx.res;
  const { sb, user } = ctx;

  const b = (await req.json().catch(() => null)) as { razorpay_order_id?: string; razorpay_payment_id?: string } | null;
  if (!b?.razorpay_order_id || !b.razorpay_payment_id) return json({ error: "missing_fields" }, 400);
  const row = await ownedPayment(sb, user.id, b.razorpay_order_id);
  if (!row) return json({ error: "order_not_found" }, 404);

  try {
    const payment = await fetchRazorpayPayment(b.razorpay_payment_id);
    if (payment.order_id !== b.razorpay_order_id) return json({ error: "payment_order_mismatch" }, 400);
    if (payment.status !== "failed") return json({ status: payment.status });
    await sb.rpc("rzp_mark_failed", {
      p_rzp_order_id: b.razorpay_order_id,
      p_rzp_payment_id: payment.id,
      p_reason: payment.error_description ?? "Payment failed",
    });
    return json({ status: "failed" });
  } catch (e) {
    console.error("[razorpay/failed]", errorCode(e));
    return json({ error: "lookup_failed" }, 502);
  }
}
