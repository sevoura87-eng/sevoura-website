"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Card, ErrorBox, Skeleton } from "@/components/admin/ui";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shop/StatusBadge";
import OrderTimeline from "@/components/shop/OrderTimeline";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { useAdminData, unwrap } from "@/components/admin/useAdminData";
import { getSupabase } from "@/lib/supabase/client";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, formatDate, formatINR } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import type { Order, OrderStatus, StatusHistory } from "@/lib/types";

interface Payment { id: string; provider: string; provider_payment_id: string | null; amount_paise: number; status: string; created_at: string }

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [next, setNext] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const { data, error, loading, reload } = useAdminData(async (sb) => {
    const [o, h, p] = await Promise.all([
      sb.from("orders").select("*, order_items(*)").eq("id", id).single(),
      sb.from("order_status_history").select("*").eq("order_id", id).order("created_at"),
      sb.from("payments").select("id, provider, provider_payment_id, amount_paise, status, created_at").eq("order_id", id).order("created_at"),
    ]);
    return { order: unwrap(o) as Order, history: unwrap(h) as StatusHistory[], payments: unwrap(p) as Payment[] };
  }, [id]);

  async function update() {
    if (!next) return;
    if (next === "cancelled" && !window.confirm("Cancel this order? Stock will be returned to inventory. This cannot be undone.")) return;
    setBusy(true);
    setMsg(null);
    const { error } = await getSupabase()!.rpc("admin_update_order_status", { p_order_id: id, p_status: next, p_note: note || null });
    setBusy(false);
    if (error) return setMsg({ tone: "error", text: friendlyError(error) });
    setMsg({ tone: "success", text: `Status updated to ${ORDER_STATUS_LABEL[next]}. The customer sees this immediately.` });
    setNext("");
    setNote("");
    reload();
  }

  if (error) return <ErrorBox message={error} />;
  if (loading || !data) return <Skeleton h={400} />;
  const o = data.order;
  const final = o.status === "delivered" || o.status === "cancelled";
  const address = `${o.ship_full_name}\n${o.ship_house_number}, ${o.ship_street_locality}\n${o.ship_landmark ? `Landmark: ${o.ship_landmark}\n` : ""}${o.ship_city}, ${o.ship_state} - ${o.ship_pincode}\nPhone: ${o.ship_phone}`;

  return (
    <>
      <Link href="/admin/orders" className="mb-5 inline-flex items-center gap-2 text-[11px] text-[#806D60] hover:text-[#792D49]"><ArrowLeft size={13} /> All orders</Link>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-3xl text-[#792D49]">{o.order_number}</p>
          <p className="mt-1 text-[12px] text-[#806D60]">Placed {formatDate(o.created_at, true)} · Updated {formatDate(o.updated_at, true)}</p>
        </div>
        <div className="flex gap-2"><OrderStatusBadge status={o.status} /><PaymentStatusBadge status={o.payment_status} /></div>
      </div>

      <Card className="p-5 sm:p-6"><OrderTimeline status={o.status} history={data.history} /></Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <p className="px-5 pt-5 font-serif text-2xl">Products</p>
            <div className="overflow-x-auto">
              <table className="mt-3 w-full min-w-[480px] text-left text-[13px]">
                <thead className="text-[10px] uppercase tracking-[0.14em] text-[#9A8070]"><tr><th className="px-5 py-2 font-medium">Product</th><th className="px-3 py-2 font-medium">Unit price</th><th className="px-3 py-2 font-medium">Qty</th><th className="px-5 py-2 text-right font-medium">Line total</th></tr></thead>
                <tbody>
                  {(o.order_items ?? []).map((it) => (
                    <tr key={it.id} className="border-t border-[#EEE5D9]">
                      <td className="px-5 py-3">{it.product_name}</td>
                      <td className="px-3 py-3 tabular-nums">{formatINR(it.unit_price_paise)}</td>
                      <td className="px-3 py-3">{it.quantity}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatINR(it.line_total_paise)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="text-[13px]">
                  <tr className="border-t border-[#E2D5C3]"><td colSpan={3} className="px-5 py-2 text-[#806D60]">Subtotal</td><td className="px-5 py-2 text-right">{formatINR(o.subtotal_paise)}</td></tr>
                  <tr><td colSpan={3} className="px-5 py-1 text-[#806D60]">Shipping</td><td className="px-5 py-1 text-right">{o.shipping_paise ? formatINR(o.shipping_paise) : "Free"}</td></tr>
                  <tr><td colSpan={3} className="px-5 py-3 font-medium">Total</td><td className="px-5 py-3 text-right font-serif text-2xl text-[#792D49]">{formatINR(o.total_paise)}</td></tr>
                </tfoot>
              </table>
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-serif text-2xl">Status history</p>
            <ul className="mt-3 space-y-3 text-[12px]">
              {data.history.map((h) => (
                <li key={h.id} className="flex flex-wrap gap-x-3 border-l-2 border-[#D9C7B4] pl-3">
                  <span className="font-medium">{h.from_status ? `${ORDER_STATUS_LABEL[h.from_status]} → ` : ""}{ORDER_STATUS_LABEL[h.to_status]}</span>
                  <span className="text-[#9A8777]">{formatDate(h.created_at, true)}</span>
                  {h.note && <span className="w-full text-[#806D60]">“{h.note}”</span>}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <p className="font-serif text-2xl">Update status</p>
            {final ? (
              <p className="mt-3 text-[13px] text-[#806D60]">This order is {ORDER_STATUS_LABEL[o.status].toLowerCase()} — its status is final.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
                <div className="grid grid-cols-2 gap-2">
                  {ORDER_STATUSES.filter((s) => s !== o.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNext(s)}
                      className={`border px-3 py-2.5 text-left text-[12px] transition ${next === s ? (s === "cancelled" ? "border-[#8A2E2E] bg-[#8A2E2E] text-white" : "border-[#792D49] bg-[#792D49] text-white") : "border-[#D6C4AD] bg-white hover:border-[#792D49]"}`}
                    >
                      {ORDER_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
                <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Note (optional) — e.g. tracking number" className="w-full border border-[#D6C4AD] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#B28B4E]" />
                <Button onClick={update} loading={busy} disabled={!next} className="w-full">{next ? `MARK AS ${ORDER_STATUS_LABEL[next].toUpperCase()}` : "CHOOSE A STATUS"}</Button>
              </div>
            )}
          </Card>

          <Card className="p-5 text-[13px] leading-6">
            <p className="font-serif text-2xl">Customer</p>
            <p className="mt-2 font-medium">{o.customer_name}</p>
            <p><a className="text-[#792D49] hover:underline" href={`mailto:${o.customer_email}`}>{o.customer_email}</a></p>
            <p><a className="text-[#792D49] hover:underline" href={`tel:+91${o.customer_phone}`}>+91 {o.customer_phone}</a></p>
            {o.user_id && <Link href={`/admin/customers/${o.user_id}`} className="mt-2 inline-block text-[11px] text-[#792D49] hover:underline">View customer profile →</Link>}
          </Card>

          <Card className="p-5 text-[13px] leading-6">
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl">Delivery address</p>
              <button onClick={() => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="inline-flex items-center gap-1 text-[11px] text-[#792D49]">
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 whitespace-pre-line text-[#5E4A44]">{address}</p>
            {o.notes && <p className="mt-3 border-t border-[#EEE5D9] pt-3 text-[#806D60]">Customer note: {o.notes}</p>}
          </Card>

          <Card className="p-5 text-[13px]">
            <p className="font-serif text-2xl">Payment</p>
            <p className="mt-2 text-[#806D60]">Method: {o.payment_method} · Status: <PaymentStatusBadge status={o.payment_status} /></p>
            {data.payments.length === 0 ? (
              <p className="mt-3 text-[12px] text-[#9A8777]">No payment attempts recorded. Payment status changes only when a verified gateway confirmation arrives.</p>
            ) : (
              <ul className="mt-3 space-y-1 text-[12px]">
                {data.payments.map((p) => <li key={p.id}>{p.provider} · {p.provider_payment_id ?? "—"} · {formatINR(p.amount_paise)} · {p.status}</li>)}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
