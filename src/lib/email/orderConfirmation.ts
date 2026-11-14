import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "./send";
import { renderOrderConfirmation, type ConfirmationOrder } from "./orderConfirmationTemplate";

const KIND = "order_confirmation";

export type ConfirmationOutcome = "sent" | "already_sent" | "not_paid" | "no_recipient" | "failed" | "not_found";

/**
 * Sends the "Thank you for your order" email for a PAID order, at most once.
 * Safe to call from every place that confirms a payment (checkout verification, webhook):
 * the email_log unique key lets exactly one caller send; the rest return "already_sent".
 * Never throws — email trouble must never affect the payment response.
 */
export async function sendOrderConfirmation(sb: SupabaseClient, orderId: string): Promise<ConfirmationOutcome> {
  try {
    const { data: order, error } = await sb
      .from("orders")
      .select(
        "id, order_number, created_at, user_id, customer_name, customer_email, ship_full_name, ship_phone, ship_house_number, ship_street_locality, ship_landmark, ship_city, ship_state, ship_pincode, subtotal_paise, shipping_paise, discount_paise, total_paise, status, payment_status, order_items(product_name, quantity, unit_price_paise, line_total_paise)",
      )
      .eq("id", orderId)
      .maybeSingle();
    if (error) throw error;
    if (!order) return "not_found";
    // only for a confirmed payment — never for pending, failed, abandoned or cancelled orders
    if (order.payment_status !== "paid" || order.status === "cancelled") return "not_paid";

    // the customer's registered (verified) account email; fall back to the address given at checkout
    let to: string | null = null;
    if (order.user_id) {
      const { data } = await sb.auth.admin.getUserById(order.user_id);
      to = data?.user?.email ?? null;
    }
    to = to || order.customer_email || null;
    if (!to) {
      console.error("[email] order_confirmation: no recipient", order.order_number);
      return "no_recipient";
    }

    const { data: claimId, error: claimErr } = await sb.rpc("email_claim", { p_kind: KIND, p_ref_id: order.id, p_to: to });
    if (claimErr) throw claimErr;
    if (claimId === null || claimId === undefined) return "already_sent";

    const msg = renderOrderConfirmation({ ...(order as unknown as ConfirmationOrder), items: order.order_items ?? [] });
    const res = await sendEmail({ to, ...msg, idempotencyKey: `${KIND}-${order.id}` });

    if (res.ok) {
      await sb.rpc("email_mark", { p_id: claimId, p_status: "sent", p_provider_id: res.id });
      return "sent";
    }
    // failed: recorded with the reason; a later confirmation (e.g. the webhook) may retry it
    await sb.rpc("email_mark", { p_id: claimId, p_status: "failed", p_error: res.error });
    console.error("[email] order_confirmation failed", order.order_number, res.error);
    return "failed";
  } catch (e) {
    console.error("[email] order_confirmation error", e instanceof Error ? e.message : e);
    return "failed";
  }
}
