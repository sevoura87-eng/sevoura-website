"use client";

import { getSupabase } from "@/lib/supabase/client";

/**
 * Browser side of Razorpay Checkout. The browser never sees a secret and never decides
 * whether an order is paid — it only hands Razorpay's response to /api/payments/razorpay/verify.
 */

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayFailure = { error?: { description?: string; reason?: string; metadata?: { order_id?: string; payment_id?: string } } };
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", cb: (r: RazorpayFailure) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

export type PaymentOutcome =
  | { status: "paid" }
  | { status: "authorized" }
  | { status: "failed"; message: string }
  | { status: "dismissed" }
  | { status: "error"; message: string };

let statusCache: Promise<{ enabled: boolean; mode: "test" | "live" | null }> | null = null;

export function getPaymentStatus() {
  statusCache ??= fetch("/api/payments/status", { cache: "no-store" })
    .then((r) => r.json())
    .catch(() => ({ enabled: false, mode: null }));
  return statusCache;
}

let scriptPromise: Promise<boolean> | null = null;
function loadCheckoutScript() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve(true);
  scriptPromise ??= new Promise<boolean>((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

async function authed(path: string, body: unknown) {
  const sb = getSupabase();
  const { data } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  const token = data.session?.access_token;
  if (!token) throw new Error("not_authenticated");
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

const INIT_ERRORS: Record<string, string> = {
  order_already_paid: "This order has already been paid.",
  payment_processing: "A payment for this order is already being processed. Please refresh in a minute.",
  order_not_payable: "This order was cancelled and can't be paid.",
  order_not_found: "We couldn't find that order.",
  not_authenticated: "Please sign in again to pay.",
};

export async function payForOrder(orderId: string): Promise<PaymentOutcome> {
  const init = await authed("/api/payments/razorpay/order", { order_id: orderId }).catch((e) => ({
    ok: false,
    status: 0,
    json: { error: String(e?.message ?? e) },
  }));
  if (!init.ok) {
    const code = init.json?.error as string | undefined;
    return { status: "error", message: (code && INIT_ERRORS[code]) || "We couldn't start the payment. Please try again." };
  }
  if (!(await loadCheckoutScript()) || !window.Razorpay) {
    return { status: "error", message: "The payment window couldn't load. Check your connection and try again." };
  }

  const o = init.json as {
    key_id: string;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    order_number: string;
    prefill: { name: string; email: string; contact: string };
  };

  return new Promise<PaymentOutcome>((resolve) => {
    let lastFailure: string | null = null;
    let settled = false;
    const done = (r: PaymentOutcome) => {
      if (!settled) {
        settled = true;
        resolve(r);
      }
    };

    const rzp = new window.Razorpay!({
      key: o.key_id,
      order_id: o.razorpay_order_id,
      amount: o.amount,
      currency: o.currency,
      name: "SEVOURA",
      description: `Order ${o.order_number}`,
      image: `${window.location.origin}/sevoura-logo.png`,
      prefill: o.prefill,
      notes: { sevoura_order: o.order_number },
      theme: { color: "#792D49" },
      retry: { enabled: true },
      handler: async (resp: RazorpayResponse) => {
        const v = await authed("/api/payments/razorpay/verify", resp).catch(() => null);
        const st = v?.json?.status as string | undefined;
        if (st === "paid") done({ status: "paid" });
        else if (st === "authorized") done({ status: "authorized" });
        else if (st === "failed") done({ status: "failed", message: "The payment failed. No money was taken." });
        else
          done({
            status: "error",
            message: "We couldn't confirm the payment yet. If money was deducted, it will be confirmed automatically within a few minutes.",
          });
      },
      modal: {
        ondismiss: () =>
          done(lastFailure ? { status: "failed", message: lastFailure } : { status: "dismissed" }),
      },
    });

    rzp.on("payment.failed", (r) => {
      lastFailure = r.error?.description || "The payment failed.";
      const pid = r.error?.metadata?.payment_id;
      if (pid) authed("/api/payments/razorpay/failed", { razorpay_order_id: o.razorpay_order_id, razorpay_payment_id: pid }).catch(() => {});
    });
    rzp.open();
  });
}
