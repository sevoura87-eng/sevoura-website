import "server-only";

import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { razorpayUnavailableReason } from "@/lib/payments/razorpay";

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Common guard: Razorpay configured, server DB access available, caller signed in. */
export async function paymentContext(
  req: Request,
): Promise<{ ok: true; sb: SupabaseClient; user: User } | { ok: false; res: NextResponse }> {
  const reason = razorpayUnavailableReason();
  if (reason) return { ok: false, res: json({ error: reason }, 503) };
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, res: json({ error: "server_not_configured" }, 503) };

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { ok: false, res: json({ error: "not_authenticated" }, 401) };
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return { ok: false, res: json({ error: "not_authenticated" }, 401) };
  return { ok: true, sb, user: data.user };
}

/** The SEVOURA order behind a Razorpay order id, only if it belongs to this user. */
export async function ownedPayment(sb: SupabaseClient, userId: string, razorpayOrderId: string) {
  const { data } = await sb
    .from("payments")
    .select("id, order_id, amount_paise, status, orders!inner(id, user_id, order_number, total_paise)")
    .eq("provider_order_id", razorpayOrderId)
    .maybeSingle();
  const row = data as unknown as {
    id: string;
    order_id: string;
    amount_paise: number;
    status: string;
    orders: { id: string; user_id: string; order_number: string; total_paise: number };
  } | null;
  if (!row || row.orders.user_id !== userId) return null;
  return row;
}

export function errorCode(e: unknown) {
  const msg = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
  return msg.slice(0, 200);
}
