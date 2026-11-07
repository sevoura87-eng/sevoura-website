import "server-only";

import crypto from "node:crypto";

/**
 * Razorpay server helpers. Secrets live ONLY in Vercel environment variables
 * (never NEXT_PUBLIC_, never in git):
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
 *
 * Live payments are open to every customer whenever live keys are configured (approved by the
 * owner on 2026-11-07). Emergency switch: RAZORPAY_LIVE_PAUSED=true stops NEW payments from
 * starting; payments already made are still verified and recorded.
 * Nothing here marks an order as paid without a verified signature + amount check.
 */

const API = "https://api.razorpay.com/v1";

export type RazorpayMode = "test" | "live";

export function razorpayMode(): RazorpayMode | null {
  const id = process.env.RAZORPAY_KEY_ID ?? "";
  if (id.startsWith("rzp_test_")) return "test";
  if (id.startsWith("rzp_live_")) return "live";
  return null;
}

export function liveOpenToAll() {
  return process.env.RAZORPAY_LIVE_PAUSED !== "true";
}

/**
 * Why payments are unavailable for this visitor, or null when ready.
 * `email` = the signed-in customer's email (null for guests).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for call-site compatibility
export function razorpayUnavailableReason(email?: string | null): string | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return "payments_not_configured";
  const mode = razorpayMode();
  if (!mode) return "payments_not_configured";
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return "webhook_not_configured";
  if (mode === "live" && !liveOpenToAll()) return "payments_paused";
  return null;
}

function authHeader() {
  return "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
}

async function rzp<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(API + path, {
    method: init?.method ?? "GET",
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) throw new Error(`razorpay_${res.status}: ${json?.error?.description ?? "request failed"}`);
  return json;
}

export type RazorpayOrder = { id: string; amount: number; currency: string; status: string; receipt: string };
export type RazorpayPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  amount_refunded?: number;
  method?: string;
  error_description?: string | null;
};

export function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  return rzp<RazorpayOrder>("/orders", {
    method: "POST",
    body: { amount: amountPaise, currency: "INR", receipt: receipt.slice(0, 40), notes, payment_capture: 1 },
  });
}

export function fetchRazorpayPayment(paymentId: string) {
  return rzp<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}`);
}

export function captureRazorpayPayment(paymentId: string, amountPaise: number) {
  return rzp<RazorpayPayment>(`/payments/${encodeURIComponent(paymentId)}/capture`, {
    method: "POST",
    body: { amount: amountPaise, currency: "INR" },
  });
}

function safeEqualHex(expected: string, given: string) {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(given ?? "", "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Checkout handler signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret) */
export function verifyPaymentSignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string, secret = process.env.RAZORPAY_KEY_SECRET) {
  if (!secret || !razorpayOrderId || !razorpayPaymentId || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Webhook signature: HMAC_SHA256(raw_body, webhook_secret) */
export function verifyWebhookSignature(rawBody: string, signature: string, secret = process.env.RAZORPAY_WEBHOOK_SECRET) {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
