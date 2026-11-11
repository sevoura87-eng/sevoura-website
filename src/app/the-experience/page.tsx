"use client";

import { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import ProductTrio from "@/components/ui/ProductTrio";
import ProductPhoto from "@/components/ProductPhoto";
import Link from "next/link";
import {
  motion,


  AnimatePresence,
} from "framer-motion";
import {

  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Flower2,
  Heart,
  Orbit,
  Wind,
  HandHeart,
  Stars,
  Gem,
  Droplets,
  Plus,
  Minus,
} from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Ornament from "@/components/ui/Ornament";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 38 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const moments = [
  {
    number: "01",
    title: "Pause",
    copy: "Leave a little space between everything you need to do and the moment you are in.",
    icon: Wind,
  },
  {
    number: "02",
    title: "Discover",
    copy: "Let fragrance become a small invitation to explore your mood, your pace and your personal expression.",
    icon: Flower2,
  },
  {
    number: "03",
    title: "Make it yours",
    copy: "Create a ritual that feels natural to you. No rules, no rush—just a moment that belongs to you.",
    icon: Heart,
  },
];

const pillars = [
  {
    number: "01",
    title: "A considered beginning",
    copy: "Every experience begins with intention. A quiet moment to slow down, take a breath and choose how you want to feel.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "A world of fragrance",
    copy: "Explore distinctive fragrance identities shaped around the symbolism and character of the seven days.",
    icon: Droplets,
  },
  {
    number: "03",
    title: "Your own rhythm",
    copy: "Some days call for calm. Others ask for confidence, clarity or a little radiance. Let your ritual move with you.",
    icon: Orbit,
  },
  {
    number: "04",
    title: "A moment remembered",
    copy: "The smallest rituals can become the moments you look forward to—the ones that gently bring you back to yourself.",
    icon: Gem,
  },
];

const questions = [
  {
    q: "What makes the SEVOURA experience different?",
    a: "SEVOURA brings fragrance and intentional everyday moments together. The experience is inspired by the symbolism traditionally associated with the seven days of the week.",
  },
  {
    q: "Do I need a set routine to enjoy it?",
    a: "Not at all. Begin with a moment that feels right for you. Your ritual can be as simple, personal and flexible as you want it to be.",
  },
  {
    q: "How do I discover the fragrance that suits me?",
    a: "Explore THE SEVEN collection or use the Ritual Finder to discover a fragrance identity connected to the mood or energy you are drawn to.",
  },
];

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.34em] ${
        light ? "text-[#F8EBDD]/75" : "text-[#A47A40]"
      }`}
    >
      <span className={`h-px w-8 ${light ? "bg-[#F8EBDD]/65" : "bg-[#B28B4E]"}`} />
      {children}
      <span className={`h-px w-8 ${light ? "bg-[#F8EBDD]/65" : "bg-[#B28B4E]"}`} />
    </div>
  );
}

function GoldOrbitArtwork() {
  return (
    <div className="relative">
      <ProductPhoto day="Friday" fragrance="Rose" notes="Neroli · Musk · Woods" sizes="(min-width:768px) 45vw, 92vw" className="aspect-[4/5]" />
      <div aria-hidden className="pointer-events-none absolute inset-4 border border-[#F7F0E6]/50" />
    </div>
  );
}

function NumberedMoment({
  number,
  title,
  copy,
  icon: Icon,
}: {
  number: string;
  title: string;
  copy: string;
  icon: React.ElementType;
}) {
  return (
    <motion.article
      variants={reveal}
      whileHover={{ y: -7 }}
      className="group relative border-t border-[#CDB895] py-8 md:py-10"
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <span className="inline-block text-[#A47A40]"><Ornament size={14} /></span>
          <h3 className="mt-5 font-serif text-3xl text-[#782C49] md:text-4xl">{title}</h3>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#B28B4E]/45 text-[#A47A40] transition-all duration-500 group-hover:rotate-12 group-hover:bg-[#782C49] group-hover:text-[#F8EBDD]">
          <Icon size={21} strokeWidth={1.1} />
        </div>
      </div>
      <p className="mt-5 max-w-md text-[15px] leading-7 text-[#756253]">{copy}</p>
    </motion.article>
  );
}

function ExperiencePillar({
  number,
  title,
  copy,
  icon: Icon,
}: {
  number: string;
  title: string;
  copy: string;
  icon: React.ElementType;
}) {
  return (
    <motion.article
      variants={reveal}
      whileHover={{ y: -8 }}
      className="group relative min-h-[300px] overflow-hidden border border-[#E8D7C1]/25 bg-[#F8EBDD]/[0.06] p-8 transition-colors duration-500 hover:bg-[#F8EBDD]/[0.11] md:p-9"
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#F8EBDD]/10 transition-transform duration-700 group-hover:scale-125" />
      <div className="relative flex items-center justify-between">
        <span className="text-[#E8C99A]/75"><Ornament size={20} /></span>
        <Icon size={25} strokeWidth={1} className="text-[#E8C99A]" />
      </div>
      <h3 className="relative mt-12 font-serif text-3xl text-[#F8EBDD]">{title}</h3>
      <p className="relative mt-5 text-[15px] leading-7 text-[#F8EBDD]/70">{copy}</p>
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#E8C99A] transition-all duration-700 group-hover:w-full" />
    </motion.article>
  );
}

export default function TheExperiencePage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip bg-[#F8F0E5] text-[#392823]">
        {/* HERO — burgundy stage, peach typography, original gold planet colours */}
        <PageHero
          eyebrow="THE SEVOURA EXPERIENCE"
          title="More than"
          accent="a fragrance."
          intro={<>A thoughtful approach to fragrance — the details, rituals and little moments that turn an everyday routine into something truly personal.</>}
          primary={{ label: "DISCOVER THE EXPERIENCE", href: "#the-ritual" }}
          secondary={{ label: "FIND YOUR RITUAL", href: "/ritual-finder" }}
          footnote="SENSE · FEEL · REMEMBER"
          artNode={<ProductTrio days={["Tuesday", "Monday", "Saturday"]} />}
        />

        {/* INTRO — asymmetric editorial layout */}
        <section id="the-ritual" className="scroll-mt-20 px-6 py-24 md:py-36">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <Eyebrow>A THOUGHTFUL APPROACH</Eyebrow>
              <p className="font-serif text-5xl leading-[1.08] text-[#782C49] md:text-6xl">
                The beauty is
                <br />
                in the
                <br />
                <span className="italic">in-between.</span>
              </p>
              <div className="mt-9 h-px w-20 bg-[#B28B4E]" />
              <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#98754D]">
                SLOW DOWN · TUNE IN · FEEL MORE
              </p>
            </motion.div>
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="pt-2 lg:pt-20"
            >
              <p className="font-serif text-3xl leading-relaxed text-[#51372F] md:text-5xl">
                We believe the everyday deserves a little ceremony.
              </p>
              <p className="mt-8 max-w-2xl text-[15px] leading-8 text-[#756253] md:text-base">
                A familiar morning. A quiet evening. The pause before you step
                into a new day. These moments may seem small, but they are
                often the ones that shape how we feel.
              </p>
              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#756253] md:text-base">
                SEVOURA brings fragrance into these spaces—not as another task
                on your list, but as an invitation to be present. To choose a
                feeling, follow your own rhythm and make an ordinary moment
                feel a little more meaningful.
              </p>
              <Link
                href="/our-story"
                className="group mt-9 inline-flex items-center gap-4 border-b border-[#782C49] pb-3 text-[12px] uppercase tracking-[0.2em] text-[#782C49]"
              >
                THE STORY BEHIND SEVOURA
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* A THREE-PART MOMENT */}
        <section className="bg-[#F0E3D2] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto mb-14 max-w-3xl text-center"
            >
              <Eyebrow>THE ART OF MAKING A MOMENT</Eyebrow>
              <h2 className="font-serif text-4xl leading-tight text-[#782C49] md:text-6xl">
                A little ritual can
                <br />
                <span className="italic">change the feeling of a day.</span>
              </h2>
            </motion.div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-8 md:grid-cols-3 md:gap-12"
            >
              {moments.map((moment) => (
                <NumberedMoment key={moment.number} {...moment} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* PHILOSOPHY VISUAL SPLIT */}
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <GoldOrbitArtwork />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <Eyebrow>THE SEVOURA PHILOSOPHY</Eyebrow>
              <h2 className="font-serif text-5xl leading-[1.08] text-[#782C49] md:text-7xl">
                A ritual,
                <br />
                <span className="italic">uniquely yours.</span>
              </h2>
              <div className="my-8 h-px w-20 bg-[#B28B4E]" />
              <p className="text-[15px] leading-8 text-[#756253] md:text-base">
                Inspired by the rhythm of the week and the symbolism
                traditionally associated with the planets, the SEVOURA world
                invites you to find a fragrance expression that feels connected
                to your own pace and personality.
              </p>
              <p className="mt-5 text-[15px] leading-8 text-[#756253] md:text-base">
                There is no one perfect way to experience a ritual. It can be
                grounding, uplifting, reflective or simply a beautiful pause.
                The meaning comes from the intention you bring to it.
              </p>
              <Link
                href="/the-seven"
                className="group mt-9 inline-flex items-center gap-4 border-b border-[#782C49] pb-3 text-[12px] uppercase tracking-[0.2em] text-[#782C49]"
              >
                EXPLORE THE SEVEN
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* BURGUNDY EXPERIENCE PILLARS */}
        <section className="relative overflow-hidden bg-[#782C49] px-6 py-24 md:py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute -right-56 -top-56 h-[700px] w-[700px] rounded-full border border-[#F8EBDD]/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-64 -left-56 h-[650px] w-[650px] rounded-full border border-[#F8EBDD]/10"
          />
          <div className="relative mx-auto max-w-7xl">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16 max-w-3xl"
            >
              <Eyebrow light>THE DETAILS THAT MATTER</Eyebrow>
              <h2 className="font-serif text-5xl leading-tight text-[#F8EBDD] md:text-7xl">
                Thoughtful by nature.
                <br />
                <span className="italic text-[#E8C99A]">Personal by design.</span>
              </h2>
              <p className="mt-7 max-w-xl text-[15px] leading-8 text-[#F8EBDD]/75 md:text-base">
                The SEVOURA experience is built around a few simple ideas:
                intention, discovery, personal expression and the joy of
                making time for yourself.
              </p>
            </motion.div>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {pillars.map((pillar) => (
                <ExperiencePillar key={pillar.number} {...pillar} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* THE SEVEN DAYS — editorial timeline */}
        <section className="px-6 py-24 md:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Eyebrow>INSPIRED BY THE WEEK</Eyebrow>
                <h2 className="font-serif text-5xl leading-[1.08] text-[#782C49] md:text-7xl">
                  Seven days.
                  <br />
                  <span className="italic">Seven ways</span>
                  <br />
                  to feel.
                </h2>
                <p className="mt-8 text-[15px] leading-8 text-[#756253] md:text-base">
                  Each day carries its own traditional planetary symbolism and
                  mood. Explore the collection as a personal journey through
                  seven distinct fragrance identities.
                </p>
                <Link
                  href="/the-seven"
                  className="group mt-8 inline-flex items-center gap-4 bg-[#782C49] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-1 hover:bg-[#572036]"
                >
                  MEET THE SEVEN
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <div className="relative">
                <div className="absolute bottom-8 left-[19px] top-8 w-px bg-[#D3B994] md:left-[27px]" />
                {[
                  ["MONDAY", "A moment for calm", "Moon"],
                  ["TUESDAY", "A spark of courage", "Mars"],
                  ["WEDNESDAY", "Space for clarity", "Mercury"],
                  ["THURSDAY", "Room to grow", "Jupiter"],
                  ["FRIDAY", "An expression of love", "Venus"],
                  ["SATURDAY", "A sense of grounding", "Saturn"],
                  ["SUNDAY", "A little radiance", "Sun"],
                ].map(([day, mood, planet], index) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07, duration: 0.65 }}
                    className="group relative flex items-center gap-6 border-b border-[#DCCBB3] py-5 md:gap-9 md:py-6"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B28B4E] bg-[#F8F0E5] text-[12px] text-[#A47A40] transition-all duration-500 group-hover:bg-[#782C49] group-hover:text-[#F8EBDD] md:h-14 md:w-14">
                      <Ornament size={12} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#A47A40]">{day} · {planet}</p>
                      <h3 className="mt-1 font-serif text-2xl text-[#782C49] md:text-3xl">{mood}</h3>
                    </div>
                    <ArrowUpRight size={17} className="text-[#A47A40] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PAUSE / QUOTE PANEL */}
        <section className="relative overflow-hidden bg-[#EBDCC9] px-6 py-24 md:py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 aspect-square h-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B28B4E]/20"
          />
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mx-auto max-w-5xl text-center"
          >
            <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#B28B4E]/50 text-[#A47A40]">
              <HandHeart size={25} strokeWidth={1} />
            </div>
            <Eyebrow>A GENTLE REMINDER</Eyebrow>
            <p className="font-serif text-4xl leading-tight text-[#782C49] md:text-7xl">
              You do not have to
              <br />
              <span className="italic">make every moment count.</span>
            </p>
            <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-8 text-[#756253] md:text-base">
              Sometimes it is enough to simply notice it. A breath. A familiar
              scent. A few minutes that are entirely your own.
            </p>
          </motion.div>
        </section>

        {/* HOW TO BEGIN */}
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <Eyebrow>BEGIN WHERE YOU ARE</Eyebrow>
              <h2 className="font-serif text-5xl leading-tight text-[#782C49] md:text-7xl">
                Find your
                <br />
                <span className="italic">own kind of ritual.</span>
              </h2>
              <p className="mt-7 text-[15px] leading-8 text-[#756253] md:text-base">
                You might be drawn to a feeling of calm, a moment of confidence
                or the promise of a fresh start. Explore the seven fragrance
                identities and discover the one that resonates with you today.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["CALM", "CLARITY", "COURAGE", "LOVE", "RADIANCE"].map((word) => (
                  <span key={word} className="border border-[#D2B995] px-4 py-2 text-[10px] tracking-[0.2em] text-[#98754D]">
                    {word}
                  </span>
                ))}
              </div>
              <Link
                href="/ritual-finder"
                className="group mt-9 inline-flex items-center gap-4 bg-[#782C49] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-1 hover:bg-[#572036]"
              >
                FIND YOUR RITUAL
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative overflow-hidden border border-[#D2B995] bg-gradient-to-br from-[#EBD9BE] via-[#F8EBDD] to-[#D2B28A] p-7 md:p-12"
            >
              <div className="absolute inset-4 border border-[#A47A40]/30" />
              <div className="relative flex min-h-[380px] flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute aspect-square h-[300px] rounded-full border border-[#A47A40]/35"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                  className="absolute aspect-square h-[220px] rounded-full border border-dashed border-[#A47A40]/40"
                />
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#A47A40]/40 bg-[#FFF8EC]/75 text-[#A47A40] shadow-[0_30px_60px_-32px_rgba(46,10,25,.35)]">
                  <Stars size={40} strokeWidth={1} />
                </div>
                <p className="relative z-10 mt-8 font-serif text-3xl tracking-[0.2em] text-[#782C49]">SEVOURA</p>
                <p className="relative z-10 mt-2 text-[10px] uppercase tracking-[0.35em] text-[#98754D]">SEVEN DAYS · SEVEN EXPRESSIONS</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#F0E3D2] px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Eyebrow>GOOD TO KNOW</Eyebrow>
              <h2 className="font-serif text-5xl leading-tight text-[#782C49] md:text-6xl">
                A few things
                <br />
                <span className="italic">you may wonder.</span>
              </h2>
              <p className="mt-7 max-w-sm text-[15px] leading-8 text-[#756253]">
                A little more about the ideas behind the SEVOURA experience.
              </p>
            </motion.div>
            <div className="border-t border-[#D3B994]">
              {questions.map((item, index) => {
                const isOpen = openQuestion === index;
                return (
                  <div key={item.q} className="border-b border-[#D3B994]">
                    <button
                      type="button"
                      onClick={() => setOpenQuestion(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-serif text-xl text-[#782C49] md:text-2xl">{item.q}</span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#B28B4E]/50 text-[#A47A40]">
                        {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 pr-10 text-[15px] leading-7 text-[#756253]">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-[#782C49] px-6 py-28 text-center md:py-36">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 85, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 aspect-square h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F8EBDD]/15"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 aspect-square h-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#F8EBDD]/15"
          />
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <Eyebrow light>THE SEVOURA EXPERIENCE</Eyebrow>
            <p className="font-serif text-5xl leading-tight text-[#F8EBDD] md:text-7xl">
              Discover the beauty
              <br />
              <span className="italic text-[#E8C99A]">of your own ritual.</span>
            </p>
            <div className="mx-auto my-9 h-px w-20 bg-[#E8C99A]" />
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#F8EBDD]/75">
              CLEANSE. ELEVATE. RADIATE.
            </p>
            <Link
              href="/shop"
              className="group mt-9 inline-flex items-center gap-4 bg-[#F8EBDD] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#782C49] transition-all hover:-translate-y-1 hover:bg-[#F1DCCB]"
            >
              DISCOVER SEVOURA
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
