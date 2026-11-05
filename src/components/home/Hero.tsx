"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { SEVEN, todayIndex } from "./data";
import Magnetic from "./Magnetic";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { LivePrice } from "@/components/shop/ProductPrice";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

function OrbitRing({ active }: { active: number }) {
  const R = 47;
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id="orbitGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#E5C48B" stopOpacity=".9" />
          <stop offset=".5" stopColor="#B28B4E" stopOpacity=".35" />
          <stop offset="1" stopColor="#E5C48B" stopOpacity=".9" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r={R} fill="none" stroke="url(#orbitGold)" strokeWidth=".18" />
      <circle cx="50" cy="50" r={R - 3.2} fill="none" stroke="#C49A59" strokeOpacity=".3" strokeWidth=".12" strokeDasharray=".6 1.4" />
      {SEVEN.map((s, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + R * Math.cos(a);
        const y = 50 + R * Math.sin(a);
        const on = i === active;
        return (
          <g key={s.day} className="sev-counter-rotate" style={{ transformOrigin: `${x}px ${y}px` }}>
            <circle cx={x} cy={y} r={on ? 4.2 : 3.2} fill={on ? "#792D49" : "#F8F1E7"} stroke="#C49A59" strokeWidth=".2" style={{ transition: "all .6s" }} />
            <text x={x} y={y + 1.35} textAnchor="middle" fontSize={on ? 4 : 3.2} fill={on ? "#F4D79C" : "#A77B4D"} style={{ transition: "all .6s" }}>
              {s.symbol}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [todayIdx, setTodayIdx] = useState(0);
  const [active, setActive] = useState(0);

  // Start the arch on today's ritual, then cycle through the week
  useEffect(() => {
    const t = todayIndex();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only date
    setTodayIdx(t);
    setActive(t);
    const id = window.setInterval(() => setActive((a) => (a + 1) % 7), 3800);
    return () => window.clearInterval(id);
  }, []);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const archX = useTransform(sx, (v) => v * 18);
  const archY = useTransform(sy, (v) => v * 14);
  const ringX = useTransform(sx, (v) => v * -26);
  const ringY = useTransform(sy, (v) => v * -20);
  const orbX = useTransform(sx, (v) => v * 46);
  const orbY = useTransform(sy, (v) => v * 36);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-title", { type: "lines,chars", mask: "lines", linesClass: "pb-[0.08em]" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-eyebrow", { y: 20, autoAlpha: 0, duration: 1 })
          .from(split.chars, { yPercent: 115, rotate: 6, duration: 1.3, stagger: 0.022 }, "-=0.7")
          .from(".hero-rule", { scaleX: 0, transformOrigin: "left", duration: 1.2 }, "-=0.9")
          .from(".hero-copy > *", { y: 26, autoAlpha: 0, duration: 1, stagger: 0.1 }, "-=1")
          .from(".hero-arch", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)", duration: 1.6, ease: "expo.inOut" }, 0.1)
          .from(".hero-arch-img", { scale: 1.5, duration: 2.2 }, 0.1)
          .from(".hero-ring", { scale: 0.7, autoAlpha: 0, rotate: -60, duration: 2 }, 0.4)
          .from(".hero-float", { autoAlpha: 0, scale: 0, duration: 1.2, stagger: 0.15, ease: "back.out(2)" }, 1)
          .from(".hero-scroll", { autoAlpha: 0, y: 10, duration: 1 }, 1.4);

        return () => split.revert();
      });
      // Desktop only: on phones the hero is taller than the screen, so keep the CTAs fully visible
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // Scroll: text drifts up and fades, arch deepens
        gsap.to(".hero-copy-wrap", {
          yPercent: -18,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-visual", {
          yPercent: 12,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [ready] }
  );

  const s = SEVEN[active];

  return (
    <section
      ref={root}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      className={`sev-grain relative isolate overflow-hidden bg-[#F8F1E7] ${ready ? "" : "[&_.hero-anim]:invisible"}`}
    >
      {/* atmosphere */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_42%,#F1DCC0_0%,#F8F1E7_52%,#F8F1E7_100%)]" />
      <div className="absolute -left-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-[#792D49]/[0.045] blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100svh-78px)] max-w-[1500px] items-center gap-10 px-6 pb-20 pt-12 md:px-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-6 lg:px-16 lg:pb-14 lg:pt-6">
        {/* COPY */}
        <div className="hero-copy-wrap hero-anim relative z-10 order-2 lg:order-1">
          <p className="hero-eyebrow flex items-center gap-3 text-[10px] tracking-[0.36em] text-[#A77B4D]">
            <span className="h-px w-8 bg-[#C49A59]" /> DISCOVER THE WORLD OF SEVOURA
          </p>
          <h1 className="hero-title mt-7 font-display text-[clamp(3.4rem,8.4vw,8.6rem)] font-medium leading-[0.9] tracking-[-0.02em] text-[#46182D]">
            Seven Rituals.
            <br />
            <span className="italic text-[#792D49]">Infinite</span>
            <br />
            Expressions.
          </h1>
          <div className="hero-rule mt-8 h-[2px] w-20 bg-gradient-to-r from-[#C49A59] to-[#E5C48B]" />
          <div className="hero-copy">
            <p className="mt-7 max-w-[440px] font-display text-[22px] italic leading-snug text-[#6E4A4D] md:text-[26px]">
              A contemporary fragrance journey that blends traditional wisdom with modern living.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="/shop"
                  className="sev-shine group inline-flex items-center gap-6 bg-[#792D49] px-9 py-5 text-[10px] tracking-[0.22em] text-[#FFF6E9] shadow-[0_18px_40px_rgba(83,29,51,.25)] transition-colors duration-500 hover:bg-[#501D32]"
                >
                  EXPLORE THE COLLECTION
                  <ArrowUpRight size={17} className="transition-transform duration-500 group-hover:rotate-45" />
                </Link>
              </Magnetic>
              <AddToCartButton className="group inline-flex items-center gap-3 border border-[#792D49]/40 px-7 py-5 text-[10px] tracking-[0.22em] text-[#792D49] transition-colors duration-500 hover:border-[#792D49] hover:bg-[#792D49]/[0.06]">
                <ShoppingBag size={15} /> ADD TO BAG · <LivePrice fallback="₹1,799" />
              </AddToCartButton>
            </div>
            <Link
              href="/the-seven"
              className="group mt-10 inline-flex items-center gap-4 border-t border-[#DCCAB5] pt-5 text-[11px] text-[#806D60]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B28B4E] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B28B4E]" />
              </span>
              <span>
                Today&apos;s ritual ·{" "}
                <strong className="font-medium text-[#792D49]">
                  {SEVEN[todayIdx].day} — {SEVEN[todayIdx].planet} {SEVEN[todayIdx].symbol} · {SEVEN[todayIdx].fragrance}
                </strong>
              </span>
              <ArrowUpRight size={13} className="text-[#A77B4D] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* VISUAL */}
        <div className="hero-visual hero-anim relative order-1 mx-auto aspect-square w-full max-w-[min(560px,74vw)] lg:order-2">
          <motion.div style={{ x: ringX, y: ringY }} className="hero-ring absolute inset-0">
            <div className="sev-rotate absolute inset-0">
              <OrbitRing active={active} />
            </div>
          </motion.div>

          <motion.div style={{ x: archX, y: archY }} className="absolute inset-[15%]">
            <div className="hero-arch relative h-full w-full overflow-hidden rounded-t-full bg-[#E7D5BD] shadow-[0_40px_90px_rgba(70,24,45,.25)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={s.day}
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="hero-arch-img absolute inset-0"
                >
                  <Image src={s.image} alt={`SEVOURA ${s.day} blend — ${s.fragrance}`} fill priority sizes="(max-width:1024px) 70vw, 400px" className="object-cover object-[50%_35%]" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E0F1D]/90 via-[#2E0F1D]/10 to-transparent" />
              <div className="pointer-events-none absolute inset-2 rounded-t-full border border-[#F4D79C]/40" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-center text-[#FBF0E4]">
                <AnimatePresence mode="wait">
                  <motion.div key={s.day} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.6 }}>
                    <p className="text-[9px] tracking-[0.35em] text-[#F4D79C]">{s.day.toUpperCase()} · {s.planet.toUpperCase()}</p>
                    <p className="mt-1 font-display text-3xl italic">{s.fragrance}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ x: orbX, y: orbY }} className="hero-float absolute right-[6%] top-[14%] h-12 w-12 rounded-full bg-[radial-gradient(circle_at_30%_25%,#FFF4D6,#C79550_60%,#79402F)] shadow-[0_0_40px_rgba(223,183,111,.55)]" />
          <motion.div style={{ x: ringX, y: orbY }} className="hero-float absolute bottom-[10%] left-[4%] h-7 w-7 rounded-full bg-[radial-gradient(circle_at_30%_25%,#FFF1CE,#B98548_65%,#5B2038)] shadow-[0_0_30px_rgba(223,183,111,.45)]" />
          <motion.div style={{ x: orbX, y: archY }} className="hero-float absolute bottom-[4%] right-[10%] flex h-[92px] w-[92px] items-center justify-center rounded-full border border-[#C5A36B]/60 bg-[#FBF5E9]/90 text-center shadow-xl backdrop-blur">
            <span className="text-[8px] leading-4 tracking-[0.2em] text-[#792D49]">
              <span className="block font-display text-2xl tracking-normal">7</span>DAYS
            </span>
          </motion.div>
        </div>
      </div>

      <div className="hero-scroll hero-anim pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[8px] tracking-[0.4em] text-[#A77B4D] md:flex">
        SCROLL
        <span className="relative h-12 w-px overflow-hidden bg-[#DCCAB5]">
          <span className="sev-scrollcue absolute inset-x-0 top-0 h-1/2 bg-[#792D49]" />
        </span>
      </div>
    </section>
  );
}
