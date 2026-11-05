"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, PageTitle, ErrorBox, Skeleton, Empty } from "@/components/admin/ui";
import { useAdminData, unwrap } from "@/components/admin/useAdminData";
import { formatDate, formatINR, timeAgo } from "@/lib/format";

export interface CustomerRow {
  id: string; full_name: string; email: string; phone: string | null; role: "customer" | "admin";
  account_status: "active" | "suspended"; created_at: string; last_login_at: string | null;
  order_count: number; total_spent_paise: number; last_order_at: string | null;
}

export default function AdminCustomers() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "buyers" | "admins">("all");
  const { data, error, loading } = useAdminData(async (sb) => unwrap(await sb.rpc("admin_list_customers")) as CustomerRow[]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (data ?? []).filter((c) => {
      if (filter === "buyers" && Number(c.order_count) === 0) return false;
      if (filter === "admins" && c.role !== "admin") return false;
      return !t || [c.full_name, c.email, c.phone].join(" ").toLowerCase().includes(t);
    });
  }, [data, q, filter]);

  return (
    <>
      <PageTitle title="Customers" sub={`${data?.filter((c) => c.role === "customer").length ?? "—"} registered customers`} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 border border-[#D6C4AD] bg-white px-3">
          <Search size={15} className="text-[#9A8777]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or phone…" className="w-full bg-transparent py-2.5 text-[13px] outline-none" />
        </label>
        <div className="flex gap-1">
          {(["all", "buyers", "admins"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`border px-3 py-2 text-[11px] capitalize ${filter === f ? "border-[#792D49] bg-[#792D49] text-white" : "border-[#D6C4AD] bg-white"}`}>
              {f === "buyers" ? "Have ordered" : f}
            </button>
          ))}
        </div>
      </div>
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : (
        <Card>
          {rows.length === 0 ? <Empty>No customers found.</Empty> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-[13px]">
                <thead className="bg-[#F8F2EA] text-[10px] uppercase tracking-[0.14em] text-[#9A8070]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    <th className="px-3 py-3 font-medium">Phone</th>
                    <th className="px-3 py-3 font-medium">Registered</th>
                    <th className="px-3 py-3 font-medium">Last login</th>
                    <th className="px-3 py-3 font-medium">Orders</th>
                    <th className="px-5 py-3 text-right font-medium">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id} className="border-t border-[#EEE5D9] hover:bg-[#FBF7F1]">
                      <td className="px-5 py-3">
                        <Link href={`/admin/customers/${c.id}`} className="text-[#792D49] hover:underline">{c.full_name || "—"}</Link>
                        {c.role === "admin" && <span className="ml-2 bg-[#E5C48B] px-1.5 py-0.5 text-[9px] tracking-wider text-[#46182D]">ADMIN</span>}
                        {c.account_status === "suspended" && <span className="ml-2 bg-[#F4DADA] px-1.5 py-0.5 text-[9px] text-[#8A2E2E]">SUSPENDED</span>}
                      </td>
                      <td className="px-3 py-3">{c.email}</td>
                      <td className="px-3 py-3">{c.phone ?? "—"}</td>
                      <td className="px-3 py-3 text-[#806D60]">{formatDate(c.created_at)}</td>
                      <td className="px-3 py-3 text-[#806D60]">{timeAgo(c.last_login_at)}</td>
                      <td className="px-3 py-3">{c.order_count}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatINR(Number(c.total_spent_paise))}</td>
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
