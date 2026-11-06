import { createRazorpayOrder, razorpayMode } from "@/lib/payments/razorpay";
import { errorCode, json, paymentContext } from "@/lib/payments/server";

/**
 * POST /api/payments/razorpay/order   { order_id }   (Authorization: Bearer <supabase access token>)
 * Creates — or reuses — the single Razorpay order for an existing SEVOURA order.
 * The amount is always the order total stored in the database (computed by place_order()
 * from product prices), never a number sent by the browser. Retries reuse the same
 * Razorpay order, so one SEVOURA order can never be charged twice.
 */
export async function POST(req: Request) {
  const ctx = await paymentContext(req);
  if (!ctx.ok) return ctx.res;
  const { sb, user } = ctx;

  const body = (await req.json().catch(() => null)) as { order_id?: string } | null;
  if (!body?.order_id || !/^[0-9a-f-]{36}$/i.test(body.order_id)) return json({ error: "order_id_required" }, 400);

  const { data: order } = await sb
    .from("orders")
    .select("id, order_number, user_id, total_paise, payment_status, status, ship_full_name, ship_phone")
    .eq("id", body.order_id)
    .maybeSingle();
  if (!order || order.user_id !== user.id) return json({ error: "order_not_found" }, 404);
  if (order.status === "cancelled") return json({ error: "order_not_payable" }, 409);
  if (order.payment_status === "paid" || order.payment_status === "refunded") return json({ error: "order_already_paid" }, 409);
  if (order.payment_status === "authorized") return json({ error: "payment_processing" }, 409);

  try {
    const { data: existing } = await sb.rpc("rzp_existing_order", { p_order_id: order.id });
    let razorpayOrderId = (existing as string | null) ?? null;
    if (!razorpayOrderId) {
      const created = await createRazorpayOrder(order.total_paise, order.order_number, {
        sevoura_order_id: order.id,
        sevoura_order_number: order.order_number,
      });
      if (created.amount !== order.total_paise) throw new Error("amount_mismatch");
      const { data: attached, error } = await sb.rpc("rzp_attach_order", {
        p_order_id: order.id,
        p_user_id: user.id,
        p_rzp_order_id: created.id,
        p_amount_paise: order.total_paise,
      });
      if (error) throw error;
      razorpayOrderId = (attached as { razorpay_order_id: string }).razorpay_order_id;
    }

    return json({
      key_id: process.env.RAZORPAY_KEY_ID, // public identifier, safe for the browser
      mode: razorpayMode(),
      razorpay_order_id: razorpayOrderId,
      amount: order.total_paise,
      currency: "INR",
      order_number: order.order_number,
      prefill: { name: order.ship_full_name, email: user.email ?? "", contact: `+91${order.ship_phone}` },
    });
  } catch (e) {
    console.error("[razorpay/order]", errorCode(e));
    return json({ error: "payment_init_failed" }, 502);
  }
}
