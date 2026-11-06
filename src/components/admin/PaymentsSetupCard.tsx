"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, RefreshCw } from "lucide-react";
import { Card } from "@/components/admin/ui";
import { getSupabase } from "@/lib/supabase/client";

type Checks = {
  mode: "live" | "test" | null;
  key_id_hint: string | null;
  credentials: "valid" | "rejected" | "not_set" | "unreachable";
  webhook_secret_set: boolean;
  webhook_events_received: number;
  service_role_key: boolean;
  supabase_project: string | null;
  live_open_to_all: boolean | null;
  live_testers: number;
  you_are_live_tester: boolean;
};

const EXPECTED_PROJECT = "igvkiplyqcookmgjqnus";

function Row({ ok, label, detail }: { ok: boolean | null; label: string; detail: string }) {
  return (
    <li className="flex items-start gap-3 py-2.5 text-[13px]">
      {ok ? (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#3E7A4A]" aria-label="OK" />
      ) : (
        <CircleAlert size={16} className={`mt-0.5 shrink-0 ${ok === null ? "text-[#B28B4E]" : "text-[#A33B3B]"}`} aria-label={ok === null ? "Info" : "Needs attention"} />
      )}
      <div>
        <p className="text-[#3B2028]">{label}</p>
        <p className="text-[11px] text-[#9A8777]">{detail}</p>
      </div>
    </li>
  );
}

/** Admin-only payment configuration check. Shows no secrets — only whether each piece is in place. */
export default function PaymentsSetupCard() {
  const [checks, setChecks] = useState<Checks | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = useCallback(async () => {
    setBusy(true);
    setErr(null);
    try {
      const token = (await getSupabase()?.auth.getSession())?.data.session?.access_token;
      const r = await fetch("/api/payments/health", { cache: "no-store", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const j = await r.json();
      if (j.checks) setChecks(j.checks as Checks);
      if (!r.ok) setErr(j.error ?? `HTTP ${r.status}`);
    } catch {
      setErr("Could not reach the payment check.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial check
    run();
  }, [run]);

  const c = checks;
  return (
    <Card className="mt-6 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-serif text-2xl">Payments setup</p>
          <p className="text-[11px] text-[#9A8777]">Razorpay configuration on this deployment. No secrets are shown.</p>
        </div>
        <button onClick={run} disabled={busy} className="inline-flex items-center gap-1.5 text-[11px] text-[#792D49] hover:underline disabled:opacity-50">
          <RefreshCw size={12} className={busy ? "animate-spin" : ""} /> Re-check
        </button>
      </div>
      {err && !c && <p className="mt-4 text-[12px] text-[#A33B3B]">{err === "server_not_configured" ? "The Supabase server key (SEVOURA_SUPABASE_SERVICE_ROLE_KEY) is not set in Vercel." : err}</p>}
      {c && (
        <ul className="mt-3 divide-y divide-[#EEE5D9]">
          <Row ok={c.mode !== null} label={`Razorpay mode: ${c.mode ? c.mode.toUpperCase() : "not set"}`} detail={c.key_id_hint ? `Key ${c.key_id_hint}` : "RAZORPAY_KEY_ID is missing"} />
          <Row
            ok={c.credentials === "valid"}
            label={`Razorpay accepts the key: ${c.credentials === "valid" ? "yes" : c.credentials === "rejected" ? "NO — key id/secret don't match" : c.credentials === "not_set" ? "not set" : "could not reach Razorpay"}`}
            detail="Checked with a read-only request to Razorpay"
          />
          <Row ok={c.webhook_secret_set} label={`Webhook secret: ${c.webhook_secret_set ? "set" : "missing"}`} detail={`${c.webhook_events_received} verified webhook event(s) received so far`} />
          <Row ok={c.service_role_key} label={`Supabase server key: ${c.service_role_key ? "valid" : "missing or wrong"}`} detail="Needed to record verified payments" />
          <Row
            ok={c.supabase_project === EXPECTED_PROJECT}
            label={`Supabase project: ${c.supabase_project ?? "unknown"}`}
            detail={c.supabase_project === EXPECTED_PROJECT ? "SEVOURA (Mumbai) — correct" : "This is NOT the SEVOURA project"}
          />
          {c.mode === "live" && (
            <Row
              ok={null}
              label={c.live_open_to_all ? "Live payments: OPEN to all customers" : "Live payments: owner testing only"}
              detail={
                c.live_open_to_all
                  ? "RAZORPAY_ALLOW_LIVE=true"
                  : `${c.live_testers} test account(s)${c.you_are_live_tester ? ", including you" : " — you are not one of them"}. Customers still see “Unpaid” checkout.`
              }
            />
          )}
        </ul>
      )}
    </Card>
  );
}
