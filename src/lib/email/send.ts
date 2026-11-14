import "server-only";

/**
 * SERVER-ONLY transactional email sender (Resend HTTP API).
 *
 * Environment (Vercel → Project → Settings → Environment Variables, never NEXT_PUBLIC_):
 *   RESEND_API_KEY   re_…  (secret)
 *   EMAIL_FROM       SEVOURA <hello@sevoura.com>
 *   EMAIL_REPLY_TO   hello@sevoura.com            (optional)
 *
 * The idempotency key makes Resend drop a repeat of the same message for 24 hours, on top of the
 * database guard in email_log — so a retry can never produce a second copy in the customer's inbox.
 */

export type SendResult = { ok: true; id: string } | { ok: false; error: string; retryable: boolean };

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(msg: { to: string; subject: string; html: string; text: string; idempotencyKey: string }): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "email_not_configured", retryable: true };
  const from = process.env.EMAIL_FROM || "SEVOURA <hello@sevoura.com>";
  const replyTo = process.env.EMAIL_REPLY_TO || "hello@sevoura.com";

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": msg.idempotencyKey },
      body: JSON.stringify({ from, to: [msg.to], reply_to: replyTo, subject: msg.subject, html: msg.html, text: msg.text }),
      signal: ctrl.signal,
      cache: "no-store",
    });
    const body = (await r.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (r.ok && body.id) return { ok: true, id: body.id };
    // 4xx (bad address, unverified domain…) won't fix itself on retry, except rate limits
    return { ok: false, error: `${r.status} ${body.name ?? ""} ${body.message ?? ""}`.trim(), retryable: r.status === 429 || r.status >= 500 };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.name + ": " + e.message : "network_error", retryable: true };
  } finally {
    clearTimeout(timer);
  }
}
