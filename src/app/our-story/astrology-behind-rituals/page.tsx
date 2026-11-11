
"use client";

import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Image from "next/image";
import { motion } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Ornament from "@/components/ui/Ornament";

const days = [
  {
    day: "MONDAY",
    planet: "MOON",
    hindi: "CHANDRA",
    symbol: "☾",
    title: "The Art of Calm",
    subtitle: "A moment to return to yourself.",
    description:
      "Monday begins the weekly journey with the symbolism of the Moon. Traditionally associated with emotions, intuition and inner reflection, its energy inspires a softer beginning to the week.",
    intention: "Embrace calm. Find your balance.",
    notes: "Jasmine · Green Tea · White Musk",
    color: "#D8C9B6",
  },
  {
    day: "TUESDAY",
    planet: "MARS",
    hindi: "MANGALA",
    symbol: "♂",
    title: "The Courage to Begin",
    subtitle: "Move forward with intention.",
    description:
      "Mars represents courage, determination and action. Tuesday becomes a reminder to meet your ambitions with confidence and to move through the day with purpose.",
    intention: "Embrace courage. Move with confidence.",
    notes: "Clove · Rose · Woods · Spice",
    color: "#B77A65",
  },
  {
    day: "WEDNESDAY",
    planet: "MERCURY",
    hindi: "BUDHA",
    symbol: "☿",
    title: "The Clarity Within",
    subtitle: "Make space for thoughtful moments.",
    description:
      "Mercury is traditionally associated with communication, intellect and expression. Wednesday celebrates curiosity, clear thinking and the beauty of a focused mind.",
    intention: "Embrace clarity. Express yourself.",
    notes: "Green Tea · Rose · Amber",
    color: "#A6A98B",
  },
  {
    day: "THURSDAY",
    planet: "JUPITER",
    hindi: "GURU",
    symbol: "♃",
    title: "The Spirit of Growth",
    subtitle: "Make room for possibility.",
    description:
      "Jupiter symbolises wisdom, expansion and abundance. Thursday invites you to look beyond the ordinary, welcome learning and approach new possibilities with optimism.",
    intention: "Embrace growth. Welcome abundance.",
    notes: "Vanilla · Cocoa · Amber",
    color: "#C7A36E",
  },
  {
    day: "FRIDAY",
    planet: "VENUS",
    hindi: "SHUKRA",
    symbol: "♀",
    title: "The Beauty of Being",
    subtitle: "Celebrate the art of self-expression.",
    description:
      "Venus is associated with beauty, love, harmony and pleasure. Friday is an invitation to appreciate the little things and reconnect with the beauty in everyday life.",
    intention: "Embrace beauty. Celebrate connection.",
    notes: "Rose · Neroli · Musk · Woods",
    color: "#C18B91",
  },
  {
    day: "SATURDAY",
    planet: "SATURN",
    hindi: "SHANI",
    symbol: "♄",
    title: "The Strength of Stillness",
    subtitle: "Find strength in grounding yourself.",
    description:
      "Saturn represents discipline, patience and responsibility. Saturday encourages a thoughtful pause, a return to what matters and an appreciation of steady progress.",
    intention: "Embrace patience. Stay grounded.",
    notes: "Vetiver · Patchouli · Cedarwood · Musk",
    color: "#77766C",
  },
  {
    day: "SUNDAY",
    planet: "SUN",
    hindi: "SURYA",
    symbol: "☉",
    title: "The Light Within",
    subtitle: "Step into your own radiance.",
    description:
      "The Sun symbolises vitality, confidence and life. Sunday closes the cycle with a reminder to celebrate your individuality and carry your light into the days ahead.",
    intention: "Embrace radiance. Celebrate yourself.",
    notes: "Saffron · Sandalwood · Vanilla · Dry Woods",
    color: "#C49B56",
  },
];

const rise = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: "easeOut" as const },
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.34em] text-[#A88762] md:text-[12px]">
      {children}
    </p>
  );
}

function PlanetArtwork() {
  return (
    <div className="relative aspect-[5/6] w-full overflow-hidden">
      <Image src="/images/sevoura-orbit-ivory.jpg" alt="" fill sizes="(min-width:768px) 45vw, 92vw" className="object-cover" />
      <div aria-hidden className="pointer-events-none absolute inset-4 border border-[#A77B4D]/40" />
    </div>
  );
}

export default function AstrologyBehindRitualsPage() {
  return (
    <main className="overflow-x-clip bg-[#F7F0E6] text-[#5B2038]">
      <SiteHeader />

      {/* 01 — HERO */}
      <PageHero
        eyebrow="SEVEN DAYS · SEVEN RITUALS"
        title="The astrology"
        accent="behind the rituals."
        intro={<>An ancient planetary order, reimagined through the art of fragrance.</>}
        primary={{ label: "DISCOVER THE STORY", href: "#ancient-connection" }}
        secondary={{ label: "MEET THE SEVEN", href: "/the-seven" }}
        art="/images/sevoura-orbit-moon.jpg"
        reverse
      />

      {/* 02 — ANCIENT CONNECTION */}
      <section
        id="ancient-connection"
        className="bg-[#F7F0E6] px-6 py-28 md:py-36"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={rise}
          className="mx-auto max-w-4xl text-center"
        >
          <SectionLabel>THE ANCIENT CONNECTION</SectionLabel>

          <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
            A Week Written in the Stars
          </h2>

          <div className="mx-auto mt-9 h-px w-20 bg-[#B99B76]" />

          <p className="mt-9 text-[15px] leading-8 text-[#705C52] md:text-base md:leading-9">
            In Indian astrological tradition, the seven days of the week are
            associated with seven celestial rulers—Surya (Sun), Chandra (Moon),
            Mangala (Mars), Budha (Mercury), Guru (Jupiter), Shukra (Venus), and
            Shani (Saturn).
          </p>

          <p className="mt-7 text-[15px] leading-8 text-[#705C52] md:text-base md:leading-9">
            Known through the tradition of <i>Vara</i> (weekday) associations,
            this ancient cycle connects the passage of time with distinct
            planetary symbolism.
          </p>

          <p className="mt-7 font-serif text-xl italic text-[#A17D5D] md:text-2xl">
            Seven days. Seven celestial identities. One timeless connection.
          </p>
        </motion.div>
      </section>

      {/* 03 — THE IDEA */}
      <section className="bg-[#FCF9F3] px-6 py-28 md:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={rise}
          className="mx-auto max-w-3xl"
        >
          <div className="text-center">
            <SectionLabel>THE IDEA</SectionLabel>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Seven Days.
              <br />
              Seven Rituals.
            </h2>
          </div>

          <div className="mt-12 space-y-7 text-[15px] leading-8 text-[#705C52] md:text-[15px] md:leading-9">
            <p>
              For centuries, the rhythm of the seven days has been intertwined
              with the symbolism of the celestial bodies in Indian astrological
              tradition—each day carrying its own distinctive meaning and energy.
            </p>

            <p>
              Inspired by this timeless connection between the cosmos, time,
              and human experience,{" "}
              <strong className="text-[#5B2038]">
                SEVOURA reimagines an ancient planetary order through the art
                of fragrance.
              </strong>
            </p>

            <blockquote className="my-12 border-l border-[#B38B57] py-3 pl-7 font-serif text-xl italic leading-relaxed text-[#80685C] md:text-2xl">
              What if the fragrance you choose could be more than a scent?
              <br />
              What if it could reflect the feeling you wish to embrace, the
              energy you seek, or the intention you carry into your day?
            </blockquote>

            <p>
              Introducing{" "}
              <strong className="text-[#5B2038]">
                SEVOURA&apos;s Seven Planetary Blend Collection
              </strong>
              —seven distinctive, alcohol-free fragrances, each inspired by
              the traditional symbolism of its ruling planet.
            </p>

            <p>
              An ancient concept, thoughtfully reimagined for the modern ritual
              of self-expression.
            </p>

            <blockquote className="mt-12 border-l border-[#B38B57] py-3 pl-7 font-serif text-lg italic text-[#80685C] md:text-xl">
              A Fragrance Ritual. Inspired by Astrology. Guided by Your Intention.
            </blockquote>
          </div>
        </motion.div>
      </section>

      {/* 04 — WHY SEVEN */}
      <section className="bg-[#5B2038] px-6 py-28 text-[#F7EEE2] md:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={rise}
          className="mx-auto max-w-6xl"
        >
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>WHY SEVEN?</SectionLabel>
            <h2 className="mt-5 font-serif text-4xl md:text-6xl">
              A Cycle. A Meaning. A Ritual.
            </h2>

            <p className="mt-8 text-[13px] leading-7 text-[#E4D2C5] md:text-[15px] md:leading-8">
              In Indian astrological tradition, each day of the week is
              associated with a different planetary ruler—each carrying its
              own symbolism and distinctive identity. This timeless connection
              between the days, the planets, and their symbolism inspires the
              very essence of SEVOURA.
            </p>

            <p className="mt-6 text-[13px] leading-7 text-[#E4D2C5] md:text-[15px] md:leading-8">
              Not seven fragrances brought together by chance, but seven
              expressions of one connected idea: the relationship between
              the day, its planetary symbolism, and the fragrance it inspires.
            </p>

            <p className="mt-6 text-[13px] leading-7 text-[#E4D2C5] md:text-[15px] md:leading-8">
              A concept where ancient tradition meets modern self-expression—and
              every day becomes an opportunity to embrace a different feeling.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "The Rhythm",
                sub: "Seven Days",
                text: "A familiar rhythm of time. Each day, a new beginning. Each day, its own possibility.",
              },
              {
                n: "02",
                title: "The Symbolism",
                sub: "Seven Identities",
                text: "Inspired by the traditional planetary associations that lend every day its distinctive symbolic character.",
              },
              {
                n: "03",
                title: "The Expression",
                sub: "One Connected Story",
                text: "Seven distinctive fragrance blends, united by a singular vision—transforming an ancient planetary cycle into a contemporary fragrance ritual.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                whileHover={{ y: -9 }}
                className="border border-[#A77E68]/45 bg-[#792D49] px-7 py-10 text-center transition-colors duration-500 hover:bg-[#93445F]"
              >
                <span className="flex justify-center text-[#D7B98E]"><Ornament size={18} /></span>
                <h3 className="mt-5 font-serif text-2xl">{item.title}</h3>
                <p className="mt-4 text-[12px] font-semibold text-[#E7CBA8]">
                  {item.sub}
                </p>
                <p className="mt-4 text-[13px] leading-6 text-[#E8D9CE]">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-center font-serif text-lg italic text-[#D7B98E] md:text-xl">
            Seven days. Seven identities. One extraordinary ritual.
          </p>
        </motion.div>
      </section>

      {/* 05 — SEVEN PLANETARY DAYS */}
      <section className="bg-[#F3EBDD] px-6 py-28 md:py-36">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rise}
            className="mx-auto max-w-3xl text-center"
          >
            <SectionLabel>THE SEVEN PLANETARY EXPRESSIONS</SectionLabel>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Seven Days. Seven Energies.
            </h2>
            <p className="mt-7 text-[15px] leading-8 text-[#705C52]">
              Each day carries a different traditional symbolism. Explore the
              seven inspirations behind the SEVOURA collection and discover
              the intention that speaks to your day.
            </p>
          </motion.div>

          <div className="mt-20 space-y-6">
            {days.map((item, i) => (
              <motion.article
                key={item.day}
                initial={{ opacity: 0, x: i % 2 === 0 ? -45 : 45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="group grid overflow-hidden border border-[#D8C8B5] bg-[#FAF6EF] md:grid-cols-[230px_1fr]"
              >
                <div className="relative flex min-h-[210px] flex-col items-center justify-center overflow-hidden bg-[#5B2038] p-8 text-center text-[#F6EBDD]">
                  <div className="absolute inset-4 rounded-full border border-[#D3B68C]/20" />
                  <div className="absolute inset-8 rounded-full border border-[#D3B68C]/15" />
                  <motion.div
                    whileHover={{ rotate: 18, scale: 1.12 }}
                    className="relative font-serif text-6xl text-[#D8B88A]"
                  >
                    {item.symbol}
                  </motion.div>
                  <p className="relative mt-5 text-[11px] tracking-[0.3em] text-[#E1C8A3]">
                    {item.day}
                  </p>
                  <p className="relative mt-2 font-serif text-lg">
                    {item.planet}
                  </p>
                  <p className="relative mt-1 text-[11px] tracking-[0.2em] text-[#D7C0AE]">
                    {item.hindi}
                  </p>
                </div>

                <div className="flex flex-col justify-center p-7 md:p-11">
                  <p className="text-[11px] tracking-[0.28em] text-[#A88762]">
                    THE {item.planet} INSPIRATION
                  </p>
                  <h3 className="mt-3 font-serif text-3xl md:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-serif text-base italic text-[#9B7C62]">
                    {item.subtitle}
                  </p>
                  <p className="mt-5 max-w-2xl text-[13px] leading-7 text-[#705C52] md:text-[15px] md:leading-8">
                    {item.description}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#DED1C1] pt-5">
                    <div>
                      <p className="text-[11px] tracking-[0.2em] text-[#A88762]">
                        YOUR DAILY INTENTION
                      </p>
                      <p className="mt-2 font-serif text-base italic">
                        {item.intention}
                      </p>
                    </div>
                    <div className="max-w-[230px] text-left md:text-right">
                      <p className="text-[11px] tracking-[0.2em] text-[#A88762]">
                        FRAGRANCE NOTES
                      </p>
                      <p className="mt-2 text-[13px] leading-5 text-[#705C52]">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — ASTROLOGY MEETS FRAGRANCE */}
      <section className="bg-[#F7F0E6] px-6 py-28 md:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={rise}
          className="mx-auto max-w-6xl"
        >
          <div className="text-center">
            <SectionLabel>WHERE ASTROLOGY MEETS FRAGRANCE</SectionLabel>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Ancient Symbolism.
              <br />
              Contemporary Expression.
            </h2>
          </div>

          <div className="mt-16 grid items-center gap-12 md:grid-cols-2 md:gap-20">
            <PlanetArtwork />

            <div>
              <p className="text-[11px] tracking-[0.3em] text-[#A88762]">
                A MODERN INTERPRETATION
              </p>
              <h3 className="mt-5 font-serif text-3xl leading-tight md:text-4xl">
                Inspired by tradition. Created for today.
              </h3>
              <p className="mt-7 text-[15px] leading-8 text-[#705C52]">
                SEVOURA reimagines traditional planetary associations through
                the art of attar, translating celestial symbolism into a
                distinctive fragrance experience.
              </p>
              <p className="mt-6 text-[15px] leading-8 text-[#705C52]">
                Each blend becomes a personal signature—a sensory expression
                of the qualities you choose to embrace and carry into your day.
              </p>

              <blockquote className="mt-9 border-l border-[#B38B57] py-2 pl-6 font-serif text-xl italic leading-9 text-[#80685C]">
                The stars inspire.
                <br />
                Your intention defines.
              </blockquote>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 07 — A PERSONAL RITUAL */}
      <section className="relative overflow-hidden bg-[#5B2038] px-6 py-28 text-[#F7EEE2] md:py-36">
        <div className="absolute -right-48 top-0 h-[450px] w-[450px] rounded-full border border-[#D3B68C]/15" />
        <div className="absolute -right-32 top-16 h-[320px] w-[320px] rounded-full border border-[#D3B68C]/15" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={rise}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <SectionLabel>MORE THAN A FRAGRANCE</SectionLabel>
          <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
            Make Every Day
            <br />
            <span className="italic text-[#D8B88A]">Your Own Ritual.</span>
          </h2>

          <p className="mx-auto mt-9 max-w-2xl text-[15px] leading-8 text-[#E4D2C5]">
            A fragrance can become a small moment of pause in a busy day.
            A familiar scent, a personal intention, a little space to reconnect
            with yourself. SEVOURA brings these ideas together through seven
            distinctive planetary inspirations.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              ["01", "PAUSE", "Take a moment for yourself."],
              ["02", "CHOOSE", "Follow the intention you wish to embrace."],
              ["03", "EXPRESS", "Make the moment your own."],
            ].map(([number, title, text], i) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="border-t border-[#B99B76]/40 px-4 pt-7"
              >
                <span className="block text-[#D8B88A]"><Ornament size={16} /></span>
                <h3 className="mt-3 text-[13px] tracking-[0.25em]">{title}</h3>
                <p className="mt-3 text-[13px] leading-6 text-[#DCC9BB]">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 08 — PHILOSOPHY */}
      <section className="bg-[#EFE2D1] px-6 py-28 text-center md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mx-auto max-w-4xl"
        >
          <SectionLabel>THE SEVOURA PHILOSOPHY</SectionLabel>
          <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
            A Ritual, Rooted in Meaning.
          </h2>
          <p className="mt-7 font-serif text-lg italic text-[#8C7566] md:text-2xl">
            Cleanse. Elevate. Radiate.
          </p>
          <div className="mx-auto mt-10 h-px w-24 bg-[#B99B76]" />
          <p className="mx-auto mt-9 max-w-2xl text-[15px] leading-8 text-[#705C52]">
            Inspired by traditional astrological symbolism, SEVOURA brings
            together fragrance, personal expression and the rhythm of seven
            days. A thoughtful reminder that every day can hold a different
            intention.
          </p>
        </motion.div>
      </section>

      {/* 09 — FINAL BRAND SECTION */}
      <section className="bg-[#F7F0E6] px-6 py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="font-serif text-3xl tracking-[0.28em] md:text-4xl">
            SEVOURA
          </h2>
          <p className="mt-3 text-[11px] tracking-[0.3em] text-[#A88762]">
            CLEANSE. ELEVATE. RADIATE.
          </p>

          <p className="mx-auto mt-8 max-w-xl text-[13px] leading-7 text-[#705C52] md:text-[15px]">
            Inspired by traditional astrological symbolism, SEVOURA offers a
            personal fragrance and ritual experience—an expression of
            intention, not a promise of outcomes.
          </p>

          <Link
            href="/the-seven"
            className="mt-10 inline-flex border border-[#8C624D] px-10 py-4 text-[11px] tracking-[0.25em] transition-all duration-500 hover:bg-[#5B2038] hover:text-[#F7EEE2]"
          >
            EXPLORE THE SEVEN →
          </Link>
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}
