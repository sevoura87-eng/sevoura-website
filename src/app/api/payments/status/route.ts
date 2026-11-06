import { razorpayMode, razorpayUnavailableReason } from "@/lib/payments/razorpay";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { json } from "@/lib/payments/server";
import { connection } from "next/server";

/** GET /api/payments/status — tells the checkout whether online payment is available (no secrets). */
export async function GET() {
  await connection();
  const reason = razorpayUnavailableReason() ?? (getServiceSupabase() ? null : "server_not_configured");
  return json({ enabled: reason === null, mode: reason === null ? razorpayMode() : null, reason });
}
