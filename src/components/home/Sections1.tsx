"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Layers, Droplets, Infinity as InfinityIcon, Recycle, ArrowUpRight, ArrowRight } from "lucide-react";
import { SEVEN, todayIndex } from "./data";
import ProductPhoto from "@/components/ProductPhoto";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* ───────────── MARQUEE + VALUES ───────────── */
const WORDS = ["Cleanse", "Elevate", "Radiate", "Seven Days", "Seven Blends", "Alcohol-free", "Thoughtfully Composed"];

export function Marquee() {
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const smooth = useSpring(v, { damping: 40, stiffness: 300 });
  const skew = useTransform(smooth, [-2500, 0, 2500], [6, 0, -6], { clamp: true });
  const row = [...WORDS, ...WORDS];
  return (
    <section className="relative overflow-hidden bg-[#792D49] py-7 text-[#F8EDDF] md:py-9">
      <motion.div style={{ skewX: skew }} className="flex w-max" aria-hidden>
        <div className="flex shrink-0 items-center gap-10 pr-10 md:gap-14 md:pr-14" style={{ animation: "sev-marquee 38s linear infinite" }}>
          {[...row, ...row].map((w, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-4xl italic md:gap-14 md:text-6xl">
              {w}
              <span className="text-xl not-italic text-[#E5C48B] md:text-2xl">✦</span>
            </span>
          ))}
        </div>
      </motion.div>
      <p className="sr-only">Cleanse. Elevate. Radiate.</p>
    </section>
  );
}

const VALUES = [
  { title: "Seven", sub: "Distinct Blends", icon: Layers },
  { title: "Clean &", sub: "Conscious", icon: Droplets },
  { title: "Everyday", sub: "Rituals", icon: InfinityIcon },
  { title: "Thoughtful", sub: "Choices", icon: Recycle },
];

export function Values() {
  return (
    <section className="border-b border-[#DDCBB5] bg-[#FBF6EE] px-6 py-10 md:py-12">
      <div className="mx-auto grid max-w-[1350px] grid-cols-2 gap-y-9 md:grid-cols-4">
        {VALUES.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`group flex items-center justify-center gap-4 px-3 ${i % 2 === 0 ? "border-r border-[#D4B88F]" : ""} ${i < 3 ? "md:border-r md:border-[#D4B88F]" : ""}`}
          >
            <v.icon className="text-[#BD8D42] transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110" size={34} strokeWidth={1.1} />
            <p className="font-display text-lg leading-5 text-[#501D32] md:text-xl">{v.title}<br />{v.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── MANIFESTO — words light up as you scroll ───────────── */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".manifesto-text", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ".manifesto-text", start: "top 80%", end: "bottom 45%", scrub: true } }
        );
        gsap.from(".manifesto-orb", { scale: 0.4, rotate: -90, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        return () => split.revert();
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="relative overflow-hidden bg-[#F8F1E7] px-6 py-28 md:py-44">
      <div className="manifesto-orb pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full border border-[#C49A59]/30">
        <div className="absolute inset-12 rounded-full border border-dashed border-[#C49A59]/30" />
      </div>
      <div className="relative mx-auto max-w-[1150px]">
        <p className="text-[12px] tracking-[0.36em] text-[#A77B4D]">THE ART OF FRAGRANCE</p>
        <p className="manifesto-text mt-8 font-display text-[clamp(2.1rem,5vw,4.6rem)] font-medium leading-[1.08] text-[#46182D]">
          More than a fragrance — <em className="text-[#9C6D55]">a feeling.</em> Fragrance has the power to make ordinary moments feel personal. It can become a memory, a signature and a small expression of individuality.
        </p>
        <div className="mt-12 flex flex-col gap-8 border-t border-[#DCCAB5] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-md text-[15px] leading-8 text-[#806D60]">SEVOURA brings this idea into a seven-day ritual inspired by traditional planetary symbolism.</p>
          <Link href="/our-story/astrology-behind-rituals" className="group inline-flex items-center gap-4 text-[12px] tracking-[0.22em] text-[#792D49]">
            THE ASTROLOGY BEHIND THE RITUALS
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#792D49]/40 transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#792D49] group-hover:text-white">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────── THE SEVEN — pinned horizontal journey ───────────── */
function SevenCard({ s, i, today }: { s: (typeof SEVEN)[number]; i: number; today: boolean }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const glareX = useTransform(sry, [-10, 10], ["20%", "80%"]);
  return (
    <motion.article
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className="seven-card group relative flex w-[78vw] shrink-0 snap-center flex-col overflow-hidden border border-[#D8C5A7] bg-[#FCF7EE] shadow-[0_20px_50px_rgba(71,35,39,.08)] sm:w-[340px] lg:w-[360px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-[#E9DFD1] m-3 mb-0">
        <ProductPhoto day={s.day} fragrance={s.fragrance} notes={s.notes} sizes="(max-width:640px) 78vw, 360px" className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
        <motion.div style={{ left: glareX }} className="pointer-events-none absolute -top-1/4 h-[150%] w-24 -translate-x-1/2 rotate-12 bg-white/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-1/2 top-5 -translate-x-1/2 bg-[#702943] px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-white">{s.day.toUpperCase()}</span>
        {today && <span className="absolute right-5 top-[22%] bg-[#E5C48B] px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-[#46182D]">TODAY</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <p className="text-[11px] font-bold tracking-[0.24em] text-[#A57C43]">{s.day.toUpperCase()} BLEND</p>
          <span className="h-px flex-1 bg-[#D8C5A7]" />
          <span className="text-[12px] text-[#9A8777]">{s.quality}</span>
        </div>
        <h3 className="mt-3 font-display text-4xl font-medium text-[#481D30]">{s.fragrance}</h3>
        <p className="mt-1 text-[13px] text-[#806D60]">{s.notes}</p>
        <p className="mt-4 border-t border-[#E2D4C1] pt-4 text-[15px] font-medium text-[#642B40]">{s.intention}</p>
      </div>
    </motion.article>
  );
}

export function SevenJourney() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState(-1);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only date
  useEffect(() => setToday(todayIndex()), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to(".seven-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        gsap.utils.toArray<HTMLElement>(".seven-card").forEach((card) => {
          gsap.from(card, {
            y: 60,
            rotate: 2,
            opacity: 0.3,
            ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 60%", scrub: true },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#F2E6D6] lg:h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,#F8EEDF,transparent_60%)]" />
      <div className="relative flex h-full flex-col justify-center py-20 lg:py-0">
          <div className="mb-10 px-6 md:px-12 lg:hidden">
            <p className="text-[12px] tracking-[0.36em] text-[#A77B4D]">THE IDEA BEHIND THE COLLECTION</p>
            <h2 className="mt-6 font-display text-[clamp(3rem,6vw,5.6rem)] font-medium leading-[0.95] text-[#46182D]">
              Seven Days.
              <br />
              <span className="italic text-[#792D49]">Seven Inspirations.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-8 text-[#806D60]">
              An ancient planetary cycle, reimagined as a contemporary fragrance story. Every day brings a different symbolic identity and a new opportunity for personal expression.
            </p>
            <p className="mt-6 text-[12px] tracking-[0.3em] text-[#A77B4D]">SWIPE TO EXPLORE →</p>
          </div>
        <div
          ref={track}
          className="flex snap-x snap-mandatory scroll-px-6 items-center gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] md:scroll-px-12 md:px-12 lg:snap-none lg:gap-6 lg:overflow-visible lg:px-16 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="hidden shrink-0 pr-4 lg:block lg:w-[460px]">
            <p className="text-[12px] tracking-[0.36em] text-[#A77B4D]">THE IDEA BEHIND THE COLLECTION</p>
            <h2 className="mt-6 font-display text-[clamp(3rem,6vw,5.6rem)] font-medium leading-[0.95] text-[#46182D]">
              Seven Days.
              <br />
              <span className="italic text-[#792D49]">Seven Inspirations.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-8 text-[#806D60]">
              An ancient planetary cycle, reimagined as a contemporary fragrance story. Every day brings a different symbolic identity and a new opportunity for personal expression.
            </p>
            <p className="mt-8 hidden items-center gap-3 text-[12px] tracking-[0.3em] text-[#A77B4D] lg:flex">
              SCROLL TO JOURNEY <ArrowRight size={14} />
            </p>
          </div>
          {SEVEN.map((s, i) => (
            <SevenCard key={s.day} s={s} i={i} today={i === today} />
          ))}
          <div className="hidden w-[340px] shrink-0 flex-col items-start justify-center gap-6 lg:flex">
            <p className="font-display text-4xl italic leading-tight text-[#46182D]">The stars inspire.<br />Your intention defines.</p>
            <Link href="/the-seven" className="sev-shine inline-flex items-center gap-4 bg-[#792D49] px-8 py-4 text-[12px] tracking-[0.2em] text-white transition hover:bg-[#501D32]">
              EXPLORE THE SEVEN <ArrowUpRight size={15} />
            </Link>
            <Link href="/ritual-finder" className="text-[12px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">FIND YOUR RITUAL</Link>
          </div>
        </div>
          <div className="mt-10 flex flex-col items-start gap-6 px-6 md:px-12 lg:hidden">
            <p className="font-display text-4xl italic leading-tight text-[#46182D]">The stars inspire.<br />Your intention defines.</p>
            <Link href="/the-seven" className="sev-shine inline-flex items-center gap-4 bg-[#792D49] px-8 py-4 text-[12px] tracking-[0.2em] text-white transition hover:bg-[#501D32]">
              EXPLORE THE SEVEN <ArrowUpRight size={15} />
            </Link>
            <Link href="/ritual-finder" className="text-[12px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">FIND YOUR RITUAL</Link>
          </div>
        <div className="mx-auto mt-6 hidden h-px w-[min(600px,60vw)] bg-[#DCCAB5] lg:block">
          <div className="seven-progress h-full origin-left scale-x-0 bg-[#792D49]" />
        </div>
      </div>
    </section>
  );
}
