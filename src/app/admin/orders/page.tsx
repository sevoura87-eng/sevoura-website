"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, RefreshCw, Download, X } from "lucide-react";
import { Card, PageTitle, ErrorBox, Skeleton, Empty } from "@/components/admin/ui";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shop/StatusBadge";
import { useAdminData, unwrap, useOrdersRealtime } from "@/components/admin/useAdminData";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDate, formatINR } from "@/lib/format";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

const PAYMENT_FILTERS: (PaymentStatus | "all")[] = ["all", "paid", "pending", "authorized", "failed", "refunded"];
const istDate = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD

export default function AdminOrders() {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [payment, setPayment] = useState<PaymentStatus | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");
  const { data, error, loading, reload } = useAdminData(async (sb) =>
    unwrap(await sb.from("orders").select("*, order_items(product_name, quantity, line_total_paise)").order("created_at", { ascending: false }).limit(2000)) as Order[]
  );
  useOrdersRealtime(() => reload({ silent: true }));

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (payment !== "all" && o.payment_status !== payment) return false;
      const d = istDate(o.created_at);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (!term) return true;
      return [o.order_number, o.customer_name, o.customer_email, o.customer_phone, o.ship_phone, o.ship_pincode, o.ship_city, o.ship_full_name]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [data, q, status, payment, from, to]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 };
    for (const o of data ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [data]);

  const filtered = status !== "all" || payment !== "all" || from || to || q;
  const total = rows.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total_paise, 0);

  function exportCsv() {
    const header = ["Order", "Date (IST)", "Customer", "Email", "Phone", "Products", "Quantity", "Total (INR)", "Order status", "Payment status", "Recipient", "Recipient phone", "Address", "Landmark", "City", "State", "Pincode"];
    const lines = rows.map((o) => [
      o.order_number, formatDate(o.created_at, true), o.customer_name, o.customer_email, o.customer_phone,
      (o.order_items ?? []).map((i) => i.product_name).join("; "),
      (o.order_items ?? []).reduce((n, i) => n + i.quantity, 0),
      (o.total_paise / 100).toFixed(2), ORDER_STATUS_LABEL[o.status], PAYMENT_STATUS_LABEL[o.payment_status],
      o.ship_full_name, o.ship_phone, `${o.ship_house_number}, ${o.ship_street_locality}`, o.ship_landmark ?? "", o.ship_city, o.ship_state, o.ship_pincode,
    ]);
    const csv = [header, ...lines].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sevoura-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageTitle
        title="Orders"
        sub="Live list of every order. New orders and status changes appear automatically."
        action={
          <div className="flex gap-2">
            <button onClick={() => reload()} className="inline-flex items-center gap-2 border border-[#D6C4AD] bg-white px-4 py-2.5 text-[11px] hover:border-[#792D49]"><RefreshCw size={13} /> Refresh</button>
            <button onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-2 bg-[#792D49] px-4 py-2.5 text-[11px] text-white disabled:opacity-50"><Download size={13} /> Export CSV</button>
          </div>
        }
      />

      <Card className="mb-4 space-y-3 p-4">
        <label className="flex items-center gap-2 border border-[#D6C4AD] bg-white px-3">
          <Search size={15} className="text-[#9A8777]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order no., customer, email, phone, city, pincode…" className="w-full bg-transparent py-2.5 text-[13px] outline-none" />
        </label>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-[10px] uppercase tracking-[0.14em] text-[#9A8070]">
            Payment
            <select value={payment} onChange={(e) => setPayment(e.target.value as PaymentStatus | "all")} className="mt-1 block border border-[#D6C4AD] bg-white px-3 py-2 text-[12px] normal-case tracking-normal text-[#3B2028]">
              {PAYMENT_FILTERS.map((p) => (
                <option key={p} value={p}>{p === "all" ? "All payments" : PAYMENT_STATUS_LABEL[p]}</option>
              ))}
            </select>
          </label>
          <label className="text-[10px] uppercase tracking-[0.14em] text-[#9A8070]">
            From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 block border border-[#D6C4AD] bg-white px-3 py-2 text-[12px] text-[#3B2028]" />
          </label>
          <label className="text-[10px] uppercase tracking-[0.14em] text-[#9A8070]">
            To
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block border border-[#D6C4AD] bg-white px-3 py-2 text-[12px] text-[#3B2028]" />
          </label>
          {filtered && (
            <button onClick={() => { setStatus("all"); setPayment("all"); setFrom(""); setTo(""); setQ(""); }} className="inline-flex items-center gap-1 px-2 py-2 text-[11px] text-[#792D49] hover:underline">
              <X size={12} /> Clear filters
            </button>
          )}
          <p className="ml-auto text-[12px] text-[#806D60]">
            {rows.length} order{rows.length === 1 ? "" : "s"} · {formatINR(total)}
          </p>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {(["all", ...ORDER_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`shrink-0 border px-3 py-2 text-[11px] transition ${status === s ? "border-[#792D49] bg-[#792D49] text-white" : "border-[#D6C4AD] bg-white hover:border-[#792D49]"}`}
            >
              {s === "all" ? "All" : ORDER_STATUS_LABEL[s]} <span className="opacity-60">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
      </Card>

      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : (
        <Card>
          {rows.length === 0 ? <Empty>{data?.length ? "No orders match these filters." : "No orders yet. They appear here the moment a customer checks out."}</Empty> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left text-[13px]">
                <thead className="bg-[#F8F2EA] text-[10px] uppercase tracking-[0.14em] text-[#9A8070]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order / date</th>
                    <th className="px-3 py-3 font-medium">Customer</th>
                    <th className="px-3 py-3 font-medium">Products</th>
                    <th className="px-3 py-3 font-medium">Delivery address</th>
                    <th className="px-3 py-3 font-medium">Payment</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => (
                    <tr key={o.id} className="border-t border-[#EEE5D9] align-top transition hover:bg-[#FBF7F1]">
                      <td className="px-5 py-3">
                        <Link href={`/admin/orders/${o.id}`} className="font-mono text-[12px] text-[#792D49] hover:underline">{o.order_number}</Link>
                        <p className="mt-0.5 text-[11px] text-[#806D60]">{formatDate(o.created_at, true)}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p>{o.customer_name}</p>
                        <p className="text-[11px] text-[#806D60]">{o.customer_email}</p>
                        <p className="text-[11px] text-[#806D60]">+91 {o.customer_phone}</p>
                      </td>
                      <td className="px-3 py-3 text-[12px]">
                        {(o.order_items ?? []).map((i, k) => (
                          <p key={k}>{i.product_name} <span className="text-[#806D60]">× {i.quantity}</span></p>
                        ))}
                      </td>
                      <td className="max-w-[260px] px-3 py-3 text-[12px] leading-5 text-[#5E4A44]">
                        {o.ship_full_name}, {o.ship_house_number}, {o.ship_street_locality}
                        {o.ship_landmark ? `, near ${o.ship_landmark}` : ""}, {o.ship_city}, {o.ship_state} – <strong>{o.ship_pincode}</strong>
                      </td>
                      <td className="px-3 py-3"><PaymentStatusBadge status={o.payment_status} /></td>
                      <td className="px-3 py-3"><OrderStatusBadge status={o.status} payment={o.payment_status} /></td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatINR(o.total_paise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
