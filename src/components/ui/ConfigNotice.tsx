"use client";

import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** Visible only if the deployment is missing its Supabase environment variables. */
export default function ConfigNotice() {
  const [dismissed, setDismissed] = useState(false);
  // Developer-only hint; customers never see it in production
  if (isSupabaseConfigured || dismissed || process.env.NODE_ENV === "production") return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[500] mx-auto max-w-xl border border-[#C49A59] bg-[#46182D] p-4 text-[12px] leading-5 text-[#F8EDDF] shadow-2xl sm:left-auto">
      <p className="font-semibold tracking-wide text-[#E5C48B]">Store backend not connected</p>
      <p className="mt-1">
        Accounts, cart prices and checkout need <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. See <code>docs/DEPLOYMENT.md</code>.
      </p>
      <button onClick={() => setDismissed(true)} className="mt-2 text-[11px] underline underline-offset-4">
        Dismiss
      </button>
    </div>
  );
}
