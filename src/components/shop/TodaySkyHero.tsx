"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import PageHero from "@/components/ui/PageHero";
import TodaySkyArt, { phaseFor, type Phase } from "@/components/art/TodaySkyArt";
import { SEVEN, todayIndex } from "@/components/home/data";

/** a small swatch for each planet, used by the day picker */
const SWATCH: Record<string, string> = {
  Moon: "radial-gradient(circle at 35% 30%,#FBF6EC,#9C9488)",
  Mars: "radial-gradient(circle at 35% 30%,#F4B48E,#7A2A16)",
  Mercury: "radial-gradient(circle at 35% 30%,#E7E2D2,#5F5C4E)",
  Jupiter: "radial-gradient(circle at 35% 30%,#FBE6C0,#8C5A2A)",
  Venus: "radial-gradient(circle at 35% 30%,#FFF0E4,#B67868)",
  Saturn: "radial-gradient(circle at 35% 30%,#F7E6BE,#7D6236)",
  Sun: "radial-gradient(circle at 35% 30%,#FFF8D8,#D98A1E)",
};

const ruler = (planet: string) => (planet === "Sun" || planet === "Moon" ? `the ${planet}` : planet);
/** "Neroli · Musk · Woods" → "Neroli, Musk & Woods" */
const listNotes = (notes: string) => {
  const p = notes.split(" · ");
  return p.length < 2 ? notes : `${p.slice(0, -1).join(", ")} & ${p[p.length - 1]}`;
};

function hourInIndia() {
  return Number(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" })) % 24;
}

/**
 * Shop hero — "Today's Sky". The day's ruling planet rises in light that follows the hour in India.
 * Visitors can tap another day to see its sky. No product photography is used.
 */
export default function TodaySkyHero({ children }: { children?: ReactNode }) {
  const [today, setToday] = useState<number | null>(null);
  const [shown, setShown] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = todayIndex();
      setToday(t);
      setShown((s) => (s === null ? t : s));
      setPhase(phaseFor(hourInIndia()));
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const d = shown === null ? null : SEVEN[shown];
  const isToday = shown !== null && shown === today;

  const art = (
    <div className="relative h-full w-full">
      <TodaySkyArt planet={d?.planet ?? null} phase={phase} />
      {/* the day picker sits on the ground band beneath the horizon */}
      <div role="radiogroup" aria-label="See the sky for another day" className="absolute inset-x-0 bottom-[6%] flex justify-center gap-[3.2%] px-4">
        {SEVEN.map((s, i) => {
          const on = i === shown;
          return (
            <button
              key={s.day}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${s.day} · ${s.planet}${i === today ? " (today)" : ""}`}
              title={`${s.day} · ${s.planet}`}
              onClick={() => setShown(i)}
              className="group relative grid h-9 w-9 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#F0D69A]"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${on ? "h-[18px] w-[18px] shadow-[0_0_14px_rgba(255,226,160,.7)]" : "h-3 w-3 opacity-70 group-hover:opacity-100"}`}
                style={{ background: SWATCH[s.planet] }}
              />
              {on && <span aria-hidden className="absolute inset-0 rounded-full border border-[#F0D69A]/70" />}
              {i === today && !on && <span aria-hidden className="absolute bottom-0 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#F0D69A]" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <PageHero
      layout="split"
      tone="dark"
      artFirstOnMobile
      artNode={art}
      eyebrow={d ? `${isToday ? "TODAY · " : ""}${d.day.toUpperCase()} · RULED BY ${ruler(d.planet).toUpperCase()}` : "SEVOURA · THE COMPLETE COLLECTION"}
      title="Seven days."
      accent="One complete ritual."
      intro={
        <>
          Seven planetary inspirations, seven alcohol-free fragrance expressions — gathered into one collection for every day of the week.
          <span className="mt-4 block min-h-[2em] font-display text-[20px] italic leading-snug text-[#F0D69A]">
            {d ? (
              <>
                {isToday ? "Today" : d.day} belongs to {ruler(d.planet)} — {d.fragrance} with {listNotes(d.notes)}.
              </>
            ) : (
              <>&nbsp;</>
            )}
          </span>
        </>
      }
    >
      {children}
    </PageHero>
  );
}
