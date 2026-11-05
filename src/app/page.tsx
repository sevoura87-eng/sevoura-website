
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Orbit,
  Droplets,
  Infinity as InfinityIcon,
  Flower2,
  ShieldCheck,
  Stars,
  Sun,
  Moon,
  Recycle,
} from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const planets = [
  { day: "MONDAY", name: "MOON", symbol: "☾", quality: "Calm & Reflection" },
  { day: "TUESDAY", name: "MARS", symbol: "♂", quality: "Courage & Action" },
  { day: "WEDNESDAY", name: "MERCURY", symbol: "☿", quality: "Clarity & Expression" },
  { day: "THURSDAY", name: "JUPITER", symbol: "♃", quality: "Growth & Wisdom" },
  { day: "FRIDAY", name: "VENUS", symbol: "♀", quality: "Beauty & Harmony" },
  { day: "SATURDAY", name: "SATURN", symbol: "♄", quality: "Grounding & Patience" },
  { day: "SUNDAY", name: "SUN", symbol: "☉", quality: "Confidence & Radiance" },
];

const destinations = [
  { no: "01", title: "The Collection", subtitle: "DISCOVER THE SEVEN", href: "/shop", visual: "collection" },
  { no: "02", title: "Our Story", subtitle: "THE SOUL OF SEVOURA", href: "/our-story", visual: "story" },
  { no: "03", title: "The Seven", subtitle: "PLANETARY INSPIRATIONS", href: "/the-seven", visual: "seven" },
  { no: "04", title: "The Experience", subtitle: "A PERSONAL RITUAL", href: "/the-experience", visual: "experience" },
  { no: "05", title: "The Journal", subtitle: "THOUGHTS & STORIES", href: "/journal", visual: "journal" },
];

const brandValues = [
  { title: "Planetary", sub: "Inspired Blends", icon: Orbit },
  { title: "Clean &", sub: "Conscious", icon: Droplets },
  { title: "Everyday", sub: "Rituals", icon: InfinityIcon },
  { title: "Thoughtful", sub: "Choices", icon: Recycle },
];

const reveal = {
  hidden: { opacity: 0, y: 38 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`text-[9px] tracking-[0.34em] ${light ? "text-[#E5C48B]" : "text-[#A77B4D]"}`}>
      {children}
    </p>
  );
}

function GoldRule() {
  return <div className="mt-7 h-[2px] w-16 bg-[#C49A59]" />;
}

function FlowingLines() {
  return (
    <svg viewBox="0 0 1200 500" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="sevouraRibbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A36D43" stopOpacity="0" />
          <stop offset="35%" stopColor="#D5AB6C" />
          <stop offset="55%" stopColor="#FFF2D9" />
          <stop offset="75%" stopColor="#C18A4D" />
          <stop offset="100%" stopColor="#A36D43" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <motion.path
          key={n}
          d={`M -100 ${250 + n * 25} C 140 ${60 + n * 20}, 360 ${440 - n * 18}, 620 ${240 + n * 12} S 940 ${80 + n * 30}, 1300 ${230 + n * 24}`}
          fill="none"
          stroke="url(#sevouraRibbon)"
          strokeWidth={n === 2 ? 4 : 1.5}
          animate={{
            pathLength: [0.75, 1, 0.75],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 9 + n * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

function HeroArtwork() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] overflow-hidden lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,#F0D9BB_0%,#F8F1E7_60%,transparent_100%)]" />

      <motion.div
        animate={{ x: [0, -20, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-[15%] top-[12%] h-[70%] w-[95%] rounded-[50%] border-2 border-[#C49A59]/60 shadow-[0_0_50px_rgba(196,154,89,.12)]"
        style={{ transform: "rotate(-15deg)" }}
      />

      <motion.div
        animate={{ x: [-15, 15, -15], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-[12%] top-[20%] h-[55%] w-[90%] rounded-[50%] border-[12px] border-[#D6B17B]/25 shadow-[inset_0_0_35px_rgba(255,255,255,.65),0_15px_45px_rgba(150,101,55,.12)]"
        style={{ transform: "rotate(-23deg)" }}
      />

      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 12, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-[20%] top-[34%] h-[36%] w-[100%] rounded-[50%] border-[22px] border-[#A86D45]/20 shadow-[0_0_50px_rgba(178,126,72,.16)]"
        style={{ transform: "rotate(-12deg)" }}
      />

      <FlowingLines />

      <div className="absolute inset-0 bg-gradient-to-r from-[#F8F1E7] via-[#F8F1E7]/35 to-transparent" />

      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute right-[22%] top-[24%] h-12 w-12 rounded-full border border-[#C49A59]/70 bg-[radial-gradient(circle_at_30%_25%,#FFF4D6,#C79550_60%,#79402F)] shadow-[0_0_35px_rgba(223,183,111,.45)]"
      />

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-[22%] right-[30%] h-7 w-7 rounded-full bg-[radial-gradient(circle_at_30%_25%,#FFF1CE,#B98548_65%,#5B2038)] shadow-[0_0_30px_rgba(223,183,111,.4)]"
      />
    </div>
  );
}

function AbstractVisual({ type }: { type: string }) {
  return (
    <div className={`relative h-[235px] overflow-hidden ${
      type === "seven" ? "bg-[#792D49]" :
      type === "story" ? "bg-[#D8C5AD]" :
      type === "journal" ? "bg-[#B99A79]" :
      type === "experience" ? "bg-[#E7D8C4]" :
      "bg-[#C6A77D]"
    }`}>
      {type === "seven" ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#A74E69,#792D49_60%,#45172D)]" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute inset-[12%] rounded-full border border-[#E3C17E]/60" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute inset-[22%] rounded-full border border-[#E3C17E]/60" />
          <div className="absolute inset-0 flex items-center justify-center font-serif text-7xl text-[#E6C47C]">✧</div>
        </>
      ) : type === "story" ? (
        <>
          <div className="absolute -left-10 top-[-20%] h-[140%] w-[70%] rotate-[28deg] rounded-full bg-[#F6EBDD]/65" />
          <div className="absolute right-[12%] top-[-20%] h-[150%] w-[2px] rotate-[28deg] bg-[#B68B55]" />
          <div className="absolute bottom-[-35%] right-[-10%] h-[90%] w-[75%] rounded-full border border-[#9B714C]/60" />
        </>
      ) : type === "journal" ? (
        <>
          <div className="absolute left-[15%] top-[10%] h-[80%] w-[70%] rotate-[-9deg] border border-[#F5E8D8]/80 bg-[#F4E8D8]/40 shadow-xl" />
          <div className="absolute left-[25%] top-[20%] h-[65%] w-[60%] rotate-[5deg] border border-[#8F6D4D]/50 bg-[#E9D9C5]/70" />
          <div className="absolute left-[35%] top-[30%] h-[45%] w-[40%] rotate-[-3deg] border border-[#B28A5B]/50" />
        </>
      ) : type === "experience" ? (
        <>
          <div className="absolute left-[-15%] top-[10%] h-[120%] w-[80%] rounded-full border border-[#B68B55]" />
          <div className="absolute right-[-20%] top-[-15%] h-[130%] w-[90%] rounded-full border border-[#B68B55]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
        </>
      ) : (
        <FlowingLines />
      )}
    </div>
  );
}

function OrbitArtwork() {
  return (
    <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden bg-[#EADBC8]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute h-[330px] w-[330px] rounded-full border border-[#B78B52]/60"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute h-[250px] w-[250px] rounded-full border border-dashed border-[#B78B52]/60"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="relative h-36 w-36 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFF5E1,#D3A25D_55%,#792D49)] shadow-[0_0_65px_rgba(169,119,68,.3)]"
      />
      <Sparkles className="absolute right-[20%] top-[22%] text-[#A77B4D]" size={24} />
      <Stars className="absolute bottom-[20%] left-[19%] text-[#A77B4D]" size={22} />
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <main className="overflow-hidden bg-[#F8F1E7] text-[#501D32]">
      <SiteHeader />

      {/* 01 — HERO */}
      <section ref={heroRef} className="relative flex min-h-[700px] items-center overflow-hidden bg-[#F8F1E7] md:min-h-[790px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_45%,#F4DFC5_0%,#F8F1E7_55%,#F8F1E7_100%)]" />
        <HeroArtwork />

        <motion.div style={{ y: heroY }} className="relative z-10 mx-auto w-full max-w-[1450px] px-7 py-32 md:px-16 lg:px-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.18 } } }}
            className="max-w-[660px]"
          >
            <motion.div variants={reveal}>
              <Eyebrow>DISCOVER THE WORLD OF SEVOURA</Eyebrow>
            </motion.div>

            <motion.h1 variants={reveal} className="mt-9 font-serif text-6xl leading-[1.02] tracking-tight sm:text-7xl md:text-[92px]">
              Seven Rituals.
              <br />
              <span className="italic text-[#792D49]">Infinite</span>
              <br />
              Expressions.
            </motion.h1>

            <motion.div variants={reveal}><GoldRule /></motion.div>

            <motion.p variants={reveal} className="mt-8 max-w-[430px] font-serif text-xl italic leading-relaxed text-[#6E4A4D] md:text-2xl">
              A contemporary fragrance journey that blends traditional wisdom with modern living.
            </motion.p>

            <motion.div variants={reveal}>
              <Link href="/shop" className="mt-10 inline-flex items-center gap-6 bg-[#792D49] px-9 py-5 text-[10px] tracking-[0.2em] text-[#FFF6E9] shadow-[0_12px_30px_rgba(83,29,51,.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#501D32]">
                EXPLORE THE COLLECTION <ArrowUpRight size={17} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 02 — BRAND SIGNATURE */}
      <section className="border-y border-[#DDCBB5] bg-[#FBF6EE] px-6 py-10 md:py-12">
        <div className="mx-auto grid max-w-[1350px] grid-cols-2 gap-y-9 md:grid-cols-4">
          {brandValues.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className={`flex items-center justify-center gap-4 px-3 ${i % 2 === 0 ? "border-r border-[#D4B88F]" : ""} ${i < 3 ? "md:border-r md:border-[#D4B88F]" : ""}`}>
                <Icon className="text-[#BD8D42]" size={36} strokeWidth={1.2} />
                <p className="font-serif text-sm leading-5 md:text-base">{v.title}<br />{v.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 03 — BRAND WORLD */}
      <section className="bg-[#F8F1E7] px-5 py-24 md:px-8 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="mx-auto mb-14 max-w-3xl text-center">
          <Eyebrow>STEP INTO OUR WORLD</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl md:text-6xl">A World of Meaning.</h2>
          <p className="mt-5 text-sm leading-7 text-[#806D60]">Discover the different dimensions of SEVOURA, from the inspiration behind the collection to the rituals that make it personal.</p>
        </motion.div>

        <div className="mx-auto grid max-w-[1450px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {destinations.map((item, i) => (
            <motion.div key={item.no} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }} whileHover={{ y: -8 }} className="group">
              <Link href={item.href} className="block">
                <div className="flex items-end justify-between px-4 pb-4">
                  <div>
                    <p className="text-[8px] tracking-[0.25em] text-[#A77B4D]">{item.subtitle}</p>
                    <h3 className="mt-2 font-serif text-2xl">{item.title}</h3>
                  </div>
                  <span className="font-serif text-sm text-[#A77B4D]">{item.no}</span>
                </div>
                <div className="relative overflow-hidden">
                  <AbstractVisual type={item.visual} />
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FBF5EC] text-[#792D49] transition-all duration-500 group-hover:rotate-[-35deg] group-hover:bg-[#792D49] group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 04 — FOUNDER STORY */}
      <section className="bg-[#F0E4D5] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1250px] items-stretch gap-8 md:grid-cols-[.85fr_1.5fr]">
          <motion.div initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative min-h-[430px] overflow-hidden border border-[#C5A16A] p-2">
            <Image src="/images/founder-jasleen.jpg" alt="Dr. Jasleen Bhatti, Founder of SEVOURA" fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover object-center" />
            <div className="pointer-events-none absolute inset-2 border border-[#E6C991]" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative flex flex-col justify-center overflow-hidden bg-[#792D49] p-9 text-[#FBF0E4] md:p-14">
            <div className="pointer-events-none absolute inset-3 border border-[#D9B77D]/70" />
            <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full border border-[#D9B77D]/30" />

            <div className="relative z-10">
              <Eyebrow light>THE STORY BEHIND THE BRAND</Eyebrow>
              <h2 className="mt-6 font-serif text-4xl italic leading-tight md:text-5xl">A Ritual Born from Curiosity.</h2>
              <p className="mt-5 font-serif text-base">Dr. Jasleen Bhatti <span className="mx-2 text-[#D9B77D]">|</span> Founder, SEVOURA</p>
              <p className="mt-8 text-sm leading-8 text-[#F0DCD4]">My fascination with fragrance grew into a curiosity about tradition, symbolism and the rituals that make everyday moments meaningful.</p>
              <p className="mt-5 text-sm leading-8 text-[#F0DCD4]">That curiosity inspired SEVOURA — seven planetary inspirations, expressed through thoughtful fragrance blends for modern rituals.</p>
              <p className="mt-8 font-serif text-2xl italic text-[#E7C276]">Cleanse. Elevate. Radiate.</p>
              <Link href="/our-story" className="mt-8 inline-flex items-center gap-3 border-b border-[#D9B77D] pb-2 text-[9px] tracking-[0.2em]">DISCOVER OUR STORY <ArrowUpRight size={14} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 05 — SEVEN PLANETARY INSPIRATIONS */}
      <section className="bg-[#FBF6EE] px-6 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="mx-auto max-w-3xl text-center">
          <Eyebrow>THE IDEA BEHIND THE COLLECTION</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">Seven Days. Seven Inspirations.</h2>
          <p className="mt-6 text-sm leading-8 text-[#806D60]">An ancient planetary cycle, reimagined as a contemporary fragrance story. Every day brings a different symbolic identity and a new opportunity for personal expression.</p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-[1250px] grid-cols-2 gap-4 md:grid-cols-4">
          {planets.map((planet, i) => (
            <motion.div key={planet.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -8 }} className="group border border-[#DCCAB5] bg-[#F6EBDD] px-5 py-8 text-center transition-colors duration-500 hover:bg-[#792D49] hover:text-[#FFF5E9] md:px-7 md:py-10">
              <p className="text-[8px] tracking-[0.25em] text-[#A77B4D] group-hover:text-[#E5C48B]">{planet.day}</p>
              <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#C49A59] font-serif text-5xl text-[#A77B4D] transition-all duration-500 group-hover:rotate-12 group-hover:border-[#E5C48B] group-hover:text-[#E5C48B]">{planet.symbol}</div>
              <h3 className="mt-6 font-serif text-xl">{planet.name}</h3>
              <p className="mt-2 text-[10px] tracking-wide text-[#846E60] group-hover:text-[#E9D8CD]">{planet.quality}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/our-story/astrology-behind-rituals" className="inline-flex items-center gap-4 border border-[#792D49] px-8 py-4 text-[9px] tracking-[0.2em] transition-all hover:bg-[#792D49] hover:text-white">THE ASTROLOGY BEHIND THE RITUALS <ArrowUpRight size={15} /></Link>
        </div>
      </section>

      {/* 06 — ART OF FRAGRANCE */}
      <section className="bg-[#F8F1E7] px-6 py-28 md:py-36">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
            <Eyebrow>THE ART OF FRAGRANCE</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">More Than a Fragrance. <span className="italic text-[#9C6D55]">A Feeling.</span></h2>
            <GoldRule />
            <p className="mt-8 text-sm leading-8 text-[#806D60]">Fragrance has the power to make ordinary moments feel personal. It can become a memory, a signature and a small expression of individuality.</p>
            <p className="mt-5 text-sm leading-8 text-[#806D60]">SEVOURA brings this idea into a seven-day ritual inspired by traditional planetary symbolism.</p>
          </motion.div>
          <OrbitArtwork />
        </div>
      </section>

      {/* 07 — PERSONAL RITUAL */}
      <section className="bg-[#792D49] px-6 py-28 text-[#F8F0E5] md:py-36">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow light>THE BEAUTY OF INTENTION</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl md:text-6xl">Make Every Day Your Own.</h2>
            <p className="mt-6 text-sm leading-8 text-[#EBD9D4]">A seven-day collection inspired by seven planetary identities. A contemporary way to bring intention into everyday moments.</p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", title: "Choose Your Intention", text: "Begin with the feeling, quality or intention you want to embrace." },
              { n: "02", title: "Discover Your Ritual", text: "Explore the seven inspirations and their traditional symbolism." },
              { n: "03", title: "Express Yourself", text: "Make the experience personal and create a ritual that feels like yours." },
            ].map((item, i) => (
              <motion.div key={item.n} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="border border-[#D9B77D]/40 bg-[#5B2038] p-9 transition-all duration-500 hover:-translate-y-2 hover:border-[#E5C48B]">
                <p className="font-serif text-3xl text-[#E5C48B]">{item.n}</p>
                <h3 className="mt-6 font-serif text-2xl">{item.title}</h3>
                <p className="mt-5 text-sm leading-7 text-[#EBD9D4]">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — COSMIC COLLECTION STORY */}
      <section className="relative overflow-hidden bg-[#46182D] px-6 py-28 text-[#FBF0E4] md:py-36">
        <div className="absolute inset-0 opacity-80"><FlowingLines /></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#792D49_0%,#46182D_75%)] opacity-70" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-20">
          <OrbitArtwork />

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <Eyebrow light>WHERE TRADITION MEETS MODERN LIVING</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">A Collection Inspired by the Cosmos.</h2>
            <p className="mt-7 text-sm leading-8 text-[#EAD8CF]">SEVOURA draws inspiration from traditional planetary symbolism and translates it into a contemporary fragrance experience. Seven individual identities come together through one connected idea: the relationship between time, intention and personal expression.</p>
            <p className="mt-6 font-serif text-xl italic text-[#E5C48B]">The stars inspire. Your intention defines.</p>
            <Link href="/the-seven" className="mt-9 inline-flex items-center gap-4 border border-[#D9B77D] px-8 py-4 text-[9px] tracking-[0.2em] transition-all hover:bg-[#D9B77D] hover:text-[#46182D]">EXPLORE THE SEVEN <ArrowUpRight size={15} /></Link>
          </motion.div>
        </div>
      </section>

      {/* 09 — PHILOSOPHY */}
      <section className="bg-[#F0E4D5] px-6 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="mx-auto max-w-3xl text-center">
          <Eyebrow>THE SEVOURA PHILOSOPHY</Eyebrow>
          <h2 className="mt-5 font-serif text-4xl md:text-6xl">A Ritual, Rooted in Meaning.</h2>
          <p className="mt-6 font-serif text-lg italic text-[#94775F]">Cleanse. Elevate. Radiate.</p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            { n: "01", title: "Cleanse", text: "Create a moment of pause. Step away from the noise and return to what feels meaningful." },
            { n: "02", title: "Elevate", text: "Bring intention to the everyday. Let your personal rituals become expressions of who you are." },
            { n: "03", title: "Radiate", text: "Carry your individuality with confidence. Celebrate the qualities that make your expression your own." },
          ].map((v, i) => (
            <motion.div key={v.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="border border-[#D6BFA5] bg-[#F8F1E7] p-9 md:p-11">
              <p className="font-serif text-2xl text-[#B28A56]">{v.n}</p>
              <h3 className="mt-5 font-serif text-3xl">{v.title}</h3>
              <p className="mt-5 text-sm leading-7 text-[#806D60]">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 10 — EVERYDAY EXPERIENCE */}
      <section className="bg-[#FBF6EE] px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <Eyebrow>THE ART OF EVERYDAY RITUAL</Eyebrow>
            <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">Make Space for a Moment That Is Yours.</h2>
            <GoldRule />
            <p className="mt-7 text-sm leading-8 text-[#806D60]">A personal ritual does not need to be complicated. Sometimes it begins with a familiar fragrance, a quiet moment and an intention you choose for yourself.</p>
            <p className="mt-5 text-sm leading-8 text-[#806D60]">Explore the world of SEVOURA and discover how tradition and contemporary self-expression can come together in your everyday life.</p>
            <Link href="/the-experience" className="mt-9 inline-flex items-center gap-3 border-b border-[#A77B4D] pb-3 text-[9px] tracking-[0.2em]">DISCOVER THE EXPERIENCE <ArrowUpRight size={15} /></Link>
          </motion.div>
          <OrbitArtwork />
        </div>
      </section>

      {/* 11 — BRAND PROMISE */}
      <section className="bg-[#F0E4D5] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl text-center">
          <Eyebrow>THE SEVOURA PROMISE</Eyebrow>
          <h2 className="mt-6 font-serif text-4xl md:text-6xl">Thoughtfully Created. Personally Experienced.</h2>

          <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4">
            {[
              { icon: Sparkles, title: "Distinctive", sub: "Seven inspired identities" },
              { icon: Droplets, title: "Conscious", sub: "Alcohol-free fragrances" },
              { icon: ShieldCheck, title: "Thoughtful", sub: "Designed for everyday rituals" },
              { icon: InfinityIcon, title: "Personal", sub: "An expression of intention" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <Icon size={36} strokeWidth={1.2} className="mx-auto text-[#B28A56]" />
                  <h3 className="mt-5 font-serif text-xl">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#806D60]">{item.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12 — EXCLUSIVE OFFER */}
      <section className="relative overflow-hidden bg-[#F0E4D5] px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full border border-[#BD9259]/20" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full border border-[#BD9259]/20" />

        <motion.div initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="relative mx-auto max-w-6xl overflow-hidden border border-[#C6A36D] bg-[#792D49] text-[#FBF0E4] shadow-[0_25px_80px_rgba(73,25,47,.18)]">
          <div className="pointer-events-none absolute inset-3 border border-[#D9B77D]/50" />
          <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-[#E4C38B]/30" />
          <div className="absolute -right-12 -top-16 h-60 w-60 rounded-full border border-[#E4C38B]/20" />

          <div className="relative z-10 grid items-center gap-12 p-9 md:grid-cols-[1.2fr_.8fr] md:p-16">
            <div>
              <Eyebrow light>A SPECIAL INVITATION FROM SEVOURA</Eyebrow>
              <h2 className="mt-7 font-serif text-4xl leading-tight md:text-6xl">Your Seven-Day<br /><span className="italic text-[#E5C48B]">Fragrance Ritual.</span></h2>
              <p className="mt-7 max-w-lg text-sm leading-8 text-[#F0DCD4]">Discover seven distinct fragrance inspirations in one thoughtfully curated collection. Begin your personal SEVOURA journey.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <span className="bg-[#E6C58B] px-4 py-2 text-[9px] tracking-[0.2em] text-[#4D1D35]">INTRODUCTORY COLLECTION OFFER</span>
                <span className="text-xs text-[#EEDCCF]">Save ₹700</span>
              </div>
            </div>

            <div className="relative border border-[#D9B77D]/50 bg-[#5B2038] p-8 text-center md:p-10">
              <p className="text-[9px] tracking-[0.3em] text-[#E5C48B]">THE SEVEN BLEND COLLECTION</p>
              <p className="mt-8 font-serif text-xl text-[#E9D8CE] line-through decoration-[#D8B77C]">₹2,499</p>
              <motion.p animate={{ scale: [1, 1.035, 1] }} transition={{ duration: 3, repeat: Infinity }} className="mt-2 font-serif text-6xl text-[#F4D79C] md:text-7xl">₹1,799</motion.p>
              <p className="mt-4 text-[10px] tracking-[0.2em] text-[#EAD9CD]">SAVE ₹700 · APPROX. 28% OFF</p>
              <Link href="/shop" className="mt-9 inline-flex w-full items-center justify-center gap-4 bg-[#F3E5D2] px-6 py-4 text-[10px] tracking-[0.2em] text-[#792D49] transition-all duration-500 hover:-translate-y-1 hover:bg-[#E5C48B]">SHOP THE COLLECTION <ArrowUpRight size={16} /></Link>
              <p className="mt-5 text-[9px] leading-5 text-[#DCC8BB]">Seven fragrances. One connected story.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 13 — FINAL BRAND ENDING */}
      <section className="relative overflow-hidden bg-[#46182D] px-6 py-32 text-center text-[#FBF0E4] md:py-48">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#792D49_0%,#46182D_65%,#301020_100%)]" />
        <div className="absolute inset-0 opacity-60"><FlowingLines /></div>

        <motion.div animate={{ rotate: 360 }} transition={{ duration: 75, repeat: Infinity, ease: "linear" }} className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9B77D]/20" />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="relative z-10 mx-auto max-w-4xl">
          <Sparkles className="mx-auto text-[#E5C48B]" size={30} />
          <Eyebrow light>THE SEVOURA EXPERIENCE</Eyebrow>

          <h2 className="mt-8 font-serif text-5xl leading-tight md:text-8xl">
            Beyond Fragrance.
            <br />
            <span className="italic text-[#E5C48B]">A Way of Expression.</span>
          </h2>

          <p className="mx-auto mt-9 max-w-2xl text-sm leading-8 text-[#EAD8CF]">
            Rooted in traditional symbolism. Inspired by seven planetary identities. Created for the beauty of everyday rituals.
          </p>

          <Link href="/shop" className="mt-12 inline-flex items-center gap-5 bg-[#F6EBDD] px-10 py-5 text-[10px] tracking-[0.2em] text-[#792D49] transition-all duration-500 hover:-translate-y-1 hover:bg-[#E5C48B]">
            BEGIN YOUR SEVOURA JOURNEY <ArrowRight size={17} />
          </Link>

          <div className="mt-20">
            <p className="font-serif text-4xl tracking-[0.3em]">SEVOURA</p>
            <p className="mt-4 text-[9px] tracking-[0.35em] text-[#E5C48B]">CLEANSE. ELEVATE. RADIATE.</p>
          </div>
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}
