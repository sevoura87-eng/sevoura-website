
"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  Fingerprint,
  Sparkles,
  ArrowUpRight,
  Mail
} from "lucide-react";
import Ornament from "@/components/ui/Ornament";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    icon: Eye,
    description: "When you place an order, create an account, contact us, or interact with our website, we may collect:",
    points: [
      "Name",
      "Email address",
      "Mobile number",
      "Billing and shipping address",
      "Order and transaction details",
      "Information you voluntarily provide when contacting us"
    ],
    ending: "Payment information is processed through our authorised payment service providers. We do not ordinarily store your complete payment-card details."
  },
  {
    number: "02",
    title: "How We Use Your Information",
    icon: Fingerprint,
    description: "We use the information you share with us to make your SEVOURA experience seamless and secure.",
    points: [
      "Process and fulfil your orders",
      "Provide delivery and order updates",
      "Respond to customer enquiries",
      "Provide customer support",
      "Improve our products, services and website",
      "Send marketing communications where you have provided appropriate consent",
      "Prevent fraud, misuse or unauthorised activity",
      "Comply with applicable legal and regulatory requirements"
    ]
  },
  {
    number: "03",
    title: "Cookies",
    icon: Sparkles,
    description: "Our website may use cookies and similar technologies to improve website functionality, understand visitor behaviour and provide a better browsing experience.",
    ending: "You can manage cookie preferences through your browser settings or any cookie controls provided on our website."
  },
  {
    number: "04",
    title: "Sharing of Information",
    icon: Eye,
    description: "We may share relevant information with trusted service providers who help us operate our business, including payment processors, logistics and delivery partners, technology providers and website service providers.",
    ending: "We do not sell your personal information."
  },
  {
    number: "05",
    title: "Data Security",
    icon: LockKeyhole,
    description: "We take reasonable technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure or misuse.",
    ending: "However, no method of online transmission or storage can be guaranteed to be completely secure."
  },
  {
    number: "06",
    title: "Your Rights",
    icon: ShieldCheck,
    description: "Subject to applicable law, you may have rights to access, correct or request deletion of your personal information and to withdraw consent for certain communications.",
    ending: "To exercise your rights or raise a privacy concern, contact us at:"
  },
  {
    number: "07",
    title: "Changes to This Policy",
    icon: Sparkles,
    description: "We may update this Privacy Policy from time to time.",
    ending: "Any changes will be posted on this page with the revised effective date."
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 }
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />

      <main className="overflow-x-clip bg-[#F5EFE5] text-[#392B2D]">

        {/* HERO */}
        <section className="relative flex min-h-[570px] items-center justify-center overflow-hidden px-6 py-28 text-center md:min-h-[650px]">

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#E9D8C4_0%,_#F5EFE5_68%)]" />

          <div className="absolute left-[-100px] top-20 h-72 w-72 rounded-full border border-[#B28B4E]/20" />
          <div className="absolute left-[-65px] top-28 h-56 w-56 rounded-full border border-[#B28B4E]/20" />
          <div className="absolute bottom-[-130px] right-[-80px] h-96 w-96 rounded-full border border-[#B28B4E]/20" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.18 } }
            }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.8 }}>
              <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#A47A55]">
                <span className="h-px w-8 bg-[#B28B4E]" />
                THE SEVOURA PROMISE
                <span className="h-px w-8 bg-[#B28B4E]" />
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.9 }}
              className="mt-9 font-serif text-6xl font-normal leading-[1.05] tracking-[-2px] text-[#782C49] md:text-8xl lg:text-[104px]"
            >
              Privacy
              <br />
              <span className="italic text-[#B28B4E]">Policy.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.8 }}
              className="mx-auto mt-9 max-w-xl text-sm leading-8 text-[#766866] md:text-base"
            >
              Your trust is an essential part of our journey.
              Discover how we respect, protect and handle
              the information you share with SEVOURA.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8 }}
              className="mt-12 flex flex-col items-center gap-5"
            >
              <div className="h-12 w-px bg-[#B28B4E]" />
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#987D6B]">
                YOUR PRIVACY · OUR RESPONSIBILITY
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* INTRODUCTION STRIP */}
        <section className="bg-[#782C49] px-6 py-16 text-[#F5EFE5] md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto]"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#E9D1A7]">
                A NOTE ON YOUR PRIVACY
              </span>
              <h2 className="mt-5 max-w-2xl font-serif text-3xl leading-snug md:text-5xl">
                Your information deserves
                <span className="italic text-[#E9D1A7]"> thoughtful care.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-[#F5EBDD]/75">
                At SEVOURA, we respect your privacy and are committed to protecting
                the personal information you share with us. This Privacy Policy
                explains how we collect, use, store, and protect your information
                when you visit or make a purchase through sevoura.com.
              </p>
            </div>

            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[#E9D1A7]/40 md:h-44 md:w-44">
              <ShieldCheck size={65} strokeWidth={0.8} className="text-[#E9D1A7]" />
            </div>
          </motion.div>
        </section>

        {/* POLICY CONTENT */}
        <section className="px-5 py-20 md:px-10 md:py-28">

          <div className="mx-auto max-w-6xl">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16 flex flex-col justify-between gap-5 border-b border-[#D9C9B5] pb-8 md:flex-row md:items-end"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#A47A55]">
                  THE DETAILS
                </span>
                <h2 className="mt-4 font-serif text-4xl text-[#782C49] md:text-5xl">
                  Our Privacy Principles
                </h2>
              </div>

              <span className="w-fit border border-[#D9C9B5] px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#8B7770]">
                LAST UPDATED · 23 OCT 2026
              </span>
            </motion.div>

            <div className="grid gap-5 md:grid-cols-2">

              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <motion.article
                    key={section.number}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.7,
                      delay: (index % 2) * 0.12
                    }}
                    className={`group relative overflow-hidden border border-[#D9C9B5] bg-[#FAF7F1] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#B28B4E]/60 hover:shadow-[0_18px_45px_rgba(75,39,47,0.08)] md:p-10 ${
                      index === 0 || index === 1 ? "md:col-span-1" : ""
                    }`}
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#E9D8C4]/30 transition-transform duration-700 group-hover:scale-150" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-[#B28B4E]/70">
                          <Ornament size={18} />
                        </span>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9C9B5] text-[#782C49] transition-all duration-500 group-hover:border-[#782C49] group-hover:bg-[#782C49] group-hover:text-[#F5EFE5]">
                          <Icon size={20} strokeWidth={1.3} />
                        </div>
                      </div>

                      <h3 className="mt-8 font-serif text-2xl text-[#782C49] md:text-[28px]">
                        {section.title}
                      </h3>

                      <div className="mb-6 mt-5 h-px w-12 bg-[#B28B4E] transition-all duration-500 group-hover:w-24" />

                      <p className="text-sm leading-8 text-[#766866]">
                        {section.description}
                      </p>

                      {section.points && (
                        <ul className="mt-6 space-y-3">
                          {section.points.map((point) => (
                            <li key={point} className="flex items-start gap-3 text-sm leading-6 text-[#766866]">
                              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B28B4E]" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.ending && (
                        <p className="mt-6 text-sm leading-8 text-[#766866]">
                          {section.ending}
                        </p>
                      )}

                      {section.number === "06" && (
                        <a
                          href="mailto:hello@sevoura.com"
                          className="mt-6 inline-flex items-center gap-3 border-b border-[#B28B4E] pb-2 text-sm text-[#782C49] transition-colors hover:text-[#B28B4E]"
                        >
                          <Mail size={16} />
                          hello@sevoura.com
                          <ArrowUpRight size={15} />
                        </a>
                      )}
                    </div>
                  </motion.article>
                );
              })}

            </div>
          </div>
        </section>

        {/* TRUST BANNER */}
        <section className="px-6 pb-24 md:px-10 md:pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto max-w-6xl overflow-hidden bg-[#E9DCCB] px-7 py-16 text-center md:px-20 md:py-24"
          >
            <div className="absolute inset-4 border border-[#B28B4E]/30" />

            <div className="relative z-10">
              <LockKeyhole size={32} strokeWidth={1} className="mx-auto text-[#A47A55]" />

              <h2 className="mx-auto mt-7 max-w-2xl font-serif text-3xl leading-snug text-[#782C49] md:text-5xl">
                Your trust is something
                <span className="italic text-[#B28B4E]"> we never take for granted.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-[#766866]">
                Have a privacy-related question? Our team would be happy to help.
              </p>

              <a
                href="mailto:hello@sevoura.com"
                className="mt-9 inline-flex items-center gap-3 bg-[#782C49] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE5] transition-all duration-300 hover:bg-[#5D2037]"
              >
                Get In Touch
                <ArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
