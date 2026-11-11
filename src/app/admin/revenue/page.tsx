"use client";

import { useState } from "react";
import { IndianRupee, Wallet, ShoppingBag, TrendingUp } from "lucide-react";
import { Card, PageTitle, StatTile, ErrorBox, Skeleton } from "@/components/admin/ui";
import BarChart from "@/components/admin/BarChart";
import { useAdminData, unwrap } from "@/components/admin/useAdminData";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatINR } from "@/lib/format";
import type { OrderStatus, PaymentStatus } from "@/lib/types";
import type { Stats } from "@/components/admin/types";

type Day = { day: string; orders: number; revenue_paise: number };
type Month = { month: string; orders: number; revenue_paise: number };

export default function AdminRevenue() {
  const [days, setDays] = useState(30);
  const { data, error, loading } = useAdminData(async (sb) => {
    const [s, d, m] = await Promise.all([
      sb.rpc("admin_dashboard_stats"),
      sb.rpc("admin_sales_daily", { p_days: days }),
      sb.rpc("admin_sales_monthly", { p_months: 12 }),
    ]);
    return { stats: unwrap(s) as Stats, daily: unwrap(d) as Day[], monthly: unwrap(m) as Month[] };
  }, [days]);

  if (error) return <ErrorBox message={error} />;
  if (loading || !data) return <Skeleton h={500} />;
  const s = data.stats;
  const periodRevenue = data.daily.reduce((n, d) => n + Number(d.revenue_paise), 0);
  const periodOrders = data.daily.reduce((n, d) => n + Number(d.orders), 0);
  const totalStatus = Object.values(s.orders_by_status).reduce((a, b) => a + b, 0) || 1;

  return (
    <>
      <PageTitle title="Revenue" sub="Booked revenue counts every non-cancelled order. Collected revenue counts only verified payments." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile tone="accent" label="Booked revenue" value={s.booked_revenue_paise} format={formatINR} icon={IndianRupee} />
        <StatTile index={1} label="Collected (paid)" value={s.collected_revenue_paise} format={formatINR} icon={Wallet} />
        <StatTile index={2} label={`Last ${days} days`} value={periodRevenue} format={formatINR} icon={TrendingUp} hint={`${periodOrders} orders`} />
        <StatTile index={3} label="Average order" value={s.avg_order_paise} format={formatINR} icon={ShoppingBag} />
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-serif text-2xl">Daily sales</p>
          <div className="flex gap-1">
            {[7, 30, 90].map((d) => (
              <button key={d} onClick={() => setDays(d)} className={`border px-3 py-1.5 text-[13px] ${days === d ? "border-[#792D49] bg-[#792D49] text-white" : "border-[#D6C4AD] bg-white"}`}>{d} days</button>
            ))}
          </div>
        </div>
        <BarChart
          ariaLabel={`Daily sales, last ${days} days`}
          format={formatINR}
          data={data.daily.map((d) => ({
            label: new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            full: new Date(d.day).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
            value: Number(d.revenue_paise),
            secondary: `${d.orders} orders`,
          }))}
        />
      </Card>

      <Card className="mt-6 p-5 sm:p-6">
        <p className="mb-5 font-serif text-2xl">Monthly sales</p>
        <BarChart
          ariaLabel="Monthly sales, last 12 months"
          format={formatINR}
          data={data.monthly.map((m) => ({
            label: new Date(m.month).toLocaleDateString("en-IN", { month: "short" }),
            full: new Date(m.month).toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
            value: Number(m.revenue_paise),
            secondary: `${m.orders} orders`,
          }))}
        />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <p className="font-serif text-2xl">Order statistics</p>
          <ul className="mt-4 space-y-3">
            {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((k) => {
              const n = s.orders_by_status[k] ?? 0;
              return (
                <li key={k} className="text-[14px]">
                  <div className="flex justify-between"><span>{ORDER_STATUS_LABEL[k]}</span><span className="tabular-nums">{n}</span></div>
                  <div className="mt-1 h-2 bg-[#F0E7DB]"><div className="h-full rounded-r-[4px] bg-[#792D49] transition-all duration-700" style={{ width: `${(n / totalStatus) * 100}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="font-serif text-2xl">Payment statistics</p>
          <table className="mt-4 w-full text-left text-[15px]">
            <thead className="text-[12px] uppercase tracking-[0.14em] text-[#9A8070]"><tr><th className="py-2 font-medium">Status</th><th className="py-2 font-medium">Orders</th><th className="py-2 text-right font-medium">Amount</th></tr></thead>
            <tbody>
              {(Object.keys(PAYMENT_STATUS_LABEL) as PaymentStatus[]).map((k) => (
                <tr key={k} className="border-t border-[#EEE5D9]">
                  <td className="py-2.5">{PAYMENT_STATUS_LABEL[k]}</td>
                  <td className="py-2.5 tabular-nums">{s.payments_by_status[k]?.count ?? 0}</td>
                  <td className="py-2.5 text-right tabular-nums">{formatINR(s.payments_by_status[k]?.amount_paise ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[13px] leading-5 text-[#9A8777]">Excludes cancelled orders. Online payments are not live yet, so orders stay “Unpaid” until Razorpay is connected.</p>
        </Card>
      </div>
    </>
  );
}
