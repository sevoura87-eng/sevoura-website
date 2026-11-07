"use client";

import Link from "next/link";
import Image from "@/components/shop/ProductImage";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Clock } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RequireAuth from "@/components/account/RequireAuth";
import Notice from "@/components/ui/Notice";
import Button from "@/components/ui/Button";
import OrderTimeline from "@/components/shop/OrderTimeline";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shop/StatusBadge";
import { getSupabase } from "@/lib/supabase/client";
import { formatDate, formatINR } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import type { Order, StatusHistory } from "@/lib/types";
import { getPaymentStatus, payForOrder } from "@/lib/payments/checkout";

const ease = [0.22, 1, 0.36, 1] as const;

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const placed = params.get("placed") === "1";
  const [paidNow, setPaidNow] = useState(params.get("paid") === "1");
  const [payMsg, setPayMsg] = useState<{ tone: "error" | "info" | "success"; text: string } | null>(() => {
    const p = params.get("payment");
    if (p === "failed") return { tone: "error", text: "Your payment didn't go through and no money was taken. Your order is saved — you can try again below." };
    if (p === "cancelled") return { tone: "info", text: "Payment was not completed. Your order is saved as Unpaid — you can pay below whenever you're ready." };
    if (p === "processing") return { tone: "info", text: "Your payment is being processed. This page will update automatically once it is confirmed." };
    if (p === "error") return { tone: "error", text: "We couldn't confirm the payment yet. If money was deducted, it will be confirmed automatically within a few minutes — please don't pay twice." };
    return null;
  });
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);
  const [paying, setPaying] = useState(false);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase()!;
    const [{ data: o }, { data: h }] = await Promise.all([
      sb.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle(),
      sb.from("order_status_history").select("*").eq("order_id", id).order("created_at"),
    ]);
    setOrder((o as Order) ?? null);
    setHistory((h as StatusHistory[]) ?? []);
  }, [id]);

  useEffect(() => {
    getPaymentStatus().then((s) => setPaymentsEnabled(s.enabled));
  }, []);

  async function pay() {
    setPaying(true);
    setPayMsg(null);
    const r = await payForOrder(id);
    setPaying(false);
    if (r.status === "paid") setPaidNow(true);
    else if (r.status === "authorized") setPayMsg({ tone: "info", text: "Your payment is being processed. This page will update automatically." });
    else if (r.status === "failed") setPayMsg({ tone: "error", text: r.message + " You can try again." });
    else if (r.status === "error") setPayMsg({ tone: "error", text: r.message });
    load();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    load();
    // live status updates from the store team
    const sb = getSupabase()!;
    const ch = sb
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, () => load())
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [id, load]);

  async function cancel() {
    if (!window.confirm("Cancel this order?")) return;
    setBusy(true);
    const { error } = await getSupabase()!.rpc("cancel_my_order", { p_order_id: id });
    setBusy(false);
    if (error) return setError(friendlyError(error));
    load();
  }

  if (order === undefined) return <div className="h-72 animate-pulse bg-[#EFE3D3]" />;
  if (order === null)
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-3xl">Order not found.</p>
        <Link href="/account" className="mt-5 inline-block text-[11px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">BACK TO MY ORDERS</Link>
      </div>
    );

  return (
    <div>
      {paidNow && order.payment_status === "paid" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="relative mb-10 overflow-hidden bg-[#792D49] p-8 text-[#FBF0E4] md:p-12"
        >
          <div className="pointer-events-none absolute inset-3 border border-[#D9B77D]/50" />
          <Sparkles className="text-[#E5C48B]" size={30} />
          <p className="relative mt-5 text-[9px] tracking-[0.34em] text-[#E5C48B]">PAYMENT RECEIVED</p>
          <h1 className="relative mt-3 font-serif text-4xl md:text-5xl">Thank you — your ritual begins.</h1>
          <p className="relative mt-4 max-w-2xl text-sm leading-7 text-[#F0DCD4]">
            We&apos;ve received {formatINR(order.total_paise)} for order <strong className="font-mono">{order.order_number}</strong>.
            We&apos;ll keep you updated here as it&apos;s packed and shipped.
          </p>
        </motion.div>
      )}
      {payMsg && order.payment_status !== "paid" && (
        <div className="mb-8"><Notice tone={payMsg.tone}>{payMsg.text}</Notice></div>
      )}
      {placed && !paidNow && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
          className="relative mb-10 overflow-hidden bg-[#792D49] p-8 text-[#FBF0E4] md:p-12"
        >
          <div className="pointer-events-none absolute inset-3 border border-[#D9B77D]/50" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#E4C38B]/30" />
          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
            <Sparkles className="text-[#E5C48B]" size={30} />
          </motion.div>
          <p className="relative mt-5 text-[9px] tracking-[0.34em] text-[#E5C48B]">ORDER CONFIRMED</p>
          <h1 className="relative mt-3 font-serif text-4xl md:text-5xl">Thank you — your ritual begins.</h1>
          <p className="relative mt-4 max-w-2xl text-sm leading-7 text-[#F0DCD4]">
            Your order <strong className="font-mono">{order.order_number}</strong> has been received. Payment is{" "}
            <strong>pending</strong> — nothing has been charged. We&apos;ll contact you on +91 {order.ship_phone} to complete payment before dispatch.
          </p>
        </motion.div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[9px] tracking-[0.34em] text-[#A77B4D]">ORDER</p>
          <p className="mt-2 font-mono text-2xl text-[#792D49] md:text-3xl">{order.order_number}</p>
          <p className="mt-1 text-xs text-[#806D60]">Placed {formatDate(order.created_at, true)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} payment={order.payment_status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>

      <div className="mt-8 border border-[#DCCAB5] bg-[#FCF7EF] p-6 md:p-8">
        <OrderTimeline status={order.status} history={history} />
        <p className="mt-6 flex items-center gap-2 text-[11px] text-[#9A8777]"><Clock size={12} /> This page updates automatically when your order status changes.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="border border-[#DCCAB5] bg-[#FCF7EF] p-6">
          <p className="text-[9px] tracking-[0.3em] text-[#A77B4D]">ITEMS</p>
          <ul className="mt-4 divide-y divide-[#E6D8C6]">
            {(order.order_items ?? []).map((it) => (
              <li key={it.id} className="flex gap-4 py-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#EFE3D3]">
                  {it.image_url && <Image src={it.image_url} alt="" fill sizes="80px" className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-serif text-lg leading-tight">{it.product_name}</p>
                  <p className="text-xs text-[#806D60]">{formatINR(it.unit_price_paise)} × {it.quantity}</p>
                </div>
                <p className="tabular-nums">{formatINR(it.line_total_paise)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-2 border-t border-[#DCCAB5] pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-[#806D60]">Subtotal</dt><dd>{formatINR(order.subtotal_paise)}</dd></div>
            <div className="flex justify-between"><dt className="text-[#806D60]">Shipping</dt><dd>{order.shipping_paise ? formatINR(order.shipping_paise) : "Free"}</dd></div>
            <div className="flex justify-between pt-2 text-base"><dt>Total</dt><dd className="font-serif text-3xl text-[#792D49]">{formatINR(order.total_paise)}</dd></div>
          </dl>
        </div>
        <div className="space-y-6">
          <div className="border border-[#DCCAB5] bg-[#FCF7EF] p-6 text-[13px] leading-6">
            <p className="text-[9px] tracking-[0.3em] text-[#A77B4D]">DELIVERING TO</p>
            <p className="mt-3 font-medium">{order.ship_full_name}</p>
            <p className="text-[#806D60]">{order.ship_house_number}, {order.ship_street_locality}</p>
            <p className="text-[#806D60]">{order.ship_city}, {order.ship_state} — {order.ship_pincode}</p>
            {order.ship_landmark && <p className="text-[#9A8777]">Landmark: {order.ship_landmark}</p>}
            <p className="text-[#806D60]">+91 {order.ship_phone}</p>
            {order.notes && <p className="mt-3 border-t border-[#E6D8C6] pt-3 text-[#806D60]">Note: {order.notes}</p>}
          </div>
          {error && <Notice tone="error">{error}</Notice>}
          {paymentsEnabled && order.status !== "cancelled" && (order.payment_status === "pending" || order.payment_status === "failed") && (
            <Button loading={paying} onClick={pay} className="w-full py-5">
              {order.payment_status === "failed" ? "RETRY PAYMENT" : "PAY NOW"} · {formatINR(order.total_paise)}
            </Button>
          )}
          {order.status === "order_placed" && (order.payment_status === "pending" || order.payment_status === "failed") && (
            <Button variant="outline" loading={busy} onClick={cancel} className="w-full">CANCEL ORDER</Button>
          )}
          <p className="text-[11px] leading-5 text-[#9A8777]">
            Questions? Write to <a className="underline" href="mailto:hello@sevoura.com">hello@sevoura.com</a> or call +91-9211877712 with your order number.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] overflow-x-clip bg-[#F8F1E7] px-5 py-14 text-[#481D30] md:px-10 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Link href="/account" className="mb-8 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#806D60] hover:text-[#792D49]">
            <ArrowLeft size={13} /> MY ORDERS
          </Link>
          <RequireAuth>
            <Suspense fallback={null}>
              <OrderDetail />
            </Suspense>
          </RequireAuth>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
