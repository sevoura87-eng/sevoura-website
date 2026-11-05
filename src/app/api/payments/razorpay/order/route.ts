import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { createRazorpayOrder, razorpayConfigured } from "@/lib/payments/razorpay";

/**
 * POST /api/payments/razorpay/order   { order_id }   (Authorization: Bearer <supabase access token>)
 * Creates a Razorpay order for an existing SEVOURA order. The amount comes from the
 * database, never from the browser. Returns 503 until Razorpay is configured.
 */
export async function POST(req: Request) {
  if (!razorpayConfigured()) {
    return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
  }
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "server_not_configured" }, { status: 503 });

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  const { data: userData, error: userErr } = await sb.auth.getUser(token);
  if (userErr || !userData.user) return NextResponse.json({ error: "not_authenticated" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { order_id?: string } | null;
  if (!body?.order_id) return NextResponse.json({ error: "order_id_required" }, { status: 400 });

  const { data: order } = await sb
    .from("orders")
    .select("id, order_number, user_id, total_paise, payment_status, status")
    .eq("id", body.order_id)
    .single();
  if (!order || order.user_id !== userData.user.id) return NextResponse.json({ error: "order_not_found" }, { status: 404 });
  if (order.status === "cancelled" || order.payment_status === "paid") {
    return NextResponse.json({ error: "order_not_payable" }, { status: 409 });
  }

  const rzp = await createRazorpayOrder(order.total_paise, order.order_number, { sevoura_order_id: order.id });
  await sb.from("payments").insert({
    order_id: order.id,
    provider: "razorpay",
    provider_order_id: rzp.id,
    amount_paise: order.total_paise,
    status: "pending",
  });

  return NextResponse.json({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID,
    razorpay_order_id: rzp.id,
    amount: order.total_paise,
    currency: "INR",
    order_number: order.order_number,
  });
}
