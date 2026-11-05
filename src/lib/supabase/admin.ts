import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY Supabase client using the service-role key.
 * Bypasses RLS — use only in route handlers for trusted operations such as
 * recording a verified payment-gateway confirmation. Never import this from a
 * client component. The key must be set in Vercel as SUPABASE_SERVICE_ROLE_KEY
 * (no NEXT_PUBLIC_ prefix, so it is never shipped to the browser).
 */
export function getServiceSupabase() {
  // Never mix projects: the SEVOURA project's URL is only paired with its own service key.
  const url = process.env.NEXT_PUBLIC_SEVOURA_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SEVOURA_SUPABASE_URL
    ? process.env.SEVOURA_SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
