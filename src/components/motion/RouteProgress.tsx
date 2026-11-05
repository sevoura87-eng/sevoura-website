"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Slim gold loading bar shown while navigating between pages. */
export default function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      setState("loading");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- route finished: complete the bar
    setState((s) => (s === "loading" ? "done" : s));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 450);
    return () => window.clearTimeout(timer.current);
  }, [pathname, search]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[310] h-[3px]">
      <div
        className="h-full bg-[#C49A59] shadow-[0_0_12px_rgba(229,196,139,.9)]"
        style={{
          width: state === "idle" ? "0%" : state === "loading" ? "78%" : "100%",
          opacity: state === "idle" ? 0 : 1,
          transition:
            state === "loading"
              ? "width 2.4s cubic-bezier(.1,.7,.2,1), opacity .2s"
              : "width .25s ease-out, opacity .35s ease .2s",
        }}
      />
    </div>
  );
}
