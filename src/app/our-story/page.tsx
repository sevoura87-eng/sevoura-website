
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0 },
};

const storyParagraphs = [
  "I have always been fascinated by the way a scent can evoke a memory, transform a moment, or make an ordinary day feel extraordinary. Over time, my curiosity extended beyond fragrance itself to the traditions, symbolism, and personal rituals that have connected scent with human experience for generations.",
  "Around that time, I explored a fragrance ritual associated with Venus, traditionally linked with beauty, love and attraction in astrology. The period that followed brought memorable experiences, beautiful travels, and a greater appreciation for the small rituals that give everyday life meaning. I would not attribute those experiences to fragrance alone, but the association stayed with me.",
];

const inspirationParagraphs = [
  "As I explored traditional astrological associations, I discovered the symbolism connecting the seven days of the week with their ruling planets and distinctive qualities. An idea began to take shape: what if these seven inspirations could be expressed through fragrance—not as seven unrelated scents, but as one thoughtfully curated collection, with each blend carrying its own character?",
  "My own experience made the gap tangible. The simple, single-note floral fragrance I had initially explored did not always suit the different settings I moved between, from professional meetings and travel to evenings out. I often found myself layering it with other fragrances to achieve the character I wanted.",
  "I envisioned something more considered: seven distinctive, alcohol-free fragrances with complementary fragrance notes, each with its own identity, yet connected by one cohesive concept.",
];

const philosophy = [
  {
    number: "01",
    title: "Seven Planetary Inspirations",
    description: "Rooted in traditional associations with the seven days of the week.",
  },
  {
    number: "02",
    title: "Seven Fragrance Identities",
    description: "Distinctive, alcohol-free fragrances, thoughtfully composed as one collection.",
  },
  {
    number: "03",
    title: "One Weekly Ritual",
    description: "An effortless way to make fragrance a personal part of everyday life.",
  },
];

const approachParagraphs = [
  "With a PhD from IIT Delhi and a background in scientific research, I have always valued curiosity, thoughtful exploration, and the process of turning ideas into something tangible. I brought that same approach to Sevoura. Traditional planetary symbolism became the inspiration; fragrance became the medium through which I could interpret it in a contemporary way.",
  "The result is the Sevoura 7-Day Planetary Blend Collection—seven distinctive, alcohol-free fragrances, each inspired by a planet traditionally associated with a day of the week and its symbolic qualities. From calm, courage and clarity to abundance, love, grounding and radiance, each blend offers its own fragrance character and associated intention.",
  "I wanted the experience to feel luxurious yet approachable, distinctive without being overpowering, and simple enough to become part of everyday life. One thoughtfully curated collection brings seven fragrance inspirations together, without the need to search across multiple brands or work out which scents to layer.",
  "For me, this is about more than choosing a fragrance. It is about creating a small moment for yourself—before a busy workday, while preparing for a special evening, before a journey, or simply when you want to pause.",
];

const personalParagraphs = [
  "Sevoura began with a personal curiosity and grew into a vision for a more considered fragrance experience. The seven-day collection is the first expression of that vision, with possibilities for future collections across feminine, masculine and unisex fragrance.",
  "Because fragrance is deeply personal. A scent that evokes confidence for one person might represent comfort, freedom, or a cherished memory for another. That individuality is part of what makes fragrance so meaningful.",
  "I want Sevoura to invite people to explore that connection—to find their own expression through fragrance and bring a little more intention to the everyday.",
  "Because luxury is not always about making a statement. Sometimes, it is about how something makes you feel.",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4 text-[9px] font-semibold uppercase tracking-[0.38em] text-[#98754D]">
      <span className="h-px w-7 bg-[#B28B4E]/70" />
      {children}
      <span className="h-px w-7 bg-[#B28B4E]/70" />
    </div>
  );
}

function Planet({ index }: { index: number }) {
  const colors = [
    "from-[#F7F1E8] via-[#E5D7C3] to-[#A99C89]",
    "from-[#E8A5A0] via-[#A84F55] to-[#692A40]",
    "from-[#C7D1A0] via-[#778C53] to-[#3E4B35]",
    "from-[#FFE6A1] via-[#DCA849] to-[#9D692A]",
    "from-[#D6B8E8] via-[#8B65AC] to-[#44345D]",
    "from-[#D5BCA1] via-[#82715F] to-[#3B332F]",
    "from-[#FFE5A1] via-[#D99836] to-[#92551D]",
  ];

  return (
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
      transition={{
        duration: 3 + index * 0.45,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      }}
      className={`relative h-12 w-12 shrink-0 rounded-full bg-gradient-to-br ${colors[index]} shadow-[inset_-8px_-8px_14px_rgba(0,0,0,0.25),0_0_25px_rgba(206,159,95,0.25)] md:h-[70px] md:w-[70px]`}
    >
      <span className="absolute left-[22%] top-[17%] h-3 w-3 rounded-full bg-white/40 blur-[5px] md:h-5 md:w-5" />
    </motion.div>
  );
}

export default function OurStoryPage() {
  return (
    <>
      <SiteHeader />

      <main className="overflow-hidden bg-[#F5EFE5] text-[#382B2A]">

        
        {/* 01 — IMMERSIVE PLANETARY HERO */}
        <section className="relative flex min-h-[760px] items-center justify-center overflow-hidden bg-[#F3E7D7] px-5 py-24 md:min-h-[900px]">

          {/* Cosmic background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FFF8ED_0%,_#F3E7D7_52%,_#EAD8C1_100%)]" />

          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(#B28B4E 0.8px, transparent 0.8px)",
              backgroundSize: "35px 35px"
            }}
          />

          {/* Ambient light */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DDBA80]/30 blur-[100px] md:h-[750px] md:w-[750px]"
          />

          {/* Wide outer orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B28B4E]/25 md:h-[1050px] md:w-[1050px] lg:h-[1350px] lg:w-[1350px]"
          >
            <div className="absolute left-[16%] top-[14%] h-3 w-3 rounded-full bg-[#D9AC60] shadow-[0_0_25px_#D9AC60]" />
            <div className="absolute bottom-[13%] right-[17%] h-5 w-5 rounded-full bg-[#C58D49] shadow-[0_0_30px_#C58D49]" />
          </motion.div>

          {/* Elliptical orbit one */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[420px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#B28B4E]/30 md:h-[570px] md:w-[1250px] lg:h-[650px] lg:w-[1550px]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute left-[12%] top-[12%] h-5 w-5 rounded-full bg-gradient-to-br from-[#FFF0C5] to-[#B28B4E] shadow-[0_0_30px_rgba(178,139,78,0.8)] md:h-8 md:w-8"
            />
          </motion.div>

          {/* Elliptical orbit two */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 h-[550px] w-[1050px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-[#B28B4E]/25 md:h-[720px] md:w-[1500px] lg:h-[800px] lg:w-[1800px]"
          >
            <div className="absolute right-[18%] top-[8%] h-4 w-4 rounded-full bg-[#E8C98E] shadow-[0_0_25px_#D6B16E]" />
          </motion.div>

          {/* LEFT PLANET — Saturn style */}
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[3%] top-[27%] hidden md:block lg:left-[8%]"
          >
            <div className="relative flex h-36 w-36 items-center justify-center lg:h-48 lg:w-48">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute h-12 w-52 rotate-[-25deg] rounded-[50%] border-[8px] border-[#C49A5C]/60 shadow-[0_0_22px_rgba(196,154,92,0.3)] lg:w-64"
              />
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#F8E6B9] via-[#C69B61] to-[#76543A] shadow-[inset_-15px_-15px_25px_rgba(75,44,24,0.35),0_0_45px_rgba(185,140,76,0.35)] lg:h-32 lg:w-32">
                <div className="absolute left-5 top-5 h-7 w-7 rounded-full bg-white/40 blur-md" />
              </div>
            </div>
            <p className="mt-4 text-center text-[9px] uppercase tracking-[0.35em] text-[#98754D]">THE ORBIT</p>
          </motion.div>

          {/* RIGHT PLANET — golden planet */}
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[4%] top-[24%] hidden md:block lg:right-[10%]"
          >
            <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-[#FFF0C4] via-[#D8AD63] to-[#98632F] shadow-[inset_-17px_-13px_25px_rgba(87,53,25,0.3),0_0_65px_rgba(205,157,79,0.5)] lg:h-40 lg:w-40">
              <div className="absolute left-6 top-5 h-9 w-9 rounded-full bg-white/50 blur-lg" />
              <div className="absolute bottom-5 right-6 h-5 w-5 rounded-full bg-[#8D6338]/20 blur-sm" />
            </div>
            <p className="mt-5 text-center text-[9px] uppercase tracking-[0.35em] text-[#98754D]">THE RADIANCE</p>
          </motion.div>

          {/* Small floating moons */}
          <motion.div
            animate={{ y: [0, -25, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute left-[17%] bottom-[23%] hidden h-10 w-10 rounded-full bg-gradient-to-br from-[#FFF8E6] to-[#C6A575] shadow-[0_0_35px_rgba(196,154,92,0.5)] md:block"
          />

          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -12, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute right-[18%] bottom-[19%] hidden h-7 w-7 rounded-full bg-gradient-to-br from-[#F9E6BD] to-[#B28B4E] shadow-[0_0_30px_rgba(196,154,92,0.5)] md:block"
          />

          {/* Centre planetary sphere */}
          <div className="absolute left-1/2 top-1/2 z-[1] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B28B4E]/25 md:h-[650px] md:w-[650px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              className="absolute inset-5 rounded-full border border-[#B28B4E]/35 md:inset-10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute inset-12 rounded-full border border-dashed border-[#B28B4E]/25 md:inset-20"
            />
          </div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto flex min-h-[400px] w-full max-w-[690px] flex-col items-center justify-center rounded-full border border-[#B28B4E]/40 bg-[#FBF4E9]/80 px-7 py-16 text-center shadow-[0_20px_90px_rgba(105,74,40,0.12)] backdrop-blur-md md:min-h-[590px] md:px-20"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-7 flex h-10 w-10 items-center justify-center rounded-full border border-[#B28B4E]/50 bg-[#F6E8D1] text-[#A47A40] shadow-[0_0_25px_rgba(178,139,78,0.25)]"
            >
              <Sparkles size={17} />
            </motion.div>

            <div className="flex items-center justify-center gap-4 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#98754D]">
              <span className="h-px w-7 bg-[#B28B4E]" />
              THE STORY BEHIND SEVOURA
              <span className="h-px w-7 bg-[#B28B4E]" />
            </div>

            <h1 className="mt-8 font-serif text-5xl leading-[0.98] tracking-[-1.5px] text-[#3C2926] md:text-7xl">
              A Fragrance
              <br />
              Story, Rooted
              <br />
              <span className="italic text-[#782C49]">in Curiosity.</span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-[#705B4B] md:text-base">
              One personal discovery. Seven planetary inspirations.
              A new expression of fragrance.
            </p>

            <Link
              href="/the-seven"
              className="group mt-9 inline-flex items-center gap-5 bg-[#782C49] px-8 py-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(120,44,73,0.2)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#5D2037] hover:shadow-[0_18px_40px_rgba(120,44,73,0.3)]"
            >
              EXPLORE THE SEVEN BLENDS
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </motion.div>

          {/* Bottom label */}
          <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-[8px] uppercase tracking-[0.4em] text-[#98754D]">
            SEVEN INSPIRATIONS · ONE PERSONAL JOURNEY
          </div>

        </section>

        {/* 02 — FOUNDER */}
        <section className="px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto grid max-w-[1120px] gap-8 md:grid-cols-2 md:items-stretch">

            <motion.div
              initial={{ opacity: 0, x: -55, rotateY: 8 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1 }}
              className="relative min-h-[440px] border border-[#B28B4E]/60 bg-[#E8DCCB] p-2 shadow-[0_25px_55px_rgba(65,43,32,0.12)] md:min-h-[590px]"
              style={{ perspective: "1200px" }}
            >
              <div className="absolute inset-4 z-10 border border-[#B28B4E]/50 pointer-events-none" />
              <img
                src="/images/founder-jasleen.jpg"
                alt="Dr. Jasleen Bhatti, Founder of Sevoura"
                className="h-full min-h-[424px] w-full object-cover object-center md:min-h-[574px]"
              />
              <div className="absolute bottom-6 left-6 z-20 bg-[#F5EFE5]/90 px-5 py-3 backdrop-blur-sm">
                <p className="font-serif text-xl text-[#782C49]">The Founder</p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#98754D]">THE MIND BEHIND SEVOURA</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 55, rotateY: -8 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1 }}
              className="relative flex flex-col justify-center bg-[#782C49] p-9 text-[#F5EFE5] shadow-[0_25px_55px_rgba(65,43,32,0.13)] md:p-12"
            >
              <div className="pointer-events-none absolute inset-3 border border-[#E9D1A7]/35" />

              <div className="relative">
                <p className="text-[9px] uppercase tracking-[0.32em] text-[#E9D1A7]">THE PERSON BEHIND THE VISION</p>
                <h2 className="mt-6 font-serif text-4xl md:text-5xl">Dr. Jasleen Bhatti</h2>
                <p className="mt-3 font-serif text-sm italic tracking-[0.12em] text-[#E9D1A7]">Founder, Sevoura</p>

                <div className="my-8 h-px w-16 bg-[#E9D1A7]/70" />

                <p className="text-sm leading-8 text-[#F8EEE7]/90">
                  My fascination with fragrance grew into a curiosity about tradition, symbolism and the rituals that make everyday moments meaningful.
                </p>

                <p className="mt-5 text-sm leading-8 text-[#F8EEE7]/90">
                  During my office days in central Delhi, the evocative aromas around temples and fragrance shops deepened this curiosity. I began to wonder how these age-old inspirations could find a place in contemporary life—not simply as traditions to admire, but as personal experiences to make our own.
                </p>

                <p className="mt-5 text-sm leading-8 text-[#F8EEE7]/90">
                  That curiosity inspired a distinctive vision: seven planetary inspirations, expressed through seven thoughtfully composed fragrances.
                </p>

                <p className="mt-7 font-serif text-lg italic tracking-[0.1em] text-[#E9D1A7]">
                  Cleanse. Elevate. Radiate.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 03 — THE BEGINNING */}
        <section className="bg-[#F0E5D8] px-6 py-28 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.16 } } }}
            className="mx-auto max-w-[780px] text-center"
          >
            <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.32em] text-[#782C49]">
              THE BEGINNING
            </motion.p>

            <motion.h2 variants={fadeUp} className="mt-7 font-serif text-4xl leading-tight text-[#382B2A] md:text-6xl">
              Sometimes, the Most
              <br />
              Meaningful Ideas
              <br />
              Begin With Something
              <br />
              We Cannot Find.
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-8 font-serif text-xl text-[#782C49] md:text-2xl">
              For me, that journey began with fragrance.
            </motion.p>

            {storyParagraphs.map((paragraph, index) => (
              <motion.p
                variants={fadeUp}
                key={index}
                className="mt-7 text-sm leading-8 text-[#544542] md:text-[15px]"
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.p variants={fadeUp} className="mt-8 font-serif text-lg italic leading-8 text-[#782C49]">
              What if fragrance could be more than something we wear?
              What if it could become a meaningful ritual of our own?
            </motion.p>
          </motion.div>
        </section>

        {/* 04 — SEVEN INSPIRATIONS */}
        <section className="px-6 py-28 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
            className="mx-auto max-w-[790px] text-center"
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.36em] text-[#782C49]">
              THE IDEA BEHIND SEVEN FRAGRANCES
            </motion.p>

            <motion.h2 variants={fadeUp} className="mt-7 font-serif text-4xl leading-tight text-[#382B2A] md:text-6xl">
              Seven Inspirations. One
              <br />
              Considered Collection.
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-5 text-xs tracking-[0.05em] text-[#987D6B]">
              A contemporary interpretation of traditional planetary symbolism, expressed through fragrance.
            </motion.p>

            {inspirationParagraphs.map((paragraph, index) => (
              <motion.p
                variants={fadeUp}
                key={index}
                className="mt-8 text-sm leading-8 text-[#544542] md:text-[15px]"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </section>

        {/* 05 — THREE PILLARS + SEVEN PLANETS */}
        <section className="overflow-hidden bg-[#F2E9DE] pb-0 pt-16 md:pt-24">

          <div className="mx-auto grid max-w-[1120px] gap-0 px-5 md:grid-cols-3">
            {philosophy.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className="border border-[#D9C9B5] bg-[#FBF7F0] px-6 py-9 text-center shadow-[0_8px_25px_rgba(65,43,32,0.04)] md:px-8"
              >
                <span className="font-serif text-[10px] italic text-[#B28B4E]">{item.number}</span>
                <h3 className="mt-4 font-serif text-xl text-[#76563D]">{item.title}</h3>
                <p className="mt-3 text-xs leading-6 text-[#766866]">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center md:pb-16">
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#98754D]">THE INSPIRATION</p>
            <h3 className="mt-6 font-serif text-2xl leading-relaxed text-[#782C49] md:text-3xl">
              Seven Planetary Inspirations. Seven Fragrance Identities. One Weekly Ritual.
            </h3>
            <p className="mx-auto mt-5 max-w-xl text-xs leading-7 text-[#766866]">
              A contemporary ritual to bring balance, intention and a sense of elevated well-being into everyday life.
            </p>
          </div>

          {/* Seven floating planetary bodies */}
          <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden bg-gradient-to-b from-[#F2E9DE] via-[#F5E9D8] to-[#EBD8C2] px-5 md:min-h-[320px]">
            <div className="absolute bottom-[-150px] left-[-5%] h-[260px] w-[110%] rounded-[50%] border-t border-[#D9B98D]/60 shadow-[0_-15px_45px_rgba(196,151,94,0.10)] md:bottom-[-180px] md:h-[340px]" />
            <div className="absolute bottom-[-170px] left-[-5%] h-[300px] w-[110%] rounded-[50%] border-t border-[#D9B98D]/40 md:bottom-[-210px] md:h-[400px]" />

            <div className="relative z-10 flex w-full max-w-[900px] items-center justify-between gap-2 md:gap-12">
              {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                <Planet key={index} index={index} />
              ))}
            </div>

            <motion.div
              animate={{ opacity: [0.2, 0.75, 0.2], scale: [0.95, 1.1, 0.95] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute bottom-5 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-full bg-[#D5A76B]/20 blur-3xl"
            />
          </div>
        </section>

        {/* 06 — THE VISION */}
        <section className="relative overflow-hidden bg-[#F4E9DA]">
          <div className="relative z-10 py-16 text-center md:py-24">
            <p className="text-[9px] uppercase tracking-[0.4em] text-[#98754D]">THE VISION</p>
            <h2 className="mt-5 font-serif text-3xl text-[#782C49] md:text-5xl">
              A Thoughtful Journey from
              <br />
              Inspiration to Expression
            </h2>
          </div>

          <div className="relative h-[250px] overflow-hidden bg-[radial-gradient(ellipse_at_center,_#FCE9C8_0%,_#E8CBA3_52%,_#F2E3D0_100%)] md:h-[400px]">

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#BD8C4D]/30 md:h-[600px] md:w-[600px]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[240px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#B28B4E]/45 md:h-[360px] md:w-[1100px]"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[170px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#D4A96D]/50 md:h-[260px] md:w-[1000px]"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFF6E8]/70 md:h-[300px] md:w-[300px]"
            >
              <div className="absolute -top-2 left-1/2 h-4 w-4 rounded-full bg-[#E8B96E] shadow-[0_0_25px_#DCA75D] md:h-6 md:w-6" />
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5D7A7] shadow-[0_0_90px_35px_rgba(224,174,104,0.45)] md:h-48 md:w-48"
            />

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F4E9DA] to-transparent" />
          </div>
        </section>

        {/* 07 — APPROACH TO FRAGRANCE */}
        <section className="px-6 py-28 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
            className="mx-auto max-w-[770px] text-center"
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-[#782C49]">
              FROM CURIOSITY TO CREATION
            </motion.p>

            <motion.h2 variants={fadeUp} className="mt-6 font-serif text-4xl leading-tight text-[#382B2A] md:text-6xl">
              A Thoughtful
              <br />
              Approach to Fragrance.
            </motion.h2>

            {approachParagraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={fadeUp}
                className="mt-7 text-sm leading-8 text-[#544542] md:text-[15px]"
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.div variants={fadeUp} className="mt-10 border-t border-[#B28B4E]/60 pt-6">
              <p className="font-serif text-xl italic leading-relaxed text-[#782C49] md:text-2xl">
                Choose a fragrance. Set an intention. Make the moment your own.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* 08 — DEEPLY PERSONAL */}
        <section className="bg-[#F0E5D8] px-6 py-28 md:py-36">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
            className="mx-auto max-w-[760px] text-center"
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.35em] text-[#782C49]">
              A BEGINNING, NOT A BOUNDARY
            </motion.p>

            <motion.h2 variants={fadeUp} className="mt-6 font-serif text-4xl leading-tight text-[#382B2A] md:text-6xl">
              Fragrance Is
              <br />
              Deeply Personal.
            </motion.h2>

            {personalParagraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={fadeUp}
                className="mt-7 text-sm leading-8 text-[#544542] md:text-[15px]"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </section>

        {/* 09 — FINAL BRAND CTA */}
        <section className="relative overflow-hidden bg-[#782C49] px-6 py-28 text-center text-[#F5EFE5] md:py-36">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#E9D1A7]/15" />
          <div className="absolute -bottom-52 -right-36 h-[550px] w-[550px] rounded-full border border-[#E9D1A7]/15" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10 mx-auto max-w-3xl"
          >
            <Sparkles size={28} className="mx-auto text-[#E9D1A7]" strokeWidth={1.2} />

            <p className="mt-8 text-[9px] uppercase tracking-[0.4em] text-[#E9D1A7]">
              WELCOME TO SEVOURA
            </p>

            <h2 className="mt-7 font-serif text-5xl leading-tight md:text-7xl">
              Make Every Day
              <br />
              <span className="italic text-[#E9D1A7]">Your Own Ritual.</span>
            </h2>

            <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-[#F5EBDD]/75">
              The planetary associations draw from traditional astrological symbolism;
              the meaning you attach to each fragrance is personal.
            </p>

            <p className="mt-7 font-serif text-lg italic tracking-[0.12em] text-[#E9D1A7]">
              Cleanse. Elevate. Radiate.
            </p>

            <Link
              href="/the-seven"
              className="group mt-10 inline-flex items-center gap-4 bg-[#E9D1A7] px-9 py-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#782C49] transition-all duration-500 hover:-translate-y-1 hover:bg-[#F5EBDD] hover:shadow-xl"
            >
              DISCOVER THE COLLECTION
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </motion.div>
        </section>

      </main>

      <SiteFooter />
    </>
  );
}
