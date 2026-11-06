"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Small fetch helper: runs `fn` with the Supabase client, tracks loading/error, exposes reload. */
export function useAdminData<T>(fn: (sb: SupabaseClient) => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fnRef = useRef(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  });
  const key = JSON.stringify(deps);

  const reload = useCallback(async (opts?: { silent?: boolean }) => {
    const sb = getSupabase();
    if (!sb) return;
    if (!opts?.silent) setLoading(true);
    try {
      setData(await fnRef.current(sb));
      setError(null);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount / when deps change
    reload();
  }, [reload, key]);

  return { data, error, loading, reload, setData };
}

/** Throw Supabase errors so useAdminData can show them */
export function unwrap<T>(res: { data: T | null; error: unknown }): T {
  if (res.error) throw res.error;
  return res.data as T;
}

/** Calls `onChange` (debounced) whenever an order is created or updated — keeps admin numbers live. */
export function useOrdersRealtime(onChange: () => void) {
  const cb = useRef(onChange);
  useLayoutEffect(() => {
    cb.current = onChange;
  });
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let t: number | undefined;
    const ch = sb
      .channel(`admin-orders-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        window.clearTimeout(t);
        t = window.setTimeout(() => cb.current(), 600);
      })
      .subscribe();
    // fallback refresh every 60s in case realtime is unavailable
    const poll = window.setInterval(() => cb.current(), 60000);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(poll);
      sb.removeChannel(ch);
    };
  }, []);
}
