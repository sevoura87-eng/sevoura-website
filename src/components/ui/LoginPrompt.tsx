"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import Ornament from "./Ornament";

/**
 * Gentle sign-in invitation for guests.
 * Shows once after DELAY_MS of browsing; never for signed-in visitors or on auth / checkout /
 * account / admin pages; after it is closed it stays away for SNOOZE_DAYS.
 */
const DELAY_MS = 30_000;
const SNOOZE_DAYS = 3;
const KEY = "sevoura-login-prompt-snooze";
const HIDDEN_ON = ["/login", "/signup", "/forgot-password", "/reset-password", "/checkout", "/account", "/admin"];

function snoozed() {
  try {
    const until = Number(localStorage.getItem(KEY) ?? 0);
    return until > Date.now();
  } catch {
    return false;
  }
}

export default function LoginPrompt() {
  const { user, loading } = useAuth();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const blockedHere = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!isSupabaseConfigured || loading || user || snoozed()) return;
    const t = setTimeout(() => {
      if (!snoozed()) setOpen(true);
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, [loading, user]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, String(Date.now() + SNOOZE_DAYS * 86_400_000));
    } catch {
      /* private mode: just close */
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const show = open && !user && !blockedHere;
  const next = encodeURIComponent(pathname);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="login-prompt"
          className="fixed inset-0 z-[400] flex items-end justify-center bg-[#26000D]/55 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-prompt-title"
            className="relative w-full max-w-[420px] overflow-hidden border border-[#D6A64F]/50 bg-[#390014] px-7 pb-8 pt-10 text-center text-[#F7F0E6] shadow-[0_40px_90px_-30px_rgba(0,0,0,.7)] sm:px-10"
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D6A64F]/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute inset-2 border border-[#D6A64F]/20" />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#E2CBB8] transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <span className="relative inline-flex text-[#D6A64F]">
              <Ornament size={22} />
            </span>
            <p className="relative mt-4 text-[9px] tracking-[0.34em] text-[#D6A64F]">WELCOME TO SEVOURA</p>
            <h2 id="login-prompt-title" className="relative mt-3 font-display text-[34px] leading-[1.05]">
              Sign in to begin
              <br />
              <span className="italic text-[#F0D69A]">your ritual.</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-[300px] text-[13px] leading-6 text-[#E2CBB8]">
              Save your bag, check out faster and follow every order from your account.
            </p>

            <div className="relative mt-7 flex flex-col gap-3">
              <Link
                href={`/login?next=${next}`}
                onClick={() => setOpen(false)}
                className="bg-[#D6A64F] px-6 py-4 text-[11px] font-semibold tracking-[0.2em] text-[#26000D] transition-colors hover:bg-[#F0D69A]"
              >
                SIGN IN
              </Link>
              <Link
                href={`/signup?next=${next}`}
                onClick={() => setOpen(false)}
                className="border border-[#D6A64F]/50 px-6 py-4 text-[11px] tracking-[0.2em] text-[#F0D69A] transition-colors hover:border-[#F0D69A] hover:bg-white/5"
              >
                CREATE AN ACCOUNT
              </Link>
              <button type="button" onClick={close} className="mt-1 text-[11px] tracking-[0.12em] text-[#BFA295] underline-offset-4 hover:text-[#F7F0E6] hover:underline">
                Continue browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
