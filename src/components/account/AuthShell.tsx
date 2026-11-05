"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const ease = [0.22, 1, 0.36, 1] as const;

export default function AuthShell({
  eyebrow,
  title,
  italic,
  intro,
  image = "/images/friday.jpg",
  children,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  intro: string;
  image?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip bg-[#F8F1E7] text-[#481D30]">
        <section className="mx-auto grid min-h-[calc(100vh-78px)] max-w-[1450px] lg:grid-cols-[1fr_1.05fr]">
          {/* Visual panel */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.2, ease }}
            className="relative hidden overflow-hidden bg-[#46182D] lg:block"
          >
            <motion.div
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease }}
              className="absolute inset-0"
            >
              <Image src={image} alt="" fill priority sizes="50vw" className="object-cover opacity-55 mix-blend-luminosity" />
            </motion.div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(121,45,73,.55),#2E0F1D_80%)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-40 -right-40 h-[560px] w-[560px] rounded-full border border-[#E5C48B]/25"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full border border-dashed border-[#E5C48B]/25"
            />
            <div className="pointer-events-none absolute inset-5 border border-[#D9B77D]/35" />
            <div className="relative flex h-full flex-col justify-end p-14 text-[#FBF0E4]">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease }}
                className="text-[9px] tracking-[0.34em] text-[#E5C48B]"
              >
                CLEANSE · ELEVATE · RADIATE
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.9, ease }}
                className="mt-5 max-w-md font-serif text-4xl italic leading-tight"
              >
                A ritual that remembers you.
              </motion.p>
            </div>
          </motion.div>

          {/* Form panel */}
          <div className="flex items-center justify-center px-5 py-14 sm:px-10 lg:px-16">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
              className="w-full max-w-[460px]"
            >
              <motion.p variants={item} className="text-[9px] tracking-[0.34em] text-[#A77B4D]">
                {eyebrow}
              </motion.p>
              <motion.h1 variants={item} className="mt-4 font-serif text-[42px] leading-[1.05] sm:text-5xl">
                {title} <span className="italic text-[#792D49]">{italic}</span>
              </motion.h1>
              <motion.div variants={item} className="mt-5 h-[2px] w-14 bg-[#C49A59]" />
              <motion.p variants={item} className="mt-5 text-sm leading-7 text-[#806D60]">
                {intro}
              </motion.p>
              <motion.div variants={item} className="mt-8">
                {children}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};
