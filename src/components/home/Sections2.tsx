"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ArrowRight, Sparkles, Droplets, ShieldCheck, Infinity as InfinityIcon, Check, ShoppingBag } from "lucide-react";
import { DESTINATIONS } from "./data";
import Magnetic from "./Magnetic";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { LivePrice } from "@/components/shop/ProductPrice";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const ease = [0.22, 1, 0.36, 1] as const;

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`text-[10px] tracking-[0.36em] ${light ? "text-[#E5C48B]" : "text-[#A77B4D]"}`}>{children}</p>
);

/* ───────────── PRODUCT SHOWCASE / OFFER ───────────── */
export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [-40, 60]);
  const features = ["7 × 4 ml alcohol-free fragrance blends", "Seven distinctive signature compositions", "Inspired by traditional planetary associations", "Presented together as one complete collection"];

  return (
    <section ref={ref} className="sev-grain relative overflow-hidden bg-[#46182D] px-6 py-24 text-[#FBF0E4] md:px-12 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,#792D49_0%,#46182D_60%,#2E0F1D_100%)]" />
      <motion.div style={{ rotate: ringRotate }} className="absolute -left-48 top-1/2 h-[760px] w-[760px] -translate-y-1/2 rounded-full border border-[#E5C48B]/15">
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5C48B] shadow-[0_0_20px_#E5C48B]" />
      </motion.div>

      <div className="relative mx-auto grid max-w-[1300px] items-center gap-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <motion.div style={{ y: imgY }} className="relative">
          <motion.div
            initial={{ clipPath: "inset(12% 12% 12% 12%)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease }}
            className="group relative bg-[#EAD9C1] p-3 shadow-[0_50px_120px_rgba(0,0,0,.45)]"
          >
            <div className="relative aspect-[544/404] overflow-hidden">
              <Image src="/sevoura-bottle.jpeg" alt="SEVOURA 7-Day Planetary Blend Collection gift box" fill sizes="(max-width:1024px) 90vw, 620px" className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
            </div>
            <div className="pointer-events-none absolute -inset-4 border border-[#E3C58C]/40" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-3 flex h-28 w-28 items-center justify-center rounded-full border border-[#E5C48B]/60 bg-[#F8F1E7] text-center text-[#792D49] shadow-2xl sm:-right-8"
          >
            <span className="text-[8px] tracking-[0.2em]">SAVE<span className="block font-display text-3xl tracking-normal"><LivePrice fallback="₹700" kind="saving" /></span></span>
          </motion.div>
        </motion.div>

        <motion.div initial="h" whileInView="s" viewport={{ once: true, amount: 0.3 }} variants={{ h: {}, s: { transition: { staggerChildren: 0.09 } } }}>
          <motion.div variants={up}><Eyebrow light>A SPECIAL INVITATION FROM SEVOURA</Eyebrow></motion.div>
          <motion.h2 variants={up} className="mt-6 font-display text-[clamp(2.8rem,5.4vw,5rem)] font-medium leading-[0.98]">
            Your Seven-Day
            <br />
            <span className="italic text-[#E5C48B]">Fragrance Ritual.</span>
          </motion.h2>
          <motion.p variants={up} className="mt-6 max-w-lg text-sm leading-8 text-[#EAD8CF]">
            Discover seven distinct fragrance inspirations in one thoughtfully curated collection. Seven individual identities come together through one connected idea: the relationship between time, intention and personal expression.
          </motion.p>
          <motion.ul variants={up} className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex gap-3 text-[13px] leading-6 text-[#F0DCD4]">
                <Check size={15} className="mt-1 shrink-0 text-[#E5C48B]" /> {f}
              </li>
            ))}
          </motion.ul>
          <motion.div variants={up} className="mt-10 flex flex-wrap items-end gap-x-6 gap-y-2 border-y border-[#D9B77D]/30 py-6">
            <span className="font-display text-7xl leading-none text-[#F4D79C]"><LivePrice fallback="₹1,799" /></span>
            <span className="pb-2 font-display text-2xl text-[#E9D8CE] line-through decoration-[#D8B77C]"><LivePrice fallback="₹2,499" kind="mrp" /></span>
            <span className="w-full text-[10px] tracking-[0.22em] text-[#EAD9CD]">INTRODUCTORY COLLECTION OFFER · PREPAID · FREE SHIPPING</span>
          </motion.div>
          <motion.div variants={up} className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <AddToCartButton className="group inline-flex items-center gap-4 bg-[#F3E5D2] px-9 py-5 text-[10px] font-semibold tracking-[0.22em] text-[#792D49] transition-colors duration-500 hover:bg-[#E5C48B]">
                <ShoppingBag size={16} /> ADD TO BAG
              </AddToCartButton>
            </Magnetic>
            <Link href="/shop" className="group inline-flex items-center gap-4 border border-[#D9B77D]/70 px-8 py-5 text-[10px] tracking-[0.22em] transition-colors duration-500 hover:bg-[#D9B77D] hover:text-[#46182D]">
              VIEW DETAILS <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
            </Link>
          </motion.div>
          <motion.p variants={up} className="mt-7 font-display text-xl italic text-[#E5C48B]">Seven fragrances. One connected story.</motion.p>
        </motion.div>
      </div>
    </section>
  );
}

const up = { h: { opacity: 0, y: 30 }, s: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } };

/* ───────────── FOUNDER ───────────── */
export function Founder() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <section ref={ref} className="bg-[#F0E4D5] px-6 py-24 md:px-12 md:py-36">
      <div className="mx-auto grid max-w-[1250px] items-stretch gap-8 md:grid-cols-[.85fr_1.4fr]">
        <motion.div
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease }}
          className="relative min-h-[460px] overflow-hidden border border-[#C5A16A]"
        >
          <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
            <Image src="/images/founder-jasleen.jpg" alt="Dr. Jasleen Bhatti, Founder of SEVOURA" fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover object-center" />
          </motion.div>
          <div className="pointer-events-none absolute inset-2 border border-[#E6C991]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
          className="relative flex flex-col justify-center overflow-hidden bg-[#792D49] p-9 text-[#FBF0E4] md:p-14"
        >
          <div className="pointer-events-none absolute inset-3 border border-[#D9B77D]/70" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full border border-dashed border-[#D9B77D]/30" />
          <div className="relative z-10">
            <Eyebrow light>THE STORY BEHIND THE BRAND</Eyebrow>
            <h2 className="mt-6 font-display text-5xl italic leading-[1.02] md:text-6xl">A Ritual Born from Curiosity.</h2>
            <p className="mt-5 font-display text-lg">Dr. Jasleen Bhatti <span className="mx-2 text-[#D9B77D]">|</span> Founder, SEVOURA</p>
            <p className="mt-8 text-sm leading-8 text-[#F0DCD4]">My fascination with fragrance grew into a curiosity about tradition, symbolism and the rituals that make everyday moments meaningful.</p>
            <p className="mt-5 text-sm leading-8 text-[#F0DCD4]">That curiosity inspired SEVOURA — seven planetary inspirations, expressed through thoughtful fragrance blends for modern rituals.</p>
            <p className="mt-8 font-display text-3xl italic text-[#E7C276]">Cleanse. Elevate. Radiate.</p>
            <Link href="/our-story" className="group mt-8 inline-flex items-center gap-3 border-b border-[#D9B77D] pb-2 text-[9px] tracking-[0.22em]">
              DISCOVER OUR STORY <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── PHILOSOPHY — stacking cards ───────────── */
const PHILOSOPHY = [
  { n: "01", title: "Cleanse", text: "Create a moment of pause. Step away from the noise and return to what feels meaningful.", bg: "#F8F1E7", fg: "#46182D", accent: "#B28A56" },
  { n: "02", title: "Elevate", text: "Bring intention to the everyday. Let your personal rituals become expressions of who you are.", bg: "#E8D3B6", fg: "#46182D", accent: "#792D49" },
  { n: "03", title: "Radiate", text: "Carry your individuality with confidence. Celebrate the qualities that make your expression your own.", bg: "#792D49", fg: "#FBF0E4", accent: "#E5C48B" },
];

export function Philosophy() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ph-card");
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.9 + i * 0.03,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 18%", scrub: true },
          });
        });
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="bg-[#F0E4D5] px-5 py-24 md:px-12 md:py-32">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="mx-auto max-w-3xl text-center">
        <Eyebrow>THE SEVOURA PHILOSOPHY</Eyebrow>
        <h2 className="mt-5 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-medium leading-none text-[#46182D]">A Ritual, Rooted in Meaning.</h2>
      </motion.div>
      <div className="mx-auto mt-16 max-w-5xl">
        {PHILOSOPHY.map((p, i) => (
          <div key={p.n} className="ph-card sticky mb-8 origin-top" style={{ top: `calc(110px + ${i * 26}px)` }}>
            <div className="relative grid min-h-[320px] overflow-hidden border border-[#C9A66C]/50 p-9 shadow-[0_30px_70px_rgba(70,24,45,.14)] md:grid-cols-[.6fr_1fr] md:p-14" style={{ background: p.bg, color: p.fg }}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border" style={{ borderColor: `${p.accent}55` }} />
              <p className="font-display text-[110px] leading-none md:text-[160px]" style={{ color: p.accent }}>{p.n}</p>
              <div className="relative self-end">
                <h3 className="font-display text-5xl italic md:text-7xl">{p.title}</h3>
                <p className="mt-5 max-w-md text-[15px] leading-8 opacity-80">{p.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── MAKE EVERY DAY YOUR OWN ───────────── */
export function Steps() {
  const steps = [
    { n: "01", title: "Choose Your Intention", text: "Begin with the feeling, quality or intention you want to embrace." },
    { n: "02", title: "Discover Your Ritual", text: "Explore the seven inspirations and their traditional symbolism." },
    { n: "03", title: "Express Yourself", text: "Make the experience personal and create a ritual that feels like yours." },
  ];
  return (
    <section className="relative overflow-hidden bg-[#2E0F1D] px-6 py-28 text-[#F8F0E5] md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#792D49_0%,transparent_65%)] opacity-70" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }} className="mx-auto max-w-3xl text-center">
          <Eyebrow light>THE BEAUTY OF INTENTION</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-medium leading-none">Make Every Day Your Own.</h2>
          <p className="mt-6 text-sm leading-8 text-[#EBD9D4]">A seven-day collection inspired by seven planetary identities. A contemporary way to bring intention into everyday moments.</p>
        </motion.div>
        <div className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.6, ease }}
            className="absolute left-[16%] right-[16%] top-8 hidden h-px origin-left bg-gradient-to-r from-[#E5C48B] via-[#E5C48B]/60 to-[#E5C48B] md:block"
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.25 + i * 0.2, duration: 0.9, ease }}
              className="group relative text-center"
            >
              <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#E5C48B] bg-[#2E0F1D] font-display text-2xl text-[#E5C48B] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#E5C48B] group-hover:text-[#2E0F1D]">
                {s.n}
              </span>
              <h3 className="mt-8 font-display text-3xl">{s.title}</h3>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#EBD9D4]">{s.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/ritual-finder" className="group inline-flex items-center gap-4 border border-[#D9B77D] px-8 py-4 text-[10px] tracking-[0.22em] transition-colors duration-500 hover:bg-[#D9B77D] hover:text-[#2E0F1D]">
            FIND YOUR RITUAL <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────── WORLD OF MEANING — editorial list with cursor preview ───────────── */
export function Destinations() {
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 25 });
  const sy = useSpring(y, { stiffness: 200, damping: 25 });
  return (
    <section
      className="relative bg-[#F8F1E7] px-6 py-24 md:px-12 md:py-36"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
    >
      <div className="mx-auto max-w-[1250px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>STEP INTO OUR WORLD</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5.5vw,5rem)] font-medium leading-none text-[#46182D]">A World of Meaning.</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#806D60]">Discover the different dimensions of SEVOURA, from the inspiration behind the collection to the rituals that make it personal.</p>
        </div>
        <ul className="mt-14 border-t border-[#D8C5A7]" onPointerLeave={() => setHover(null)}>
          {DESTINATIONS.map((d, i) => (
            <motion.li key={d.no} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8, ease }}>
              <Link
                href={d.href}
                onPointerEnter={() => setHover(i)}
                className="group relative flex items-center gap-5 border-b border-[#D8C5A7] py-7 md:gap-10 md:py-9"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-[#792D49] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
                <span className="relative w-10 font-display text-lg text-[#A77B4D] transition-colors group-hover:text-[#E5C48B] md:pl-4">{d.no}</span>
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full md:hidden">
                  <Image src={d.image} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <span className="relative flex-1 font-display text-3xl text-[#46182D] transition-all duration-500 group-hover:translate-x-3 group-hover:text-[#FBF0E4] md:text-6xl">{d.title}</span>
                <span className="relative hidden text-[9px] tracking-[0.3em] text-[#A77B4D] transition-colors group-hover:text-[#E5C48B] md:block">{d.subtitle}</span>
                <span className="relative mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#792D49]/30 text-[#792D49] transition-all duration-500 group-hover:rotate-45 group-hover:border-[#E5C48B] group-hover:text-[#E5C48B] md:mr-4">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* cursor-following preview (pointer devices) */}
      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block">
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.4, ease }}
              className="relative -ml-[130px] -mt-[170px] h-[240px] w-[190px] overflow-hidden rounded-t-full border-4 border-[#F8F1E7] shadow-2xl"
            >
              <AnimatePresence initial={false}>
                <motion.div key={hover} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-30%" }} transition={{ duration: 0.55, ease }} className="absolute inset-0">
                  <Image src={DESTINATIONS[hover].image} alt="" fill sizes="190px" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ───────────── PROMISE ───────────── */
export function Promise() {
  const items = [
    { icon: Sparkles, title: "Distinctive", sub: "Seven inspired identities" },
    { icon: Droplets, title: "Conscious", sub: "Alcohol-free fragrances" },
    { icon: ShieldCheck, title: "Thoughtful", sub: "Designed for everyday rituals" },
    { icon: InfinityIcon, title: "Personal", sub: "An expression of intention" },
  ];
  return (
    <section className="bg-[#FBF6EE] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <Eyebrow>THE SEVOURA PROMISE</Eyebrow>
        <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-none text-[#46182D]">Thoughtfully Created. <span className="italic text-[#792D49]">Personally Experienced.</span></h2>
        <div className="mt-16 grid grid-cols-2 gap-px bg-[#DCCAB5] md:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease }}
              className="group bg-[#FBF6EE] px-4 py-10 transition-colors duration-500 hover:bg-[#792D49]"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4B88F] transition-all duration-500 group-hover:rotate-12 group-hover:border-[#E5C48B]">
                <it.icon size={26} strokeWidth={1.2} className="text-[#B28A56] group-hover:text-[#E5C48B]" />
              </span>
              <h3 className="mt-5 font-display text-2xl text-[#46182D] group-hover:text-[#FBF0E4]">{it.title}</h3>
              <p className="mt-2 text-xs leading-6 text-[#806D60] group-hover:text-[#EBD9D4]">{it.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FINALE ───────────── */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const wordX = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"]);
  const ring = useTransform(scrollYProgress, [0, 1], [0, 140]);
  return (
    <section ref={ref} className="sev-grain relative overflow-hidden bg-[#2E0F1D] px-6 py-32 text-center text-[#FBF0E4] md:py-48">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#792D49_0%,#46182D_55%,#2E0F1D_100%)]" />
      <motion.div style={{ rotate: ring }} className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9B77D]/20">
        {[0, 51, 103, 154, 206, 257, 309].map((d) => (
          <span key={d} className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#E5C48B]/70" style={{ transform: `rotate(${d}deg) translateY(-360px)` }} />
        ))}
      </motion.div>
      <motion.p
        aria-hidden
        style={{ x: wordX, WebkitTextStroke: "1px rgba(229,196,139,.25)" }}
        className="pointer-events-none absolute bottom-6 left-0 whitespace-nowrap font-display text-[24vw] leading-none text-transparent"
      >
        SEVOURA SEVOURA
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 1.1, ease }} className="relative z-10 mx-auto max-w-4xl">
        <Sparkles className="mx-auto text-[#E5C48B]" size={28} />
        <p className="mt-6 text-[10px] tracking-[0.36em] text-[#E5C48B]">THE SEVOURA EXPERIENCE</p>
        <h2 className="mt-8 font-display text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.92]">
          Beyond Fragrance.
          <br />
          <span className="italic text-[#E5C48B]">A Way of Expression.</span>
        </h2>
        <p className="mx-auto mt-9 max-w-2xl text-sm leading-8 text-[#EAD8CF]">
          Rooted in traditional symbolism. Inspired by seven planetary identities. Created for the beauty of everyday rituals.
        </p>
        <div className="mt-12">
          <Magnetic strength={0.45}>
            <Link href="/shop" className="sev-shine group inline-flex items-center gap-5 bg-[#F6EBDD] px-11 py-6 text-[10px] tracking-[0.22em] text-[#792D49] transition-colors duration-500 hover:bg-[#E5C48B]">
              BEGIN YOUR SEVOURA JOURNEY <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </div>
        <p className="mt-16 text-[9px] tracking-[0.4em] text-[#E5C48B]">CLEANSE. ELEVATE. RADIATE.</p>
      </motion.div>
    </section>
  );
}
