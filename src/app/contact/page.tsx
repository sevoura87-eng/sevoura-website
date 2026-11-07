
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, Clock, ArrowUpRight, Camera, PlayCircle,
  Send, ShieldCheck, LockKeyhole, Sparkles, Headphones,
  Package, MessageCircle, Heart, ChevronDown, Gift,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Ornament from "@/components/ui/Ornament";

const faqs = [
  {
    q: "How can I contact SEVOURA customer support?",
    a: "You can reach our team by emailing hello@sevoura.com or calling +91-9211877712. Our customer support team is available Monday to Sunday, 10:00 AM to 6:00 PM IST."
  },
  {
    q: "How long does it take to receive a response?",
    a: "We aim to respond to all enquiries within 1–2 business days."
  },
  {
    q: "Where can I ask questions about my order?",
    a: "For order-related assistance, write to hello@sevoura.com. Please include your order details so our team can help you more efficiently."
  },
  {
    q: "Can I learn more about the SEVOURA fragrances?",
    a: "Absolutely. Contact our team for assistance with our Seven-Day Planetary Blend Collection, fragrance rituals and product discovery."
  },
  {
    q: "How can I follow SEVOURA?",
    a: "Follow @SEVOURA on Instagram for new launches, collection stories, fragrance rituals, inspiration and community updates."
  },
  {
    q: "Can I contact you about gifting or collaborations?",
    a: "Yes. Send your enquiry to hello@sevoura.com and our team will be happy to review it."
  }
];

const contactMethods = [
  {
    number: "01",
    title: "Write to Us",
    subtitle: "WE'RE JUST AN EMAIL AWAY",
    value: "hello@sevoura.com",
    detail: "For orders, product questions and everything in between.",
    icon: Mail,
    href: "mailto:hello@sevoura.com"
  },
  {
    number: "02",
    title: "Call Our Team",
    subtitle: "LET'S HAVE A CONVERSATION",
    value: "+91-9211877712",
    detail: "Speak with our customer support team directly.",
    icon: Phone,
    href: "tel:+919211877712"
  },
  {
    number: "03",
    title: "Customer Support",
    subtitle: "HERE WHEN YOU NEED US",
    value: "7 Days a Week",
    detail: "Monday–Sunday | 10:00 AM–6:00 PM IST",
    icon: Headphones,
    href: "mailto:hello@sevoura.com"
  }
];

const helpOptions = [
  {
    icon: Package,
    title: "Order Assistance",
    text: "Questions about an existing order, delivery or your shopping experience.",
    link: "mailto:hello@sevoura.com?subject=Order%20Assistance"
  },
  {
    icon: Sparkles,
    title: "Fragrance Discovery",
    text: "Explore our fragrances, collection stories and Seven-Day Ritual.",
    link: "mailto:hello@sevoura.com?subject=Fragrance%20Enquiry"
  },
  {
    icon: Gift,
    title: "Gifting Enquiries",
    text: "Connect with us for gifting-related questions and product enquiries.",
    link: "mailto:hello@sevoura.com?subject=Gifting%20Enquiry"
  },
  {
    icon: MessageCircle,
    title: "General Enquiries",
    text: "Have something else in mind? We would love to hear from you.",
    link: "mailto:hello@sevoura.com?subject=General%20Enquiry"
  }
];

const supportSteps = [
  {
    number: "01",
    title: "Reach Out",
    text: "Choose your preferred way to connect with our customer support team."
  },
  {
    number: "02",
    title: "We Listen",
    text: "Share your question or concern and our team will review your enquiry."
  },
  {
    number: "03",
    title: "Get Assistance",
    text: "We'll get back to you and help you with the next steps."
  }
];

const reveal = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0 }
};

export default function ContactPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <>
      <SiteHeader />

      <main className="overflow-x-clip bg-[#F5EFE5] text-[#392B2D]">

        {/* 01 - CINEMATIC HERO */}
        <section className="relative flex min-h-[760px] items-center justify-center overflow-hidden px-6 py-32 md:min-h-[900px]">

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#E8D6C3_0%,_#F5EFE5_65%)]" />

          <div className="absolute left-[-160px] top-20 h-[430px] w-[430px] rounded-full border border-[#B28B4E]/20" />
          <div className="absolute left-[-110px] top-32 h-[330px] w-[330px] rounded-full border border-[#B28B4E]/20" />
          <div className="absolute bottom-[-180px] right-[-100px] h-[500px] w-[500px] rounded-full border border-[#B28B4E]/20" />

          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 7, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[9%] top-[17%] hidden h-40 w-40 items-center justify-center rounded-full border border-[#B28B4E]/40 bg-white/10 shadow-2xl backdrop-blur-sm lg:flex"
          >
            <Sparkles size={48} strokeWidth={0.8} className="text-[#B28B4E]" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[18%] left-[10%] hidden h-24 w-24 rounded-full border border-[#782C49]/20 bg-[#782C49]/5 lg:block"
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.16 } }
            }}
            className="relative z-10 mx-auto max-w-5xl text-center"
          >
            <motion.p variants={reveal} className="flex items-center justify-center gap-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A47A55]">
              <span className="h-px w-9 bg-[#B28B4E]" />
              THE ART OF CONNECTION
              <span className="h-px w-9 bg-[#B28B4E]" />
            </motion.p>

            <motion.h1
              variants={reveal}
              className="mt-10 font-serif text-6xl font-normal leading-[1.05] tracking-[-2px] text-[#782C49] md:text-8xl lg:text-[112px]"
            >
              Let&apos;s Start
              <br />
              <span className="italic text-[#B28B4E]">a Conversation.</span>
            </motion.h1>

            <motion.p variants={reveal} className="mx-auto mt-9 max-w-2xl text-sm leading-8 text-[#766866] md:text-base">
              Whether you&apos;re curious about our fragrances, need assistance
              with an order, or simply want to connect, we&apos;d love to hear
              from you. Every meaningful connection begins with a conversation.
            </motion.p>

            <motion.div variants={reveal} className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <a href="mailto:hello@sevoura.com" className="group inline-flex items-center gap-4 bg-[#782C49] px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F5EFE5] transition-all duration-500 hover:bg-[#5D2037] hover:shadow-xl">
                Get in Touch
                <ArrowUpRight size={17} />
              </a>

              <a href="tel:+919211877712" className="inline-flex items-center gap-3 border border-[#B28B4E]/60 px-10 py-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#782C49] transition hover:bg-[#E9DCCB]">
                <Phone size={15} />
                Call Us
              </a>
            </motion.div>

            <motion.div variants={reveal} className="mt-24 flex flex-col items-center gap-4">
              <span className="h-16 w-px bg-[#B28B4E]" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#987D6B]">
                WE WOULD LOVE TO HEAR FROM YOU
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* 02 - BRAND INTRODUCTION */}
        <section className="relative overflow-hidden bg-[#782C49] px-6 py-28 text-[#F5EFE5] md:py-36">
          <div className="absolute -right-28 -top-28 h-[450px] w-[450px] rounded-full border border-[#E9D1A7]/15" />
          <div className="absolute -bottom-40 -left-24 h-[450px] w-[450px] rounded-full border border-[#E9D1A7]/15" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={reveal}
            transition={{ duration: 0.9 }}
            className="relative mx-auto max-w-5xl text-center"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#E9D1A7]">
              A PERSONAL TOUCH
            </span>

            <h2 className="mt-8 font-serif text-4xl leading-tight md:text-7xl">
              More than a fragrance.
              <br />
              <span className="italic text-[#E9D1A7]">A connection that matters.</span>
            </h2>

            <p className="mx-auto mt-9 max-w-2xl text-sm leading-8 text-[#F5EBDD]/75 md:text-base">
              At SEVOURA, we believe every detail matters. From discovering
              your favourite fragrance to receiving your order, our team is
              here to make your experience thoughtful and memorable.
            </p>
          </motion.div>
        </section>

        {/* 03 - CONTACT METHODS */}
        <section className="px-5 py-28 md:px-10 md:py-36">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={reveal}
              className="mb-20 text-center"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A47A55]">
                CONNECT WITH SEVOURA
              </span>
              <h2 className="mt-6 font-serif text-4xl text-[#782C49] md:text-6xl">
                We&apos;re Here for You
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#766866]">
                Choose the way you&apos;d like to connect. Our team is always happy to help.
              </p>
            </motion.div>

            <div className="grid gap-7 md:grid-cols-3">
              {contactMethods.map((card, index) => {
                const Icon = card.icon;

                return (
                  <motion.a
                    key={card.number}
                    href={card.href}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    whileHover={{ y: -12, rotateX: 3, rotateY: -3 }}
                    className="group relative flex min-h-[390px] flex-col overflow-hidden border border-[#D9C9B5] bg-[#FAF7F1] p-9 shadow-sm transition-shadow duration-500 hover:shadow-2xl md:p-11"
                    style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                  >
                    <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#E9DCCB]/50 transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative flex items-center justify-between">
                      <span className="text-[#B28B4E]/70"><Ornament size={22} /></span>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9C9B5] text-[#782C49] transition-all duration-500 group-hover:bg-[#782C49] group-hover:text-white">
                        <Icon size={25} strokeWidth={1.3} />
                      </div>
                    </div>

                    <p className="relative mt-12 text-[9px] font-semibold tracking-[0.25em] text-[#A47A55]">{card.subtitle}</p>
                    <h3 className="relative mt-4 font-serif text-3xl text-[#782C49]">{card.title}</h3>
                    <p className="relative mt-6 text-sm leading-8 text-[#766866]">{card.detail}</p>

                    <div className="relative mt-auto flex items-center justify-between border-t border-[#D9C9B5] pt-7">
                      <span className="break-all text-sm text-[#782C49]">{card.value}</span>
                      <ArrowUpRight size={20} className="shrink-0 text-[#B28B4E] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 04 - HOW CAN WE HELP */}
        <section className="bg-[#E9DCCB] px-6 py-28 md:px-10 md:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">

              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A47A55]">
                  WE&apos;RE LISTENING
                </span>
                <h2 className="mt-7 font-serif text-5xl leading-tight text-[#782C49] md:text-7xl">
                  How Can
                  <br />
                  We <span className="italic text-[#B28B4E]">Help You?</span>
                </h2>
                <p className="mt-8 max-w-md text-sm leading-8 text-[#766866]">
                  Whatever brings you here, we want to make sure you find
                  the right assistance. Explore the different ways we can help.
                </p>
                <div className="mt-12 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#782C49] text-[#F5EFE5]">
                    <Heart size={24} strokeWidth={1.2} />
                  </div>
                  <p className="max-w-[220px] text-xs leading-6 text-[#766866]">
                    Every enquiry matters. We&apos;re happy to hear from you.
                  </p>
                </div>
              </motion.div>

              <div className="grid gap-4 sm:grid-cols-2">
                {helpOptions.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.a
                      key={item.title}
                      href={item.link}
                      initial={{ opacity: 0, y: 35 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: index * 0.12 }}
                      whileHover={{ y: -8 }}
                      className="group border border-[#CDBBA7] bg-[#F5EFE5] p-8 transition-all duration-500 hover:border-[#B28B4E] hover:shadow-xl md:p-9"
                    >
                      <Icon size={27} strokeWidth={1.3} className="text-[#A47A55] transition-transform duration-500 group-hover:scale-110" />
                      <h3 className="mt-9 font-serif text-2xl text-[#782C49]">{item.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-[#766866]">{item.text}</p>
                      <div className="mt-8 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#782C49]">
                        MAKE AN ENQUIRY <ArrowUpRight size={15} />
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 05 - SUPPORT JOURNEY */}
        <section className="px-6 py-28 md:px-10 md:py-36">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={reveal}
              className="text-center"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A47A55]">
                SIMPLE AND THOUGHTFUL
              </span>
              <h2 className="mt-6 font-serif text-4xl text-[#782C49] md:text-6xl">
                A Better Support Experience
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#766866]">
                Connecting with SEVOURA is simple. Here&apos;s how our support journey works.
              </p>
            </motion.div>

            <div className="relative mt-24 grid gap-12 md:grid-cols-3">
              <div className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-[#D9C9B5] md:block" />

              {supportSteps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto flex h-[74px] w-[74px] items-center justify-center rounded-full border border-[#B28B4E] bg-[#F5EFE5] font-serif text-2xl text-[#782C49] shadow-[0_0_0_10px_#F5EFE5]">
                    <Ornament size={22} />
                  </div>
                  <h3 className="mt-10 font-serif text-3xl text-[#782C49]">{step.title}</h3>
                  <p className="mx-auto mt-5 max-w-xs text-sm leading-8 text-[#766866]">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 - SUPPORT HOURS */}
        <section className="bg-[#782C49] px-6 py-28 text-[#F5EFE5] md:px-10 md:py-36">
          <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#E9D1A7]">
                CUSTOMER CARE
              </span>

              <h2 className="mt-7 font-serif text-5xl leading-tight md:text-7xl">
                Thoughtful support,
                <br />
                <span className="italic text-[#E9D1A7]">every day.</span>
              </h2>

              <p className="mt-9 max-w-lg text-sm leading-8 text-[#F5EBDD]/75">
                Have a question about your order or need help discovering
                your SEVOURA ritual? Our customer support team is here to
                make things easier.
              </p>

              <div className="mt-10 flex items-start gap-4">
                <ShieldCheck size={30} className="shrink-0 text-[#E9D1A7]" />
                <div>
                  <h3 className="font-serif text-2xl">We&apos;re listening.</h3>
                  <p className="mt-2 text-sm leading-7 text-[#F5EBDD]/70">
                    We aim to respond to all enquiries within 1–2 business days.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: 8 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative overflow-hidden border border-[#E9D1A7]/30 bg-[#65243D] p-10 shadow-2xl md:p-16"
            >
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#E9D1A7]/20" />
              <div className="relative">
                <Clock size={28} className="text-[#E9D1A7]" />
                <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#E9D1A7]">
                  CUSTOMER SUPPORT HOURS
                </p>
                <h3 className="mt-8 font-serif text-4xl md:text-5xl">We&apos;re Available</h3>
                <p className="mt-5 text-sm text-[#F5EBDD]/70">Monday through Sunday</p>
                <div className="my-10 h-px bg-[#E9D1A7]/30" />
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#E9D1A7]">
                  OUR WORKING HOURS
                </p>
                <p className="mt-5 font-serif text-3xl md:text-4xl">10:00 AM – 6:00 PM</p>
                <p className="mt-4 text-xs tracking-[0.2em] text-[#E9D1A7]">INDIAN STANDARD TIME · IST</p>
                <a href="mailto:hello@sevoura.com" className="mt-12 inline-flex items-center gap-3 border-b border-[#E9D1A7] pb-3 text-[10px] uppercase tracking-[0.2em]">
                  EMAIL OUR TEAM <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 07 - FAQ */}
        <section className="px-6 py-28 md:px-10 md:py-36">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr]">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A47A55]">
                NEED A LITTLE HELP?
              </span>
              <h2 className="mt-7 font-serif text-5xl leading-tight text-[#782C49] md:text-7xl">
                Frequently
                <br />
                Asked <span className="italic text-[#B28B4E]">Questions.</span>
              </h2>
              <p className="mt-8 max-w-sm text-sm leading-8 text-[#766866]">
                Find answers to some common questions about reaching
                our team and getting assistance.
              </p>
              <a href="mailto:hello@sevoura.com" className="mt-10 inline-flex items-center gap-3 border-b border-[#B28B4E] pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#782C49]">
                STILL HAVE QUESTIONS? <ArrowUpRight size={16} />
              </a>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="border-b border-[#D9C9B5]"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-5 py-7 text-left"
                    aria-expanded={activeFaq === index}
                  >
                    <span className="font-serif text-lg text-[#782C49] md:text-xl">
                      {faq.q}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9C9B5] text-[#782C49]">
                      <ChevronDown
                        size={17}
                        className={`transition-transform duration-300 ${activeFaq === index ? "rotate-180" : ""}`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 pr-12 text-sm leading-8 text-[#766866]">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 08 - SOCIAL MEDIA */}
        <section className="bg-[#E9DCCB] px-6 py-28 md:px-10 md:py-36">
          <div className="mx-auto max-w-7xl">

            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A47A55]">
                BE PART OF OUR WORLD
              </span>
              <h2 className="mt-7 font-serif text-5xl text-[#782C49] md:text-7xl">
                Beyond the Fragrance
              </h2>
              <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-[#766866]">
                Discover the stories, rituals and inspiration behind SEVOURA.
                Follow our journey and explore a different perspective on fragrance.
              </p>
            </motion.div>

            <div className="mt-20 grid gap-7 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative overflow-hidden border border-[#D9C9B5] bg-[#F5EFE5] p-10 md:p-16"
              >
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-[#B28B4E]/30" />
                <div className="relative">
                  <Camera size={38} strokeWidth={1.2} className="text-[#782C49]" />
                  <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-[#A47A55]">FOLLOW OUR JOURNEY</p>
                  <h3 className="mt-5 font-serif text-5xl text-[#782C49]">Instagram</h3>
                  <p className="mt-7 max-w-sm text-sm leading-8 text-[#766866]">
                    New launches, collection stories, fragrance rituals,
                    behind-the-scenes moments, styling, gifting and community stories.
                  </p>
                  <p className="mt-10 font-serif text-2xl text-[#782C49]">@SEVOURA</p>
                  <a href="mailto:hello@sevoura.com?subject=Instagram%20Enquiry" className="mt-10 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#782C49]">
                    CONNECT WITH US <ArrowUpRight size={17} />
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative overflow-hidden bg-[#782C49] p-10 text-[#F5EFE5] md:p-16"
              >
                <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full border border-[#E9D1A7]/20" />
                <div className="relative">
                  <PlayCircle size={42} strokeWidth={1.2} className="text-[#E9D1A7]" />
                  <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-[#E9D1A7]">EXPLORE OUR STORIES</p>
                  <h3 className="mt-5 font-serif text-5xl">YouTube</h3>
                  <p className="mt-7 max-w-sm text-sm leading-8 text-[#F5EBDD]/75">
                    Step into the world of SEVOURA. Explore our Seven-Day
                    Planetary Blend Collection, fragrance rituals,
                    inspiration and philosophy.
                  </p>
                  <p className="mt-10 font-serif text-2xl text-[#E9D1A7]">SEVOURA</p>
                  <a href="mailto:hello@sevoura.com?subject=YouTube%20Enquiry" className="mt-10 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E9D1A7]">
                    DISCOVER SEVOURA <ArrowUpRight size={17} />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 09 - TRUST SECTION */}
        <section className="px-6 py-28 md:px-10 md:py-36">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto max-w-7xl overflow-hidden bg-[#782C49] px-8 py-20 text-center text-[#F5EFE5] md:px-20 md:py-28"
          >
            <div className="absolute inset-4 border border-[#E9D1A7]/30" />
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-[#E9D1A7]/15" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-[#E9D1A7]/15" />

            <div className="relative z-10">
              <LockKeyhole size={38} strokeWidth={1} className="mx-auto text-[#E9D1A7]" />
              <p className="mt-9 text-[10px] uppercase tracking-[0.4em] text-[#E9D1A7]">
                YOUR TRUST MATTERS
              </p>
              <h2 className="mx-auto mt-7 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
                Every connection deserves
                <span className="italic text-[#E9D1A7]"> care and attention.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-[#F5EBDD]/75">
                We are committed to making every interaction with SEVOURA
                thoughtful, respectful and helpful.
              </p>
              <a href="/privacy-policy" className="mt-10 inline-flex items-center gap-3 border border-[#E9D1A7]/60 px-9 py-4 text-[10px] uppercase tracking-[0.2em] text-[#E9D1A7] transition hover:bg-[#E9D1A7] hover:text-[#782C49]">
                READ OUR PRIVACY POLICY <ArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
        </section>

        {/* 10 - FINAL CTA */}
        <section className="px-6 pb-32 md:px-10 md:pb-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative mx-auto max-w-7xl overflow-hidden border border-[#D9C9B5] bg-[#E9DCCB] px-7 py-24 text-center md:px-20 md:py-36"
          >
            <div className="absolute inset-4 border border-[#B28B4E]/30" />

            <div className="relative z-10">
              <Send size={34} strokeWidth={1} className="mx-auto text-[#A47A55]" />

              <p className="mt-9 text-[10px] uppercase tracking-[0.4em] text-[#A47A55]">
                EVERY CONVERSATION MATTERS
              </p>

              <h2 className="mx-auto mt-7 max-w-3xl font-serif text-5xl leading-tight text-[#782C49] md:text-7xl">
                We look forward to
                <br />
                <span className="italic text-[#B28B4E]">hearing from you.</span>
              </h2>

              <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-[#766866]">
                Have something on your mind? Reach out to our team.
                We&apos;d love to be a part of your SEVOURA journey.
              </p>

              <a href="mailto:hello@sevoura.com" className="group mt-12 inline-flex items-center gap-4 bg-[#782C49] px-11 py-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE5] transition-all duration-500 hover:bg-[#5D2037] hover:shadow-xl">
                hello@sevoura.com
                <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </motion.div>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
