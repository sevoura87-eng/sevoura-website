"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import { Card, PageTitle, ErrorBox, Skeleton, Empty } from "@/components/admin/ui";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shop/StatusBadge";
import { useAdminData, unwrap } from "@/components/admin/useAdminData";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, formatDate, formatINR } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

export default function AdminOrders() {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const { data, error, loading, reload } = useAdminData(async (sb) =>
    unwrap(await sb.from("orders").select("*, order_items(product_name, quantity)").order("created_at", { ascending: false }).limit(1000)) as Order[]
  );

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data ?? []).filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!term) return true;
      return [o.order_number, o.customer_name, o.customer_email, o.customer_phone, o.ship_pincode, o.ship_city].join(" ").toLowerCase().includes(term);
    });
  }, [data, q, status]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 };
    for (const o of data ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [data]);

  function exportCsv() {
    const header = ["Order", "Date", "Customer", "Email", "Phone", "Items", "Total (INR)", "Status", "Payment", "Address", "City", "State", "Pincode"];
    const lines = rows.map((o) => [
      o.order_number, formatDate(o.created_at, true), o.customer_name, o.customer_email, o.customer_phone,
      (o.order_items ?? []).map((i) => `${i.product_name} x${i.quantity}`).join("; "),
      (o.total_paise / 100).toFixed(2), ORDER_STATUS_LABEL[o.status], o.payment_status,
      `${o.ship_house_number}, ${o.ship_street_locality}${o.ship_landmark ? `, near ${o.ship_landmark}` : ""}`, o.ship_city, o.ship_state, o.ship_pincode,
    ]);
    const csv = [header, ...lines].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
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
        sub="Every order placed on the store. Click an order to view details and update its status."
        action={
          <div className="flex gap-2">
            <button onClick={reload} className="inline-flex items-center gap-2 border border-[#D6C4AD] bg-white px-4 py-2.5 text-[11px] hover:border-[#792D49]"><RefreshCw size={13} /> Refresh</button>
            <button onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-2 bg-[#792D49] px-4 py-2.5 text-[11px] text-white disabled:opacity-50"><Download size={13} /> Export CSV</button>
          </div>
        }
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex flex-1 items-center gap-2 border border-[#D6C4AD] bg-white px-3">
          <Search size={15} className="text-[#9A8777]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order no., name, email, phone, pincode…" className="w-full bg-transparent py-2.5 text-[13px] outline-none" />
        </label>
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
      </div>
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : (
        <Card>
          {rows.length === 0 ? <Empty>No orders match.</Empty> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-[13px]">
                <thead className="bg-[#F8F2EA] text-[10px] uppercase tracking-[0.14em] text-[#9A8070]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Customer</th>
                    <th className="px-3 py-3 font-medium">Items</th>
                    <th className="px-3 py-3 font-medium">Pincode</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Payment</th>
                    <th className="px-5 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => (
                    <tr key={o.id} className="border-t border-[#EEE5D9] transition hover:bg-[#FBF7F1]">
                      <td className="px-5 py-3"><Link href={`/admin/orders/${o.id}`} className="font-mono text-[12px] text-[#792D49] hover:underline">{o.order_number}</Link></td>
                      <td className="px-3 py-3 text-[#806D60]">{formatDate(o.created_at, true)}</td>
                      <td className="px-3 py-3"><p>{o.customer_name}</p><p className="text-[11px] text-[#9A8777]">{o.customer_phone}</p></td>
                      <td className="px-3 py-3 text-[12px] text-[#806D60]">{(o.order_items ?? []).map((i) => `${i.product_name} ×${i.quantity}`).join(", ")}</td>
                      <td className="px-3 py-3">{o.ship_pincode}</td>
                      <td className="px-3 py-3"><OrderStatusBadge status={o.status} /></td>
                      <td className="px-3 py-3"><PaymentStatusBadge status={o.payment_status} /></td>
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
