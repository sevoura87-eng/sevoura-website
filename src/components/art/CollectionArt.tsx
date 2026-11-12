"use client";

import Image from "next/image";
import { useId } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Shop hero plate: the real seven-bottle photograph set inside a gilded arch on deep burgundy.
 * Around it, vector light that moves on its own — an orbit ring turning slowly, seven planets each
 * keeping its own pace on the ring above the arch, a soft glint across the glass and drifting motes.
 * The photograph is shown as supplied (only cropped by the arch top, never altered or retouched).
 */
const W = 1000;
const H = 1200;
const CX = 500;
const CY = 600; // centre of the arch top, so ring and planets are concentric with it
const PLANETS = [
  { c1: "#F4EAD8", c2: "#9C8F7E", r: 11 }, // Moon
  { c1: "#E7A07A", c2: "#7A3324", r: 10 }, // Mars
  { c1: "#D9CDB8", c2: "#6F6556", r: 9 }, // Mercury
  { c1: "#F2D9A8", c2: "#9B6A35", r: 16 }, // Jupiter
  { c1: "#F6D8C8", c2: "#B27C6B", r: 12 }, // Venus
  { c1: "#E9D2A2", c2: "#8E7144", r: 13 }, // Saturn
  { c1: "#FFE4A0", c2: "#C8862C", r: 15 }, // Sun
];

export default function CollectionArt({ priority = false, className = "" }: { priority?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:«»]/g, "");
  const spin = (s: number, reverse = false): React.CSSProperties | undefined =>
    reduce ? undefined : { animation: `art-spin ${s}s linear infinite${reverse ? " reverse" : ""}`, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" };

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#2A0712] ${className}`}>
      {/* atmosphere: a warm champagne glow rising behind the arch */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_50%,#7A2E45_0%,#4A1426_42%,#2A0712_78%)]" />
      <div aria-hidden className="art-breathe absolute inset-0 bg-[radial-gradient(42%_30%_at_50%_52%,rgba(240,200,130,.30),transparent_70%)]" />

      {/* orbit ring and the seven planets */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          {PLANETS.map((p, i) => (
            <radialGradient key={i} id={`${uid}-p${i}`} cx="35%" cy="30%" r="75%">
              <stop offset="0" stopColor={p.c1} />
              <stop offset="1" stopColor={p.c2} />
            </radialGradient>
          ))}
        </defs>
        <g style={spin(260)}>
          <circle cx={CX} cy={CY} r="440" fill="none" stroke="#E2BE78" strokeOpacity=".28" strokeWidth="1.2" />
          {Array.from({ length: 84 }, (_, k) => {
            const t = (k / 84) * Math.PI * 2;
            const L = k % 12 === 0 ? 14 : 6;
            return <line key={k} x1={CX + Math.cos(t) * 440} y1={CY + Math.sin(t) * 440} x2={CX + Math.cos(t) * (440 + L)} y2={CY + Math.sin(t) * (440 + L)} stroke="#E2BE78" strokeOpacity=".32" strokeWidth="1" />;
          })}
        </g>
        <g style={spin(200, true)}>
          <ellipse cx={CX} cy={CY} rx="480" ry="150" transform={`rotate(-18 ${CX} ${CY})`} fill="none" stroke="#E2BE78" strokeOpacity=".18" strokeWidth="1" />
        </g>
        {/* the planets ride the ring, each on its own period */}
        {PLANETS.map((p, i) => {
          const a = -168 + i * 26; // spread along the upper arc
          const rad = (a * Math.PI) / 180;
          const x = CX + Math.cos(rad) * 408;
          const y = CY + Math.sin(rad) * 408;
          return (
            <g key={i} style={reduce ? undefined : { animation: `art-spin ${150 + i * 23}s linear infinite`, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box", animationDelay: `-${i * 11}s` }}>
              <circle cx={x} cy={y} r={p.r * 2.2} fill={p.c1} opacity=".08" />
              <circle cx={x} cy={y} r={p.r} fill={`url(#${uid}-p${i})`} />
              {i === 5 && <ellipse cx={x} cy={y} rx={p.r * 1.9} ry={p.r * 0.5} transform={`rotate(-16 ${x} ${y})`} fill="none" stroke="#E9D2A2" strokeOpacity=".8" strokeWidth="1.4" />}
            </g>
          );
        })}
      </svg>

      {/* the arch with the photograph */}
      <div className="absolute left-1/2 top-[20%] w-[72%] -translate-x-1/2">
        <div aria-hidden className="absolute -inset-[3.2%] rounded-t-full border border-[#E2BE78]/30" />
        <div className="relative aspect-square overflow-hidden rounded-t-full border border-[#E2BE78]/70 shadow-[0_50px_90px_-30px_rgba(0,0,0,.65)]">
          <Image
            src="/images/sevoura-seven-collection.jpg"
            alt="The seven SEVOURA fragrance bottles, Monday to Sunday, standing together on a stone plinth"
            fill
            priority={priority}
            sizes="(min-width:1024px) 440px, 66vw"
            className="art-drift object-cover"
          />
          {/* a slow glint of light across the glass */}
          {!reduce && <div aria-hidden className="art-glint pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(255,244,220,.28),transparent)]" />}
        </div>
      </div>

      {/* a gilded ledge beneath the arch */}
      <div aria-hidden className="absolute left-1/2 top-[86%] flex w-[62%] -translate-x-1/2 items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E2BE78]/70" />
        <span className="h-2 w-2 rotate-45 border border-[#E2BE78]/80" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E2BE78]/70" />
      </div>

      {/* drifting motes */}
      {[
        [18, 22, 0], [82, 30, 3], [24, 70, 6], [76, 64, 2], [50, 12, 8], [12, 48, 5], [90, 82, 9], [40, 86, 4],
      ].map(([l, t, d], k) => (
        <span key={k} aria-hidden className="art-mote absolute h-[3px] w-[3px] rounded-full bg-[#FFE9C2]" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `-${d * 1.6}s` }} />
      ))}
    </div>
  );
}
