
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  Orbit,
  Stars,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { LivePrice } from "@/components/shop/ProductPrice";

const blends = [
  {
    day: "MONDAY",
    planet: "Moon",
    fragrance: "Jasmine",
    notes: "Green Tea · White Musk",
    intention: "Calm · Emotional Balance",
    color: "from-[#D9C8B0] via-[#F8EBDD] to-[#B99476]",
    description:
      "Begin the week with softness. A gentle fragrance identity inspired by the Moon and the quiet beauty of emotional balance.",
    icon: Moon,
  },
  {
    day: "TUESDAY",
    planet: "Mars",
    fragrance: "Clove",
    notes: "Rose · Woods · Spice",
    intention: "Courage · Confidence · Action",
    color: "from-[#541C32] via-[#8C3B50] to-[#D29A75]",
    description:
      "A bold expression of confidence and action, inspired by the traditional symbolism of Mars.",
    icon: Orbit,
  },
  {
    day: "WEDNESDAY",
    planet: "Mercury",
    fragrance: "Green Tea",
    notes: "Rose · Amber",
    intention: "Clarity · Communication · Focus",
    color: "from-[#D7C5A9] via-[#F8EBDD] to-[#B8A58B]",
    description:
      "A fresh, thoughtful identity inspired by clarity, communication and a focused mind.",
    icon: Stars,
  },
  {
    day: "THURSDAY",
    planet: "Jupiter",
    fragrance: "Vanilla",
    notes: "Cocoa · Amber",
    intention: "Abundance · Expansion · Prosperity",
    color: "from-[#D4A75F] via-[#F5DFB0] to-[#A87540]",
    description:
      "Warm and generous in character, inspired by expansion, possibility and abundance.",
    icon: Sun,
  },
  {
    day: "FRIDAY",
    planet: "Venus",
    fragrance: "Rose",
    notes: "Neroli · Musk · Woods",
    intention: "Love · Attraction · Luxury",
    color: "from-[#E3C8C5] via-[#F8EBDD] to-[#B77B82]",
    description:
      "A romantic expression of beauty and appreciation, inspired by Venus.",
    icon: Sparkles,
  },
  {
    day: "SATURDAY",
    planet: "Saturn",
    fragrance: "Vetiver",
    notes: "Patchouli · Cedarwood · Musk",
    intention: "Grounding · Stability · Strength",
    color: "from-[#80604B] via-[#C4A58A] to-[#594332]",
    description:
      "Earthy and composed, inspired by patience, structure and inner strength.",
    icon: Orbit,
  },
  {
    day: "SUNDAY",
    planet: "Sun",
    fragrance: "Saffron",
    notes: "Sandalwood · Vanilla · Dry Woods",
    intention: "Radiance · Vitality · Charisma",
    color: "from-[#D6A34D] via-[#F8E3A9] to-[#A66B32]",
    description:
      "A luminous expression of vitality and presence, inspired by the Sun.",
    icon: Sun,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 55 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export default function TheSevenPage() {
  const [activeBlend, setActiveBlend] = useState<number | null>(null);

  return (
    <main className="overflow-x-clip bg-[#F5EBDD] text-[#501D32]">
      <SiteHeader />

      {/* 01 — HERO */}
      <section className="relative flex min-h-[690px] items-center justify-center overflow-hidden bg-[#501D32] px-6 py-28 text-center text-[#F8EBDD] md:min-h-[790px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#78364B_0%,_#501D32_55%,_#351322_100%)]" />

        <div className="absolute left-1/2 top-1/2 h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D5B47C]/20" />
        <div className="absolute left-1/2 top-1/2 h-[590px] w-[590px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#D5B47C]/25" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D5B47C]/20" />

        <motion.div
          className="absolute left-[8%] top-[23%] h-24 w-24 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFF0C9,#C59A5A_50%,#68432E)] shadow-[0_0_65px_#D4A75F55]"
          animate={{ y: [0, -22, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-[17%] right-[9%] h-32 w-32 rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFF0C9,#D4A75F_50%,#68432E)] shadow-[0_0_80px_#D4A75F55]"
          animate={{ y: [0, 24, 0], rotate: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute right-[22%] top-[20%] h-3 w-3 rounded-full bg-[#D6B77F]"
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="relative z-10 mx-auto max-w-5xl"
        >
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#D8B77C]/50 text-[#D8B77C]">
            <Orbit size={30} strokeWidth={1} />
          </div>

          <p className="mb-8 text-[10px] tracking-[0.45em] text-[#D9B77C] md:text-xs">
            A SEVEN-DAY FRAGRANCE RITUAL
          </p>

          <h1 className="font-serif text-6xl leading-[1.05] md:text-8xl lg:text-[112px]">
            Meet The Seven
            <br />
            <i className="text-[#E4C99F]">Seven identities.</i>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-[#EAD9D0] md:text-lg">
            7 DAYS. 7 PLANETS. 7 FRAGRANCES.
            <br />
            Discover the planetary character of every day.
          </p>

          <motion.a
            href="#seven-blends"
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 inline-flex items-center gap-5 bg-[#F5EBDD] px-9 py-5 text-[10px] font-semibold tracking-[0.2em] text-[#501D32] shadow-xl"
          >
            EXPLORE THE SEVEN <ArrowRight size={16} />
          </motion.a>

          <p className="mt-10 text-[9px] tracking-[0.35em] text-[#D8B77C]">
            DISCOVER · EXPERIENCE · EMBODY
          </p>
        </motion.div>
      </section>

      {/* 02 — THE IDEA */}
      <section className="relative bg-[#F5EBDD] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-14 md:grid-cols-2 md:gap-20"
          >
            <div className="flex flex-col justify-center">
              <p className="mb-5 text-[10px] font-semibold tracking-[0.3em]">
                THE IDEA
              </p>
              <h2 className="font-serif text-4xl leading-tight md:text-6xl">
                A rhythm for
                <br />
                every day.
              </h2>
              <p className="mt-7 max-w-lg text-sm leading-8 text-[#705B52]">
                In traditional astrology, each day is associated with a ruling
                planet—each with its own symbolism and character.
              </p>
            </div>

            <div className="flex flex-col justify-center border-l border-[#B68A4E] pl-7 md:pl-12">
              <h3 className="font-serif text-2xl leading-snug md:text-3xl">
                SEVOURA translates this rhythm into fragrance blends.
              </h3>
              <p className="mt-5 text-sm leading-7 text-[#705B52]">
                Seven alcohol-free fragrance blends, each interpreted through
                distinctive notes, character and intention.
              </p>
              <p className="mt-5 text-sm leading-7 text-[#705B52]">
                Make fragrance a sensory reminder of the qualities you choose
                to focus on and embody.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15 }}
            className="mt-16 grid gap-4 md:grid-cols-3"
          >
            {[
              ["PLANETARY SYMBOLISM", "Traditional character of the day"],
              ["THE FRAGRANCE", "A blend that interprets that character"],
              ["THE INTENTION", "A quality to consciously cultivate"],
            ].map((item, index) => (
              
<motion.div
  key={item[0]}
  variants={fadeUp}
  whileHover={{
    y: -9,
    scale: 1.025,
    boxShadow: "0 24px 55px rgba(80,29,50,0.25)",
  }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="group relative overflow-hidden border border-[#8D5265] bg-[#501D32] p-9 text-center text-[#F5EBDD] shadow-lg transition-colors duration-500 hover:bg-[#64263F]"
>
  <motion.div
    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
    initial={{ x: "-120%" }}
    whileHover={{ x: "120%" }}
    transition={{ duration: 0.8 }}
  />

  <p className="relative text-[11px] font-semibold tracking-[0.22em] text-[#E8C58D]">
    {item[0]}
  </p>

  <p className="relative mt-4 text-sm leading-7 text-[#F5EBDD]/85">
    {item[1]}
  </p>

  <div className="relative mx-auto mt-6 h-px w-12 bg-[#D5B47C] transition-all duration-500 group-hover:w-24" />
</motion.div>

            ))}
          </motion.div>
        </div>
      </section>

      {/* 03 — SEVEN BLENDS */}
      <section
        id="seven-blends"
        className="bg-[#EFE0CD] px-6 py-24 md:px-12 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-4 text-[10px] font-semibold tracking-[0.35em]">
              SEVEN EXPRESSIONS
            </p>
            <h2 className="font-serif text-5xl md:text-7xl">
              Find Your Day
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#806B5E]">
              Explore each fragrance blend. Open a card to discover its story
              and personal intention.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blends.map((blend, index) => {
              const Icon = blend.icon;
              const isActive = activeBlend === index;

              return (
                <motion.article
                  key={blend.day}
                  initial={{ opacity: 0, y: 65, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.8,
                    delay: (index % 3) * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -10 }}
                  className="group overflow-hidden rounded-lg border border-[#D9C5AA] bg-[#FBF6EE] shadow-[0_12px_35px_#6C493015] transition-shadow duration-500 hover:shadow-[0_25px_50px_#6C493030]"
                >
                  <div
                    className={`relative h-40 overflow-hidden bg-gradient-to-br ${blend.color}`}
                  >
                    <div className="absolute inset-0 opacity-50">
                      <div className="absolute -left-10 top-12 h-40 w-[130%] rotate-[-20deg] border-t border-white/80" />
                      <div className="absolute -left-10 top-20 h-40 w-[130%] rotate-[-20deg] border-t border-white/60" />
                      <div className="absolute -left-10 top-28 h-40 w-[130%] rotate-[-20deg] border-t border-white/50" />
                    </div>

                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 35 + index * 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -right-7 -top-20 h-64 w-64 rounded-full border border-white/50"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 12 }}
                        transition={{ duration: 0.6 }}
                        className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-white/20 text-white shadow-lg backdrop-blur-sm"
                      >
                        <Icon size={29} strokeWidth={1} />
                      </motion.div>
                    </div>

                    <span className="absolute bottom-3 right-4 text-[9px] tracking-[0.3em] text-white/90">
                      0{index + 1} / 07
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-[9px] font-semibold tracking-[0.22em] text-[#A77B43]">
                      {String(index + 1).padStart(2, "0")} · {blend.day}
                    </p>

                    <h3 className="mt-2 font-serif text-3xl">
                      {blend.planet}
                    </h3>

                    <p className="mt-1 font-serif text-lg italic text-[#7D3B51]">
                      {blend.fragrance}
                    </p>

                    <p className="mt-2 text-xs text-[#806B5E]">
                      {blend.notes}
                    </p>

                    <span className="mt-4 inline-block rounded-full bg-[#F0E0CC] px-3 py-2 text-[9px] font-semibold text-[#67334A]">
                      {blend.intention}
                    </span>

                    <button
                      onClick={() =>
                        setActiveBlend(isActive ? null : index)
                      }
                      className="mt-5 flex w-full items-center justify-between border-t border-[#E4D3BD] pt-4 text-left text-xs font-semibold"
                    >
                      <span>
                        {isActive ? "Close the story" : "Discover the story"}
                      </span>
                      <motion.span animate={{ rotate: isActive ? 180 : 0 }}>
                        <ChevronDown size={17} />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-[#E4D3BD] pt-4 text-sm leading-7 text-[#806B5E]">
                            {blend.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 — GLANCE TABLE */}
      <section className="bg-[#F8F0E5] px-5 py-24 md:px-12 md:py-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] tracking-[0.3em]">
              YOUR QUICK GUIDE
            </p>
            <h2 className="font-serif text-4xl md:text-6xl">
              The Seven at a Glance
            </h2>
            <p className="mt-4 text-sm text-[#806B5E]">
              A quick guide to the notes and intentions behind each day.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#DCC6A8] shadow-lg">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead className="bg-[#E8D3B5]">
                <tr className="text-[10px] tracking-[0.15em] text-[#501D32]">
                  <th className="px-6 py-5">DAY</th>
                  <th className="px-6 py-5">PLANET</th>
                  <th className="px-6 py-5">SIGNATURE</th>
                  <th className="px-6 py-5">INTENTION</th>
                </tr>
              </thead>
              <tbody>
                {blends.map((blend, index) => (
                  <motion.tr
                    key={blend.day}
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    className="border-t border-[#E2D2BD] text-xs transition-colors hover:bg-[#F0E2D0]"
                  >
                    <td className="px-6 py-5 font-semibold">{blend.day}</td>
                    <td className="px-6 py-5 font-serif text-base">
                      {blend.planet}
                    </td>
                    <td className="px-6 py-5">{blend.fragrance}</td>
                    <td className="px-6 py-5">{blend.intention}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* 05 — RITUAL OF INTENTION */}
      <section className="bg-[#EEDFCC] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="mb-4 text-[10px] tracking-[0.3em]">
              MAKE IT YOUR OWN
            </p>
            <h2 className="font-serif text-4xl md:text-6xl">
              A Ritual of Intention
            </h2>
            <p className="mt-4 text-sm text-[#806B5E]">
              Planetary symbolism. Personal intention. Fragrance ritual.
            </p>
          </motion.div>

          <div className="grid gap-7 md:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="border border-[#D9C4A8] bg-[#FBF6EE] p-8 md:p-12"
            >
              <Sparkles className="mb-7 text-[#B68A4E]" size={30} />
              <h3 className="font-serif text-3xl">Make it meaningful</h3>
              <p className="mt-5 text-sm leading-7 text-[#705B52]">
                Choose the quality you want to bring into your day. Let a
                familiar fragrance become a sensory cue to return your
                attention to that intention.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-2">
                {["Set intention", "Wear the fragrance", "Embody the energy"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className="bg-[#F0E1CE] px-2 py-4 text-center"
                    >
                      <span className="block font-serif text-xl text-[#B68A4E]">
                        0{index + 1}
                      </span>
                      <p className="mt-2 text-[10px] font-semibold">{step}</p>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="border border-[#D9C4A8] bg-[#FBF6EE] p-8 md:p-12"
            >
              <Orbit className="mb-7 text-[#B68A4E]" size={30} />
              <h3 className="font-serif text-3xl">A thoughtful note</h3>
              <p className="mt-5 text-sm leading-7 text-[#705B52]">
                SEVOURA&apos;s planetary associations draw from traditional
                astrological symbolism. The blends are designed as a personal
                fragrance experience—not as a remedy or a promise of a
                particular outcome.
              </p>
              <p className="mt-5 text-sm leading-7 text-[#705B52]">
                Use the ritual as a practice of intention, focus and mindful
                association.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 06 — COMPLETE COLLECTION / ACTUAL BOTTLE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#501D32] via-[#67263F] to-[#A35E45] px-6 py-24 text-[#F8EBDD] md:px-12 md:py-32">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#E8C58D]/20" />
        <div className="absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full border border-dashed border-[#E8C58D]/20" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -55, scale: 0.94 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="group relative mx-auto w-full max-w-[620px] overflow-hidden rounded-lg border border-[#E7C99B]/60 bg-[#EBD9C4] p-2 shadow-2xl"
          >
            <motion.img
              src="/sevoura-bottle.jpeg"
              alt="SEVOURA complete seven-bottle planetary fragrance collection"
              className="block h-auto w-full rounded object-contain"
              whileHover={{ scale: 1.025 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />

            <div className="pointer-events-none absolute inset-5 rounded-sm border border-white/60" />

            <motion.div
              className="pointer-events-none absolute inset-2 rounded-sm bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              animate={{ opacity: [0.04, 0.28, 0.04], x: ["-8%", "8%", "-8%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="absolute bottom-6 left-6 bg-[#501D32]/95 px-5 py-3 text-[#F8EBDD] shadow-lg backdrop-blur-md sm:bottom-7 sm:left-7">
              <p className="text-[9px] tracking-[0.25em]">SEVEN DAY RITUAL</p>
              <p className="mt-1 font-serif text-lg sm:text-xl">Seven fragrances · One collection</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 55 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#E7C68E]">
              THE COMPLETE COLLECTION
            </p>

            <h2 className="font-serif text-5xl leading-tight md:text-6xl">
              Seven inspirations.
              <br />
              <i>One complete ritual.</i>
            </h2>

            <p className="mt-7 max-w-lg text-sm leading-8 text-[#F0DED2]">
              Discover the SEVOURA 7-Day Planetary Blend Collection.
            </p>

            <div className="mt-8 border-y border-[#E8C58D]/30 py-6">
              <p className="font-serif text-xl">7 × 4 ml fragrance blends</p>
              <p className="mt-2 text-sm text-[#EBD7C7]">
                Alcohol-free · Complete seven-day set
              </p>
            </div>

            <p className="mt-7 font-serif text-3xl text-[#E8C58D]">
              <LivePrice fallback="₹1,799" />
            </p>
            <p className="mt-1 text-xs text-[#F0DED2]">
              Prepaid · Free Shipping
            </p>

            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="mt-8 inline-flex items-center gap-5 border border-[#E8C58D] bg-[#3F1729] px-8 py-5 text-[10px] font-semibold tracking-[0.2em] transition hover:bg-[#E8C58D] hover:text-[#501D32]"
            >
              EXPLORE THE COLLECTION <ArrowRight size={16} />
            </motion.a>

            <p className="mt-8 max-w-lg text-[10px] leading-6 text-[#EBD7C7]/75">
              Planetary associations are inspired by traditional symbolism
              and are intended for personal exploration. They do not predict
              or guarantee outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
