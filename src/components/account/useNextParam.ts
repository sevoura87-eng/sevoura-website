"use client";

import { useSearchParams } from "next/navigation";

/** Safe in-site redirect target (?next=/checkout) — never an external URL. */
export function useNextParam(fallback = "/account") {
  const params = useSearchParams();
  const next = params.get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return fallback;
}
