"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import AuthShell from "@/components/account/AuthShell";
import { Field } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/components/providers/AuthProvider";
import { useNextParam } from "@/components/account/useNextParam";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import StoreClosed from "@/components/shop/StoreClosed";
import { friendlyError } from "@/lib/errors";
import { isValidEmail, normalizePhone, passwordIssues } from "@/lib/validation";

type Errors = Partial<Record<"name" | "email" | "phone" | "password" | "confirm", string>>;

function SignupForm() {
  const router = useRouter();
  const next = useNextParam();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) router.replace(next);
  }, [authLoading, user, next, router]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const errs: Errors = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!isValidEmail(form.email)) errs.email = "Please enter a valid email address.";
    if (form.phone && !normalizePhone(form.phone)) errs.phone = "Enter a valid 10-digit Indian mobile number.";
    const pw = passwordIssues(form.password);
    if (pw) errs.password = pw;
    if (form.confirm !== form.password) errs.confirm = "Passwords don't match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const sb = getSupabase();
    if (!sb) return setError("The store is not connected yet.");
    setBusy(true);
    const { data, error } = await sb.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: { full_name: form.name.trim(), phone: form.phone ? normalizePhone(form.phone) : null },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    setBusy(false);
    if (error) return setError(friendlyError(error));
    // Supabase returns a user with no identities when the email is already registered
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return setError("An account with this email already exists. Try signing in instead.");
    }
    if (data.session) router.replace(next);
    else setSentTo(form.email.trim());
  }

  if (sentTo) {
    return (
      <div className="border border-[#DCCAB5] bg-[#FCF7EF] p-8 text-center">
        <MailCheck size={34} strokeWidth={1.2} className="mx-auto text-[#A77B4D]" />
        <p className="mt-5 font-serif text-2xl">Check your inbox</p>
        <p className="mt-3 text-[15px] leading-7 text-[#806D60]">
          We sent a confirmation link to <strong className="text-[#481D30]">{sentTo}</strong>. Open it to activate your account —
          you&apos;ll be signed in automatically.
        </p>
        <Link href="/login" className="mt-6 inline-block text-[13px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">
          BACK TO SIGN IN
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && <Notice tone="error">{error}</Notice>}
      <Field label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
      <Field label="Email address" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
      <Field
        label="Mobile number (optional)"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={form.phone}
        onChange={set("phone")}
        error={errors.phone}
        hint="Used only for delivery updates."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} error={errors.password} hint="8+ characters, letters & numbers" />
        <Field label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
      </div>
      <Button type="submit" loading={busy} className="w-full">
        CREATE ACCOUNT
      </Button>
      <p className="text-center text-[12px] leading-5 text-[#A08A79]">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline">Terms</Link> and{" "}
        <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
      </p>
      <p className="pt-2 text-center text-[15px] text-[#806D60]">
        Already have an account?{" "}
        <Link href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-[#792D49] underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="JOIN SEVOURA"
      title="Begin"
      italic="your ritual."
      intro="Create an account to place orders, track deliveries and keep your details for next time."
      image="/images/products/monday.jpg"
    >
      <Suspense fallback={null}>
        {isSupabaseConfigured ? <SignupForm /> : <StoreClosed compact />}
      </Suspense>
    </AuthShell>
  );
}
