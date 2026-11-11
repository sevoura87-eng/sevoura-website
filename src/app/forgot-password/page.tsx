"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import AuthShell from "@/components/account/AuthShell";
import { Field } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { getSupabase } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { isValidEmail } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    const sb = getSupabase();
    if (!sb) return setError("The store is not connected yet.");
    setBusy(true);
    const { error } = await sb.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return setError(friendlyError(error));
    setSent(true);
  }

  return (
    <AuthShell
      eyebrow="ACCOUNT RECOVERY"
      title="Reset your"
      italic="password."
      intro="Enter the email you registered with and we'll send you a secure link to choose a new password."
      image="/images/hero-window.jpg"
    >
      {sent ? (
        <div className="space-y-5">
          <Notice tone="success">
            If an account exists for <strong>{email}</strong>, a reset link is on its way. The link expires in one hour.
          </Notice>
          <Link href="/login" className="inline-block text-[13px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">
            BACK TO SIGN IN
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {error && <Notice tone="error">{error}</Notice>}
          <Field label="Email address" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" loading={busy} className="w-full">
            SEND RESET LINK
          </Button>
          <p className="pt-2 text-center text-[15px] text-[#806D60]">
            Remembered it?{" "}
            <Link href="/login" className="font-medium text-[#792D49] underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
