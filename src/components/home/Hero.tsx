"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Droplets, Layers, Truck } from "lucide-react";
import { SEVEN, todayIndex } from "./data";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* Product showcase: the real bottles, one per day, in an arched frame.
   (thursday.jpg currently shows the Sunday bottle, so Thursday is left out until a correct photo exists.) */
const SHOWCASE = SEVEN.map((s, i) => ({ ...s, i })).filter((s) => s.day !== "Thursday");
const SEAL_TEXT = "ALCOHOL-FREE · SEVEN BLENDS · ONE RITUAL · ";

function RitualShowcase({ today, ready }: { today: number; ready: boolean }) {
  const reduce = useReducedMotion();
  const startAt = Math.max(0, SHOWCASE.findIndex((s) => s.i === today));
  const [idx, setIdx] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start on today's blend once the client date is known
    if (!touched) setIdx(startAt);
  }, [startAt, touched]);

  useEffect(() => {
    if (!ready || reduce) return;
    const t = setInterval(() => setIdx((v) => (v + 1) % SHOWCASE.length), 4200);
    return () => clearInterval(t);
  }, [ready, reduce, idx]);

  const cur = SHOWCASE[idx];
  const isToday = cur.i === today;

  return (
    <div className="relative mx-auto w-[min(78vw,360px)] lg:w-[min(32vw,420px)]">
      {/* glow */}
      <div aria-hidden className="absolute -inset-[18%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(229,196,139,.45),rgba(121,45,73,.10)_45%,transparent_70%)] blur-2xl" />
      {/* offset gold arch */}
      <div aria-hidden className="hero-frame-line absolute inset-0 translate-x-4 translate-y-4 rounded-t-full border border-[#C49A59]/70 md:translate-x-6 md:translate-y-6" />

      {/* the photograph */}
      <div className="hero-frame relative aspect-[3/4] overflow-hidden rounded-t-full bg-[#EADCC8] shadow-[0_40px_80px_-30px_rgba(70,24,45,.45)]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={cur.image}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1, ease: "easeInOut" }, scale: { duration: 5.5, ease: "easeOut" } }}
          >
            <Image
              src={cur.image}
              alt={`SEVOURA ${cur.day} blend — ${cur.fragrance}`}
              fill
              priority={cur.i === SHOWCASE[startAt].i}
              sizes="(max-width:1024px) 78vw, 420px"
              className="object-cover object-[50%_42%]"
            />
          </motion.div>
        </AnimatePresence>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#2E0F1D]/35 via-transparent to-transparent" />
      </div>

      {/* rotating seal */}
      <div aria-hidden className="absolute -right-6 -top-4 h-24 w-24 md:-right-10 md:h-28 md:w-28">
        <svg viewBox="0 0 100 100" className="hero-seal h-full w-full">
          <defs>
            <path id="seal-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
          </defs>
          <circle cx="50" cy="50" r="49" fill="#FBF6EE" stroke="#C49A59" strokeWidth=".6" />
          <text fontSize="7.4" fill="#792D49" fontFamily="var(--font-geist-sans)">
            <textPath href="#seal-circle" textLength="236" lengthAdjust="spacing">{SEAL_TEXT}</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[#B28B4E]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c.6 5.6 3.4 9.4 12 12-8.6 2.6-11.4 6.4-12 12-.6-5.6-3.4-9.4-12-12C8.6 9.4 11.4 5.6 12 0Z" /></svg>
        </span>
      </div>

      {/* floating blend card */}
      <div className="absolute -bottom-10 -left-4 w-[200px] border border-[#E3D3BE] bg-[#FBF6EE]/90 p-4 shadow-[0_20px_45px_-20px_rgba(70,24,45,.35)] backdrop-blur md:-left-14 md:w-[230px] md:p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={cur.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="text-[9px] tracking-[0.28em] text-[#A77B4D]">
              {cur.day.toUpperCase()}
              {isToday && <span className="text-[#792D49]"> · TODAY</span>}
            </p>
            <p className="mt-1.5 font-display text-[26px] leading-none text-[#792D49]">{cur.fragrance}</p>
            <p className="mt-2 truncate text-[11px] text-[#806D60]">{cur.notes}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 flex gap-1.5" role="tablist" aria-label="Choose a blend">
          {SHOWCASE.map((s, k) => (
            <button
              key={s.day}
              type="button"
              role="tab"
              aria-selected={k === idx}
              aria-label={`${s.day}: ${s.fragrance}`}
              onClick={() => {
                setTouched(true);
                setIdx(k);
              }}
              className="group flex h-4 flex-1 items-center"
            >
              <span className={`h-[2px] w-full transition-colors duration-500 ${k === idx ? "bg-[#792D49]" : "bg-[#DCCAB5] group-hover:bg-[#C49A59]"}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [today, setToday] = useState(-1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only date
    setToday(todayIndex());
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const visualX = useTransform(sx, (v) => v * -12);
  const visualY = useTransform(sy, (v) => v * -10);

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
          .fromTo(".hero-frame", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 0.15)
          .from(".hero-frame-line", { autoAlpha: 0, x: -10, y: -10, duration: 1.2 }, 0.9)
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
      className={`relative isolate overflow-hidden bg-[#F8F1E7] ${ready ? "hero-ready" : "[&_.hero-anim]:invisible"}`}
    >
      {/* soft light, no grid */}
      <div aria-hidden className="absolute right-[-10%] top-[-10%] -z-10 h-[620px] w-[620px] rounded-full bg-[#E9D3B8]/50 blur-3xl" />
      <div aria-hidden className="absolute -left-48 bottom-0 -z-10 h-[460px] w-[460px] rounded-full bg-[#792D49]/[0.05] blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100svh-78px-104px)] max-w-[1440px] items-center gap-6 px-6 pb-6 pt-14 md:px-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-10 lg:px-16 lg:pt-8">
        {/* COPY */}
        <div className="hero-copy-wrap hero-anim relative z-10">
          <p className="hero-eyebrow flex items-center gap-3 text-[10px] tracking-[0.32em] text-[#A77B4D]">
            <span className="h-px w-8 bg-[#C49A59]" /> ALCOHOL-FREE FRAGRANCE BLENDS
          </p>
          <h1 className="hero-title mt-7 font-display text-[clamp(3.6rem,8.8vw,8.4rem)] font-medium leading-[0.92] tracking-[-0.015em] text-[#792D49]">
            Cleanse.
            <br />
            Elevate.
            <br />
            <span className="italic text-[#5C1F38]">Radiate.</span>
          </h1>
          <div className="hero-copy">
            <p className="mt-8 max-w-[500px] text-[15px] leading-8 text-[#6B5650] md:text-base">
              SEVOURA is a collection of seven alcohol-free fragrance blends — one for every day of the week — thoughtfully composed to bring a moment of intention into modern routines.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/shop"
                  className="sev-shine group inline-flex items-center gap-5 rounded-full bg-[#792D49] px-9 py-[18px] text-[11px] font-medium tracking-[0.18em] text-[#FFF6E9] shadow-[0_18px_40px_rgba(83,29,51,.22)] transition-colors duration-500 hover:bg-[#501D32]"
                >
                  SHOP THE COLLECTION
                  <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Link
                href="/the-seven"
                className="group inline-flex items-center gap-3 rounded-full border border-[#792D49]/30 px-7 py-[17px] text-[11px] font-medium tracking-[0.18em] text-[#792D49] transition-colors duration-500 hover:border-[#792D49] hover:bg-white/60"
              >
                EXPLORE THE BLENDS
                <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </div>
            <ul className="mt-11 grid max-w-[520px] grid-cols-3 gap-3 border-t border-[#DCCAB5] pt-6">
              {[
                { icon: Layers, k: "7", v: "Distinct compositions" },
                { icon: Droplets, k: "0%", v: "Alcohol in every blend" },
                { icon: Truck, k: "Free", v: "Shipping across India" },
              ].map((f) => (
                <li key={f.v} className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 font-display text-3xl leading-none text-[#46182D]">
                    <f.icon size={15} strokeWidth={1.5} className="text-[#B28B4E]" /> {f.k}
                  </span>
                  <span className="text-[11px] leading-4 text-[#806D60]">{f.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* VISUAL — the seven blends, photographed */}
        <motion.div style={{ x: visualX, y: visualY }} className="hero-visual hero-anim relative flex justify-center pb-16 pt-6 lg:py-0">
          <RitualShowcase today={today} ready={ready} />
        </motion.div>
      </div>

      {/* The seven-day ritual — quick navigation */}
      <div className="hero-anim border-t border-[#E3D3BE] bg-[#FBF6EE]/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-stretch gap-0 overflow-x-auto px-6 [scrollbar-width:none] md:px-12 lg:px-16 [&::-webkit-scrollbar]:hidden">
          <p className="hidden shrink-0 items-center pr-8 text-[9px] leading-4 tracking-[0.3em] text-[#A77B4D] lg:flex">
            THE SEVEN-DAY
            <br />
            RITUAL
          </p>
          <div className="hero-week grid min-w-[760px] flex-1 grid-cols-7">
            {SEVEN.map((s, i) => (
              <Link
                key={s.day}
                href="/the-seven"
                className={`group relative flex flex-col gap-1 border-l border-[#E3D3BE] px-4 py-5 transition-colors duration-300 hover:bg-[#F3E6D6] ${
                  i === today ? "bg-[#792D49] text-white hover:bg-[#6A2640]" : ""
                }`}
              >
                <span className={`text-[9px] tracking-[0.24em] ${i === today ? "text-[#F4D79C]" : "text-[#A77B4D]"}`}>
                  {s.day.slice(0, 3).toUpperCase()}
                  {i === today && " · TODAY"}
                </span>
                <span className={`font-display text-xl leading-tight ${i === today ? "text-white" : "text-[#46182D]"}`}>{s.fragrance}</span>
                <span className={`truncate text-[10px] ${i === today ? "text-[#F0DCD4]" : "text-[#9A8777]"}`}>{s.notes}</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#B28B4E] transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
