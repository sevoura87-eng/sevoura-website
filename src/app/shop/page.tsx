"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
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
import AddToCartButton from "@/components/shop/AddToCartButton";
import { LivePrice } from "@/components/shop/ProductPrice";

const blends = [
  {
    day: "MONDAY",
    image: "/images/monday.jpg",
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
    image: "/images/tuesday.jpg",
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
    image: "/images/wednesday.jpg",
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
    image: "/images/thursday.jpg",
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
    image: "/images/friday.jpg",
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
    image: "/images/saturday.jpg",
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
    image: "/images/sunday.jpg",
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
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.35], [0, -65]);

  return (
    <main className="overflow-x-clip bg-[#F5EFE4] text-[#481D30]">
      <SiteHeader />

      {/* HERO */}
      <section className="relative min-h-[760px] overflow-hidden bg-[#F5EFE4]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-40 -top-40 h-[650px] w-[650px] rounded-full border border-[#C9A66C]/25" />
          <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full border border-[#C9A66C]/20" />
          <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-[#F5EFE4] to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[760px] max-w-[1450px] items-center gap-12 px-6 py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10 max-w-[620px]"
          >
            <motion.p
              variants={reveal}
              className="mb-8 text-[10px] font-semibold tracking-[0.32em] text-[#A57C43]"
            >
              SEVOURA · THE COMPLETE COLLECTION
            </motion.p>

            <motion.h1
              variants={reveal}
              className="font-serif text-[clamp(3.5rem,6vw,6.5rem)] leading-[0.98] tracking-[-0.045em]"
            >
              Seven Days.
              <br />
              <span className="italic text-[#762C49]">
                One Complete
              </span>
              <br />
              Ritual.
            </motion.h1>

            <motion.p
              variants={reveal}
              className="mt-8 max-w-[470px] font-serif text-xl leading-relaxed text-[#6B4D4C]"
            >
              Seven planetary inspirations. Seven fragrance expressions.
              One complete collection.
            </motion.p>

            <motion.p
              variants={reveal}
              className="mt-5 max-w-[450px] text-sm leading-7 text-[#806D60]"
            >
              Discover the SEVOURA 7-Day Planetary Blend Collection —
              a thoughtful interpretation of traditional planetary
              symbolism through distinctive fragrance blends and
              personal intention.
            </motion.p>

            <motion.div variants={reveal} className="mt-8">
              <div className="flex items-end gap-3">
                <span className="font-serif text-4xl text-[#762C49]">
                  <LivePrice fallback="₹1,799" />
                </span>
                <span className="pb-1 text-sm text-[#9C8B7A] line-through">
                  <LivePrice fallback="₹2,499" kind="mrp" />
                </span>
              </div>
              <p className="mt-2 text-[11px] tracking-wide text-[#806D60]">
                7 × 4 ml alcohol-free fragrance blends
              </p>
              <div className="mt-5 inline-flex flex-wrap items-center gap-3 border border-[#B98A4B]/60 bg-[#F0E1CD] px-4 py-3">
                <span className="bg-[#702943] px-3 py-2 text-[10px] font-bold tracking-[0.18em] text-white">
                  FESTIVE OFFER
                </span>
                <span className="text-sm font-semibold text-[#702943]">SAVE <LivePrice fallback="₹700" kind="saving" /></span>
                <span className="text-xs text-[#806D60]">Limited-period collection price</span>
              </div>
              <p className="mt-1 text-[10px] tracking-[0.15em] text-[#A57C43]">
                PREPAID · FREE SHIPPING
              </p>
            </motion.div>

            <motion.div
              variants={reveal}
              className="mt-8 flex flex-wrap gap-3"
            >
              <AddToCartButton className="group inline-flex items-center gap-5 bg-[#702943] px-7 py-4 text-[10px] font-bold tracking-[0.2em] text-[#FFF8EC] transition-all duration-300 hover:bg-[#4D1B30]">
                ADD TO BAG
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </AddToCartButton>

              <Link
                href="/the-seven"
                className="inline-flex items-center gap-4 border border-[#702943]/50 px-7 py-4 text-[10px] font-bold tracking-[0.2em] transition-all duration-300 hover:bg-[#702943] hover:text-white"
              >
                DISCOVER THE SEVEN
              </Link>
            </motion.div>

            <motion.p
              variants={reveal}
              className="mt-6 text-[9px] leading-5 text-[#9A8777]"
            >
              Limited introductory pricing · Secure payment through Razorpay
            </motion.p>
          </motion.div>

          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.88, x: 55 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 1.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[690px]"
          >
            <div className="absolute -inset-5 border border-[#C7A36C]/40" />

            <motion.div
              whileHover={{ scale: 1.025 }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden bg-[#E7D5BD] p-3 shadow-[0_35px_90px_rgba(67,32,35,0.18)]"
            >
              <Image
                src="/sevoura-bottle.jpeg"
                alt="SEVOURA complete seven-day planetary fragrance collection"
                width={544}
                height={404}
                priority
                className="h-[340px] w-full object-contain sm:h-[440px] lg:h-[510px]"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-7 flex h-24 w-24 items-center justify-center rounded-full border border-[#C5A36B]/50 bg-[#FBF5E9] shadow-xl"
            >
              <div className="text-center">
                <Sparkles className="mx-auto text-[#A77B42]" size={23} />
                <p className="mt-1 text-[8px] tracking-[0.15em]">SEVEN DAYS</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 h-px w-full bg-[#C8AC82]/50" />
      </section>

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
              <p className="mb-5 text-[10px] font-semibold tracking-[0.3em] text-[#A57C43]">
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
              <p className="mt-5 text-sm leading-7 text-[#8A7669]">
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
                <p className="mt-4 text-sm leading-6 text-[#624A46]">
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
            <p className="text-[10px] tracking-[0.35em] text-[#D8B77D]">
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
                  <p className="mt-4 text-sm leading-7 text-[#D9C5B6]">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SEVEN BLENDS */}
      <section className="bg-[#F5EFE4] px-6 py-28 lg:px-16">
        <div className="mx-auto max-w-[1300px]">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <p className="text-[10px] font-semibold tracking-[0.32em] text-[#A57C43]">
              SEVEN DAYS · SEVEN EXPRESSIONS
            </p>
            <h2 className="mt-5 font-serif text-5xl md:text-6xl">
              Meet your <span className="italic text-[#762C49]">seven.</span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#806D60]">
              Explore the fragrance identity associated with each day.
              Every blend brings its own notes, character and intention.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {blends.map((blend) => (
              <motion.article
                variants={reveal}
                key={blend.number}
                whileHover={{ y: -8 }}
                className="group overflow-hidden border border-[#D8C5A7] bg-[#FCF7EE] shadow-[0_8px_30px_rgba(71,35,39,0.05)] transition-all duration-500 hover:shadow-[0_24px_55px_rgba(71,35,39,0.15)]"
              >
                <div className="relative overflow-hidden bg-[#E9DFD1] p-5">
                  <div className="absolute left-4 top-4 z-10 bg-[#702943] px-3 py-2 text-[9px] font-bold tracking-[0.2em] text-white">
                    {blend.day}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.055 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative mx-auto h-[330px] w-full"
                  >
                    <Image
                      src={blend.image}
                      alt={`SEVOURA ${blend.day} ${blend.fragrance} fragrance bottle`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain drop-shadow-[0_18px_18px_rgba(50,30,25,0.16)]"
                    />
                  </motion.div>
                  <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/70 bg-[#FBF5E9]/85 px-3 py-2 text-[9px] tracking-[0.18em] text-[#702943]">
                    4 ML
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] font-bold tracking-[0.24em] text-[#A57C43]">BLEND {blend.number}</p>
                    <span className="h-px flex-1 bg-[#D8C5A7]" />
                    <span className="text-[10px] text-[#9A8777]">{blend.planet}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-3xl text-[#481D30]">{blend.fragrance}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#806D60]">{blend.notes}</p>
                  <div className="mt-5 border-y border-[#E2D4C1] py-4">
                    <p className="text-[9px] font-bold tracking-[0.2em] text-[#A57C43]">THE INSPIRATION</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#642B40]">{blend.intention}</p>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[#806D60]">{blend.description}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#E2D4C1] pt-5">
                    <div>
                      <p className="text-[9px] tracking-[0.18em] text-[#9A8777]">PART OF THE SEVEN</p>
                      <p className="mt-1 font-serif text-lg text-[#762C49]">7-Day Collection</p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CDB994] font-serif text-sm text-[#762C49] transition-all duration-300 group-hover:bg-[#702943] group-hover:text-white">
                      {blend.number}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="mt-14 text-center">
            <Link
              href="/the-seven"
              className="group inline-flex items-center gap-4 border-b border-[#762C49] pb-2 text-[10px] font-bold tracking-[0.2em] text-[#762C49]"
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
              className="text-[10px] font-bold tracking-[0.3em] text-[#E4C58D]"
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
              className="mt-7 max-w-lg text-sm leading-7 text-[#E8D8CC]"
            >
              Discover the SEVOURA 7-Day Planetary Blend Collection.
              Seven fragrance expressions, thoughtfully brought together.
            </motion.p>

            <motion.div
              variants={reveal}
              className="my-9 border-y border-[#D7B77E]/40 py-6"
            >
              <p className="font-serif text-2xl">7 × 4 ml fragrance blends</p>
              <p className="mt-2 text-sm text-[#E8D8CC]">
                Alcohol-free · Complete seven-day set
              </p>
            </motion.div>

            <motion.div variants={reveal}>
              <span className="font-serif text-5xl text-[#E7C58B]">
                <LivePrice fallback="₹1,799" />
              </span>
              <p className="mt-2 text-xs tracking-wide text-[#E8D8CC]">
                PREPAID · FREE SHIPPING
              </p>
            </motion.div>

            <motion.div variants={reveal}>
              <AddToCartButton className="group mt-8 inline-flex items-center gap-6 bg-[#F5EBDC] px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-[#552038] transition-all hover:bg-white">
                ADD TO BAG
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-2"
                />
              </AddToCartButton>
            </motion.div>

            <motion.p
              variants={reveal}
              className="mt-7 max-w-lg text-[10px] leading-6 text-[#D8C2B6]"
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
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#A57C43]">
              YOUR EVERYDAY RITUAL
            </p>
            <h2 className="mt-6 font-serif text-5xl leading-tight">
              Make every day
              <br />
              <span className="italic text-[#762C49]">feel intentional.</span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-8 text-[#806D60]">
              Discover the collection at your own pace. Explore the
              fragrance notes, learn about the inspiration behind each
              blend, and choose an expression that feels meaningful to you.
            </p>
            <Link
              href="/ritual-finder"
              className="group mt-8 inline-flex items-center gap-4 border-b border-[#762C49] pb-2 text-[10px] font-bold tracking-[0.2em]"
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
                <span className="font-serif text-3xl text-[#B58A4D]">
                  {number}
                </span>
                <div>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#806D60]">
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
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#A57C43]">
              A LITTLE MORE TO KNOW
            </p>
            <h2 className="mt-5 font-serif text-5xl leading-tight">
              Questions,
              <br />
              <span className="italic text-[#762C49]">answered.</span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#806D60]">
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
                  <p className="max-w-2xl pb-7 pr-8 text-sm leading-7 text-[#806D60]">
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
            className="mt-7 text-[10px] tracking-[0.35em] text-[#D9B77C]"
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
            className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#E3D0C2]"
          >
            Discover seven fragrance expressions and bring a little
            more intention into the everyday.
          </motion.p>

          <motion.div variants={reveal}>
            <AddToCartButton className="group mt-10 inline-flex items-center gap-6 bg-[#F5EBDC] px-9 py-5 text-[10px] font-bold tracking-[0.2em] text-[#552038] transition-all hover:bg-white">
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