'use client';

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import {
  ArrowUpRight,
  MessageCircle,
  Mail,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const sections = [
  {
    number: "01",
    title: "Acceptance of Terms",
    content:
      "By accessing or using the SEVOURA website, you acknowledge that you have read and understood these Terms & Conditions. Your continued use of the website indicates your acceptance of the terms described on this page. If you do not agree with these terms, please discontinue using the website.",
  },
  {
    number: "02",
    title: "About SEVOURA",
    content:
      "SEVOURA presents a considered fragrance and ritual experience inspired by seven planetary inspirations. Our website provides information about our brand, products, collections and related experiences. Product descriptions and brand information are provided to help visitors understand our offerings.",
  },
  {
    number: "03",
    title: "Products & Information",
    content:
      "We make reasonable efforts to display product descriptions, photographs, colours and details as accurately as possible. However, the appearance of products may vary slightly depending on your device, screen settings and lighting conditions. Product information may be updated from time to time.",
  },
  {
    number: "04",
    title: "Orders & Acceptance",
    content:
      "Placing an order through our website constitutes an offer to purchase the selected products. An order is subject to confirmation and acceptance by SEVOURA. We reserve the right to contact customers regarding order details or to decline an order where necessary. An order confirmation message does not necessarily mean that the order has been dispatched.",
  },
  {
    number: "05",
    title: "Pricing & Payments",
    content:
      "Prices displayed on the website are shown in the applicable currency and may be revised without prior notice. Any applicable delivery charges, taxes or additional costs will be communicated during checkout where relevant. Orders must be paid for using the payment methods made available on the website.",
  },
  {
    number: "06",
    title: "Shipping & Delivery",
    content:
      "Delivery timelines are estimates and may vary depending on the delivery location, courier availability and circumstances beyond our control. Customers are responsible for providing accurate delivery information when placing an order. For detailed information about dispatch, delivery and returns, please refer to our Shipping & Returns page.",
  },
  {
    number: "07",
    title: "Returns & Exchanges",
    content:
      "Returns, exchanges and refund requests are governed by the applicable SEVOURA return policy. Eligibility may depend on product condition, packaging and the time within which a request is submitted. Please review our Shipping & Returns page before placing an order or contacting our customer care team.",
  },
  {
    number: "08",
    title: "Website Use",
    content:
      "You agree to use this website only for lawful purposes. You must not misuse the website, attempt unauthorised access, interfere with its operation, distribute harmful material or use any part of the website in a manner that may damage SEVOURA or other visitors.",
  },
  {
    number: "09",
    title: "Intellectual Property",
    content:
      "The SEVOURA name, logo, visual identity, website design, written content, photographs, graphics and other brand materials are protected by applicable intellectual property laws. No material may be copied, reproduced, modified, distributed or commercially used without prior written permission from the respective rights holder.",
  },
  {
    number: "10",
    title: "Brand Content & Interpretations",
    content:
      "SEVOURA may present traditional associations, planetary inspirations and personal interpretations as part of its fragrance and ritual storytelling. Such content is shared for cultural, creative and personal exploration. It should not be understood as medical, therapeutic or guaranteed scientific advice.",
  },
  {
    number: "11",
    title: "Third-Party Links",
    content:
      "Our website may contain links to external websites or services for your convenience. These third-party websites operate independently and may have their own terms, privacy policies and practices. SEVOURA is not responsible for the content, availability or policies of external websites.",
  },
  {
    number: "12",
    title: "Limitation of Liability",
    content:
      "To the extent permitted by applicable law, SEVOURA shall not be responsible for indirect or consequential losses arising from the use of this website, temporary website interruptions or circumstances beyond our reasonable control. Nothing in these terms excludes any rights or liabilities that cannot legally be excluded.",
  },
  {
    number: "13",
    title: "Privacy & Personal Information",
    content:
      "Information shared with us through the website may be used to process orders, respond to enquiries and provide customer support in accordance with our Privacy Policy. Please read the Privacy Policy to understand how personal information is handled.",
  },
  {
    number: "14",
    title: "Changes to These Terms",
    content:
      "SEVOURA may revise these Terms & Conditions when required to reflect changes to our services, website or applicable requirements. Updated terms will be published on this page. Visitors are encouraged to review this page periodically.",
  },
  {
    number: "15",
    title: "Governing Law",
    content:
      "These Terms & Conditions shall be interpreted in accordance with the applicable laws of India, subject to any mandatory consumer protection rights and other applicable legal requirements.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reveal}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}





export default function TermsPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F5F0E7] text-[#542038]">
      <SiteHeader />

      {/* ANIMATED HERO */}
      <section className="relative overflow-hidden bg-[#481B30] text-[#F8F0E5]">
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-24 -top-28 h-[540px] w-[540px] rounded-full border border-[#8b5368]/30"
        >
          <div className="absolute inset-16 rounded-full border border-[#8b5368]/30">
            <div className="absolute inset-16 rounded-full border border-[#8b5368]/30" />
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#A66C6C]/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1250px] px-6 py-24 md:px-12 md:py-32">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex items-center gap-3 text-[10px] tracking-[0.25em] text-[#E5C38B]"
          >
            <Link href="/" className="transition hover:text-white">HOME</Link>
            <span>›</span>
            <span>LEGAL</span>
          </motion.div>

          <div className="max-w-[780px]">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="mb-7 text-[11px] tracking-[0.35em] text-[#D9B77C]"
            >
              THE DETAILS THAT MATTER
            </motion.p>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-serif text-5xl leading-[1.08] md:text-7xl"
            >
              Terms &<br /> Conditions
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-9 max-w-[610px] text-base leading-8 text-[#F0DFE2] md:text-lg"
            >
              A little clarity goes a long way. Please take a moment to
              understand the terms that guide your experience with SEVOURA.
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 1.1 }}
              className="mt-12 h-px w-full origin-left bg-[#A77A72]/60"
            />

            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-6 text-[10px] tracking-[0.25em] text-[#E5C38B]"
            >
              YOUR EXPERIENCE. OUR COMMITMENT.
            </motion.p>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-[1150px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <Reveal>
            <p className="text-[10px] tracking-[0.3em] text-[#A66C35]">
              IMPORTANT INFORMATION
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Welcome to SEVOURA.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-5 text-[15px] leading-8 text-[#6E5860]">
              <p>
                We believe that a thoughtful experience begins with clarity.
                These Terms & Conditions explain the guidelines for accessing
                and using our website, exploring our collections and engaging
                with our services.
              </p>
              <p>
                Please read the following information carefully. These terms
                are intended to help create a transparent and comfortable
                experience for everyone visiting SEVOURA.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TERMS CONTENT */}
      <section className="border-y border-[#E3D5C4] bg-[#F0E8DC]">
        <div className="mx-auto max-w-[1150px] px-6 py-20 md:px-12 md:py-28">
          <Reveal className="mb-16 max-w-[650px]">
            <p className="text-[10px] tracking-[0.3em] text-[#A66C35]">
              THE GUIDELINES
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Everything you need to know.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#78656A]">
              The following sections outline the terms that apply when
              using the SEVOURA website and exploring our offerings.
            </p>
          </Reveal>

          <div className="border-t border-[#D9C9B8]">
            {sections.map((section, index) => (
              <motion.article
                key={section.number}
                initial={reduceMotion ? false : { opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  duration: 0.65,
                  delay: reduceMotion ? 0 : (index % 2) * 0.08,
                  ease: "easeOut",
                }}
                className="group grid gap-5 border-b border-[#D9C9B8] py-9 transition-colors duration-500 hover:bg-[#E9DFD1]/60 md:grid-cols-[90px_0.8fr_1.2fr] md:gap-10 md:px-4"
              >
                <motion.span
                  whileHover={reduceMotion ? undefined : { scale: 1.15, x: 5 }}
                  className="font-serif text-2xl text-[#B17B42]"
                >
                  {section.number}
                </motion.span>

                <h3 className="font-serif text-2xl leading-snug text-[#542038] transition-transform duration-500 group-hover:translate-x-1">
                  {section.title}
                </h3>

                <p className="text-sm leading-8 text-[#74636A]">
                  {section.content}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-[#F5F0E7] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-[1150px]">
          <Reveal>
            <div className="relative overflow-hidden bg-[#E9DFD1] px-7 py-12 md:px-16 md:py-16">
              <motion.div
                aria-hidden="true"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#CBB69C]/60"
              />
              <div className="pointer-events-none absolute -right-5 -top-12 h-52 w-52 rounded-full border border-[#CBB69C]/40" />

              <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-[#A66C35]">
                    NEED MORE INFORMATION?
                  </p>
                  <h2 className="mt-5 font-serif text-4xl leading-tight text-[#542038] md:text-5xl">
                    We are here to help.
                  </h2>
                  <p className="mt-5 max-w-[500px] text-sm leading-7 text-[#78656A]">
                    Have a question about these terms, an order or your
                    experience with SEVOURA? Our team would be happy to help.
                  </p>
                </div>

                <motion.a
                  href="https://wa.me/919211877712?text=Hello%20SEVOURA%2C%20I%20have%20a%20query%20regarding%20your%20Terms%20%26%20Conditions."
                  target="_blank"
                  rel="noreferrer"
                  whileHover={reduceMotion ? undefined : { scale: 1.04, y: -4 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  className="inline-flex min-h-[58px] items-center justify-center gap-4 bg-[#481B30] px-8 text-[10px] font-semibold tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#782C49]"
                >
                  <MessageCircle size={17} />
                  CONTACT ON WHATSAPP
                  <ArrowUpRight size={16} />
                </motion.a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-col gap-5 border-t border-[#DCCDBB] pt-8 text-sm text-[#6E5860] md:flex-row md:items-center md:justify-between">
              <p>We would love to hear from you.</p>
              <a
                href="mailto:hello@sevoura.com"
                className="inline-flex items-center gap-3 transition-colors hover:text-[#A66C35]"
              >
                <Mail size={16} />
                hello@sevoura.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
