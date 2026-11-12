"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

/* The SEVOURA philosophy told as a three-movement campaign: the light grows from a quiet pearl to a full sun. */
const CHAPTERS = [
  {
    word: "Cleanse",
    label: "THE PAUSE",
    text: "Create a moment of pause. Step away from the noise and return to what feels meaningful.",
    img: "/images/ritual-cleanse.jpg",
  },
  {
    word: "Elevate",
    label: "THE INTENTION",
    text: "Bring intention to the everyday. Let your personal rituals become expressions of who you are.",
    img: "/images/ritual-elevate.jpg",
  },
  {
    word: "Radiate",
    label: "THE EXPRESSION",
    text: "Carry your individuality with confidence. Celebrate the qualities that make your expression your own.",
    img: "/images/ritual-radiate.jpg",
  },
];

/* desktop: one pinned stage whose light, colour and words move with the scroll */
function Stage() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(2, Math.max(0, Math.floor(v * 3.05)))));

  const bg = useTransform(scrollYProgress, [0, 0.4, 0.6, 0.66, 0.7], ["#F3EADD", "#EBDBC2", "#E3CDAA", "#5A1F36", "#2E0F1D"]);
  const ink = useTransform(scrollYProgress, [0.62, 0.67], ["#3A1626", "#F7F0E6"]);
  const soft = useTransform(scrollYProgress, [0.62, 0.67], ["#6B5650", "#E2CBB8"]);
  const gold = useTransform(scrollYProgress, [0.62, 0.67], ["#A77B4D", "#D6A64F"]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-4%", "4%"]);
  const fade = useTransform(bg, (c) => `linear-gradient(90deg, transparent, ${c})`);

  return (
    <motion.section ref={root} style={{ backgroundColor: bg }} className="relative hidden h-[330vh] lg:block" aria-labelledby="ritual-title">
      <div className="sticky top-0 flex h-screen overflow-hidden">
        {/* the photograph, bleeding off the left edge */}
        <div className="relative h-full w-[46%] shrink-0 overflow-hidden">
          <motion.div style={{ y: drift }} className="absolute inset-[-5%]">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 1.1, ease }, scale: { duration: 2.4, ease } }}
                className="absolute inset-0"
              >
                <Image src={CHAPTERS[active].img} alt="" fill sizes="46vw" className="object-cover object-[50%_45%]" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {/* the image dissolves into the page instead of ending in a hard edge */}
          <motion.div aria-hidden className="absolute inset-y-0 right-0 w-1/3" style={{ background: fade }} />
        </div>

        {/* the words */}
        <div className="relative flex min-w-0 flex-1 flex-col justify-center py-16 pl-4 pr-16 xl:pr-24">
          <motion.p style={{ color: gold }} className="flex items-center gap-4 text-[12px] font-medium tracking-[0.34em]">
            <motion.span style={{ backgroundColor: gold }} className="h-px w-10" /> THE SEVOURA PHILOSOPHY
          </motion.p>
          <motion.h2 id="ritual-title" style={{ color: ink }} className="mt-6 font-display text-[clamp(2.2rem,3.4vw,3.4rem)] font-medium leading-[1.02]">
            A ritual, rooted <span className="italic">in meaning.</span>
          </motion.h2>

          <ol className="mt-[6vh] space-y-[1.5vh]">
            {CHAPTERS.map((c, i) => (
              <li key={c.word} style={{ paddingLeft: `${i * 9}%` }}>
                <motion.span
                  animate={{ opacity: i === active ? 1 : 0.16, x: i === active ? 0 : -10 }}
                  transition={{ duration: 0.9, ease }}
                  style={{ color: i === active ? (i === 2 ? gold : ink) : ink }}
                  className="block font-display text-[clamp(4.2rem,8.4vw,8.6rem)] font-medium italic leading-[0.92] tracking-[-0.02em]"
                >
                  {c.word}.
                </motion.span>
              </li>
            ))}
          </ol>

          <div className="relative mt-[5vh] h-[132px] max-w-[440px]" style={{ marginLeft: `${active * 9}%`, transition: "margin-left .9s cubic-bezier(.22,1,.36,1)" }}>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease }}>
                <motion.p style={{ color: gold }} className="text-[12px] font-semibold tracking-[0.3em]">
                  {CHAPTERS[active].label}
                </motion.p>
                <motion.p style={{ color: soft }} className="mt-4 text-[18px] leading-8">
                  {CHAPTERS[active].text}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* progress */}
          <div aria-hidden className="absolute bottom-[14vh] right-10 top-[14vh] w-px bg-[#A77B4D]/25 xl:right-14">
            <motion.span style={{ height: progress, backgroundColor: gold }} className="absolute left-0 top-0 w-px" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* mobile & tablet: three asymmetric chapters that flow into the burgundy section below */
function Chapters() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F3EADD_0%,#EADAC0_58%,#2E0F1D_100%)] pb-24 pt-20 lg:hidden" aria-labelledby="ritual-title-m">
      <div className="px-6 md:px-12">
        <p className="flex items-center gap-4 text-[12px] font-medium tracking-[0.34em] text-[#A77B4D]">
          <span className="h-px w-10 bg-[#A77B4D]" /> THE SEVOURA PHILOSOPHY
        </p>
        <h2 id="ritual-title-m" className="mt-6 font-display text-[clamp(2.6rem,9vw,4.2rem)] font-medium leading-[1] text-[#3A1626]">
          A ritual, rooted <span className="italic">in meaning.</span>
        </h2>
      </div>
      {/* each chapter is a plain vertical flow — image, then word, then label and text — so nothing ever sits on the photograph */}
      <div className="mt-14 space-y-16 md:space-y-24">
        {CHAPTERS.map((c, i) => {
          const right = i % 2 === 1;
          const last = i === 2;
          return (
            <motion.article key={c.word} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease }} className="flex flex-col">
              <div className={`relative aspect-[4/5] overflow-hidden md:aspect-[4/3] ${right ? "ml-[10%] md:ml-[24%]" : "mr-[10%] md:mr-[24%]"}`}>
                <Image src={c.img} alt="" fill sizes="(min-width:768px) 76vw, 90vw" className="object-cover" />
              </div>
              <div className={`px-6 pt-6 md:px-12 md:pt-8 ${right ? "text-left" : "text-right"}`}>
                <h3 className={`font-display text-[clamp(3.4rem,15vw,6.5rem)] font-medium italic leading-[1.05] tracking-[-0.01em] ${last ? "text-[#E2B45E]" : "text-[#3A1626]"}`}>
                  {c.word}.
                </h3>
                <div className={`mt-4 max-w-[460px] ${right ? "" : "ml-auto"}`}>
                  <p className={`text-[12px] font-semibold tracking-[0.3em] ${last ? "text-[#D6A64F]" : "text-[#A77B4D]"}`}>{c.label}</p>
                  <p className={`mt-3 text-[16px] leading-7 md:text-[17px] md:leading-8 ${last ? "text-[#E8D3C3]" : "text-[#5E4A44]"}`}>{c.text}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default function RitualStory() {
  return (
    <>
      <Stage />
      <Chapters />
      <div className="bg-[#2E0F1D] px-6 pb-4 text-center lg:pt-2">
        <Link href="/the-seven" className="group inline-flex items-center gap-3 border-b border-[#D6A64F]/50 pb-2 text-[12px] font-semibold tracking-[0.26em] text-[#F0D69A] transition-colors hover:border-[#F0D69A]">
          BEGIN YOUR RITUAL <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
}
