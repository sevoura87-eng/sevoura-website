"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;

/** Brand intro — plays once per browser session, ~2s, skipped for reduced motion. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [show, setShow] = useState(true);

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
    const end = window.setTimeout(() => {
      setShow(false);
    }, 1800);
    return () => {
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
          {/* One composition sized to the ring: every element is measured in the ring's own width (cqw), so the
              wordmark, divider and tagline keep their proportions and stay centred inside it at any screen size. */}
          <div className="relative grid aspect-square w-[min(84vw,420px)] place-items-center [container-type:inline-size]">
            <motion.div
              aria-hidden
              initial={{ scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 rounded-full border border-[#E5C48B]/35"
            />
            <motion.div
              aria-hidden
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-[4.5%] rounded-full border border-[#E5C48B]/12"
            />
            <div className="relative flex w-[74%] flex-col items-center text-center">
              <div className="overflow-hidden">
                {/* padding-left equals the letter-spacing so the trailing space after the last letter doesn't shift the word */}
                <div role="heading" aria-level={2} className="flex justify-center pl-[0.2em] font-display text-[11cqw] font-normal leading-[1.1] tracking-[0.2em]">
                  {"SEVOURA".split("").map((c, k) => (
                    <motion.span
                      key={k}
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.2 + k * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block"
                    >
                      {c}
                    </motion.span>
                  ))}
                </div>
              </div>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.65, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-[5cqw] block h-px w-[46cqw] origin-center bg-[#E5C48B]"
              />
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-[5cqw] whitespace-nowrap pl-[0.3em] text-[max(9px,2.65cqw)] font-medium tracking-[0.3em] text-[#E5C48B]"
              >
                CLEANSE · ELEVATE · RADIATE
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
