"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, ErrorBox, Skeleton, Empty } from "@/components/admin/ui";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shop/StatusBadge";
import { useAdminData, unwrap } from "@/components/admin/useAdminData";
import { getSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDate, formatINR } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import type { Address, Order, Profile } from "@/lib/types";

interface LoginEvent { id: number; event_type: string; occurred_at: string; user_agent: string | null }

function device(ua: string | null) {
  if (!ua) return "—";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const br = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  return `${br} · ${os}`;
}

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [err, setErr] = useState<string | null>(null);
  const { data, error, loading, reload } = useAdminData(async (sb) => {
    const [p, o, a, l] = await Promise.all([
      sb.from("profiles").select("*").eq("id", id).single(),
      sb.from("orders").select("id, order_number, created_at, total_paise, status, payment_status").eq("user_id", id).order("created_at", { ascending: false }),
      sb.from("addresses").select("*").eq("user_id", id),
      sb.from("login_events").select("id, event_type, occurred_at, user_agent").eq("user_id", id).order("occurred_at", { ascending: false }).limit(25),
    ]);
    return { profile: unwrap(p) as Profile, orders: unwrap(o) as Order[], addresses: unwrap(a) as Address[], logins: unwrap(l) as LoginEvent[] };
  }, [id]);

  async function toggleStatus() {
    if (!data) return;
    const next = data.profile.account_status === "active" ? "suspended" : "active";
    if (!window.confirm(`${next === "suspended" ? "Suspend" : "Reactivate"} this account?`)) return;
    const { error } = await getSupabase()!.rpc("admin_set_account_status", { p_user_id: id, p_status: next });
    if (error) setErr(friendlyError(error));
    else reload();
  }

  if (error) return <ErrorBox message={error} />;
  if (loading || !data) return <Skeleton h={400} />;
  const p = data.profile;
  const spent = data.orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total_paise, 0);

  return (
    <>
      <Link href="/admin/customers" className="mb-5 inline-flex items-center gap-2 text-[11px] text-[#806D60] hover:text-[#792D49]"><ArrowLeft size={13} /> All customers</Link>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">{p.full_name || p.email}</h1>
          <p className="mt-2 text-[13px] text-[#806D60]">{p.email} · {p.phone ? `+91 ${p.phone}` : "no phone"} · {p.role}</p>
        </div>
        {p.id !== user?.id && (
          <button onClick={toggleStatus} className={`border px-4 py-2.5 text-[11px] ${p.account_status === "active" ? "border-[#8A2E2E] text-[#8A2E2E] hover:bg-[#8A2E2E] hover:text-white" : "border-[#3E5B2E] text-[#3E5B2E] hover:bg-[#3E5B2E] hover:text-white"}`}>
            {p.account_status === "active" ? "Suspend account" : "Reactivate account"}
          </button>
        )}
      </div>
      {err && <div className="mb-4"><ErrorBox message={err} /></div>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Registered", formatDate(p.created_at, true)],
          ["Last login", formatDate(p.last_login_at, true)],
          ["Orders", String(data.orders.length)],
          ["Total spent", formatINR(spent)],
        ].map(([k, v]) => (
          <Card key={k} className="p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-[#9A8070]">{k}</p><p className="mt-2 font-serif text-xl">{v}</p></Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <p className="px-5 pt-5 font-serif text-2xl">Order history</p>
          {data.orders.length === 0 ? <Empty>No orders yet.</Empty> : (
            <div className="overflow-x-auto">
              <table className="mt-3 w-full min-w-[520px] text-left text-[13px]">
                <tbody>
                  {data.orders.map((o) => (
                    <tr key={o.id} className="border-t border-[#EEE5D9]">
                      <td className="px-5 py-3"><Link href={`/admin/orders/${o.id}`} className="font-mono text-[12px] text-[#792D49] hover:underline">{o.order_number}</Link></td>
                      <td className="px-3 py-3 text-[#806D60]">{formatDate(o.created_at)}</td>
                      <td className="px-3 py-3"><OrderStatusBadge status={o.status} /></td>
                      <td className="px-3 py-3"><PaymentStatusBadge status={o.payment_status} /></td>
                      <td className="px-5 py-3 text-right">{formatINR(o.total_paise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <div className="space-y-6">
          <Card className="p-5">
            <p className="font-serif text-2xl">Saved addresses</p>
            {data.addresses.length === 0 ? <p className="mt-2 text-[12px] text-[#9A8777]">None saved.</p> : data.addresses.map((a) => (
              <p key={a.id} className="mt-3 border-t border-[#EEE5D9] pt-3 text-[12px] leading-5 text-[#5E4A44]">
                {a.full_name}, {a.house_number}, {a.street_locality}, {a.city}, {a.state} – {a.pincode}{a.landmark ? ` (near ${a.landmark})` : ""} · {a.phone}
              </p>
            ))}
          </Card>
          <Card className="p-5">
            <p className="font-serif text-2xl">Login activity</p>
            <ul className="mt-3 space-y-2 text-[12px]">
              {data.logins.length === 0 && <li className="text-[#9A8777]">No activity.</li>}
              {data.logins.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span className="capitalize">{l.event_type.replace("_", " ")}</span>
                  <span className="text-[#9A8777]">{device(l.user_agent)}</span>
                  <span className="text-[#806D60]">{formatDate(l.occurred_at, true)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
