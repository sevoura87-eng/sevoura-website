"use client";

import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-4xl text-[#3B1626] md:text-5xl">{title}</h1>
        {sub && <p className="mt-2 text-[15px] text-[#806D60]">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-[#E2D5C3] bg-white/70 ${className}`}>{children}</div>;
}

function CountUp({ value, format }: { value: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setDisplay(format ? format(Math.round(v)) : Math.round(v).toLocaleString("en-IN")) });
    return () => c.stop();
  }, [inView, value, mv, format]);
  return <span ref={ref}>{display}</span>;
}

export function StatTile({
  label, value, icon: Icon, format, hint, tone = "default", index = 0,
}: {
  label: string; value: number; icon: LucideIcon; format?: (n: number) => string; hint?: string; tone?: "default" | "accent"; index?: number;
}) {
  const accent = tone === "accent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className={`relative overflow-hidden border p-5 ${accent ? "border-[#792D49] bg-[#792D49] text-[#FBF0E4]" : "border-[#E2D5C3] bg-white/70"}`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-[12px] font-medium uppercase tracking-[0.18em] ${accent ? "text-[#E5C48B]" : "text-[#9A8070]"}`}>{label}</p>
        <Icon size={16} className={accent ? "text-[#E5C48B]" : "text-[#B28B4E]"} />
      </div>
      <p className="mt-3 font-serif text-[34px] leading-none tabular-nums">
        <CountUp value={value} format={format} />
      </p>
      {hint && <p className={`mt-2 text-[13px] ${accent ? "text-[#EBD9D4]" : "text-[#9A8777]"}`}>{hint}</p>}
    </motion.div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="px-6 py-14 text-center text-[15px] text-[#9A8777]">{children}</div>;
}

export function ErrorBox({ message }: { message: string }) {
  return <div className="border border-[#E2B3B3] bg-[#FBEDED] px-4 py-3 text-[15px] text-[#8A2E2E]">{message}</div>;
}

export function Skeleton({ h = 120 }: { h?: number }) {
  return <div className="animate-pulse bg-[#E9DFD2]" style={{ height: h }} />;
}
