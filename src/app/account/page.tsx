"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Package, MapPin, UserRound, LogOut, ChevronRight, Trash2, Star, Shield } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RequireAuth from "@/components/account/RequireAuth";
import { Field, SelectField } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shop/StatusBadge";
import { useAuth } from "@/components/providers/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";
import { formatDate, formatINR } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import { INDIAN_STATES, emptyAddress, normalizePhone, validateAddress, type AddressInput } from "@/lib/validation";
import type { Address, Order } from "@/lib/types";

type Tab = "orders" | "addresses" | "profile";
const ease = [0.22, 1, 0.36, 1] as const;

function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    getSupabase()
      ?.from("orders")
      .select("id, order_number, created_at, total_paise, status, payment_status, order_items(quantity, product_name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, []);

  if (!orders) return <div className="h-40 animate-pulse bg-[#EFE3D3]" />;
  if (!orders.length)
    return (
      <div className="border border-[#DCCAB5] bg-[#FCF7EF] p-10 text-center">
        <Package size={30} strokeWidth={1.2} className="mx-auto text-[#A77B4D]" />
        <p className="mt-4 font-serif text-2xl">No orders yet.</p>
        <Link href="/shop" className="mt-5 inline-block text-[13px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">DISCOVER THE COLLECTION</Link>
      </div>
    );
  return (
    <ul className="space-y-3">
      {orders.map((o, i) => (
        <motion.li key={o.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ease }}>
          <Link href={`/account/orders/${o.id}`} className="group flex flex-col gap-3 border border-[#DCCAB5] bg-[#FCF7EF] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B28B4E] hover:shadow-[0_14px_40px_rgba(71,35,39,.08)] sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[14px] tracking-wide text-[#792D49]">{o.order_number}</p>
              <p className="mt-1 truncate text-[15px]">
                {(o.order_items ?? []).map((it) => `${it.product_name} × ${it.quantity}`).join(", ")}
              </p>
              <p className="mt-1 text-[13px] text-[#9A8777]">Placed {formatDate(o.created_at, true)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={o.status} payment={o.payment_status} />
              <PaymentStatusBadge status={o.payment_status} />
            </div>
            <p className="font-serif text-2xl tabular-nums sm:w-28 sm:text-right">{formatINR(o.total_paise)}</p>
            <ChevronRight size={18} className="hidden text-[#A77B4D] transition group-hover:translate-x-1 sm:block" />
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}

function Addresses() {
  const [list, setList] = useState<Address[] | null>(null);
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [form, setForm] = useState<AddressInput>(emptyAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressInput, string>>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const load = useCallback(async () => {
    const { data } = await getSupabase()!
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setList((data as Address[]) ?? []);
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    load();
  }, [load]);

  function startEdit(a: Address | "new") {
    setEditing(a);
    setErrors({});
    setError(null);
    setForm(a === "new" ? emptyAddress : { ...a, landmark: a.landmark ?? "" });
  }
  const set = (k: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: k === "pincode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value }));

  async function onSave(e: FormEvent) {
    e.preventDefault();
    const errs = validateAddress(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const sb = getSupabase()!;
    setBusy(true);
    const row = {
      full_name: form.full_name.trim(),
      phone: normalizePhone(form.phone)!,
      house_number: form.house_number.trim(),
      street_locality: form.street_locality.trim(),
      city: form.city.trim(),
      state: form.state,
      pincode: form.pincode.trim(),
      landmark: form.landmark.trim() || null,
    };
    const res =
      editing === "new"
        ? await sb.from("addresses").insert({ ...row, user_id: user!.id, is_default: !list?.length })
        : await sb.from("addresses").update(row).eq("id", (editing as Address).id);
    setBusy(false);
    if (res.error) return setError(friendlyError(res.error));
    setEditing(null);
    load();
  }

  async function makeDefault(id: string) {
    const sb = getSupabase()!;
    await sb.from("addresses").update({ is_default: false }).neq("id", id);
    await sb.from("addresses").update({ is_default: true }).eq("id", id);
    load();
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this address?")) return;
    await getSupabase()!.from("addresses").delete().eq("id", id);
    load();
  }

  if (!list) return <div className="h-40 animate-pulse bg-[#EFE3D3]" />;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((a) => (
          <div key={a.id} className="relative border border-[#DCCAB5] bg-[#FCF7EF] p-5 text-[15px] leading-6">
            {a.is_default && <span className="absolute right-4 top-4 bg-[#792D49] px-2 py-0.5 text-[11px] tracking-[0.15em] text-white">DEFAULT</span>}
            <p className="font-medium">{a.full_name}</p>
            <p className="text-[#806D60]">{a.house_number}, {a.street_locality}</p>
            <p className="text-[#806D60]">{a.city}, {a.state} — {a.pincode}</p>
            {a.landmark && <p className="text-[#9A8777]">Landmark: {a.landmark}</p>}
            <p className="text-[#806D60]">+91 {a.phone}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-[13px] text-[#792D49]">
              <button onClick={() => startEdit(a)} className="underline-offset-4 hover:underline">Edit</button>
              {!a.is_default && (
                <button onClick={() => makeDefault(a.id)} className="inline-flex items-center gap-1 underline-offset-4 hover:underline"><Star size={11} /> Make default</button>
              )}
              <button onClick={() => remove(a.id)} className="inline-flex items-center gap-1 text-[#9A8777] hover:text-[#A23B52]"><Trash2 size={11} /> Delete</button>
            </div>
          </div>
        ))}
        <button onClick={() => startEdit("new")} className="flex min-h-[150px] items-center justify-center border border-dashed border-[#C9B496] text-[14px] tracking-wide text-[#806D60] transition hover:border-[#792D49] hover:text-[#792D49]">
          + Add a new address
        </button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.form
            onSubmit={onSave}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 grid gap-4 border border-[#DCCAB5] bg-[#FCF7EF] p-6 sm:grid-cols-2"
          >
            <p className="font-serif text-2xl sm:col-span-2">{editing === "new" ? "New address" : "Edit address"}</p>
            {error && <div className="sm:col-span-2"><Notice tone="error">{error}</Notice></div>}
            <Field label="Full name" value={form.full_name} onChange={set("full_name")} error={errors.full_name} />
            <Field label="Mobile number" type="tel" inputMode="numeric" value={form.phone} onChange={set("phone")} error={errors.phone} />
            <Field label="House / flat no., building" value={form.house_number} onChange={set("house_number")} error={errors.house_number} />
            <Field label="Street & locality" value={form.street_locality} onChange={set("street_locality")} error={errors.street_locality} />
            <Field label="City" value={form.city} onChange={set("city")} error={errors.city} />
            <SelectField label="State" options={INDIAN_STATES} value={form.state} onChange={set("state")} error={errors.state} />
            <Field label="Pincode" inputMode="numeric" value={form.pincode} onChange={set("pincode")} error={errors.pincode} />
            <Field label="Landmark (optional)" value={form.landmark} onChange={set("landmark")} error={errors.landmark} />
            <div className="flex gap-3 sm:col-span-2">
              <Button type="submit" loading={busy}>SAVE ADDRESS</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>CANCEL</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Profile() {
  const { profile, user, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [msg, setMsg] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (name.trim().length < 2) return setMsg({ tone: "error", text: "Please enter your full name." });
    const p = phone ? normalizePhone(phone) : null;
    if (phone && !p) return setMsg({ tone: "error", text: "Enter a valid 10-digit mobile number." });
    setBusy(true);
    const { error } = await getSupabase()!.from("profiles").update({ full_name: name.trim(), phone: p }).eq("id", user!.id);
    setBusy(false);
    if (error) return setMsg({ tone: "error", text: friendlyError(error) });
    await refreshProfile();
    setMsg({ tone: "success", text: "Your details have been saved." });
  }

  return (
    <form onSubmit={onSave} noValidate className="max-w-xl space-y-4">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <Field label="Email address" value={user?.email ?? ""} disabled hint="Contact us to change your login email." />
      <Field label="Mobile number" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div className="grid grid-cols-2 gap-4 text-[14px] text-[#806D60]">
        <div className="border border-[#E3D5C3] p-3"><p className="text-[11px] uppercase tracking-[0.2em] text-[#A77B4D]">Member since</p><p className="mt-1">{formatDate(profile?.created_at)}</p></div>
        <div className="border border-[#E3D5C3] p-3"><p className="text-[11px] uppercase tracking-[0.2em] text-[#A77B4D]">Last sign-in</p><p className="mt-1">{formatDate(profile?.last_login_at, true)}</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" loading={busy}>SAVE CHANGES</Button>
        <Link href="/forgot-password" className="text-[13px] text-[#792D49] underline underline-offset-4">Change password</Link>
      </div>
    </form>
  );
}

function AccountInner() {
  const [tab, setTab] = useState<Tab>("orders");
  const { profile, user, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const first = (profile?.full_name || user?.email || "").split(" ")[0];
  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "profile", label: "Profile", icon: UserRound },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
          <p className="text-[11px] tracking-[0.34em] text-[#A77B4D]">MY ACCOUNT</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">
            Welcome, <span className="italic text-[#792D49]">{first}.</span>
          </h1>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          {isAdmin && (
            <Link href="/admin" className="inline-flex items-center gap-2 border border-[#B28B4E] px-5 py-3 text-[12px] tracking-[0.2em] text-[#7A5418] transition hover:bg-[#B28B4E] hover:text-white">
              <Shield size={13} /> ADMIN DASHBOARD
            </Link>
          )}
          <button
            onClick={async () => {
              await signOut();
              router.replace("/");
            }}
            className="inline-flex items-center gap-2 border border-[#792D49]/50 px-5 py-3 text-[12px] tracking-[0.2em] text-[#792D49] transition hover:bg-[#792D49] hover:text-white"
          >
            <LogOut size={13} /> SIGN OUT
          </button>
        </div>
      </div>

      <div className="relative mt-10 flex gap-1 overflow-x-auto border-b border-[#DCCAB5]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative inline-flex items-center gap-2 px-5 py-4 text-[13px] tracking-[0.18em] transition ${tab === t.id ? "text-[#792D49]" : "text-[#9A8777] hover:text-[#481D30]"}`}
          >
            <t.icon size={14} /> {t.label.toUpperCase()}
            {tab === t.id && <motion.span layoutId="acct-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-[#792D49]" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="mt-8">
          {tab === "orders" ? <Orders /> : tab === "addresses" ? <Addresses /> : <Profile />}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function AccountPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] overflow-x-clip bg-[#F8F1E7] px-5 py-14 text-[#481D30] md:px-10 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <RequireAuth>
            <AccountInner />
          </RequireAuth>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
