"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type Cta = { label: string; href: string };

/**
 * Editorial split hero shared by the inner pages: serif headline on the left,
 * SEVOURA campaign art (or a photograph) on the right. `tone` picks the burgundy or ivory edition.
 */
export default function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  primary,
  secondary,
  tone = "dark",
  art,
  artAlt = "",
  artPosition = "50% 50%",
  footnote,
  artNode,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  intro?: ReactNode;
  primary?: Cta;
  secondary?: Cta;
  tone?: "dark" | "light";
  art?: string;
  artAlt?: string;
  artPosition?: string;
  footnote?: ReactNode;
  artNode?: ReactNode;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  const img = art ?? (dark ? "/images/sevoura-orbit.jpg" : "/images/sevoura-orbit-ivory.jpg");
  const bg = dark ? "#26000D" : "#F3EADD";
  return (
    <section className={`relative isolate overflow-hidden ${dark ? "bg-[#26000D] text-[#F7F0E6]" : "bg-[#F3EADD] text-[#2E1A20]"}`}>
      {dark && <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(110%_90%_at_75%_40%,#5A1630_0%,#390014_45%,#26000D_100%)]" />}
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-16 pt-14 md:px-12 lg:min-h-[min(760px,calc(100svh-78px))] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-16 lg:py-16">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }} className="relative z-10 max-w-[640px]">
          <p className={`flex items-center gap-4 text-[12px] font-medium tracking-[0.34em] ${dark ? "text-[#D6A64F]" : "text-[#A77B4D]"}`}>
            <span className={`h-px w-10 ${dark ? "bg-[#D6A64F]" : "bg-[#A77B4D]"}`} />
            {eyebrow}
          </p>
          <h1 className={`mt-8 font-display text-[clamp(3rem,6.4vw,6rem)] font-medium leading-[0.98] tracking-[-0.01em] ${dark ? "text-[#F7F0E6]" : "text-[#2E1A20]"}`}>
            {title}
            {accent && (
              <>
                <br />
                <span className={`italic ${dark ? "text-[#D6A64F]" : "text-[#792D49]"}`}>{accent}</span>
              </>
            )}
          </h1>
          {intro && <div className={`mt-8 max-w-[520px] text-[17px] leading-8 ${dark ? "text-[#E8D3C3]/85" : "text-[#5E4A44]"}`}>{intro}</div>}
          {(primary || secondary) && (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {primary && (
                <Link
                  href={primary.href}
                  className={`group inline-flex items-center gap-4 px-8 py-[18px] text-[12px] font-semibold tracking-[0.22em] transition-colors duration-500 ${
                    dark ? "bg-[#D6A64F] text-[#26000D] hover:bg-[#F0D69A]" : "bg-[#481D30] text-[#FFF6E9] hover:bg-[#792D49]"
                  }`}
                >
                  {primary.label}
                  <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              )}
              {secondary && (
                <Link
                  href={secondary.href}
                  className={`inline-flex items-center gap-3 border px-7 py-[17px] text-[12px] font-medium tracking-[0.22em] transition-colors duration-500 ${
                    dark ? "border-[#D6A64F]/45 text-[#F0D69A] hover:border-[#F0D69A] hover:bg-[#F0D69A]/10" : "border-[#481D30]/40 text-[#481D30] hover:border-[#481D30] hover:bg-[#481D30]/5"
                  }`}
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          )}
          {children}
          {footnote && <p className={`mt-12 text-[12px] tracking-[0.3em] ${dark ? "text-[#B9925A]" : "text-[#A77B4D]"}`}>{footnote}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[420px] sm:max-w-[500px] lg:max-w-[560px]"
        >
          {artNode ?? (
            <>
              <div className="relative aspect-[5/6] w-full">
                <Image
                  src={img}
                  alt={artAlt}
                  fill
                  priority
                  sizes="(min-width:1024px) 560px, 90vw"
                  style={{ objectPosition: artPosition }}
                  className="object-cover [mask-image:radial-gradient(ellipse_74%_80%_at_50%_48%,#000_64%,transparent_100%)]"
                />
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(transparent, ${bg})` }} />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
