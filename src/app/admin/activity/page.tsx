"use client";

import { useMemo, useState } from "react";
import { UserPlus, LogIn, LogOut, ShoppingBag, RefreshCw, Package, XCircle, Shield } from "lucide-react";
import { Card, PageTitle, ErrorBox, Skeleton, Empty } from "@/components/admin/ui";
import { useAdminData, unwrap } from "@/components/admin/useAdminData";
import { formatDate } from "@/lib/format";

interface Row { id: number; event_type: string; summary: string; created_at: string }

const GROUPS: Record<string, { label: string; types: string[] }> = {
  all: { label: "All", types: [] },
  registrations: { label: "Registrations", types: ["user_registered"] },
  logins: { label: "Logins", types: ["user_login", "user_logout"] },
  orders: { label: "Orders", types: ["order_placed", "order_cancelled"] },
  status: { label: "Status changes", types: ["order_status_changed"] },
  products: { label: "Products", types: ["product_created", "product_updated", "product_deleted"] },
};

const ICON: Record<string, typeof UserPlus> = {
  user_registered: UserPlus, user_login: LogIn, user_logout: LogOut, order_placed: ShoppingBag,
  order_status_changed: RefreshCw, order_cancelled: XCircle, product_created: Package, product_updated: Package,
  product_deleted: Package, account_status_changed: Shield,
};

export default function AdminActivity() {
  const [group, setGroup] = useState("all");
  const { data, error, loading, reload } = useAdminData(async (sb) => {
    let q = sb.from("activity_log").select("id, event_type, summary, created_at").order("created_at", { ascending: false }).limit(300);
    if (group !== "all") q = q.in("event_type", GROUPS[group].types);
    return unwrap(await q) as Row[];
  }, [group]);

  const byDay = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of data ?? []) {
      const k = formatDate(r.created_at);
      m.set(k, [...(m.get(k) ?? []), r]);
    }
    return [...m.entries()];
  }, [data]);

  return (
    <>
      <PageTitle title="Activity log" sub="Registrations, logins, orders, status changes and product edits — newest first." action={<button onClick={reload} className="inline-flex items-center gap-2 border border-[#D6C4AD] bg-white px-4 py-2.5 text-[11px]"><RefreshCw size={13} /> Refresh</button>} />
      <div className="mb-4 flex gap-1 overflow-x-auto">
        {Object.entries(GROUPS).map(([k, g]) => (
          <button key={k} onClick={() => setGroup(k)} className={`shrink-0 border px-3 py-2 text-[11px] ${group === k ? "border-[#792D49] bg-[#792D49] text-white" : "border-[#D6C4AD] bg-white"}`}>{g.label}</button>
        ))}
      </div>
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : byDay.length === 0 ? <Card><Empty>No activity yet.</Empty></Card> : (
        <div className="space-y-6">
          {byDay.map(([day, rows]) => (
            <Card key={day} className="p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#9A8070]">{day}</p>
              <ul className="mt-3 divide-y divide-[#EEE5D9]">
                {rows.map((r) => {
                  const Icon = ICON[r.event_type] ?? RefreshCw;
                  return (
                    <li key={r.id} className="flex items-center gap-3 py-2.5 text-[13px]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F3E8DA] text-[#792D49]"><Icon size={13} /></span>
                      <span className="flex-1">{r.summary}</span>
                      <span className="text-[11px] text-[#9A8777]">{new Date(r.created_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
