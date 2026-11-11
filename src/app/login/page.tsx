"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/account/AuthShell";
import { Field } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNextParam } from "@/components/account/useNextParam";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import StoreClosed from "@/components/shop/StoreClosed";
import { friendlyError } from "@/lib/errors";
import { isValidEmail } from "@/lib/validation";

function LoginForm() {
  const router = useRouter();
  const next = useNextParam();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace(next);
  }, [authLoading, user, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");
    const sb = getSupabase();
    if (!sb) return setError("The store is not connected yet.");
    setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setBusy(false);
    if (error) return setError(friendlyError(error));
    router.replace(next);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && <Notice tone="error">{error}</Notice>}
      <Field label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-[13px] text-[#792D49] underline-offset-4 hover:underline">
          Forgot your password?
        </Link>
      </div>
      <Button type="submit" loading={busy} className="w-full">
        SIGN IN
      </Button>
      <p className="pt-3 text-center text-[15px] text-[#806D60]">
        New to SEVOURA?{" "}
        <Link href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-[#792D49] underline underline-offset-4">
          Create an account
        </Link>
      </p>
      <p className="text-center text-[12px] leading-5 text-[#A08A79]">You&apos;ll stay signed in on this device until you sign out.</p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Sign in to"
      italic="your ritual."
      intro="Access your orders, saved addresses and a faster checkout."
      image="/images/products/friday.jpg"
    >
      <Suspense fallback={null}>
        {isSupabaseConfigured ? <LoginForm /> : <StoreClosed compact />}
      </Suspense>
    </AuthShell>
  );
}
