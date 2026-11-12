"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type Cta = { label: string; href: string };

/**
 * Art-directed hero for the inner pages. Never shows product photography — only SEVOURA campaign art
 * (architecture, celestial geometry, botanical light). Layouts:
 *  - split:    headline beside a tall art plate (optionally reversed)
 *  - panorama: full-bleed architectural plate behind the headline
 *  - band:     a shorter editorial band for service and policy pages
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
  layout = "split",
  reverse = false,
  index,
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
  /** a live, layered artwork (components/art) used instead of a still image */
  artNode?: ReactNode;
  artAlt?: string;
  artPosition?: string;
  footnote?: ReactNode;
  layout?: "split" | "panorama" | "band";
  reverse?: boolean;
  /** small chapter marker shown above the eyebrow, e.g. "II" */
  index?: string;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  const root = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  /* on phones the panorama stacks (art above text); parallax there would slide the two into each other */
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setStacked(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const reduce = prefersReduced || (layout === "panorama" && stacked);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const ink = dark ? "text-[#F7F0E6]" : "text-[#2E1A20]";
  const accentInk = dark ? "text-[#D6A64F]" : "text-[#792D49]";
  const gold = dark ? "text-[#D6A64F]" : "text-[#A77B4D]";
  const goldBg = dark ? "bg-[#D6A64F]" : "bg-[#A77B4D]";
  const body = dark ? "text-[#E8D3C3]/85" : "text-[#5E4A44]";
  const bg = dark ? "#26000D" : "#F3EADD";

  const copy = (
    <motion.div style={{ y: reduce ? 0 : textY }} className="relative z-10 max-w-[640px]">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }}>
        <p className={`flex items-center gap-4 text-[12px] font-medium tracking-[0.34em] ${gold}`}>
          {index && <span className="font-display text-[15px] italic tracking-[0.1em]">{index}</span>}
          <span className={`h-px w-10 ${goldBg}`} />
          {eyebrow}
        </p>
        <h1 className={`mt-8 font-display font-medium leading-[0.96] tracking-[-0.015em] lg:mt-[3.2svh] ${ink} ${layout === "band" ? "text-[clamp(2.8rem,min(5.4vw,9svh),5rem)]" : "text-[clamp(3rem,min(6.6vw,10.6svh),6.4rem)]"}`}>
          {title}
          {accent && (
            <>
              <br />
              <span className={`italic ${accentInk}`}>{accent}</span>
            </>
          )}
        </h1>
      </motion.div>
      {intro && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.25 }} className={`mt-8 max-w-[520px] text-[17px] leading-8 lg:mt-[3svh] ${body}`}>
          {intro}
        </motion.div>
      )}
      {(primary || secondary) && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.4 }} className="mt-10 flex flex-wrap items-center gap-4 lg:mt-[4svh]">
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
        </motion.div>
      )}
      {children && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.4 }}>
          {children}
        </motion.div>
      )}
      {footnote && <p className={`mt-12 text-[12px] tracking-[0.3em] lg:mt-[4.5svh] ${gold}`}>{footnote}</p>}
    </motion.div>
  );

  /* ------------------------------------------------------------ panorama */
  if (layout === "panorama") {
    const wash = dark
      ? "bg-[linear-gradient(90deg,#26000D_0%,rgba(38,0,13,.88)_30%,rgba(38,0,13,.25)_62%,rgba(38,0,13,0)_80%)]"
      : "bg-[linear-gradient(90deg,#F3EADD_0%,rgba(243,234,221,.9)_30%,rgba(243,234,221,.15)_60%,rgba(243,234,221,0)_78%)]";
    return (
      <section ref={root} className={`relative isolate overflow-hidden ${dark ? "bg-[#26000D]" : "bg-[#F3EADD]"}`}>
        <motion.div style={{ y: reduce ? 0 : artY }} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2.2, ease }} className="absolute inset-0 -z-10 max-md:relative max-md:h-[62vw] max-md:min-h-[260px]">
          {artNode ?? (art && <Image src={art} alt={artAlt} fill priority sizes="100vw" style={{ objectPosition: artPosition }} className="object-cover" />)}
        </motion.div>
        <div aria-hidden className={`absolute inset-0 -z-10 max-md:hidden ${wash}`} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-28 max-md:hidden" style={{ background: `linear-gradient(transparent, ${bg})` }} />
        <div className="mx-auto flex max-w-[1440px] items-center px-6 pb-16 pt-12 md:min-h-[min(780px,calc(100svh-var(--header-h)))] md:px-12 md:py-20 lg:h-[calc(100svh-var(--header-h))] lg:min-h-[560px] lg:px-16 lg:py-[5svh]">{copy}</div>
      </section>
    );
  }

  /* ------------------------------------------------------------ split & band */
  const band = layout === "band";
  return (
    <section ref={root} className={`relative isolate overflow-hidden ${dark ? "bg-[#26000D]" : "bg-[#F3EADD]"}`}>
      {dark && <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(110%_90%_at_75%_40%,#4A1028_0%,#33000F_45%,#26000D_100%)]" />}
      <div
        className={`mx-auto grid max-w-[1440px] items-center gap-10 px-6 pb-14 pt-12 md:px-12 lg:gap-16 lg:px-16 ${
          band ? "lg:min-h-[480px] lg:grid-cols-[1.25fr_1fr] lg:py-[6svh]" : "lg:h-[calc(100svh-var(--header-h))] lg:min-h-[560px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-[5svh]"
        }`}
      >
        <div className={reverse ? "lg:order-2" : ""}>{copy}</div>
        <motion.div
          style={{ y: reduce ? 0 : artY }}
          initial={{ opacity: 0, y: 30, clipPath: "inset(12% 0 0 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.6, ease, delay: 0.1 }}
          className={`relative mx-auto w-full ${band ? "max-w-[560px]" : "max-w-[420px] sm:max-w-[500px] lg:flex lg:h-full lg:max-w-full lg:items-center lg:justify-center"} ${reverse ? "lg:order-1" : ""}`}
        >
          <div data-hero-art className={`relative ${band ? "aspect-[16/11] w-full" : "aspect-[5/6] w-full lg:h-[min(100%,680px,calc((min(100vw,1440px)-12rem)*0.585))] lg:w-auto"}`}>
            <div className="absolute inset-0 overflow-hidden">
              {artNode ?? (art && <Image src={art} alt={artAlt} fill priority sizes="(min-width:1024px) 560px, 92vw" style={{ objectPosition: artPosition }} className="art-drift object-cover" />)}
            </div>
            {/* a fine gold frame offset from the plate */}
            <div aria-hidden className={`pointer-events-none absolute border ${dark ? "border-[#D6A64F]/35" : "border-[#A77B4D]/35"} ${reverse ? "-bottom-3 -left-3 right-3 top-3" : "-bottom-3 -right-3 left-3 top-3"}`} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
