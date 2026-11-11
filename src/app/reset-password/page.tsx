"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/account/AuthShell";
import { Field } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { getSupabase } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { passwordIssues } from "@/lib/validation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no backend configured
      setReady("invalid");
      return;
    }
    const { data } = sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady("ok");
    });
    // The recovery link signs the user in via the URL; give it a moment
    const t = window.setTimeout(async () => {
      const { data: s } = await sb.auth.getSession();
      setReady((r) => (r === "ok" || s.session ? "ok" : "invalid"));
    }, 1200);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(t);
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const issue = passwordIssues(pw);
    if (issue) return setError(issue);
    if (pw !== confirm) return setError("Passwords don't match.");
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setError(friendlyError(error));
    setDone(true);
    window.setTimeout(() => router.replace("/account"), 1800);
  }

  return (
    <AuthShell
      eyebrow="ACCOUNT RECOVERY"
      title="Choose a new"
      italic="password."
      intro="Pick something memorable and secure — at least 8 characters with letters and numbers."
      image="/images/hero-window.jpg"
    >
      {done ? (
        <Notice tone="success">Your password has been updated. Taking you to your account…</Notice>
      ) : ready === "checking" ? (
        <div className="h-40 animate-pulse bg-[#EFE3D3]" />
      ) : ready === "invalid" ? (
        <div className="space-y-5">
          <Notice tone="error">This reset link is invalid or has expired. Please request a new one.</Notice>
          <Link href="/forgot-password" className="inline-block text-[13px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">
            REQUEST A NEW LINK
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {error && <Notice tone="error">{error}</Notice>}
          <Field label="New password" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <Field label="Confirm new password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <Button type="submit" loading={busy} className="w-full">
            UPDATE PASSWORD
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
