"use client";

import { useCallback, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Preloader from "@/components/home/Preloader";
import Hero from "@/components/home/Hero";
import { Marquee, Values, Manifesto, SevenJourney } from "@/components/home/Sections1";
import { Showcase, Founder, Philosophy, Steps, Destinations, Promise as BrandPromise, Finale } from "@/components/home/Sections2";

export default function Home() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <main className="overflow-x-clip bg-[#F8F1E7] text-[#501D32]">
      <Preloader onDone={onDone} />
      <SiteHeader />
      <Hero ready={ready} />
      <Marquee />
      <Values />
      <Manifesto />
      <SevenJourney />
      <Showcase />
      <Founder />
      <Philosophy />
      <Steps />
      <Destinations />
      <BrandPromise />
      <Finale />
      <SiteFooter />
    </main>
  );
}
