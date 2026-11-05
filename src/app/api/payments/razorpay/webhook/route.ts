import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { razorpayConfigured, verifyWebhookSignature } from "@/lib/payments/razorpay";

/**
 * POST /api/payments/razorpay/webhook — configure this URL in the Razorpay dashboard
 * (events: payment.captured, payment.failed). Only a signature-verified event whose
 * amount matches the order total can mark an order as paid.
 */
export async function POST(req: Request) {
  if (!razorpayConfigured()) return NextResponse.json({ error: "payments_not_configured" }, { status: 503 });
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "server_not_configured" }, { status: 503 });

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!signature || !verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const event = JSON.parse(raw) as {
    event: string;
    payload?: { payment?: { entity?: { id: string; order_id: string; amount: number; status: string; error_description?: string } } };
  };
  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id) return NextResponse.json({ ok: true });

  const { data: row } = await sb
    .from("payments")
    .select("id, order_id, amount_paise")
    .eq("provider_order_id", payment.order_id)
    .single();
  if (!row) return NextResponse.json({ ok: true });

  if (event.event === "payment.captured" && payment.amount === row.amount_paise) {
    await sb.from("payments").update({ status: "paid", provider_payment_id: payment.id, raw: event }).eq("id", row.id);
    await sb.from("orders").update({ payment_status: "paid" }).eq("id", row.order_id);
  } else if (event.event === "payment.failed") {
    await sb.from("payments").update({ status: "failed", provider_payment_id: payment.id, failure_reason: payment.error_description ?? null, raw: event }).eq("id", row.id);
  }
  return NextResponse.json({ ok: true });
}
