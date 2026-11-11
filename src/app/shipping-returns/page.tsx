'use client';

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  MessageCircle,
  PackageCheck,
  Truck,
  Clock3,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Ornament from "@/components/ui/Ornament";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 55, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const shippingDetails = [
  {
    icon: Clock3,
    title: "Order Processing",
    text: "Orders are dispatched within 1–2 business days of confirmation.",
    detail: "PREPARATION",
  },
  {
    icon: Truck,
    title: "Delivery",
    text: "Orders are typically delivered within 3–7 business days, depending on the destination.",
    detail: "DELIVERY",
  },
  {
    icon: PackageCheck,
    title: "Shipping Charges",
    text: "Free shipping on all orders. SEVOURA accepts prepaid online payments only (UPI, cards, net banking and wallets) — Cash on Delivery is not available.",
    detail: "SHIPPING",
  },
];

const sections = [
  {
    number: "01",
    title: "Can I change or cancel my order?",
    paragraphs: [
      "Orders can be cancelled or modified only before they are dispatched.",
      "Once an order has been shipped, it cannot be cancelled or modified.",
      "To request a cancellation, please contact us at hello@sevoura.com with your order number as soon as possible.",
    ],
  },
  {
    number: "02",
    title: "Returns & Exchanges",
    paragraphs: [
      "At SEVOURA, every fragrance is carefully packed and quality-checked before dispatch. As our attar blends are personal-use fragrance products, we currently do not accept returns or exchanges for change of mind, preference, or fragrance choice once the product has been delivered.",
      "However, if your order arrives damaged, defective, or incorrect, we are happy to assist.",
    ],
  },
  {
    number: "03",
    title: "What should I do if my order arrives damaged?",
    paragraphs: [
      "Please contact us within 48 hours of delivery at hello@sevoura.com with:",
    ],
    bullets: [
      "Your order number",
      "Clear photographs/videos of the package and product",
      "A brief description of the issue",
      "Please retain the original packaging until the issue has been resolved.",
    ],
    ending:
      "After verification, we may arrange a replacement or appropriate resolution.",
  },
  {
    number: "04",
    title: "What if I receive the wrong product?",
    paragraphs: [
      "If you receive an item different from what you ordered, please contact us within 48 hours of delivery with your order number and photographs of the product received. We will arrange the appropriate resolution after verification.",
    ],
  },
  {
    number: "05",
    title: "Can I return a fragrance if I don't like the fragrance?",
    paragraphs: [
      "We want you to discover the SEVOURA collection with confidence. However, because fragrance is a personal preference and our products are intended for personal use, we do not accept returns based solely on fragrance preference after delivery.",
      "We encourage you to explore the fragrance descriptions and the Seven-Day Ritual Guide before making your selection.",
    ],
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      variants={reveal}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}





export default function ShippingReturnsPage() {
  const reduce = useReducedMotion();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F5F0E7] text-[#542038]">
      <SiteHeader />

      {/* CINEMATIC HERO */}
      <section className="relative isolate overflow-hidden bg-[#481B30] text-[#F8F0E5]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,#d4a77b,transparent_45%)]" />
        </div>

        <motion.div
          aria-hidden="true"
          animate={reduce ? {} : { rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-52 -top-48 h-[760px] w-[760px] rounded-full border border-[#d7b17c]/30"
        >
          <div className="absolute inset-16 rounded-full border border-[#d7b17c]/25" />
          <div className="absolute inset-32 rounded-full border border-[#d7b17c]/20" />
          <div className="absolute left-1/2 top-0 h-3 w-3 rounded-full bg-[#D8B77D] shadow-[0_0_30px_#D8B77D]" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          animate={reduce ? {} : { y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[16%] top-[30%] hidden h-28 w-28 rounded-full border border-[#d7b17c]/25 lg:block"
        />

        <div className="relative mx-auto max-w-[1250px] px-6 py-24 md:px-12 md:py-36">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mb-12 flex items-center gap-3 text-[12px] tracking-[0.25em] text-[#E5C38B]"
          >
            <Link href="/" className="transition hover:text-white">HOME</Link>
            <span>›</span>
            <span>CUSTOMER CARE</span>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="mb-7 text-[12px] text-[#D9B77C] md:text-[13px]"
          >
            A THOUGHTFUL JOURNEY, FROM US TO YOU
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 60, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.25, delay: 0.3, ease }}
            className="max-w-[850px] font-serif text-6xl leading-[1.02] md:text-8xl lg:text-[104px]"
          >
            Shipping
            <br />
            <span className="text-[#D9B77C]">&amp; Returns</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease }}
            className="mt-9 max-w-[610px] text-base leading-8 text-[#F0DFE2] md:text-lg"
          >
            Every SEVOURA order is carefully prepared and thoughtfully
            packed. Here is everything you need to know about delivery,
            cancellations and returns.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, delay: 0.9, ease }}
            style={{ transformOrigin: "left" }}
            className="mt-12 h-px max-w-[780px] bg-gradient-to-r from-[#D9B77C] via-[#A77A72] to-transparent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25 }}
            className="mt-6 text-[12px] tracking-[0.25em] text-[#E5C38B]"
          >
            CAREFULLY PACKED. THOUGHTFULLY DELIVERED.
          </motion.p>

          <motion.div
            animate={reduce ? {} : { y: [0, 9, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-14 flex items-center gap-3 text-[11px] tracking-[0.25em] text-[#D9B77C]/80"
          >
            <span className="h-9 w-px bg-[#D9B77C]" />
            SCROLL TO EXPLORE
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-[1150px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <Reveal>
            <p className="text-[12px] tracking-[0.3em] text-[#A66C35]">
              SHIPPING INFORMATION
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              From our hands
              <br />
              <span className="text-[#A66C35]">to yours.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-[15px] leading-8 text-[#6E5860] md:pt-8">
              We carefully pack every SEVOURA order to ensure it reaches you
              safely and in pristine condition. We want every part of your
              experience, from placing your order to receiving it, to feel
              considered and effortless.
            </p>
          </Reveal>
        </div>

        {/* SHIPPING CARDS */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 grid gap-5 md:grid-cols-3"
        >
          {shippingDetails.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={reveal}
                whileHover={
                  reduce
                    ? {}
                    : {
                        y: -12,
                        rotateX: 3,
                        rotateY: index === 1 ? 0 : index === 0 ? -2 : 2,
                        transition: { duration: 0.35 },
                      }
                }
                className="group relative overflow-hidden border border-[#E1D3C2] bg-[#F0E8DC] p-8 shadow-[0_8px_30px_rgba(84,32,56,0.035)] transition-shadow duration-500 hover:shadow-[0_24px_55px_rgba(84,32,56,0.13)]"
                style={{ transformPerspective: 1000 }}
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full border-b border-l border-[#D8C4A8]/60 transition-all duration-700 group-hover:h-36 group-hover:w-36" />

                <div className="relative flex items-center justify-between">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.12 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D7C3A9] text-[#A66C35]"
                  >
                    <Icon size={25} strokeWidth={1.3} />
                  </motion.div>
                  <span className="text-[11px] tracking-[0.2em] text-[#A66C35]">
                    {item.detail}
                  </span>
                </div>

                <h3 className="relative mt-10 font-serif text-2xl">
                  {item.title}
                </h3>
                <p className="relative mt-4 text-[15px] leading-7 text-[#74636A]">
                  {item.text}
                </p>

                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: index * 0.15 }}
                  className="mt-8 h-px bg-gradient-to-r from-[#B17B42] to-transparent"
                />
              </motion.div>
            );
          })}
        </motion.div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex gap-5 border-l-2 border-[#B17B42] bg-[#F0E8DC] px-7 py-6">
            <ShieldCheck className="mt-1 shrink-0 text-[#A66C35]" size={23} />
            <p className="text-[15px] leading-7 text-[#74636A]">
              Once your order is dispatched, you will receive a tracking link
              via email/SMS/WhatsApp. Delivery timelines may vary for remote
              locations, weekends, public holidays, or circumstances beyond
              our control.
            </p>
          </div>
        </Reveal>
      </section>

      {/* RETURNS */}
      <section className="relative overflow-hidden border-y border-[#E3D5C4] bg-[#F0E8DC]">
        <div className="pointer-events-none absolute -left-64 top-40 h-[600px] w-[600px] rounded-full border border-[#D8C5AC]/40" />

        <div className="relative mx-auto max-w-[1150px] px-6 py-20 md:px-12 md:py-28">
          <Reveal>
            <p className="text-[12px] tracking-[0.3em] text-[#A66C35]">
              RETURNS & CUSTOMER CARE
            </p>
            <h2 className="mt-5 max-w-[750px] font-serif text-4xl leading-tight md:text-6xl">
              Here when you
              <br />
              <span className="text-[#A66C35]">need us.</span>
            </h2>
            <p className="mt-5 max-w-[600px] text-[15px] leading-7 text-[#78656A]">
              Please review the following information for order changes,
              damaged deliveries and product-related concerns.
            </p>
          </Reveal>

          <div className="mt-16 border-t border-[#D9C9B8]">
            {sections.map((section, index) => (
              <motion.article
                key={section.number}
                initial={
                  reduce
                    ? false
                    : {
                        opacity: 0,
                        x: index % 2 === 0 ? -45 : 45,
                        y: 25,
                      }
                }
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.85, delay: 0.05, ease }}
                className="group grid gap-5 border-b border-[#D9C9B8] py-10 md:grid-cols-[90px_0.8fr_1.2fr] md:gap-10"
              >
                <div className="relative">
                  <span className="inline-block pt-2 text-[#B17B42] transition-colors duration-500 group-hover:text-[#542038]">
                    <Ornament size={18} />
                  </span>
                  <motion.span
                    initial={{ height: 0 }}
                    whileInView={{ height: 45 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-3 block w-px bg-[#B17B42]/50"
                  />
                </div>

                <h3 className="font-serif text-2xl leading-snug text-[#542038] transition-transform duration-500 group-hover:translate-x-1 md:text-[27px]">
                  {section.title}
                </h3>

                <div className="space-y-5 text-[15px] leading-8 text-[#74636A]">
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}

                  {section.bullets && (
                    <ul className="space-y-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B17B42]" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.ending && <p>{section.ending}</p>}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-[#F5F0E7] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1150px]">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease }}
            className="group relative overflow-hidden bg-[#E9DFD1] px-7 py-12 md:px-16 md:py-16"
          >
            <motion.div
              aria-hidden="true"
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute -right-28 -top-44 h-[450px] w-[450px] rounded-full border border-[#CBB69C]/70"
            >
              <div className="absolute inset-12 rounded-full border border-[#CBB69C]/50" />
              <div className="absolute inset-24 rounded-full border border-[#CBB69C]/40" />
            </motion.div>

            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
              <div>
                <p className="text-[12px] tracking-[0.3em] text-[#A66C35]">
                  WE ARE HERE TO HELP
                </p>
                <h2 className="mt-5 font-serif text-4xl leading-tight text-[#542038] md:text-6xl">
                  Need a little
                  <br />
                  assistance?
                </h2>
                <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-[#78656A]">
                  For cancellation requests, damaged deliveries or any
                  questions about your order, get in touch with our team.
                </p>
                <a
                  href="mailto:hello@sevoura.com"
                  className="mt-5 inline-flex items-center gap-3 text-[15px] text-[#542038] transition hover:text-[#A66C35]"
                >
                  <Mail size={16} />
                  hello@sevoura.com
                </a>
              </div>

              <motion.a
                href="https://wa.me/919211877712?text=Hello%20SEVOURA%2C%20I%20need%20help%20with%20my%20order."
                target="_blank"
                rel="noreferrer"
                whileHover={reduce ? {} : { scale: 1.055, y: -5 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex min-h-[60px] items-center justify-center gap-4 overflow-hidden bg-[#481B30] px-8 text-[12px] font-semibold tracking-[0.15em] text-white shadow-lg transition-shadow duration-500 hover:shadow-[0_15px_40px_rgba(72,27,48,0.35)]"
              >
                <motion.span
                  initial={{ x: "-120%" }}
                  whileHover={{ x: "120%" }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <MessageCircle size={17} />
                CHAT ON WHATSAPP
                <ArrowUpRight size={16} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
