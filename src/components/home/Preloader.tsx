"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SEVEN } from "./data";

const ease = [0.76, 0, 0.24, 1] as const;

/** Brand intro — plays once per browser session, ~2s, skipped for reduced motion. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);
  const [i, setI] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("sev-intro") === "1";
      sessionStorage.setItem("sev-intro", "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip intro on repeat visits
      setShow(false);
      onDone();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const tick = window.setInterval(() => setI((n) => (n + 1) % 7), 190);
    const end = window.setTimeout(() => {
      window.clearInterval(tick);
      setShow(false);
    }, 2100);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(end);
      document.documentElement.style.overflow = "";
    };
  }, [onDone]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
        onDone();
      }}
    >
      {show && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[600] flex items-center justify-center bg-[#2E0F1D] text-[#F8EDDF]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.95, ease }}
        >
          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E5C48B]/30"
            />
            <div className="overflow-hidden">
              <div className="flex justify-center font-display text-[13vw] leading-none tracking-[0.18em] sm:text-7xl">
                {"SEVOURA".split("").map((c, k) => (
                  <motion.span
                    key={k}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + k * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-6 h-px w-48 origin-left bg-[#E5C48B]"
            />
            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] tracking-[0.35em] text-[#E5C48B]">
              <span className="w-6 text-right font-display text-xl tracking-normal">{SEVEN[i].symbol}</span>
              <span className="w-28 text-left">{SEVEN[i].day.toUpperCase()}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
