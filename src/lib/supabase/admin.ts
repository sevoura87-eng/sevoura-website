import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY Supabase client using the service-role key.
 * Bypasses RLS — use only in route handlers for trusted operations such as
 * recording a verified payment-gateway confirmation. Never import this from a
 * client component. Set the key in Vercel as SEVOURA_SUPABASE_SERVICE_ROLE_KEY
 * (no NEXT_PUBLIC_ prefix, so it is never shipped to the browser).
 */

/** Project ref inside a legacy JWT key ("ref" claim), or null for opaque keys. */
function jwtRef(key: string): string | null {
  const part = key.split(".")[1];
  if (!part) return null;
  try {
    const json = JSON.parse(Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    return typeof json.ref === "string" ? json.ref : null;
  } catch {
    return null;
  }
}

export function getServiceSupabase() {
  const sevouraUrl = process.env.NEXT_PUBLIC_SEVOURA_SUPABASE_URL;
  const url = sevouraUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;

  let key: string | undefined;
  if (sevouraUrl) {
    key = process.env.SEVOURA_SUPABASE_SERVICE_ROLE_KEY;
    // Fallback: accept the generic name only when the key provably belongs to the SEVOURA project
    // (a Vercel integration may have filled SUPABASE_SERVICE_ROLE_KEY for a different project).
    if (!key && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const ref = sevouraUrl.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
      if (ref && jwtRef(process.env.SUPABASE_SERVICE_ROLE_KEY) === ref) key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  } else {
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  if (!key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
