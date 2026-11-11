'use client';

import SiteHeader from "@/components/SiteHeader";
import AstrolabeArt from "@/components/art/AstrolabeArt";
import PageHero from "@/components/ui/PageHero";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Minus,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Ornament from "@/components/ui/Ornament";

const faqs = [
  {
    question: "What is SEVOURA?",
    answer:
      "SEVOURA is a contemporary fragrance brand inspired by traditional astrological wisdom. Its Seven-Day Planetary Blend Collection features seven alcohol-free attar blends—one for each day of the week and its traditional ruling planet.",
  },
  {
    question: "What makes SEVOURA different from conventional perfume?",
    answer:
      "SEVOURA offers seven fragrances for seven days, rather than one signature fragrance for every day. Each blend is inspired by the traditional planetary association of its day, bringing together fragrance, intention, and ritual.",
  },
  {
    question: "What does the SEVOURA collection include?",
    answer:
      "The Seven-Day Planetary Blend Collection includes seven alcohol-free attar blends, each inspired by a different day and its ruling planet. Each comes in a convenient 4 ml roll-on format.",
  },
  {
    question: "How do I use the seven fragrances?",
    answer:
      "Choose the blend associated with the day and apply gently to your preferred pulse points, such as the wrists, neck, or behind the ears. Follow your Seven-Day Ritual Guide for additional guidance, then pause and enjoy the fragrance.",
  },
  {
    question: "How long does the fragrance last?",
    answer:
      "SEVOURA's alcohol-free blends offer a fragrance experience lasting several hours, depending on individual skin type, body chemistry, application, and environment. The roll-on format makes it easy to refresh whenever desired.",
  },
  {
    question: "Can I wear SEVOURA with another fragrance?",
    answer:
      "Yes. SEVOURA can be worn on its own or layered with another fragrance. For the most distinctive experience of each blend, we recommend enjoying it on its own or allowing it to settle before layering.",
  },
  {
    question: "Is SEVOURA based on astrology?",
    answer:
      "Yes. Astrology is at the heart of the SEVOURA concept. Each blend is inspired by the traditional ruling planet associated with a particular day of the week and its symbolic qualities. SEVOURA brings this timeless connection into a contemporary seven-day fragrance ritual. The planetary associations are intended as part of the personal fragrance and ritual experience and are not intended to predict or guarantee any specific outcome.",
  },
  {
    question: "Can I use SEVOURA every day?",
    answer:
      "Absolutely. SEVOURA is designed as a seven-day fragrance ritual, with a distinctive blend for each day. Follow the suggested sequence or choose the blend that resonates with you.",
  },
  {
    question: "Where should I apply SEVOURA?",
    answer:
      "Apply gently to pulse points such as the wrists, neck, and behind the ears. Avoid the eyes and broken or irritated skin. Discontinue use if irritation occurs.",
  },
  {
    question: "Are SEVOURA fragrances alcohol-free?",
    answer:
      "Yes. The Seven-Day Planetary Blend Collection is alcohol-free and presented in a convenient roll-on format for direct application.",
  },
  {
    question: "How should I store my SEVOURA fragrances?",
    answer:
      "Keep the blends tightly closed and away from direct sunlight, excessive heat, and moisture. Store in a cool, dry place for the best fragrance experience.",
  },
  {
    question: "Is SEVOURA suitable for gifting?",
    answer:
      "Absolutely. The Seven-Day Planetary Blend Collection brings all seven alcohol-free attar blends together in one beautifully curated set, making it an elegant and meaningful gift for someone special.",
  },
];

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className="relative inline-block shrink-0">
      <img
        src="/sevoura-logo.png"
        alt="SEVOURA"
        className={footer ? "w-[185px] object-contain" : "w-[145px] object-contain md:w-[175px]"}
      />
      <span
        aria-label="Trademark"
        className="absolute -right-[9px] top-[1px] text-[11px] font-semibold"
        style={{ color: footer ? "#F8F0E5" : "#542038" }}
      >
        ™
      </span>
    </Link>
  );
}





export default function FAQPage() {
  const [active, setActive] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F5F0E7] text-[#542038]">
      <SiteHeader />

      {/* HERO */}
      <PageHero
        layout="band"
        eyebrow="SUPPORT · A LITTLE MORE CLARITY"
        title="Frequently"
        accent="asked questions."
        intro={<>Everything you would like to know about our fragrances, the seven-day ritual and the SEVOURA experience.</>}
        artNode={<AstrolabeArt priority fit="cover" />}
      />

      {/* INTRO */}
      <section className="mx-auto max-w-[1150px] px-6 py-20 md:px-12 md:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-20"
        >
          <div>
            <p className="text-[12px] tracking-[0.3em] text-[#A66C35]">
              THE SEVOURA GUIDE
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Your questions,<br />beautifully answered.
            </h2>
          </div>
          <p className="text-[15px] leading-8 text-[#6E5860]">
            From understanding our seven planetary blends to making the most
            of your daily fragrance ritual, find the information you need
            right here. Explore the questions below to learn more about SEVOURA.
          </p>
        </motion.div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="border-y border-[#E3D5C4] bg-[#F0E8DC]">
        <div className="mx-auto max-w-[1050px] px-6 py-20 md:px-12 md:py-28">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-[12px] tracking-[0.3em] text-[#A66C35]">
              GOOD TO KNOW
            </p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              Frequently asked.
            </h2>
            <p className="mt-4 text-[15px] text-[#78656A]">
              Explore all 12 answers about the SEVOURA experience.
            </p>
          </motion.div>

          <div className="border-t border-[#D9C9B8]">
            {faqs.map((faq, index) => {
              const isOpen = active === index;

              return (
                <motion.article
                  key={faq.question}
                  initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: (index % 3) * 0.06 }}
                  className="border-b border-[#D9C9B8]"
                >
                  <button
                    type="button"
                    onClick={() => setActive(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-8"
                  >
                    <span className="flex items-start gap-5 md:gap-8">
                      <span className="pt-2 text-[#B17B42]">
                        <Ornament size={14} />
                      </span>
                      <span className="font-serif text-xl leading-snug text-[#542038] transition-colors group-hover:text-[#A66C35] md:text-2xl">
                        {faq.question}
                      </span>
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#CBB69C] text-[#542038] transition-colors group-hover:bg-[#542038] group-hover:text-white"
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[790px] pb-8 pl-[48px] text-[15px] leading-8 text-[#74636A] md:pl-[64px] md:text-[15px]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-[#F5F0E7] px-6 py-20 md:px-12 md:py-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-[1150px] overflow-hidden bg-[#E9DFD1] px-7 py-12 md:px-16 md:py-16"
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#CBB69C]/60" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[12px] tracking-[0.3em] text-[#A66C35]">
                STILL HAVE A QUESTION?
              </p>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-[#542038] md:text-5xl">
                We would love to help.
              </h2>
              <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-[#78656A]">
                Can&apos;t find what you are looking for? Reach out to our team
                and we will be happy to assist.
              </p>
            </div>

            <motion.a
              href="https://wa.me/919211877712?text=Hello%20SEVOURA%2C%20I%20have%20a%20question."
              target="_blank"
              rel="noreferrer"
              whileHover={reduceMotion ? undefined : { scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex min-h-[58px] items-center justify-center gap-4 bg-[#481B30] px-8 text-[12px] font-semibold tracking-[0.2em] text-white transition hover:bg-[#782C49]"
            >
              CONTACT US
              <ArrowUpRight size={16} />
            </motion.a>
          </div>
        </motion.div>

        <div className="mx-auto mt-12 flex max-w-[1150px] flex-col gap-5 border-t border-[#DCCDBB] pt-8 text-[15px] text-[#6E5860] md:flex-row md:items-center md:justify-between">
          <p>Here for your SEVOURA journey.</p>
          <a href="mailto:hello@sevoura.com" className="inline-flex items-center gap-3 hover:text-[#A66C35]">
            <Mail size={16} />
            hello@sevoura.com
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
