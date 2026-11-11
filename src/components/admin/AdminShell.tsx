"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Users, Package, LineChart, Activity, MessagesSquare, LogOut, Menu, X, ExternalLink, Loader2, ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getSupabase } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { Field } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/revenue", label: "Revenue", icon: LineChart },
  { href: "/admin/community", label: "Community", icon: MessagesSquare },
  { href: "/admin/activity", label: "Activity", icon: Activity },
];

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const sb = getSupabase();
    if (!sb) return setError("Supabase is not configured for this deployment.");
    setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setBusy(false);
    if (error) setError(friendlyError(error));
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2A0E1A] px-5">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[420px] bg-[#F8F1E7] p-8 text-[#481D30] shadow-2xl sm:p-10"
      >
        <div className="pointer-events-none absolute inset-2 border border-[#D9B77D]/60" />
        <p className="text-[11px] tracking-[0.34em] text-[#A77B4D]">SEVOURA · ADMIN</p>
        <h1 className="mt-3 font-serif text-4xl">Store <span className="italic text-[#792D49]">dashboard.</span></h1>
        <p className="mt-3 text-[15px] text-[#806D60]">Sign in with an account that has admin access.</p>
        <div className="relative mt-7 space-y-4">
          {error && <Notice tone="error">{error}</Notice>}
          <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" loading={busy} className="w-full">SIGN IN</Button>
        </div>
      </motion.form>
    </div>
  );
}

function ForcePasswordChange({ onDone }: { onDone: () => Promise<void> }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 12 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return setError("Use at least 12 characters with letters and numbers.");
    if (pw !== confirm) return setError("Passwords don't match.");
    const sb = getSupabase()!;
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password: pw });
    if (error) {
      setBusy(false);
      return setError(friendlyError(error));
    }
    await sb.rpc("clear_password_change_flag");
    await onDone();
    setBusy(false);
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2A0E1A] px-5">
      <form onSubmit={onSubmit} noValidate className="relative w-full max-w-[440px] bg-[#F8F1E7] p-8 text-[#481D30] shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute inset-2 border border-[#D9B77D]/60" />
        <p className="text-[11px] tracking-[0.34em] text-[#A77B4D]">SEVOURA · ADMIN SECURITY</p>
        <h1 className="mt-3 font-serif text-3xl">Set your own password</h1>
        <p className="mt-3 text-[15px] leading-6 text-[#806D60]">You signed in with a temporary password. Choose a new one to continue — the temporary password stops working immediately.</p>
        <div className="relative mt-6 space-y-4">
          {error && <Notice tone="error">{error}</Notice>}
          <Field label="New password (12+ characters)" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <Field label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <Button type="submit" loading={busy} className="w-full">SAVE PASSWORD &amp; CONTINUE</Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, profile, signOut, configured, refreshProfile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile nav on navigation
  useEffect(() => setOpen(false), [pathname]);

  if (!configured) {
    return <div className="flex min-h-screen items-center justify-center bg-[#2A0E1A] p-6 text-center text-[15px] text-[#F0DCD4]">Supabase environment variables are missing. See docs/DEPLOYMENT.md.</div>;
  }
  if (loading || (user && !profile)) {
    return <div className="flex min-h-screen items-center justify-center bg-[#2A0E1A]"><Loader2 className="animate-spin text-[#E5C48B]" /></div>;
  }
  if (!user) return <AdminLogin />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2A0E1A] px-6 text-center text-[#F8EDDF]">
        <div>
          <ShieldAlert className="mx-auto text-[#E5C48B]" size={36} strokeWidth={1.3} />
          <h1 className="mt-5 font-serif text-4xl">Access restricted</h1>
          <p className="mt-3 text-[15px] text-[#E3D0C2]">This area is only for SEVOURA store administrators.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/" className="border border-[#E5C48B] px-5 py-3 text-[12px] tracking-[0.2em]">BACK TO STORE</Link>
            <button onClick={() => signOut()} className="bg-[#E5C48B] px-5 py-3 text-[12px] tracking-[0.2em] text-[#46182D]">SIGN OUT</button>
          </div>
        </div>
      </div>
    );
  }

  if (profile?.must_change_password) return <ForcePasswordChange onDone={refreshProfile} />;

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav className="flex h-full flex-col">
      <div className="px-6 pb-8 pt-7">
        <p className="font-serif text-2xl tracking-[0.25em] text-[#F8EDDF]">SEVOURA</p>
        <p className="mt-1 text-[10px] tracking-[0.35em] text-[#E5C48B]">STORE ADMIN</p>
      </div>
      <ul className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              className={`relative flex items-center gap-3 px-4 py-3 text-[15px] transition ${isActive(n.href) ? "text-[#2A0E1A]" : "text-[#E3CFC5] hover:bg-white/5 hover:text-white"}`}
            >
              {isActive(n.href) && <motion.span layoutId="admin-nav" className="absolute inset-0 bg-[#E5C48B]" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
              <n.icon size={16} className="relative" />
              <span className="relative">{n.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#E3CFC5] hover:text-white">
          <ExternalLink size={14} /> View store
        </Link>
        <button
          onClick={async () => {
            await signOut();
            router.replace("/admin");
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] text-[#E3CFC5] hover:text-white"
        >
          <LogOut size={14} /> Sign out
        </button>
        <p className="truncate px-4 pt-2 text-[12px] text-[#B79C95]">{profile?.email}</p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F4EEE5] text-[#3B2028]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] bg-[#2A0E1A] lg:block">{nav}</aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E2D5C3] bg-[#F4EEE5]/90 px-4 backdrop-blur lg:hidden">
        <p className="font-serif text-lg tracking-[0.2em] text-[#792D49]">SEVOURA <span className="text-[11px] tracking-[0.3em] text-[#A77B4D]">ADMIN</span></p>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2"><Menu size={20} /></button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.35 }} className="absolute inset-y-0 left-0 w-[260px] bg-[#2A0E1A]">
              <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-6 p-2 text-white"><X size={18} /></button>
              {nav}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="lg:pl-[240px]">
        <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6 md:py-10 lg:px-10">
          {children}
        </motion.div>
      </main>
    </div>
  );
}
