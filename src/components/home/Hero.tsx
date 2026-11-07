"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Droplets, Layers, Truck } from "lucide-react";
import { SEVEN, todayIndex } from "./data";
import Magnetic from "./Magnetic";
import CelestialArt from "./CelestialArt";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* faint star dust across the whole hero so both halves read as one sky */
const DUST = Array.from({ length: 36 }, (_, i) => ({
  x: (i * 61.8) % 100,
  y: (i * 37.3 + (i % 5) * 11) % 100,
  s: 1 + (i % 3) * 0.6,
  d: (i * 0.73) % 6,
}));

/* flowing silk — each layer morphs between two shapes */
const SILK = [
  {
    a: "M0 210 C 240 150 420 260 720 200 S 1180 120 1440 190",
    b: "M0 190 C 260 240 460 160 740 215 S 1200 170 1440 150",
    fill: "url(#silk-1)",
    dur: 16,
  },
  {
    a: "M0 250 C 300 210 520 300 820 250 S 1250 200 1440 245",
    b: "M0 265 C 280 290 560 220 860 262 S 1260 280 1440 225",
    fill: "url(#silk-2)",
    dur: 12,
  },
  {
    a: "M0 290 C 360 270 640 318 960 288 S 1300 270 1440 292",
    b: "M0 280 C 340 302 700 276 980 298 S 1320 300 1440 278",
    fill: "url(#silk-3)",
    dur: 10,
  },
];
const closed = (d: string) => `${d} L1440 320 L0 320 Z`;
const SPLINE = { calcMode: "spline", keyTimes: "0;0.5;1", keySplines: ".45 0 .55 1;.45 0 .55 1" } as const;

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const silk = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const [today, setToday] = useState(-1);

  useEffect(() => {
    if (reduce) silk.current?.pauseAnimations();
    else silk.current?.unpauseAnimations();
  }, [reduce]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only date
    setToday(todayIndex());
  }, []);

  /* pointer parallax: three depths */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const backX = useTransform(sx, (v) => v * -6);
  const backY = useTransform(sy, (v) => v * -6);
  const midX = useTransform(sx, (v) => v * -14);
  const midY = useTransform(sy, (v) => v * -12);
  const frontX = useTransform(sx, (v) => v * -30);
  const frontY = useTransform(sy, (v) => v * -24);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-title", { type: "lines,words", mask: "lines", linesClass: "pb-[0.06em]" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-eyebrow", { y: 16, autoAlpha: 0, duration: 0.9 })
          .from(split.words, { yPercent: 110, duration: 1.25, stagger: 0.12 }, "-=0.6")
          .from(".hero-copy > *", { y: 22, autoAlpha: 0, duration: 0.9, stagger: 0.09 }, "-=0.9")
          .from(".hero-art", { scale: 0.86, autoAlpha: 0, rotate: -8, duration: 2.2 }, 0.1)
          .from(".hero-silk", { yPercent: 40, autoAlpha: 0, duration: 1.8 }, 0.3)
          .from(".hero-week > *", { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.05 }, 1.1);
        return () => split.revert();
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".hero-copy-wrap", {
          yPercent: -14,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-visual", {
          yPercent: 8,
          rotate: 6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      className={`relative isolate overflow-hidden bg-[#26000D] ${ready ? "hero-ready" : "[&_.hero-anim]:invisible"}`}
    >
      {/* one continuous sky: deep burgundy with light gathering behind the artwork */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(120%_95%_at_72%_42%,#5C0C2C_0%,#390014_42%,#26000D_100%)]" />
      <div aria-hidden className="absolute right-[2%] top-[8%] -z-10 h-[70%] w-[55%] rounded-full bg-[#D6A64F]/[0.07] blur-[110px]" />
      <div aria-hidden className="absolute -left-40 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-[#7A1636]/30 blur-[120px]" />
      <div aria-hidden className="absolute inset-0 -z-10">
        {DUST.map((d, i) => (
          <span
            key={i}
            className="cx-twinkle absolute rounded-full bg-[#F0D69A]"
            style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s` }}
          />
        ))}
      </div>

      {/* flowing silk along the bottom */}
      <svg ref={silk} aria-hidden viewBox="0 0 1440 320" preserveAspectRatio="none" className="hero-silk absolute inset-x-0 bottom-0 -z-10 h-[40%] min-h-[200px] w-full">
        <defs>
          <linearGradient id="silk-1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7A1438" stopOpacity=".9" />
            <stop offset=".5" stopColor="#4A0620" stopOpacity=".9" />
            <stop offset="1" stopColor="#8E2347" stopOpacity=".85" />
          </linearGradient>
          <linearGradient id="silk-2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#56082A" />
            <stop offset=".55" stopColor="#3A0016" />
            <stop offset="1" stopColor="#62102F" />
          </linearGradient>
          <linearGradient id="silk-3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2E000F" />
            <stop offset="1" stopColor="#26000D" />
          </linearGradient>
        </defs>
        {SILK.map((l, i) => (
          <g key={i}>
            <path d={closed(l.a)} fill={l.fill}>
              <animate attributeName="d" dur={`${l.dur}s`} repeatCount="indefinite" values={`${closed(l.a)};${closed(l.b)};${closed(l.a)}`} {...SPLINE} />
            </path>
            <path d={l.a} fill="none" stroke="#F0D69A" strokeOpacity={0.4 - i * 0.1} strokeWidth="1.3" vectorEffect="non-scaling-stroke">
              <animate attributeName="d" dur={`${l.dur}s`} repeatCount="indefinite" values={`${l.a};${l.b};${l.a}`} {...SPLINE} />
            </path>
          </g>
        ))}
      </svg>

      <div className="mx-auto grid min-h-[calc(100svh-78px-104px)] max-w-[1440px] items-center gap-4 px-6 pb-10 pt-14 md:px-12 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:px-16 lg:pb-6 lg:pt-8">
        {/* COPY */}
        <div className="hero-copy-wrap hero-anim relative z-10">
          <p className="hero-eyebrow flex items-center gap-3 text-[10px] tracking-[0.32em] text-[#D6A64F]">
            <span className="h-px w-8 bg-[#D6A64F]" /> ALCOHOL-FREE FRAGRANCE BLENDS
          </p>
          <h1 className="hero-title mt-7 font-display text-[clamp(3.8rem,9.2vw,9rem)] font-medium leading-[0.9] tracking-[-0.015em] text-[#F6E6C4]">
            Cleanse.
            <br />
            Elevate.
            <br />
            <span className="italic text-[#E2B45E]">Radiate.</span>
          </h1>
          <div className="hero-copy">
            <p className="mt-8 max-w-[500px] text-[15px] leading-8 text-[#E8D3C3]/85 md:text-base">
              SEVOURA is a collection of seven alcohol-free fragrance blends — one for every day of the week — thoughtfully composed to bring a moment of intention into modern routines.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/shop"
                  className="sev-shine group inline-flex items-center gap-5 rounded-full bg-[#D6A64F] px-9 py-[18px] text-[11px] font-semibold tracking-[0.18em] text-[#26000D] shadow-[0_18px_44px_rgba(214,166,79,.28)] transition-colors duration-500 hover:bg-[#F0D69A]"
                >
                  SHOP THE COLLECTION
                  <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Link
                href="/the-seven"
                className="group inline-flex items-center gap-3 rounded-full border border-[#D6A64F]/45 px-7 py-[17px] text-[11px] font-medium tracking-[0.18em] text-[#F0D69A] transition-colors duration-500 hover:border-[#F0D69A] hover:bg-[#F0D69A]/10"
              >
                EXPLORE THE BLENDS
                <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </div>
            <ul className="mt-11 grid max-w-[520px] grid-cols-3 gap-3 border-t border-[#D6A64F]/25 pt-6">
              {[
                { icon: Layers, k: "7", v: "Distinct compositions" },
                { icon: Droplets, k: "0%", v: "Alcohol in every blend" },
                { icon: Truck, k: "Free", v: "Shipping across India" },
              ].map((f) => (
                <li key={f.v} className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-display text-3xl leading-none text-[#F6E6C4]">
                    <f.icon size={15} strokeWidth={1.5} className="text-[#D6A64F]" /> {f.k}
                  </span>
                  <span className="text-[11px] leading-4 text-[#CDB3A6]">{f.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* VISUAL — the celestial artwork */}
        <div className="hero-visual hero-anim pointer-events-none absolute right-[-46%] top-8 -z-[1] w-[125vw] max-w-[760px] opacity-[0.42] sm:right-[-30%] sm:w-[95vw] md:opacity-50 lg:pointer-events-auto lg:relative lg:right-auto lg:top-auto lg:z-auto lg:mx-auto lg:-mr-10 lg:w-full lg:max-w-[min(52vw,760px)] lg:opacity-100">
          <div className="hero-art aspect-square w-full">
            <CelestialArt back={{ x: backX, y: backY }} mid={{ x: midX, y: midY }} front={{ x: frontX, y: frontY }} />
          </div>
        </div>
      </div>

      {/* The seven-day ritual — quick navigation */}
      <div className="hero-anim relative border-t border-[#D6A64F]/20 bg-[#26000D]/55 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-stretch gap-0 overflow-x-auto px-6 [scrollbar-width:none] md:px-12 lg:px-16 [&::-webkit-scrollbar]:hidden">
          <p className="hidden shrink-0 items-center pr-8 text-[9px] leading-4 tracking-[0.3em] text-[#D6A64F] lg:flex">
            THE SEVEN-DAY
            <br />
            RITUAL
          </p>
          <div className="hero-week grid min-w-[760px] flex-1 grid-cols-7">
            {SEVEN.map((s, i) => (
              <Link
                key={s.day}
                href="/the-seven"
                className={`group relative flex flex-col gap-1 border-l border-[#D6A64F]/15 px-4 py-5 transition-colors duration-300 hover:bg-[#F0D69A]/[0.06] ${
                  i === today ? "bg-[#D6A64F]/15 hover:bg-[#D6A64F]/20" : ""
                }`}
              >
                <span className={`text-[9px] tracking-[0.24em] ${i === today ? "text-[#F0D69A]" : "text-[#C9A15C]"}`}>
                  {s.day.slice(0, 3).toUpperCase()}
                  {i === today && " · TODAY"}
                </span>
                <span className="font-display text-xl leading-tight text-[#F6E6C4]">{s.fragrance}</span>
                <span className="truncate text-[10px] text-[#BFA295]">{s.notes}</span>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#D6A64F] transition-all duration-500 group-hover:w-full ${i === today ? "w-full" : "w-0"}`} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
