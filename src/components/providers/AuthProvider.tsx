"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

interface AuthState {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  signingOut: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [signingOut, setSigningOut] = useState(false);

  const loadProfile = useCallback(async (userId: string | undefined) => {
    const sb = getSupabase();
    if (!sb || !userId) {
      setProfile(null);
      return;
    }
    const { data } = await sb
      .from("profiles")
      .select("id, full_name, email, phone, role, account_status, created_at, last_login_at, must_change_password")
      .eq("id", userId)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let active = true;
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : null;

    // Restores the persisted session on every visit — no repeated logins.
    sb.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      if (active) setLoading(false);
      if (data.session) sb.rpc("touch_session", { p_user_agent: ua }).then(() => undefined);
    });

    const { data: sub } = sb.auth.onAuthStateChange((event, next) => {
      setSession(next);
      // Defer Supabase calls out of the auth callback (avoids an auth lock deadlock)
      setTimeout(() => {
        if (!active) return;
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          loadProfile(next?.user.id);
          if (event === "SIGNED_IN") sb.rpc("touch_session", { p_user_agent: ua }).then(() => undefined);
        }
        if (event === "SIGNED_OUT") setProfile(null);
      }, 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setSigningOut(true);
    window.setTimeout(() => setSigningOut(false), 4000);
    try {
      await sb.rpc("record_logout", {
        p_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      });
    } catch {
      /* logging must never block sign-out */
    }
    await sb.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      configured: isSupabaseConfigured,
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin: profile?.role === "admin" && profile.account_status === "active",
      signingOut,
      refreshProfile: () => loadProfile(session?.user.id),
      signOut,
    }),
    [loading, session, profile, loadProfile, signOut, signingOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
