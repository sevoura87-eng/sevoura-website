"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  BookOpen,
  Feather,
  Flower2,
  Stars,
  Moon,
  Sun,
  Orbit,
  Mail,
  CheckCircle2,
  MoveUpRight,
  Compass,
  Wind,
  Heart,
  Clock3,
} from "lucide-react";
import { useRef } from "react";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const topics = [
  "FRAGRANCE",
  "PLANETARY INSPIRATION",
  "EVERYDAY RITUALS",
  "MINDFUL LIVING",
  "SCENT & MEMORY",
  "THE ART OF SLOW LIVING",
];

const categories = [
  {
    number: "01",
    title: "Stories",
    subtitle: "PERSONAL PERSPECTIVES",
    description:
      "Personal perspectives, meaningful moments, and the stories behind the rituals we cherish.",
    icon: BookOpen,
    word: "Stories",
    background: "from-[#E7D1B5] to-[#C9A77E]",
  },
  {
    number: "02",
    title: "Blogs",
    subtitle: "IDEAS & INSIGHTS",
    description:
      "Ideas and insights on fragrance, self-care, and the art of living with intention.",
    icon: Feather,
    word: "Thoughts",
    background: "from-[#E4D8D0] to-[#BFA6A0]",
  },
  {
    number: "03",
    title: "Editorial",
    subtitle: "A CURATED LENS",
    description:
      "A curated lens on the worlds of scent, style, culture, and celestial inspiration.",
    icon: Flower2,
    word: "Culture",
    background: "from-[#D8D9C9] to-[#A7AA91]",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 55 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-3 text-[9px] font-medium uppercase tracking-[0.34em] text-[#A17B4B]">
      <span className="h-px w-8 bg-[#B28B4E]" />
      {children}
      <span className="h-px w-8 bg-[#B28B4E]" />
    </div>
  );
}

function FloatingOrb({
  className = "",
  duration = 7,
}: {
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [0, -17, 0],
        rotate: [0, 8, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`rounded-full ${className}`}
    />
  );
}

function CelestialArtwork() {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#E8D5BB] via-[#F8ECDD] to-[#D5B58B]">
      <div className="absolute inset-4 border border-[#A47A40]/35" />
      <div className="absolute inset-7 border border-[#A47A40]/20" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        className="absolute h-[82%] aspect-square rounded-full border border-[#A47A40]/45"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        className="absolute h-[65%] aspect-square rounded-full border border-dashed border-[#A47A40]/45"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute h-[44%] aspect-square rounded-full border border-[#A47A40]/35"
      />

      <FloatingOrb
        duration={6}
        className="absolute left-[18%] top-[22%] h-7 w-7 bg-gradient-to-br from-[#FFF8E9] to-[#A47A40] shadow-lg"
      />
      <FloatingOrb
        duration={8}
        className="absolute right-[18%] bottom-[24%] h-11 w-11 bg-gradient-to-br from-[#FFF8E9] to-[#B28B4E] shadow-lg"
      />

      <motion.div
        animate={{ y: [0, -12, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full border border-[#B28B4E]/50 bg-[#FFF8EC]/80 text-[#A47A40] shadow-[0_20px_50px_rgba(104,69,34,0.15)] md:h-40 md:w-40"
      >
        <div className="absolute inset-3 rounded-full border border-[#B28B4E]/25" />
        <Sparkles size={48} strokeWidth={0.8} />
      </motion.div>

      <div className="absolute bottom-[15%] text-center">
        <p className="font-serif text-2xl tracking-[0.28em] text-[#782C49] md:text-3xl">
          SEVOURA
        </p>
        <p className="mt-2 text-[8px] uppercase tracking-[0.4em] text-[#98754D]">
          A WORLD OF RITUALS
        </p>
      </div>
    </div>
  );
}

function EditorialArtwork() {
  return (
    <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-[#782C49] md:min-h-[540px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#A65B70_0%,_#782C49_50%,_#48172F_100%)]" />

      {[250, 350, 470, 600].map((size, index) => (
        <motion.div
          key={size}
          animate={{ rotate: index % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: 45 + index * 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute rounded-full border border-[#E9D1A7]/20"
          style={{ width: size, height: size, maxWidth: "95vw", maxHeight: "95vw" }}
        />
      ))}

      <FloatingOrb
        duration={7}
        className="absolute left-[15%] top-[20%] h-10 w-10 bg-gradient-to-br from-[#FFF2D5] to-[#B28B4E] shadow-xl"
      />

      <FloatingOrb
        duration={9}
        className="absolute right-[16%] top-[25%] h-16 w-16 bg-gradient-to-br from-[#F9E6C3] to-[#9B7041] shadow-xl"
      />

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="relative z-10 px-5 text-center"
      >
        <Stars className="mx-auto mb-7 text-[#E9D1A7]" size={36} strokeWidth={1} />
        <p className="font-serif text-5xl italic leading-tight text-[#F9EBDD] md:text-7xl">
          The art of
          <br />
          everyday rituals.
        </p>
        <div className="mx-auto mt-8 h-px w-20 bg-[#E9D1A7]/70" />
        <p className="mt-5 text-[8px] uppercase tracking-[0.4em] text-[#E9D1A7]">
          THE SEVOURA JOURNAL
        </p>
      </motion.div>
    </div>
  );
}

export default function JournalPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <>
      <SiteHeader />

      <main className="overflow-hidden bg-[#F8F0E5] text-[#392823]">

        {/* 01 — CINEMATIC HERO */}
        <section
          ref={heroRef}
          className="relative flex min-h-[720px] items-center justify-center overflow-hidden bg-[#EEDCC5] px-6 py-24 md:min-h-[850px]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FFF8EC_0%,_#F3E5D2_48%,_#DCC3A3_100%)]" />

          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(#A47A40 0.8px, transparent 0.8px)",
              backgroundSize: "32px 32px",
            }}
          />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B28B4E]/25 md:h-[900px] md:w-[900px]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#B28B4E]/25 md:h-[700px] md:w-[700px]"
            />
          </motion.div>

          <FloatingOrb
            duration={8}
            className="absolute left-[8%] top-[22%] h-20 w-20 bg-gradient-to-br from-[#FFF8E8] via-[#D8B77F] to-[#765137] shadow-[0_15px_40px_rgba(75,45,20,0.25)] md:h-32 md:w-32"
          />

          <FloatingOrb
            duration={10}
            className="absolute bottom-[17%] right-[8%] h-24 w-24 bg-gradient-to-br from-[#FFF8E8] via-[#D8B77F] to-[#765137] shadow-[0_15px_40px_rgba(75,45,20,0.25)] md:h-40 md:w-40"
          />

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="relative z-10 mx-auto max-w-5xl text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#B28B4E]/45 bg-[#FFF8EC]/50 text-[#A47A40]"
            >
              <Orbit size={29} strokeWidth={1} />
            </motion.div>

            <SectionLabel>THE SEVOURA JOURNAL</SectionLabel>

            <h1 className="font-serif text-6xl leading-[0.98] tracking-[-1.5px] text-[#782C49] sm:text-7xl md:text-9xl">
              Stories.
              <br />
              <span className="italic text-[#782C49]">
                Blogs. Editorial.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-[#756253] md:text-base">
              A considered space for fragrance, rituals, and the little moments
              that make everyday life feel extraordinary.
            </p>

            <Link
              href="#featured-story"
              className="group mt-10 inline-flex items-center gap-5 bg-[#782C49] px-9 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-[#572036]"
            >
              EXPLORE THE JOURNAL
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>

            <div className="mt-12 flex items-center justify-center gap-3 text-[8px] uppercase tracking-[0.35em] text-[#98754D]">
              <span className="h-px w-8 bg-[#B28B4E]" />
              READ · REFLECT · RECONNECT
              <span className="h-px w-8 bg-[#B28B4E]" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[#98754D]"
          >
            <span className="text-[8px] tracking-[0.3em]">SCROLL TO EXPLORE</span>
            <ArrowDown size={15} />
          </motion.div>
        </section>

        {/* 02 — INTRODUCTION */}
        <section className="px-6 py-24 md:py-32">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto max-w-4xl text-center"
          >
            <SectionLabel>A SPACE FOR INSPIRATION</SectionLabel>

            <h2 className="font-serif text-4xl leading-tight text-[#782C49] md:text-6xl">
              Some moments deserve
              <br />
              <span className="italic">to be remembered.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-[#756253] md:text-base">
              From the world of fragrance to the meaning behind everyday
              rituals, the SEVOURA Journal is a considered space for ideas,
              perspectives and inspiration.
            </p>
          </motion.div>
        </section>

        {/* 03 — FEATURED STORY */}
        <section
          id="featured-story"
          className="scroll-mt-20 bg-[#F0E3D2] px-6 py-20 md:py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -55 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1"
            >
              <SectionLabel>THE FEATURED STORY</SectionLabel>

              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-[#98754D]">
                A SEVOURA PERSPECTIVE
              </p>

              <h2 className="font-serif text-5xl leading-[1.08] text-[#782C49] md:text-7xl">
                A world of rituals,
                <br />
                <span className="italic">reimagined.</span>
              </h2>

              <div className="my-8 h-px w-20 bg-[#B28B4E]" />

              <p className="max-w-xl text-sm leading-8 text-[#756253] md:text-base">
                Discover thoughtful perspectives on fragrance, planetary
                inspirations, and mindful moments—curated to bring a little
                more meaning to your everyday.
              </p>

              <Link
                href="#journal-categories"
                className="group mt-9 inline-flex items-center gap-4 border-b border-[#782C49] pb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#782C49]"
              >
                READ THE STORY
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-2"
                />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.88, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1 }}
              className="order-1 lg:order-2"
            >
              <EditorialArtwork />
            </motion.div>
          </div>
        </section>

        {/* 04 — CATEGORY EDITORIAL */}
        <section
          id="journal-categories"
          className="px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <SectionLabel>EXPLORE THE JOURNAL</SectionLabel>

              <h2 className="font-serif text-4xl leading-tight text-[#782C49] md:text-6xl">
                Three perspectives.
                <br />
                <span className="italic">One thoughtful world.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#756253]">
                A curated destination for stories, ideas and inspiration.
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-5 md:grid-cols-3"
            >
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <motion.article
                    key={category.title}
                    variants={reveal}
                    whileHover={{ y: -12 }}
                    className="group relative overflow-hidden border border-[#D5C0A2] bg-[#FCF7EF]"
                  >
                    <div
                      className={`relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br ${category.background}`}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 55,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute h-48 w-48 rounded-full border border-white/45"
                      />

                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 35,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute h-36 w-36 rounded-full border border-dashed border-white/50"
                      />

                      <div className="absolute right-5 top-4 font-serif text-6xl text-white/35">
                        {category.number}
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.13, rotate: 8 }}
                        className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-white/25 text-white backdrop-blur-sm"
                      >
                        <Icon size={42} strokeWidth={1} />
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0.3 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute bottom-5 font-serif text-4xl italic text-white/80"
                      >
                        {category.word}
                      </motion.p>
                    </div>

                    <div className="p-8">
                      <p className="text-[8px] tracking-[0.24em] text-[#98754D]">
                        {category.subtitle}
                      </p>

                      <h3 className="mt-3 font-serif text-4xl text-[#782C49]">
                        {category.title}
                      </h3>

                      <p className="mt-5 min-h-[85px] text-sm leading-7 text-[#756253]">
                        {category.description}
                      </p>

                      <div className="mt-7 flex items-center justify-between border-t border-[#D8C5A9] pt-5">
                        <span className="text-[8px] uppercase tracking-[0.2em] text-[#98754D]">
                          THE SEVOURA JOURNAL
                        </span>
                        <ArrowRight
                          size={17}
                          className="text-[#782C49] transition-transform duration-500 group-hover:translate-x-2"
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* 05 — RUNNING TOPIC STRIP */}
        <section className="overflow-hidden border-y border-[#D2B995] bg-[#EBDCC9] py-7">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max items-center gap-10"
          >
            {[...topics, ...topics].map((topic, index) => (
              <div
                key={`${topic}-${index}`}
                className="flex items-center gap-10"
              >
                <span className="whitespace-nowrap font-serif text-2xl italic tracking-wide text-[#782C49] md:text-3xl">
                  {topic}
                </span>
                <Sparkles
                  size={18}
                  strokeWidth={1}
                  className="text-[#A47A40]"
                />
              </div>
            ))}
          </motion.div>
        </section>

        {/* 06 — PLANETARY INSPIRATION */}
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <CelestialArtwork />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <SectionLabel>PLANETARY INSPIRATION</SectionLabel>

              <h2 className="font-serif text-5xl leading-tight text-[#782C49] md:text-6xl">
                Beyond the
                <br />
                <span className="italic">ordinary.</span>
              </h2>

              <p className="mt-7 text-sm leading-8 text-[#756253] md:text-base">
                Traditional planetary associations offer a fascinating lens
                through which to explore the days of the week, their symbolism
                and the intentions they inspire.
              </p>

              <p className="mt-5 text-sm leading-8 text-[#756253]">
                SEVOURA brings this inspiration into the world of fragrance
                through seven distinctive identities—each with its own
                character and expression.
              </p>

              <Link
                href="/the-seven"
                className="group mt-9 inline-flex items-center gap-4 border-b border-[#782C49] pb-3 text-[10px] uppercase tracking-[0.2em] text-[#782C49]"
              >
                EXPLORE THE SEVEN
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-2"
                />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 07 — MINDFUL LIVING */}
        <section className="relative overflow-hidden bg-[#782C49] px-6 py-24 text-[#F8F0E5] md:py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full border border-[#E9D1A7]/15"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
            className="absolute -left-48 -bottom-48 h-[550px] w-[550px] rounded-full border border-[#E9D1A7]/15"
          />

          <div className="relative mx-auto max-w-5xl text-center">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionLabel>THE ART OF EVERYDAY RITUALS</SectionLabel>

              <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#E9D1A7]/50 text-[#E9D1A7]">
                <Heart size={27} strokeWidth={1} />
              </div>

              <h2 className="font-serif text-5xl leading-tight md:text-7xl">
                Make the everyday
                <br />
                <span className="italic text-[#E9D1A7]">
                  feel extraordinary.
                </span>
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-[#F8F0E5]/80 md:text-base">
                A moment of stillness. A familiar fragrance. A little time
                for yourself. Sometimes, the most meaningful experiences
                are found in the smallest everyday moments.
              </p>

              <div className="mx-auto mt-12 grid max-w-3xl gap-8 border-t border-[#E9D1A7]/30 pt-10 sm:grid-cols-3">
                {[
                  { icon: Wind, title: "PAUSE", text: "Make room for a moment." },
                  { icon: Sparkles, title: "CONNECT", text: "Reconnect with yourself." },
                  { icon: Flower2, title: "ELEVATE", text: "Find beauty in the everyday." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title}>
                      <Icon className="mx-auto mb-4 text-[#E9D1A7]" size={25} />
                      <p className="text-[9px] tracking-[0.24em] text-[#E9D1A7]">
                        {item.title}
                      </p>
                      <p className="mt-3 text-xs text-[#F8F0E5]/75">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 08 — LATEST FROM THE JOURNAL */}
        <section
          id="latest-journal"
          className="scroll-mt-20 px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <SectionLabel>LATEST FROM THE JOURNAL</SectionLabel>
                <h2 className="font-serif text-4xl text-[#782C49] md:text-6xl">
                  A journal in the making.
                </h2>
              </div>

              <span className="inline-flex w-fit items-center gap-2 border border-[#B28B4E]/50 px-4 py-3 text-[8px] tracking-[0.2em] text-[#98754D]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B28B4E]" />
                COMING SOON
              </span>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative flex min-h-[390px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#E6D1B4] via-[#D4B68D] to-[#A98561] p-8 md:min-h-[470px] md:p-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full border border-white/35"
                />

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-5 top-5 h-[300px] w-[300px] rounded-full border border-dashed border-white/40"
                />

                <div className="relative z-10">
                  <p className="text-[9px] tracking-[0.3em] text-[#5E412B]">
                    THE SEVOURA JOURNAL
                  </p>
                  <p className="mt-6 font-serif text-5xl leading-tight text-[#4B3027] md:text-7xl">
                    New stories.
                    <br />
                    <span className="italic">New perspectives.</span>
                  </p>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <p className="max-w-xs text-xs leading-6 text-[#593E2D]">
                    Thoughtful ideas and inspiration are on their way.
                  </p>
                  <BookOpen size={36} strokeWidth={1} className="text-[#593E2D]" />
                </div>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex min-h-[200px] flex-col justify-between border border-[#D8C5A9] bg-[#F0E3D2] p-7"
                >
                  <div className="flex items-center justify-between">
                    <Moon size={26} strokeWidth={1} className="text-[#98754D]" />
                    <Clock3 size={16} className="text-[#98754D]" />
                  </div>
                  <div>
                    <p className="text-[8px] tracking-[0.25em] text-[#98754D]">
                      STORIES & PERSPECTIVES
                    </p>
                    <h3 className="mt-3 font-serif text-3xl text-[#782C49]">
                      Coming soon.
                    </h3>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex min-h-[200px] flex-col justify-between border border-[#D8C5A9] bg-[#E8D9CA] p-7"
                >
                  <div className="flex items-center justify-between">
                    <Sun size={26} strokeWidth={1} className="text-[#98754D]" />
                    <Sparkles size={16} className="text-[#98754D]" />
                  </div>
                  <div>
                    <p className="text-[8px] tracking-[0.25em] text-[#98754D]">
                      IDEAS & INSPIRATION
                    </p>
                    <h3 className="mt-3 font-serif text-3xl text-[#782C49]">
                      Stay inspired.
                    </h3>
                  </div>
                </motion.div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs leading-6 text-[#98754D]">
              New stories arriving soon. No published articles are available yet.
            </p>
          </div>
        </section>

        {/* 09 — TOPICS */}
        <section className="bg-[#F0E3D2] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl text-center">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionLabel>EXPLORE BY TOPIC</SectionLabel>

              <h2 className="font-serif text-4xl text-[#782C49] md:text-6xl">
                Follow your curiosity.
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#756253]">
                A few of the themes you can look forward to in the SEVOURA Journal.
              </p>
            </motion.div>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {topics.slice(0, 4).map((topic, index) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -6,
                    backgroundColor: "#782C49",
                    color: "#FFFFFF",
                  }}
                  className="border border-[#B28B4E]/60 bg-[#FBF5EC] px-6 py-5 text-[9px] tracking-[0.17em] text-[#782C49] transition-colors duration-300 md:px-9"
                >
                  {topic}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10 — NEWSLETTER */}
        <section className="relative overflow-hidden px-6 py-24 md:py-32">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#D9B477]/20 blur-[110px]" />
          <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#782C49]/10 blur-[110px]" />

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl overflow-hidden border border-[#D2B995] bg-[#FBF5EC] px-6 py-16 text-center shadow-[0_25px_80px_rgba(89,62,39,0.08)] md:px-16 md:py-24"
          >
            <div className="absolute inset-3 border border-[#D2B995]/50" />

            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#B28B4E]/50 text-[#98754D]"
              >
                <Mail size={27} strokeWidth={1} />
              </motion.div>

              <SectionLabel>STAY INSPIRED</SectionLabel>

              <h2 className="font-serif text-4xl leading-tight text-[#782C49] md:text-6xl">
                A little inspiration,
                <br />
                <span className="italic">delivered thoughtfully.</span>
              </h2>

              <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#756253]">
                Be the first to discover new stories, rituals, and journal
                updates from SEVOURA.
              </p>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="newsletter-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      aria-label="Your email address"
                      className="min-h-[58px] flex-1 border border-[#D5C2A7] bg-[#FFFDF8] px-5 text-sm text-[#392823] outline-none transition placeholder:text-[#A28E78] focus:border-[#782C49]"
                    />

                    <button
                      type="submit"
                      className="group inline-flex min-h-[58px] items-center justify-center gap-3 bg-[#782C49] px-8 text-[9px] font-semibold uppercase tracking-[0.17em] text-white transition-all hover:bg-[#572036]"
                    >
                      SIGN ME UP
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="newsletter-success"
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-3 border border-[#B28B4E]/40 bg-[#F0E3D2] px-5 py-6 text-sm text-[#782C49]"
                  >
                    <CheckCircle2 size={21} />
                    <span>
                      Thank you for joining the SEVOURA Journal. Stay inspired.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-7 text-[8px] uppercase tracking-[0.25em] text-[#98754D]">
                THOUGHTFULLY CURATED. ALWAYS SEVOURA.
              </p>
            </div>
          </motion.div>
        </section>

        {/* 11 — FINAL EDITORIAL STATEMENT */}
        <section className="relative overflow-hidden bg-[#EBDCC9] px-6 py-28 text-center md:py-36">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B28B4E]/20"
          />

          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <SectionLabel>THE SEVOURA JOURNAL</SectionLabel>

            <p className="font-serif text-4xl leading-tight text-[#782C49] md:text-7xl">
              A world of fragrance.
              <br />
              A world of rituals.
              <br />
              <span className="italic">A world of inspiration.</span>
            </p>

            <div className="mx-auto my-9 h-px w-20 bg-[#B28B4E]" />

            <p className="text-[9px] uppercase tracking-[0.35em] text-[#98754D]">
              CLEANSE. ELEVATE. RADIATE.
            </p>

            <Link
              href="/shop"
              className="group mt-9 inline-flex items-center gap-4 bg-[#782C49] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-1 hover:bg-[#572036]"
            >
              DISCOVER SEVOURA
              <MoveUpRight
                size={15}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}