import { captureRazorpayPayment, fetchRazorpayPayment, verifyPaymentSignature } from "@/lib/payments/razorpay";
import { errorCode, json, ownedPayment, paymentContext } from "@/lib/payments/server";

/**
 * POST /api/payments/razorpay/verify
 *   { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Called by the checkout after Razorpay reports success. The order is marked PAID only if
 *   1. the HMAC signature is valid for our key secret,
 *   2. the order belongs to the signed-in customer,
 *   3. Razorpay itself confirms the payment is captured for this exact order and amount.
 */
export async function POST(req: Request) {
  const ctx = await paymentContext(req, { gate: false });
  if (!ctx.ok) return ctx.res;
  const { sb, user } = ctx;

  const b = (await req.json().catch(() => null)) as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  } | null;
  if (!b?.razorpay_order_id || !b.razorpay_payment_id || !b.razorpay_signature) return json({ error: "missing_fields" }, 400);

  if (!verifyPaymentSignature(b.razorpay_order_id, b.razorpay_payment_id, b.razorpay_signature)) {
    return json({ error: "invalid_signature", status: "unverified" }, 400);
  }

  const row = await ownedPayment(sb, user.id, b.razorpay_order_id);
  if (!row) return json({ error: "order_not_found" }, 404);

  try {
    let payment = await fetchRazorpayPayment(b.razorpay_payment_id);
    if (payment.order_id !== b.razorpay_order_id) return json({ error: "payment_order_mismatch" }, 400);
    if (payment.amount !== row.amount_paise) return json({ error: "amount_mismatch" }, 400);

    if (payment.status === "authorized") {
      try {
        payment = await captureRazorpayPayment(payment.id, row.amount_paise);
      } catch {
        await sb.rpc("rzp_mark_authorized", { p_rzp_order_id: b.razorpay_order_id, p_rzp_payment_id: payment.id });
        return json({ status: "authorized", order_id: row.order_id });
      }
    }

    if (payment.status === "captured") {
      const { error } = await sb.rpc("rzp_mark_paid", {
        p_rzp_order_id: b.razorpay_order_id,
        p_rzp_payment_id: payment.id,
        p_amount_paise: payment.amount,
        p_signature: b.razorpay_signature,
        p_source: "checkout_verify",
        p_raw: { id: payment.id, status: payment.status, method: payment.method ?? null, amount: payment.amount },
      });
      if (error) throw error;
      return json({ status: "paid", order_id: row.order_id });
    }

    if (payment.status === "failed") {
      await sb.rpc("rzp_mark_failed", {
        p_rzp_order_id: b.razorpay_order_id,
        p_rzp_payment_id: payment.id,
        p_reason: payment.error_description ?? "Payment failed",
      });
      return json({ status: "failed", order_id: row.order_id });
    }
    return json({ status: payment.status, order_id: row.order_id });
  } catch (e) {
    console.error("[razorpay/verify]", errorCode(e));
    return json({ error: "verification_failed" }, 502);
  }
}
