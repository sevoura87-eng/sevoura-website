import { connection } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { json, userFromRequest } from "@/lib/payments/server";
import { liveOpenToAll, liveTesterEmails, razorpayMode } from "@/lib/payments/razorpay";

/**
 * GET /api/payments/health — ADMIN ONLY. Checks the payment configuration without revealing any
 * secret: which mode the key is in, whether Razorpay accepts the credentials, whether the webhook
 * secret is set, and whether the server key belongs to this Supabase project.
 */
export async function GET(req: Request) {
  await connection();
  const sb = getServiceSupabase();
  const supabaseUrl = process.env.NEXT_PUBLIC_SEVOURA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const project = supabaseUrl.replace(/^https:\/\//, "").split(".")[0] || null;
  if (!sb) return json({ error: "server_not_configured", checks: { service_role_key: false, supabase_project: project } }, 503);

  const user = await userFromRequest(sb, req);
  if (!user) return json({ error: "not_authenticated" }, 401);
  const { data: prof } = await sb.from("profiles").select("role, account_status").eq("id", user.id).maybeSingle();
  if (prof?.role !== "admin" || prof.account_status !== "active") return json({ error: "admin_only" }, 403);

  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const mode = razorpayMode();
  let credentials: "valid" | "rejected" | "not_set" | "unreachable" = "not_set";
  if (keyId && process.env.RAZORPAY_KEY_SECRET) {
    try {
      const auth = "Basic " + Buffer.from(`${keyId}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
      const r = await fetch("https://api.razorpay.com/v1/orders?count=1", { headers: { Authorization: auth }, cache: "no-store" });
      credentials = r.ok ? "valid" : r.status === 401 ? "rejected" : "unreachable";
    } catch {
      credentials = "unreachable";
    }
  }
  const { error: srvErr } = await sb.rpc("rzp_event_seen", { p_event_id: "__health__" });
  const { count: webhookEvents } = await sb.from("payment_webhook_events").select("event_id", { count: "exact", head: true });

  const testers = liveTesterEmails();
  return json({
    checks: {
      mode, // "live" | "test" | null
      key_id_hint: keyId ? `${keyId.slice(0, 9)}…${keyId.slice(-4)}` : null,
      credentials,
      webhook_secret_set: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET),
      webhook_events_received: webhookEvents ?? 0,
      service_role_key: !srvErr,
      supabase_project: project,
      live_open_to_all: mode === "live" ? liveOpenToAll() : null,
      live_testers: testers.length,
      you_are_live_tester: testers.includes((user.email ?? "").toLowerCase()),
    },
  });
}
