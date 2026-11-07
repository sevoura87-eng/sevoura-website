"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, IndianRupee, ShoppingBag, Users, Wallet, XCircle } from "lucide-react";
import { Card, PageTitle, StatTile, ErrorBox, Skeleton, Empty } from "@/components/admin/ui";
import BarChart from "@/components/admin/BarChart";
import PaymentsSetupCard from "@/components/admin/PaymentsSetupCard";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shop/StatusBadge";
import { useAdminData, unwrap, useOrdersRealtime } from "@/components/admin/useAdminData";
import { formatDate, formatINR, timeAgo } from "@/lib/format";
import type { Order } from "@/lib/types";
import type { Stats } from "@/components/admin/types";


interface ActivityRow { id: number; event_type: string; summary: string; created_at: string }

export default function AdminOverview() {
  const { data, error, loading, reload } = useAdminData(async (sb) => {
    const [stats, daily, orders, activity] = await Promise.all([
      sb.rpc("admin_dashboard_stats"),
      sb.rpc("admin_sales_daily", { p_days: 14 }),
      sb.from("orders").select("id, order_number, customer_name, total_paise, status, payment_status, created_at").order("created_at", { ascending: false }).limit(6),
      sb.from("activity_log").select("id, event_type, summary, created_at").order("created_at", { ascending: false }).limit(10),
    ]);
    return {
      stats: unwrap(stats) as Stats,
      daily: unwrap(daily) as { day: string; orders: number; revenue_paise: number }[],
      orders: unwrap(orders) as Order[],
      activity: unwrap(activity) as ActivityRow[],
    };
  });

  useOrdersRealtime(() => reload({ silent: true }));

  if (error) return <ErrorBox message={error} />;

  const s = data?.stats;
  return (
    <>
      <PageTitle title="Overview" sub={`Today, ${formatDate(new Date().toISOString())}`} />
      {loading || !s ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatTile index={0} tone="accent" label="Total revenue (paid)" value={s.collected_revenue_paise} format={formatINR} icon={Wallet} hint="Confirmed paid orders only" />
            <StatTile index={1} label="Total orders (paid)" value={s.confirmed_orders ?? s.paid_orders} icon={ShoppingBag} hint={`${s.unpaid_orders} awaiting payment · ${s.total_orders} started`} />
            <StatTile index={2} label="Today's orders (paid)" value={s.today_paid_orders ?? s.today_orders} icon={CalendarDays} hint={`${formatINR(s.today_paid_revenue_paise ?? s.today_revenue_paise)} received today (IST)`} />
            <StatTile index={3} label="Total customers" value={s.registered_users} icon={Users} hint={`${s.customers} have ordered · +${s.new_users_7d} this week`} />
            <StatTile index={4} label="Failed payments" value={s.failed_payments} icon={AlertTriangle} hint="Customer can retry from their order page" />
            <StatTile index={5} label="Paid orders" value={s.paid_orders} icon={CheckCircle2} hint="Verified payment received" />
            <StatTile index={6} label="Unpaid orders" value={s.unpaid_orders} icon={IndianRupee} hint={`Not paid yet · ${s.payment_pending_orders} processing`} />
            <StatTile index={7} label="Cancelled orders" value={s.cancelled_orders} icon={XCircle} />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="font-serif text-2xl">Sales, last 14 days</p>
                  <p className="text-[11px] text-[#9A8777]">Order value of non-cancelled orders (IST)</p>
                </div>
                <Link href="/admin/revenue" className="text-[11px] text-[#792D49] hover:underline">Revenue details →</Link>
              </div>
              <BarChart
                ariaLabel="Daily sales for the last 14 days"
                format={formatINR}
                data={(data?.daily ?? []).map((d) => ({
                  label: new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
                  full: new Date(d.day).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
                  value: Number(d.revenue_paise),
                  secondary: `${d.orders} order${Number(d.orders) === 1 ? "" : "s"}`,
                }))}
              />
            </Card>

            <Card className="p-5 sm:p-6">
              <p className="font-serif text-2xl">Recent activity</p>
              <ul className="mt-4 space-y-3">
                {(data?.activity ?? []).length === 0 && <Empty>No activity yet.</Empty>}
                {(data?.activity ?? []).map((a) => (
                  <li key={a.id} className="flex gap-3 text-[12px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B28B4E]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[#3B2028]">{a.summary}</p>
                      <p className="text-[10px] text-[#9A8777]">{timeAgo(a.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/admin/activity" className="mt-4 inline-block text-[11px] text-[#792D49] hover:underline">All activity →</Link>
            </Card>
          </div>

          <Card className="mt-6">
            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
              <p className="font-serif text-2xl">Recent orders</p>
              <Link href="/admin/orders" className="inline-flex items-center gap-1 text-[11px] text-[#792D49] hover:underline">All orders <ArrowRight size={12} /></Link>
            </div>
            {(data?.orders ?? []).length === 0 ? (
              <Empty>No orders yet. They will appear here the moment a customer checks out.</Empty>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <tbody>
                    {data!.orders.map((o) => (
                      <tr key={o.id} className="border-t border-[#EEE5D9] hover:bg-[#FBF7F1]">
                        <td className="px-5 py-3 sm:px-6"><Link href={`/admin/orders/${o.id}`} className="font-mono text-[12px] text-[#792D49] hover:underline">{o.order_number}</Link></td>
                        <td className="px-3 py-3">{o.customer_name}</td>
                        <td className="px-3 py-3 text-[#9A8777]">{timeAgo(o.created_at)}</td>
                        <td className="px-3 py-3"><OrderStatusBadge status={o.status} payment={o.payment_status} /></td>
                        <td className="px-3 py-3"><PaymentStatusBadge status={o.payment_status} /></td>
                        <td className="px-5 py-3 text-right tabular-nums sm:px-6">{formatINR(o.total_paise)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
          <PaymentsSetupCard />
        </>
      )}
    </>
  );
}
