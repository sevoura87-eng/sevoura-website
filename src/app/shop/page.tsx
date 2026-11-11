"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
} from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Plus,
  Minus,
  Package,
  ShieldCheck,
  Gift,
} from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductPhoto from "@/components/ProductPhoto";
import PageHero from "@/components/ui/PageHero";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { LivePrice } from "@/components/shop/ProductPrice";
import Ornament from "@/components/ui/Ornament";

const blends = [
  {
    day: "MONDAY",
    image: "/images/products/monday.jpg",
    planet: "Moon",
    fragrance: "Jasmine",
    notes: "Green Tea · White Musk",
    intention: "Calm · Emotional Balance",
    number: "01",
    color: "#D8C5A5",
    description:
      "A soft, comforting fragrance inspired by the quiet energy of the Moon.",
  },
  {
    day: "TUESDAY",
    image: "/images/products/tuesday.jpg",
    planet: "Mars",
    fragrance: "Clove",
    notes: "Rose · Woods · Spice",
    intention: "Courage · Confidence · Action",
    number: "02",
    color: "#7A304A",
    description:
      "A warm and expressive blend inspired by courage, strength and movement.",
  },
  {
    day: "WEDNESDAY",
    image: "/images/products/wednesday.jpg",
    planet: "Mercury",
    fragrance: "Green Tea",
    notes: "Rose · Amber",
    intention: "Clarity · Communication · Focus",
    number: "03",
    color: "#A8B39A",
    description:
      "A fresh fragrance that represents clarity, curiosity and expression.",
  },
  {
    day: "THURSDAY",
    image: "/images/products/thursday-vanilla-studio.jpg",
    planet: "Jupiter",
    fragrance: "Vanilla",
    notes: "Cocoa · Amber",
    intention: "Abundance · Expansion · Prosperity",
    number: "04",
    color: "#C89B55",
    description:
      "A rich, warm fragrance inspired by growth, optimism and possibility.",
  },
  {
    day: "FRIDAY",
    image: "/images/products/friday.jpg",
    planet: "Venus",
    fragrance: "Rose",
    notes: "Neroli · Musk · Woods",
    intention: "Love · Attraction · Luxury",
    number: "05",
    color: "#C88C91",
    description:
      "A graceful floral expression inspired by beauty, love and connection.",
  },
  {
    day: "SATURDAY",
    image: "/images/products/saturday.jpg",
    planet: "Saturn",
    fragrance: "Vetiver",
    notes: "Patchouli · Cedarwood · Musk",
    intention: "Grounding · Stability · Strength",
    number: "06",
    color: "#85776D",
    description:
      "An earthy fragrance inspired by grounding, patience and inner strength.",
  },
  {
    day: "SUNDAY",
    image: "/images/products/sunday.jpg",
    planet: "Sun",
    fragrance: "Saffron",
    notes: "Sandalwood · Vanilla · Dry Woods",
    intention: "Radiance · Vitality · Charisma",
    number: "07",
    color: "#D4A64E",
    description:
      "A luminous fragrance inspired by confidence, warmth and radiance.",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Seven distinct expressions",
    text: "Seven fragrance identities inspired by traditional planetary associations.",
  },
  {
    icon: Package,
    title: "One complete collection",
    text: "A considered seven-day experience, presented together as one collection.",
  },
  {
    icon: ShieldCheck,
    title: "Alcohol-free blends",
    text: "A collection of alcohol-free fragrance blends.",
  },
  {
    icon: Gift,
    title: "Thoughtful gifting",
    text: "A distinctive gift for someone who appreciates meaningful details.",
  },
];

const faqs = [
  {
    q: "What is included in the SEVOURA collection?",
    a: "The collection features seven distinct fragrance blends, each inspired by a day of the week and its traditional planetary association.",
  },
  {
    q: "Are the fragrances alcohol-free?",
    a: "Yes. The SEVOURA seven-day collection is presented as an alcohol-free fragrance collection.",
  },
  {
    q: "How do I choose a fragrance?",
    a: "Explore the seven blends and their fragrance notes and intentions. You can also visit the Ritual Finder to discover the blend that resonates with you.",
  },
  {
    q: "Can I gift the collection?",
    a: "Yes. The complete seven-day collection makes a thoughtful gifting choice.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function ShopPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="overflow-x-clip bg-[#F5EFE4] text-[#481D30]">
      <SiteHeader />

      {/* HERO — the colonnade: an architectural introduction, no product photography */}
      <PageHero
        layout="panorama"
        tone="light"
        art="/images/hero-colonnade-v2.jpg"
        artPosition="100% 50%"
        eyebrow="SEVOURA · THE COMPLETE COLLECTION"
        title="Seven days."
        accent="One complete ritual."
        intro={<>Seven planetary inspirations, seven alcohol-free fragrance expressions — gathered into one collection for every day of the week.</>}
      >
        <div className="mt-10 border-t border-[#A77B4D]/30 pt-8">
          <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
            <span className="font-display text-[44px] leading-none text-[#481D30]">
              <LivePrice fallback="₹1,799" />
            </span>
            <span className="pb-1 text-[16px] text-[#9C8B7A] line-through">
              <LivePrice fallback="₹2,499" kind="mrp" />
            </span>
            <span className="pb-1.5 text-[12px] font-semibold tracking-[0.2em] text-[#792D49]">
              FESTIVE OFFER · SAVE <LivePrice fallback="₹700" kind="saving" />
            </span>
          </div>
          <p className="mt-3 text-[14px] tracking-wide text-[#6B5650]">7 × 4 ml alcohol-free fragrance blends · Prepaid · Free shipping across India</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <AddToCartButton className="group inline-flex items-center gap-4 bg-[#481D30] px-8 py-[18px] text-[12px] font-semibold tracking-[0.22em] text-[#FFF6E9] transition-colors duration-500 hover:bg-[#792D49]">
              ADD TO BAG
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
            </AddToCartButton>
            <Link href="#meet-your-seven" className="inline-flex items-center gap-3 border border-[#481D30]/40 px-7 py-[17px] text-[12px] font-medium tracking-[0.22em] text-[#481D30] transition-colors duration-500 hover:border-[#481D30] hover:bg-[#481D30]/5">
              MEET THE SEVEN
            </Link>
          </div>
          <p className="mt-5 text-[12px] tracking-[0.04em] text-[#9A8777]">Limited introductory pricing · Secure online payment</p>
        </div>
      </PageHero>

      {/* INTRODUCTION */}
      <section className="relative bg-[#F9F3E9] px-6 py-28 lg:px-16">
        <div className="mx-auto max-w-[1250px]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-12 lg:grid-cols-2 lg:gap-24"
          >
            <div>
              <p className="mb-5 text-[12px] font-semibold tracking-[0.3em] text-[#A57C43]">
                INSIDE YOUR COLLECTION
              </p>
              <h2 className="max-w-[570px] font-serif text-5xl leading-[1.1] md:text-6xl">
                A considered ritual,
                <br />
                <span className="italic text-[#762C49]">
                  beautifully brought together.
                </span>
              </h2>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-base leading-8 text-[#765F56]">
                The complete seven-day collection is designed to be
                explored as a whole — with a fragrance blend for each
                day and a story behind every expression.
              </p>
              <p className="mt-5 text-[15px] leading-7 text-[#8A7669]">
                A thoughtful way to make fragrance part of your everyday
                routine, with seven distinctive compositions to discover.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              "7 × 4 ml alcohol-free fragrance blends",
              "Seven distinctive signature compositions",
              "Inspired by traditional planetary associations",
              "Presented together as one complete collection",
            ].map((item, index) => (
              <motion.div
                variants={reveal}
                key={item}
                className="border-t border-[#CDB994] py-6"
              >
                <span className="font-serif text-2xl text-[#B38A4C]">
                  ✦
                </span>
                <p className="mt-4 text-[15px] leading-6 text-[#624A46]">
                  {item}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#511E34] px-6 py-24 text-[#F8EDDF] lg:px-16">
        <div className="mx-auto max-w-[1250px]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="text-[12px] tracking-[0.35em] text-[#D8B77D]">
              THE SEVOURA DIFFERENCE
            </p>
            <h2 className="mt-5 font-serif text-5xl md:text-6xl">
              Thoughtfully composed.
              <br />
              <span className="italic text-[#D9B77D]">
                Made to be experienced.
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-px bg-[#B99768]/35 md:grid-cols-2 lg:grid-cols-4"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  variants={reveal}
                  key={benefit.title}
                  className="bg-[#511E34] px-7 py-10 transition-colors duration-500 hover:bg-[#65263F]"
                >
                  <Icon size={27} strokeWidth={1.2} className="text-[#D8B77D]" />
                  <h3 className="mt-8 font-serif text-2xl">
                    {benefit.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-[#D9C5B6]">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SEVEN BLENDS */}
      <section id="meet-your-seven" className="scroll-mt-20 bg-[#F5EFE4] px-6 py-28 lg:px-16">
        <div className="mx-auto max-w-[1300px]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="text-[12px] font-semibold tracking-[0.32em] text-[#A57C43]">
              SEVEN DAYS · SEVEN EXPRESSIONS
            </p>
            <h2 className="mt-5 font-serif text-5xl md:text-6xl">
              Meet your <span className="italic text-[#762C49]">seven.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#806D60]">
              Explore the fragrance identity associated with each day.
              Every blend brings its own notes, character and intention.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {blends.map((blend) => (
              <motion.article variants={reveal} key={blend.number} className="group flex flex-col bg-[#FCF7EE]">
                <div className="relative overflow-hidden">
                  <ProductPhoto
                    day={blend.day.charAt(0) + blend.day.slice(1).toLowerCase()}
                    fragrance={blend.fragrance}
                    notes={blend.notes}
                    sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, (max-width:1280px) 31vw, 300px"
                    className="aspect-[4/5]"
                    imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-0 top-5 bg-[#481D30] px-3.5 py-2 text-[11px] font-semibold tracking-[0.24em] text-[#F7F0E6]">{blend.day}</span>
                  <span className="absolute bottom-4 right-4 bg-[#FBF5E9]/85 px-2.5 py-1.5 text-[11px] tracking-[0.18em] text-[#702943] backdrop-blur-sm">4 ML</span>
                </div>
                <div className="flex flex-1 flex-col border-x border-b border-[#E2D4C1] px-6 pb-7 pt-6 transition-colors duration-500 group-hover:border-[#C9A574]">
                  <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.24em] text-[#A57C43]">
                    <span>{blend.planet.toUpperCase()}</span>
                    <span className="h-px flex-1 bg-[#E2D4C1]" />
                    <span>N° {blend.number}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[34px] font-medium leading-none text-[#481D30]">{blend.fragrance}</h3>
                  <p className="mt-2 text-[14px] tracking-[0.04em] text-[#806D60]">{blend.notes}</p>
                  <p className="mt-5 flex-1 text-[15px] leading-7 text-[#5E4A44]">{blend.description}</p>
                  <p className="mt-6 border-t border-[#E2D4C1] pt-4 text-[12px] font-semibold tracking-[0.16em] text-[#642B40]">{blend.intention.toUpperCase()}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <Link
              href="/the-seven"
              className="group inline-flex items-center gap-4 border-b border-[#762C49] pb-2 text-[12px] font-bold tracking-[0.2em] text-[#762C49]"
            >
              EXPLORE THE SEVEN IN DETAIL
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* COLLECTION FEATURE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#4C1B30] via-[#68263F] to-[#9A5948] px-6 py-28 text-[#F9EEDF] lg:px-16">
        <div className="absolute -right-32 -top-48 h-[600px] w-[600px] rounded-full border border-[#E2C28A]/20" />
        <div className="absolute -right-10 -top-28 h-[430px] w-[430px] rounded-full border border-[#E2C28A]/20" />

        <div className="relative mx-auto grid max-w-[1250px] items-center gap-16 lg:grid-cols-2">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 border border-[#E3C58C]/40" />
            <motion.div
              whileHover={{ scale: 1.025 }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden bg-[#EAD9C1] p-3"
            >
              <Image
                src="/sevoura-bottle.jpeg"
                alt="SEVOURA seven fragrance collection gift set"
                width={544}
                height={404}
                className="h-[340px] w-full object-contain sm:h-[430px]"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              variants={reveal}
              className="text-[12px] font-bold tracking-[0.3em] text-[#E4C58D]"
            >
              THE COMPLETE SEVEN-DAY EXPERIENCE
            </motion.p>

            <motion.h2
              variants={reveal}
              className="mt-6 font-serif text-5xl leading-[1.08] md:text-6xl"
            >
              Seven inspirations.
              <br />
              <span className="italic text-[#E6C895]">
                One complete ritual.
              </span>
            </motion.h2>

            <motion.p
              variants={reveal}
              className="mt-7 max-w-lg text-[15px] leading-7 text-[#E8D8CC]"
            >
              Discover the SEVOURA 7-Day Planetary Blend Collection.
              Seven fragrance expressions, thoughtfully brought together.
            </motion.p>

            <motion.div
              variants={reveal}
              className="my-9 border-y border-[#D7B77E]/40 py-6"
            >
              <p className="font-serif text-2xl">7 × 4 ml fragrance blends</p>
              <p className="mt-2 text-[15px] text-[#E8D8CC]">
                Alcohol-free · Complete seven-day set
              </p>
            </motion.div>

            <motion.div variants={reveal}>
              <span className="font-serif text-5xl text-[#E7C58B]">
                <LivePrice fallback="₹1,799" />
              </span>
              <p className="mt-2 text-[13px] tracking-wide text-[#E8D8CC]">
                PREPAID · FREE SHIPPING
              </p>
            </motion.div>

            <motion.div variants={reveal}>
              <AddToCartButton className="group mt-8 inline-flex items-center gap-6 bg-[#F5EBDC] px-8 py-5 text-[12px] font-bold tracking-[0.2em] text-[#552038] transition-all hover:bg-white">
                ADD TO BAG
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-2"
                />
              </AddToCartButton>
            </motion.div>

            <motion.p
              variants={reveal}
              className="mt-7 max-w-lg text-[12px] leading-6 text-[#D8C2B6]"
            >
              Planetary associations are inspired by traditional symbolism
              and are intended for personal exploration. They do not predict
              or guarantee outcomes.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* RITUAL GUIDE */}
      <section className="bg-[#F9F3E9] px-6 py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1250px] gap-16 lg:grid-cols-2">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[12px] font-bold tracking-[0.3em] text-[#A57C43]">
              YOUR EVERYDAY RITUAL
            </p>
            <h2 className="mt-6 font-serif text-5xl leading-tight">
              Make every day
              <br />
              <span className="italic text-[#762C49]">feel intentional.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-8 text-[#806D60]">
              Discover the collection at your own pace. Explore the
              fragrance notes, learn about the inspiration behind each
              blend, and choose an expression that feels meaningful to you.
            </p>
            <Link
              href="/ritual-finder"
              className="group mt-8 inline-flex items-center gap-4 border-b border-[#762C49] pb-2 text-[12px] font-bold tracking-[0.2em]"
            >
              FIND YOUR RITUAL
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              ["01", "Discover", "Explore the seven fragrance identities."],
              ["02", "Choose", "Find the notes and character that resonate with you."],
              ["03", "Experience", "Make fragrance a thoughtful part of your day."],
            ].map(([number, title, description]) => (
              <motion.div
                variants={reveal}
                key={number}
                className="flex gap-6 border-b border-[#D8C5A7] py-6"
              >
                <span className="pt-2 text-[#B58A4D]">
                  <Ornament size={18} />
                </span>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-[15px] leading-6 text-[#806D60]">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#EEE2D1] px-6 py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1250px] gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[12px] font-bold tracking-[0.3em] text-[#A57C43]">
              A LITTLE MORE TO KNOW
            </p>
            <h2 className="mt-5 font-serif text-5xl leading-tight">
              Questions,
              <br />
              <span className="italic text-[#762C49]">answered.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-[#806D60]">
              Everything you may want to know before discovering
              your SEVOURA collection.
            </p>
          </motion.div>

          <div className="border-t border-[#CDB994]">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="border-b border-[#CDB994]">
                <button
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-5 py-6 text-left"
                >
                  <span className="font-serif text-xl md:text-2xl">
                    {faq.q}
                  </span>
                  {openFaq === index ? (
                    <Minus size={19} className="shrink-0 text-[#A57C43]" />
                  ) : (
                    <Plus size={19} className="shrink-0 text-[#A57C43]" />
                  )}
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 pr-8 text-[15px] leading-7 text-[#806D60]">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#4D1B30] px-6 py-32 text-center text-[#F8EDDF] lg:px-16">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D5B47B]/20" />
        <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D5B47B]/20" />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mx-auto max-w-3xl"
        >
          <motion.div variants={reveal}>
            <Sparkles className="mx-auto text-[#D9B77C]" size={30} />
          </motion.div>

          <motion.p
            variants={reveal}
            className="mt-7 text-[12px] tracking-[0.35em] text-[#D9B77C]"
          >
            THE SEVOURA COLLECTION
          </motion.p>

          <motion.h2
            variants={reveal}
            className="mt-6 font-serif text-5xl leading-tight md:text-7xl"
          >
            Seven days.
            <br />
            <span className="italic text-[#E2C18B]">
              One beautiful beginning.
            </span>
          </motion.h2>

          <motion.p
            variants={reveal}
            className="mx-auto mt-7 max-w-xl text-[15px] leading-7 text-[#E3D0C2]"
          >
            Discover seven fragrance expressions and bring a little
            more intention into the everyday.
          </motion.p>

          <motion.div variants={reveal}>
            <AddToCartButton className="group mt-10 inline-flex items-center gap-6 bg-[#F5EBDC] px-9 py-5 text-[12px] font-bold tracking-[0.2em] text-[#552038] transition-all hover:bg-white">
              ADD THE COLLECTION TO BAG
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-2"
              />
            </AddToCartButton>
          </motion.div>
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}