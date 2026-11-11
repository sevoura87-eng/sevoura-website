"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  RotateCcw,
  Orbit,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const blends = [
  {
    day: "MONDAY",
    planet: "MOON",
    name: "Moon",
    quality: "Calm & Emotional Balance",
    notes: "Jasmine · Green Tea · White Musk",
    intention: "Calm",
    color: "#D9D8D1",
    deep: "#777B83",
    symbol: "☾",
    description:
      "A gentle expression inspired by the Moon. An invitation to slow down, reconnect and create moments of quiet balance.",
  },
  {
    day: "TUESDAY",
    planet: "MARS",
    name: "Mars",
    quality: "Courage & Confidence",
    notes: "Clove · Rose · Woods · Spice",
    intention: "Courage",
    color: "#C77B78",
    deep: "#7F303D",
    symbol: "♂",
    description:
      "Inspired by Mars, this blend represents courage, determination and the confidence to move forward.",
  },
  {
    day: "WEDNESDAY",
    planet: "MERCURY",
    name: "Mercury",
    quality: "Clarity & Focus",
    notes: "Green Tea · Basil · Amber",
    intention: "Clarity",
    color: "#A5B28A",
    deep: "#506C4C",
    symbol: "☿",
    description:
      "A fresh interpretation of Mercury, associated with curiosity, communication and a clear sense of direction.",
  },
  {
    day: "THURSDAY",
    planet: "JUPITER",
    name: "Jupiter",
    quality: "Abundance & Expansion",
    notes: "Vanilla · Cocoa · Amber",
    intention: "Abundance",
    color: "#D9B875",
    deep: "#96703A",
    symbol: "♃",
    description:
      "Inspired by Jupiter, a fragrance identity representing optimism, growth and a spirit of possibility.",
  },
  {
    day: "FRIDAY",
    planet: "VENUS",
    name: "Venus",
    quality: "Love & Harmony",
    notes: "Rose · Neroli · Musk · Woods",
    intention: "Love",
    color: "#D8A1AD",
    deep: "#97556C",
    symbol: "♀",
    description:
      "A softer expression inspired by Venus, celebrating beauty, harmony and the little rituals that make a moment personal.",
  },
  {
    day: "SATURDAY",
    planet: "SATURN",
    name: "Saturn",
    quality: "Grounding & Stability",
    notes: "Vetiver · Patchouli · Cedarwood · Musk",
    intention: "Grounding",
    color: "#A0A3A7",
    deep: "#50545D",
    symbol: "♄",
    description:
      "Inspired by Saturn, this blend reflects grounding, patience and the beauty of finding your own rhythm.",
  },
  {
    day: "SUNDAY",
    planet: "SUN",
    name: "Sun",
    quality: "Radiance & Self-worth",
    notes: "Saffron · Sandalwood · Vanilla · Dry Woods",
    intention: "Radiance",
    color: "#E5AE61",
    deep: "#A76529",
    symbol: "☉",
    description:
      "A radiant interpretation inspired by the Sun, celebrating warmth, individuality and self-expression.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em] text-[#98754D]">
      <span className="h-px w-7 bg-[#B28B4E]" />
      {children}
      <span className="h-px w-7 bg-[#B28B4E]" />
    </div>
  );
}

function PlanetOrb({
  color,
  deep,
}: {
  color: string;
  deep: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative h-20 w-20 shrink-0 rounded-full"
      style={{
        background: `radial-gradient(circle at 30% 25%, #fff9e9 0%, ${color} 35%, ${deep} 85%)`,
        boxShadow: `inset -10px -10px 20px rgba(35,20,15,.2), 0 12px 30px ${color}55`,
      }}
    >
      <div className="absolute left-[18%] top-[16%] h-[25%] w-[25%] rounded-full bg-white/40 blur-md" />
    </motion.div>
  );
}

export default function RitualFinderPage() {
  const [planet, setPlanet] = useState("");
  const [intention, setIntention] = useState("");
  const [day, setDay] = useState("");
  const [fragrance, setFragrance] = useState("");
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    return blends.find((blend) => {
      return (
        (!planet || blend.planet === planet) &&
        (!intention || blend.intention === intention) &&
        (!day || blend.day === day) &&
        (!fragrance ||
          blend.notes.toLowerCase().includes(fragrance.toLowerCase()))
      );
    });
  }, [planet, intention, day, fragrance]);

  const resetFinder = () => {
    setPlanet("");
    setIntention("");
    setDay("");
    setFragrance("");
    setShowResult(false);
  };

  return (
    <>
      <SiteHeader />

      <main className="overflow-x-clip bg-[#F8F0E5] text-[#392823]">
        {/* 01 — RITUAL FINDER HERO — THE SEVEN INSPIRED DESIGN */}
        <section className="relative flex min-h-[760px] items-center justify-center overflow-hidden bg-[#782C49] px-5 py-20 md:min-h-[850px]">
          {/* Burgundy atmosphere and subtle star field */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#9A4965_0%,_#782C49_52%,_#4B1B32_100%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{ backgroundImage: "radial-gradient(#F8EBDD 0.8px, transparent 0.8px)", backgroundSize: "34px 34px" }}
          />

          {/* Animated orbital rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E9D1A7]/25 md:h-[900px] md:w-[900px]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#E9D1A7]/25 md:h-[700px] md:w-[700px]"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[1050px] w-[1050px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E9D1A7]/15 md:block"
          />

          {/* Floating golden planets — same gold palette as the reference */}
          <motion.div
            animate={{ y: [0, -13, 0], rotate: [0, 7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute left-[5%] top-[24%] h-24 w-24 rounded-full md:left-[8%] md:top-[25%] md:h-36 md:w-36"
            style={{ background: "radial-gradient(circle at 30% 28%, #FFF4D7 0%, #D9B477 42%, #80603F 100%)", boxShadow: "inset -12px -14px 24px rgba(55,30,20,.24), 0 18px 45px rgba(25,8,18,.24)" }}
          />
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute bottom-[17%] right-[5%] h-28 w-28 rounded-full md:bottom-[15%] md:right-[8%] md:h-40 md:w-40"
            style={{ background: "radial-gradient(circle at 30% 28%, #FFF4D7 0%, #D9B477 42%, #80603F 100%)", boxShadow: "inset -12px -14px 24px rgba(55,30,20,.24), 0 18px 45px rgba(25,8,18,.24)" }}
          />
          <motion.div
            animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="pointer-events-none absolute right-[17%] top-[58%] h-3 w-3 rounded-full bg-[#E9C477] shadow-[0_0_18px_#E9C477]"
          />

          {/* Central peach circular panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex min-h-[570px] w-full max-w-[760px] flex-col items-center justify-center rounded-[48%] border border-[#E9D1A7]/70 bg-[#F8EBDD] px-7 py-16 text-center shadow-[0_25px_90px_rgba(30,8,18,0.22)] md:min-h-[690px] md:px-20"
          >
            <div className="absolute inset-3 rounded-[48%] border border-[#B28B4E]/20" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#B28B4E]/50 text-[#A47A40] md:h-16 md:w-16"
            >
              <Orbit size={27} strokeWidth={1} />
            </motion.div>

            <div className="relative z-10 mb-7 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.34em] text-[#98754D] md:text-[11px]">
              <span className="h-px w-7 bg-[#B28B4E]" />
              THE SEVOURA RITUAL FINDER
              <span className="h-px w-7 bg-[#B28B4E]" />
            </div>

            <h1 className="relative z-10 max-w-[620px] font-serif text-5xl leading-[1.04] tracking-[-1px] text-[#392823] sm:text-6xl md:text-7xl">
              Discover the ritual
              <br />
              <span className="italic text-[#782C49]">that feels like you.</span>
            </h1>

            <p className="relative z-10 mx-auto mt-7 max-w-[490px] text-[15px] leading-7 text-[#756253] md:text-base md:leading-8">
              Every day carries a different energy. Explore seven distinctive fragrance identities inspired by traditional planetary associations and discover the SEVOURA blend that resonates with you.
            </p>

            <Link
              href="#find-your-ritual"
              className="group relative z-10 mt-9 inline-flex items-center gap-4 bg-[#782C49] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_30px_60px_-32px_rgba(46,10,25,.35)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#5D2037] md:px-10 md:py-5"
            >
              FIND YOUR RITUAL
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </Link>

            <div className="relative z-10 mt-9 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#98754D]">
              <span className="h-px w-7 bg-[#B28B4E]" />
              SEVEN DAYS · SEVEN EXPRESSIONS
              <span className="h-px w-7 bg-[#B28B4E]" />
            </div>
          </motion.div>
        </section>

        {/* 02 — INTRODUCTION */}
        <section className="px-6 py-20 md:py-28">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionLabel>A MORE PERSONAL WAY TO EXPLORE</SectionLabel>

            <h2 className="font-serif text-4xl leading-tight text-[#782C49] md:text-6xl">
              Your day. Your intention.
              <br />
              <span className="italic">Your fragrance.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-8 text-[#756253] md:text-base">
              Whether you are drawn to a planet, a particular intention, a
              fragrance note or a day of the week, begin wherever feels natural.
              The Ritual Finder will help you explore the corresponding
              SEVOURA fragrance identity.
            </p>
          </motion.div>
        </section>

        {/* 03 — FINDER TOOL */}
        <section
          id="find-your-ritual"
          className="scroll-mt-24 bg-[#EBDCC9] px-6 py-24 md:py-32"
        >
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SectionLabel>THE PLANETARY FRAGRANCE FINDER</SectionLabel>

              <h2 className="font-serif text-5xl leading-tight text-[#782C49] md:text-6xl">
                Find the blend
                <br />
                <span className="italic">that resonates.</span>
              </h2>

              <p className="mt-6 max-w-md text-[15px] leading-8 text-[#756253]">
                Choose what draws you in. Select a planet, intention,
                fragrance note or day to discover your corresponding blend.
              </p>

              <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#98754D]">
                <Orbit size={17} />
                YOUR PERSONAL FRAGRANCE JOURNEY
              </div>

              <div className="mt-12 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C8AD87] text-[#98754D]">
                  <Moon size={21} />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C8AD87] text-[#98754D]">
                  <Sun size={21} />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C8AD87] text-[#98754D]">
                  <Sparkles size={21} />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border border-[#D0B998] bg-[#FFFBF4] p-6 shadow-[0_20px_60px_rgba(89,62,39,0.08)] md:p-10"
            >
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#98754D]">
                  PERSONALISE YOUR DISCOVERY
                </p>
                <h3 className="mt-2 font-serif text-3xl text-[#782C49]">
                  What are you drawn to?
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* PLANET */}
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#98754D]">
                  EXPLORE BY PLANET
                  <div className="relative mt-3">
                    <select
                      value={planet}
                      onChange={(e) => {
                        setPlanet(e.target.value);
                        setShowResult(false);
                      }}
                      className="w-full appearance-none border border-[#D5C2A7] bg-transparent px-4 py-4 pr-10 text-[13px] text-[#49362D] outline-none transition focus:border-[#782C49]"
                    >
                      <option value="">Select a planet</option>
                      {blends.map((b) => (
                        <option key={b.planet} value={b.planet}>
                          {b.planet}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </label>

                {/* INTENTION */}
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#98754D]">
                  EXPLORE BY INTENTION
                  <div className="relative mt-3">
                    <select
                      value={intention}
                      onChange={(e) => {
                        setIntention(e.target.value);
                        setShowResult(false);
                      }}
                      className="w-full appearance-none border border-[#D5C2A7] bg-transparent px-4 py-4 pr-10 text-[13px] text-[#49362D] outline-none transition focus:border-[#782C49]"
                    >
                      <option value="">Select an intention</option>
                      {blends.map((b) => (
                        <option key={b.intention} value={b.intention}>
                          {b.intention}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </label>

                {/* FRAGRANCE */}
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#98754D]">
                  EXPLORE BY FRAGRANCE
                  <div className="relative mt-3">
                    <select
                      value={fragrance}
                      onChange={(e) => {
                        setFragrance(e.target.value);
                        setShowResult(false);
                      }}
                      className="w-full appearance-none border border-[#D5C2A7] bg-transparent px-4 py-4 pr-10 text-[13px] text-[#49362D] outline-none transition focus:border-[#782C49]"
                    >
                      <option value="">Select a fragrance note</option>
                      {[
                        "Jasmine",
                        "Rose",
                        "Green Tea",
                        "Vanilla",
                        "Amber",
                        "Musk",
                        "Sandalwood",
                        "Vetiver",
                        "Clove",
                        "Basil",
                        "Cocoa",
                        "Neroli",
                        "Patchouli",
                        "Cedarwood",
                        "Saffron",
                      ].map((note) => (
                        <option key={note} value={note}>
                          {note}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </label>

                {/* DAY */}
                <label className="text-[11px] uppercase tracking-[0.18em] text-[#98754D]">
                  EXPLORE BY DAY
                  <div className="relative mt-3">
                    <select
                      value={day}
                      onChange={(e) => {
                        setDay(e.target.value);
                        setShowResult(false);
                      }}
                      className="w-full appearance-none border border-[#D5C2A7] bg-transparent px-4 py-4 pr-10 text-[13px] text-[#49362D] outline-none transition focus:border-[#782C49]"
                    >
                      <option value="">Select a day</option>
                      {blends.map((b) => (
                        <option key={b.day} value={b.day}>
                          {b.day}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowResult(true)}
                  className="group inline-flex items-center gap-3 bg-[#782C49] px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#572036]"
                >
                  DISCOVER MY RITUAL
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <button
                  onClick={resetFinder}
                  className="border border-[#D5C2A7] px-6 py-4 text-[11px] uppercase tracking-[0.16em] text-[#782C49] transition hover:bg-[#F3E9DB]"
                >
                  <RotateCcw size={13} className="mr-2 inline" />
                  RESET
                </button>
              </div>

              {/* RESULT */}
              <AnimatePresence mode="wait">
                {showResult && (
                  <motion.div
                    key={result?.name ?? "no-result"}
                    initial={{ opacity: 0, height: 0, y: 15 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mt-8 overflow-hidden border-t border-[#D5C2A7] pt-7"
                  >
                    {result ? (
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                        <PlanetOrb
                          color={result.color}
                          deep={result.deep}
                        />

                        <div className="flex-1">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#98754D]">
                            YOUR SEVOURA DISCOVERY
                          </p>

                          <h3 className="mt-2 font-serif text-3xl text-[#782C49]">
                            {result.name}
                          </h3>

                          <p className="mt-1 text-[13px] text-[#49362D]">
                            {result.quality}
                          </p>

                          <p className="mt-3 text-[13px] leading-6 text-[#756253]">
                            {result.description}
                          </p>

                          <p className="mt-3 text-[12px] leading-5 text-[#98754D]">
                            FRAGRANCE NOTES: {result.notes}
                          </p>

                          <p className="mt-2 text-[11px] tracking-[0.15em] text-[#98754D]">
                            {result.day} · {result.planet}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-serif text-2xl text-[#782C49]">
                          Explore another combination
                        </p>
                        <p className="mt-2 text-[13px] leading-6 text-[#756253]">
                          Your selected filters do not match one blend.
                          Try removing a selection or resetting the finder.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* 04 — EXPLORE THE SEVEN */}
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-6xl">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-14 text-center"
            >
              <SectionLabel>SEVEN PLANETARY INSPIRATIONS</SectionLabel>

              <h2 className="font-serif text-4xl leading-tight text-[#782C49] md:text-6xl">
                Meet the seven
                <br />
                <span className="italic">fragrance identities.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-[#756253]">
                Explore the traditional associations behind each day and its
                corresponding SEVOURA fragrance identity.
              </p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {blends.map((blend, i) => (
                <motion.article
                  key={blend.name}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: (i % 4) * 0.08 }}
                  whileHover={{ y: -9 }}
                  className="group relative overflow-hidden border border-[#D8C5A9] bg-[#FFFAF2] p-7 text-center shadow-sm transition-shadow duration-500 hover:shadow-[0_30px_60px_-32px_rgba(46,10,25,.35)]"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: blend.color }}
                  />

                  <p className="text-[10px] tracking-[0.25em] text-[#98754D]">
                    {blend.day}
                  </p>

                  <div className="relative mx-auto my-8 flex h-28 items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 30 + i * 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute h-28 w-28 rounded-full border border-[#B28B4E]/40"
                    />
                    <PlanetOrb color={blend.color} deep={blend.deep} />
                  </div>

                  <p className="text-2xl text-[#98754D]">{blend.symbol}</p>

                  <p className="mt-3 text-[10px] tracking-[0.25em] text-[#98754D]">
                    {blend.planet}
                  </p>

                  <h3 className="mt-2 font-serif text-3xl text-[#782C49]">
                    {blend.name}
                  </h3>

                  <p className="mt-3 min-h-[38px] text-[13px] leading-5 text-[#49362D]">
                    {blend.quality}
                  </p>

                  <div className="mx-auto my-5 h-px w-12 bg-[#C8AD87]" />

                  <p className="text-[12px] leading-5 text-[#756253]">
                    {blend.notes}
                  </p>

                  <button
                    onClick={() => {
                      setPlanet(blend.planet);
                      setIntention("");
                      setDay("");
                      setFragrance("");
                      setShowResult(true);

                      document
                        .getElementById("find-your-ritual")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-7 inline-flex items-center gap-2 border-b border-[#B28B4E] pb-2 text-[11px] uppercase tracking-[0.16em] text-[#782C49] transition-all hover:gap-4"
                  >
                    EXPLORE THIS BLEND
                    <ArrowRight size={13} />
                  </button>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* 05 — CLOSING */}
        <section className="relative overflow-hidden bg-[#782C49] px-6 py-24 text-center text-[#F8F0E5] md:py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute -right-40 -top-48 h-[550px] w-[550px] rounded-full border border-[#E9D1A7]/15"
          />

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 mx-auto max-w-3xl"
          >
            <SectionLabel>YOUR SEVOURA JOURNEY</SectionLabel>

            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              A ritual that feels
              <br />
              <span className="italic text-[#E9D1A7]">uniquely yours.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-8 text-[#F8F0E5]/80">
              Seven distinctive fragrance identities. One collection.
              Discover the blend that speaks to your day, your intention
              and your own sense of self.
            </p>

            <Link
              href="/shop"
              className="mt-9 inline-flex items-center gap-4 bg-[#F8F0E5] px-9 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#782C49] shadow-[0_30px_60px_-32px_rgba(46,10,25,.35)] transition-all hover:-translate-y-1 hover:bg-white"
            >
              EXPLORE THE COLLECTION
              <ArrowRight size={16} />
            </Link>

            <p className="mt-7 font-serif text-[15px] italic text-[#E9D1A7]">
              Cleanse. Elevate. Radiate.
            </p>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}