"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client.
 *
 * Only the PUBLIC url + anon (publishable) key are used here. They are safe to
 * expose: every table is protected by Row Level Security, and all sensitive
 * operations (placing orders, admin actions, analytics) run inside database
 * functions that verify the caller server-side.
 *
 * Sessions are persisted in localStorage and refreshed automatically, so a
 * customer stays signed in across visits until they log out or the refresh
 * token expires (configurable in Supabase → Authentication → Sessions).
 */

// NEXT_PUBLIC_SEVOURA_* take priority so the store's own project is used even when a
// Vercel Marketplace Supabase integration injects its generic NEXT_PUBLIC_SUPABASE_* variables.
// (Each NEXT_PUBLIC_ variable must be referenced literally so Next.js can inline it.)
const sevouraUrl = process.env.NEXT_PUBLIC_SEVOURA_SUPABASE_URL;
const sevouraKey = process.env.NEXT_PUBLIC_SEVOURA_SUPABASE_ANON_KEY;
const url = sevouraUrl ? sevouraUrl : process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = sevouraUrl
  ? sevouraKey
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

let client: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(url && anonKey);

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "implicit",
        storageKey: "sevoura-auth",
      },
    });
  }
  return client;
}

export function requireSupabase(): SupabaseClient {
  const sb = getSupabase();
  if (!sb) {
    throw new Error(
      "The store is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return sb;
}
