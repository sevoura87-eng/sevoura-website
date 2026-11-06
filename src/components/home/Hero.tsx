"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Droplets, Layers, Truck } from "lucide-react";
import { SEVEN, todayIndex } from "./data";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* Deterministic particle field (no Math.random → no hydration mismatch) */
const PARTICLES = Array.from({ length: 26 }, (_, i) => {
  const angle = (i * 137.508) % 360; // golden-angle spread
  return { angle, delay: (i * 0.53) % 7, dur: 6 + ((i * 7) % 5), size: 2 + (i % 3) };
});

/* Hexagon geometry for the vanillin ring */
const HEX = Array.from({ length: 6 }, (_, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x: 200 + 46 * Math.cos(a), y: 200 + 46 * Math.sin(a) };
});
const hexPath = HEX.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") + " Z";
const stub = (i: number, len = 30) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { x1: HEX[i].x, y1: HEX[i].y, x2: HEX[i].x + len * Math.cos(a), y2: HEX[i].y + len * Math.sin(a) };
};

function ScentArchitecture() {
  const rings = [
    { r: 172, label: "TOP NOTES", sub: "Green Tea · Neroli · Saffron", at: -38 },
    { r: 128, label: "HEART NOTES", sub: "Jasmine · Rose · Clove", at: 22 },
    { r: 88, label: "BASE NOTES", sub: "Sandalwood · Vetiver · Musk", at: 148 },
  ];
  return (
    <svg viewBox="-95 8 590 384" className="h-full w-full overflow-visible" role="img" aria-label="Fragrance structure: top, heart and base notes around a vanillin molecule">
      <defs>
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F3D9B8" stopOpacity=".95" />
          <stop offset=".55" stopColor="#EED2C8" stopOpacity=".45" />
          <stop offset="1" stopColor="#F8F1E7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#aura)" className="hero-aura" />

      {rings.map((ring, i) => {
        const a = (ring.at * Math.PI) / 180;
        const px = 200 + ring.r * Math.cos(a);
        const py = 200 + ring.r * Math.sin(a);
        const right = Math.cos(a) >= 0;
        const lx = px + (right ? 34 : -34);
        return (
          <g key={ring.label} className="hero-ring" style={{ transitionDelay: `${0.35 + i * 0.15}s` }}>
            <circle cx="200" cy="200" r={ring.r} fill="none" stroke="#B28B4E" strokeOpacity={0.55 - i * 0.08} strokeWidth=".8" strokeDasharray={i === 0 ? "2 5" : undefined} />
            <circle cx={px} cy={py} r="3.6" fill="#792D49" />
            <circle cx={px} cy={py} r="8" fill="none" stroke="#792D49" strokeOpacity=".35" className="hero-ping" />
            <line className="hero-note-label" x1={px} y1={py} x2={lx} y2={py} stroke="#792D49" strokeOpacity=".5" strokeWidth=".8" />
            <text className="hero-note-label" x={lx + (right ? 5 : -5)} y={py - 3} textAnchor={right ? "start" : "end"} fontSize="9.5" letterSpacing="2" fill="#792D49" fontFamily="var(--font-geist-sans)">
              {ring.label}
            </text>
            <text className="hero-note-label" x={lx + (right ? 5 : -5)} y={py + 9} textAnchor={right ? "start" : "end"} fontSize="10" fill="#806D60" fontFamily="var(--font-geist-sans)">
              {ring.sub}
            </text>
          </g>
        );
      })}

      {/* Vanillin: 4-hydroxy-3-methoxybenzaldehyde */}
      <g className="hero-molecule" stroke="#46182D" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d={hexPath} className="hero-draw" pathLength={1} />
        <circle cx="200" cy="200" r="27" className="hero-draw" pathLength={1} strokeOpacity=".6" />
        {[0, 2, 3].map((i) => {
          const s = stub(i);
          return <line key={i} {...s} className="hero-draw" pathLength={1} />;
        })}
      </g>
      <g fontFamily="var(--font-geist-sans)" fontSize="10.5" fill="#46182D" className="hero-labels">
        <text x={stub(0).x2} y={stub(0).y2 - 7} textAnchor="middle">CHO</text>
        <text x={stub(2).x2 + 6} y={stub(2).y2 + 6}>OCH₃</text>
        <text x={stub(3).x2} y={stub(3).y2 + 15} textAnchor="middle">OH</text>
      </g>
      <text className="hero-note-label" x="200" y="388" textAnchor="middle" fontSize="8.5" letterSpacing="2.4" fill="#A77B4D" fontFamily="var(--font-geist-sans)">
        VANILLIN · C₈H₈O₃ — A MOLECULE OF SCENT
      </text>
    </svg>
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
  const visualX = useTransform(sx, (v) => v * -18);
  const visualY = useTransform(sy, (v) => v * -14);

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
          .from(".hero-aura", { scale: 0.6, autoAlpha: 0, transformOrigin: "50% 50%", duration: 1.8 }, 0.1)
          .fromTo(".hero-draw", { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: "power2.inOut" }, 0.6)
          .from(".hero-labels", { autoAlpha: 0, duration: 0.8 }, 1.6)
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
          yPercent: 10,
          rotate: 12,
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
      {/* fine lab-paper grid, faded towards the edges */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_70%_45%,black_20%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(178,139,78,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(178,139,78,.16) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div aria-hidden className="absolute -left-48 bottom-0 -z-10 h-[460px] w-[460px] rounded-full bg-[#792D49]/[0.05] blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100svh-78px-104px)] max-w-[1440px] items-center gap-6 px-6 pb-6 pt-14 md:px-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-10 lg:px-16 lg:pt-8">
        {/* COPY */}
        <div className="hero-copy-wrap hero-anim relative z-10">
          <p className="hero-eyebrow flex items-center gap-3 text-[10px] tracking-[0.32em] text-[#A77B4D]">
            <span className="h-px w-8 bg-[#C49A59]" /> ALCOHOL-FREE FRAGRANCE BLENDS
          </p>
          <h1 className="hero-title mt-7 font-display text-[clamp(3.6rem,8.8vw,8.4rem)] font-medium leading-[0.92] tracking-[-0.015em] text-[#2F1420]">
            Cleanse.
            <br />
            Elevate.
            <br />
            <span className="italic text-[#792D49]">Radiate.</span>
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

        {/* VISUAL — the architecture of scent */}
        <motion.div style={{ x: visualX, y: visualY }} className="hero-visual hero-anim relative mx-auto aspect-[590/384] w-full max-w-[min(720px,96vw)] lg:-mr-6">
          <div aria-hidden className="absolute inset-0">
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                className="sev-particle absolute left-1/2 top-1/2 rounded-full bg-[#B28B4E]"
                style={
                  {
                    width: p.size,
                    height: p.size,
                    "--a": `${p.angle}deg`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.dur}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <ScentArchitecture />
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
