import { connection } from "next/server";
import { razorpayMode, razorpayUnavailableReason } from "@/lib/payments/razorpay";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { json } from "@/lib/payments/server";

/**
 * GET /api/payments/status            → { enabled, mode, reason }   (used by the checkout)
 * GET /api/payments/status?verify=1   → adds pass/fail configuration checks for the owner.
 * Only booleans and the public project ref are returned — never a key or secret.
 * Results of the remote checks are cached for 5 minutes per server instance.
 */
type Checks = {
  razorpay_keys_valid: boolean;
  razorpay_webhook_secret_set: boolean;
  supabase_service_key_valid: boolean;
  supabase_project: string | null;
  live_mode_approved: boolean;
};
let cache: { at: number; checks: Checks } | null = null;

function projectRef() {
  const url = process.env.NEXT_PUBLIC_SEVOURA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1] ?? null;
}

async function runChecks(): Promise<Checks> {
  if (cache && Date.now() - cache.at < 5 * 60_000) return cache.checks;

  let razorpayOk = false;
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders?count=1", { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" });
      razorpayOk = res.ok;
    } catch {
      razorpayOk = false;
    }
  }

  let supabaseOk = false;
  const sb = getServiceSupabase();
  if (sb) {
    // calling a server-only function proves the key is a valid service key for THIS project
    const { error } = await sb.rpc("rzp_event_seen", { p_event_id: "__status_check__" });
    supabaseOk = !error;
  }

  const checks: Checks = {
    razorpay_keys_valid: razorpayOk,
    razorpay_webhook_secret_set: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
    supabase_service_key_valid: supabaseOk,
    supabase_project: projectRef(),
    live_mode_approved: process.env.RAZORPAY_ALLOW_LIVE === "true",
  };
  cache = { at: Date.now(), checks };
  return checks;
}

export async function GET(req: Request) {
  await connection();
  const reason = razorpayUnavailableReason() ?? (getServiceSupabase() ? null : "server_not_configured");
  const base = { enabled: reason === null, mode: razorpayMode(), reason };
  if (new URL(req.url).searchParams.get("verify") !== "1") {
    return json({ ...base, mode: reason === null ? base.mode : null });
  }
  return json({ ...base, checks: await runChecks() });
}
