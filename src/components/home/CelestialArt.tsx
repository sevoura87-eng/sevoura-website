"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";

/**
 * SEVOURA hero artwork — a hand-built celestial composition (pure SVG, no images).
 * Motion: CSS for rotations / twinkle / float, SMIL <animateMotion> for orbiting bodies.
 * Reduced motion: CSS animations are disabled in globals.css and SMIL is paused here.
 */

const C = 340; // centre of the 680 × 680 artboard
const GOLD = "#D6A64F";
const CHAMPAGNE = "#F0D69A";

/* deterministic pseudo-random (no hydration mismatch) */
function lcg(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const rnd = lcg(7);
const STARS = Array.from({ length: 54 }, () => {
  const x = rnd() * 680, y = rnd() * 680;
  return { x, y, r: 0.5 + rnd() * 1.3, d: rnd() * 6, t: 3 + rnd() * 4 };
}).filter((s) => Math.hypot(s.x - C, s.y - C) > 150);

const SPARKLES = [
  { x: 548, y: 118, s: 1.1, d: 0.4 }, { x: 96, y: 330, s: 0.8, d: 2.1 }, { x: 600, y: 420, s: 0.9, d: 1.3 },
  { x: 250, y: 610, s: 0.7, d: 3.2 }, { x: 430, y: 64, s: 0.6, d: 4.4 }, { x: 70, y: 520, s: 1, d: 0.9 },
];

const CONSTELLATIONS = [
  [[505, 70], [540, 96], [575, 84], [602, 120], [590, 160]],
  [[60, 600], [92, 572], [128, 590], [150, 548]],
];

/* orbit path for <animateMotion>: full circle, clockwise, starting at the left */
const orbit = (r: number) => `M ${C - r} ${C} a ${r} ${r} 0 1 1 ${2 * r} 0 a ${r} ${r} 0 1 1 ${-2 * r} 0`;

/* faceted eight-point compass star */
function starFacets() {
  const out: { d: string; light: boolean; long: boolean }[] = [];
  for (let k = 0; k < 8; k++) {
    const long = k % 2 === 0;
    const a = (k * 45 * Math.PI) / 180;
    const L = long ? 120 : 70;
    const w = long ? 19 : 13;
    const tip = [C + L * Math.sin(a), C - L * Math.cos(a)];
    const l = [C + w * Math.sin(a - Math.PI / 4), C - w * Math.cos(a - Math.PI / 4)];
    const r = [C + w * Math.sin(a + Math.PI / 4), C - w * Math.cos(a + Math.PI / 4)];
    const f = (p: number[]) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
    out.push({ d: `M${C} ${C} L${f(tip)} L${f(l)} Z`, light: true, long });
    out.push({ d: `M${C} ${C} L${f(tip)} L${f(r)} Z`, light: false, long });
  }
  return out;
}
const FACETS = starFacets();

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180;
  const long = i % 6 === 0;
  const r1 = 128, r2 = long ? 140 : 135;
  return { x1: C + r1 * Math.sin(a), y1: C - r1 * Math.cos(a), x2: C + r2 * Math.sin(a), y2: C - r2 * Math.cos(a), long };
});

const octa = (r: number, rot: number) =>
  Array.from({ length: 4 }, (_, i) => {
    const a = ((rot + i * 90) * Math.PI) / 180;
    return `${(C + r * Math.sin(a)).toFixed(1)},${(C - r * Math.cos(a)).toFixed(1)}`;
  }).join(" ");

type Depth = { x: MotionValue<number>; y: MotionValue<number> };

export default function CelestialArt({ back, mid, front }: { back: Depth; mid: Depth; front: Depth }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (reduce) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [reduce]);

  return (
    <svg ref={ref} viewBox="0 0 680 680" className="celestial h-full w-full overflow-visible" role="img" aria-label="An animated golden celestial compass with orbiting planets, crescent moons and stars">
      <defs>
        <radialGradient id="cx-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={CHAMPAGNE} stopOpacity=".7" />
          <stop offset=".35" stopColor={GOLD} stopOpacity=".26" />
          <stop offset="1" stopColor="#390014" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cx-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset=".45" stopColor={GOLD} />
          <stop offset="1" stopColor="#8C5B1C" />
        </linearGradient>
        <linearGradient id="cx-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={CHAMPAGNE} />
          <stop offset="1" stopColor={GOLD} />
        </linearGradient>
        {/* planets */}
        <radialGradient id="pl-wine" cx="34%" cy="30%" r="75%">
          <stop offset="0" stopColor="#C2566F" />
          <stop offset=".45" stopColor="#7A1A37" />
          <stop offset="1" stopColor="#2A0010" />
        </radialGradient>
        <radialGradient id="pl-gold" cx="34%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFF0C4" />
          <stop offset=".45" stopColor={GOLD} />
          <stop offset="1" stopColor="#6E420F" />
        </radialGradient>
        <radialGradient id="pl-rose" cx="34%" cy="30%" r="75%">
          <stop offset="0" stopColor="#F2C2B3" />
          <stop offset=".5" stopColor="#B0586A" />
          <stop offset="1" stopColor="#3F0818" />
        </radialGradient>
        <radialGradient id="pl-shade" cx="32%" cy="28%" r="80%">
          <stop offset=".35" stopColor="#12000A" stopOpacity="0" />
          <stop offset="1" stopColor="#12000A" stopOpacity=".72" />
        </radialGradient>
        <radialGradient id="cx-spark" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFF6DA" stopOpacity="1" />
          <stop offset=".3" stopColor={CHAMPAGNE} stopOpacity=".6" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moon" cx="38%" cy="32%" r="78%">
          <stop offset="0" stopColor="#FFF3D0" />
          <stop offset=".5" stopColor={GOLD} />
          <stop offset="1" stopColor="#7E5016" />
        </radialGradient>
        <clipPath id="clip-giant"><circle r="28" /></clipPath>
        <clipPath id="clip-rose"><circle r="17" /></clipPath>
        <clipPath id="clip-front"><rect x="-70" y="0" width="140" height="40" /></clipPath>
        <mask id="moon-cut">
          <rect x="-60" y="-60" width="120" height="120" fill="#fff" />
          <circle cx="20" cy="-12" r="40" fill="#000" />
        </mask>
        <mask id="moon-cut-sm">
          <rect x="-30" y="-30" width="60" height="60" fill="#fff" />
          <circle cx="7" cy="-5" r="14" fill="#000" />
        </mask>
      </defs>

      {/* ---------- BACK: stars & constellations ---------- */}
      <motion.g style={back}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={CHAMPAGNE} className="cx-twinkle" style={{ animationDelay: `${s.d}s`, animationDuration: `${s.t}s` }} />
        ))}
        {CONSTELLATIONS.map((pts, i) => (
          <g key={i}>
            <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={CHAMPAGNE} strokeOpacity=".28" strokeWidth=".6" />
            {pts.map((p, j) => (
              <circle key={j} cx={p[0]} cy={p[1]} r="1.6" fill={CHAMPAGNE} className="cx-twinkle" style={{ animationDelay: `${(i + j) * 0.7}s` }} />
            ))}
          </g>
        ))}
        {SPARKLES.map((s, i) => (
          <path
            key={i}
            transform={`translate(${s.x} ${s.y}) scale(${s.s})`}
            d="M0-9C.5-3 3-.5 9 0 3 .5.5 3 0 9-.5 3-3 .5-9 0-3-.5-.5-3 0-9Z"
            fill={CHAMPAGNE}
            className="cx-twinkle"
            style={{ animationDelay: `${s.d}s` }}
          />
        ))}
      </motion.g>

      {/* ---------- MID: astrolabe, orbits, compass, planets ---------- */}
      <motion.g style={mid}>
        <circle cx={C} cy={C} r="230" fill="url(#cx-halo)" className="cx-pulse" />

        {/* outer astrolabe ring */}
        <g className="cx-spin cx-slow">
          <circle cx={C} cy={C} r="318" fill="none" stroke={GOLD} strokeOpacity=".35" strokeWidth=".8" />
          <circle cx={C} cy={C} r="310" fill="none" stroke={CHAMPAGNE} strokeOpacity=".35" strokeWidth=".8" strokeDasharray="1 7" />
          {[0, 90, 180, 270].map((a) => (
            <path key={a} transform={`rotate(${a} ${C} ${C})`} d={`M${C} ${C - 324} l5 6 -5 6 -5 -6 Z`} fill={GOLD} />
          ))}
        </g>

        {/* orbits */}
        <circle cx={C} cy={C} r="285" fill="none" stroke={GOLD} strokeOpacity=".22" strokeWidth=".8" />
        <g className="cx-spin cx-rev cx-med">
          <circle cx={C} cy={C} r="245" fill="none" stroke={CHAMPAGNE} strokeOpacity=".4" strokeWidth=".9" strokeDasharray="2 9" />
        </g>
        <g className="cx-spin cx-fast">
          <circle cx={C} cy={C} r="195" fill="none" stroke={GOLD} strokeOpacity=".38" strokeWidth=".8" strokeDasharray="60 14 2 14" />
        </g>

        {/* geometric octagram */}
        <g className="cx-spin cx-rev cx-slower" stroke={GOLD} strokeOpacity=".3" strokeWidth=".8" fill="none">
          <polygon points={octa(172, 0)} />
          <polygon points={octa(172, 45)} />
          <circle cx={C} cy={C} r="121" strokeDasharray="1 5" />
        </g>

        {/* astrolabe dial */}
        <g className="cx-spin cx-med">
          <circle cx={C} cy={C} r="144" fill="none" stroke="url(#cx-line)" strokeWidth="1.6" />
          <circle cx={C} cy={C} r="126" fill="none" stroke={GOLD} strokeOpacity=".55" strokeWidth=".7" />
          {TICKS.map((t, i) => (
            <line key={i} {...t} stroke={t.long ? CHAMPAGNE : GOLD} strokeOpacity={t.long ? 0.9 : 0.5} strokeWidth={t.long ? 1.1 : 0.6} />
          ))}
        </g>

        {/* central compass star */}
        <g className="cx-spin cx-star">
          {FACETS.map((f, i) => (
            <path key={i} d={f.d} fill={f.long ? (f.light ? "#FBE3A6" : "#B07A2A") : f.light ? "#E9C77F" : "#8A5A1C"} />
          ))}
          <circle cx={C} cy={C} r="70" fill="url(#cx-spark)" opacity=".35" />
          <circle cx={C} cy={C} r="16" fill="#2A0010" stroke="url(#cx-gold)" strokeWidth="2" />
          <circle cx={C} cy={C} r="6" fill="url(#cx-gold)" />
        </g>
        <circle cx={C} cy={C - 112} r="10" fill="url(#cx-spark)" className="cx-pulse" />

        {/* orbiting particles of light */}
        {[
          { r: 195, dur: 16, begin: 0 },
          { r: 195, dur: 16, begin: -8 },
          { r: 245, dur: 26, begin: -5, rev: true },
          { r: 285, dur: 34, begin: -20 },
        ].map((p, i) => (
          <g key={i}>
            <circle r="7" fill="url(#cx-spark)" />
            <circle r="1.5" fill="#FFF6DA" />
            <animateMotion dur={`${p.dur}s`} begin={`${p.begin}s`} repeatCount="indefinite" path={orbit(p.r)} {...(p.rev ? { keyPoints: "1;0", keyTimes: "0;1", calcMode: "linear" } : {})} />
          </g>
        ))}

        {/* gold planet with craters */}
        <g>
          <g transform="scale(1.25)">
          <circle r="15" fill="url(#pl-gold)" />
          <circle cx="-4" cy="3" r="3" fill="#6E420F" opacity=".25" />
          <circle cx="5" cy="-5" r="2" fill="#6E420F" opacity=".22" />
          <circle cx="3" cy="7" r="1.6" fill="#6E420F" opacity=".2" />
          <circle r="15" fill="url(#pl-shade)" />
          <circle r="15" fill="none" stroke="#FFF1C9" strokeOpacity=".45" strokeWidth=".6" />
          </g>
          <animateMotion dur="48s" begin="-14s" repeatCount="indefinite" path={orbit(195)} />
        </g>

        {/* ringed burgundy giant */}
        <g>
          <g transform="scale(1.3)">
          <g transform="rotate(-20)">
            <ellipse rx="54" ry="12" fill="none" stroke="url(#cx-gold)" strokeWidth="2.4" strokeOpacity=".9" />
            <ellipse rx="45" ry="9.5" fill="none" stroke={CHAMPAGNE} strokeWidth=".7" strokeOpacity=".6" />
          </g>
          <circle r="28" fill="url(#pl-wine)" />
          <g clipPath="url(#clip-giant)" transform="rotate(-20)" opacity=".9">
            <rect x="-30" y="-14" width="60" height="5" fill={CHAMPAGNE} opacity=".16" />
            <rect x="-30" y="-6" width="60" height="2.5" fill={GOLD} opacity=".3" />
            <rect x="-30" y="2" width="60" height="7" fill="#2A0010" opacity=".28" />
            <rect x="-30" y="12" width="60" height="3" fill={CHAMPAGNE} opacity=".14" />
            <ellipse cx="8" cy="5" rx="6" ry="2.6" fill={GOLD} opacity=".28" />
          </g>
          <circle r="28" fill="url(#pl-shade)" />
          <circle r="28" fill="none" stroke={CHAMPAGNE} strokeOpacity=".4" strokeWidth=".7" />
          <g transform="rotate(-20)" clipPath="url(#clip-front)">
            <ellipse rx="54" ry="12" fill="none" stroke="url(#cx-gold)" strokeWidth="2.4" />
            <ellipse rx="45" ry="9.5" fill="none" stroke={CHAMPAGNE} strokeWidth=".7" strokeOpacity=".7" />
          </g>
          </g>
          <animateMotion dur="120s" begin="-38s" repeatCount="indefinite" path={orbit(245)} keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
        </g>

        {/* rose planet with swirling bands */}
        <g>
          <g transform="scale(1.25)">
          <circle r="17" fill="url(#pl-rose)" />
          <g clipPath="url(#clip-rose)" fill="none" strokeLinecap="round">
            <path d="M-18 -6 C-8 -10 6 -2 18 -7" stroke={CHAMPAGNE} strokeOpacity=".25" strokeWidth="2" />
            <path d="M-18 2 C-6 -1 8 6 18 1" stroke="#3F0818" strokeOpacity=".4" strokeWidth="3" />
            <path d="M-18 9 C-4 6 6 12 18 8" stroke={CHAMPAGNE} strokeOpacity=".18" strokeWidth="1.5" />
          </g>
          <circle r="17" fill="url(#pl-shade)" />
          <circle r="17" fill="none" stroke="#F2C2B3" strokeOpacity=".4" strokeWidth=".6" />
          </g>
          <animateMotion dur="160s" begin="-110s" repeatCount="indefinite" path={orbit(285)} />
        </g>
      </motion.g>

      {/* ---------- FRONT: crescent moons ---------- */}
      <motion.g style={front}>
        <g transform="translate(112 126) scale(1.2)">
          <g className="cx-float">
            <circle r="70" fill="url(#cx-halo)" opacity=".7" />
            <circle r="44" fill="url(#moon)" mask="url(#moon-cut)" />
            <g mask="url(#moon-cut)" fill="#6E420F" opacity=".22">
              <circle cx="-22" cy="10" r="5" />
              <circle cx="-12" cy="26" r="3" />
              <circle cx="-30" cy="-8" r="2.4" />
            </g>
            <circle r="44" fill="none" stroke={CHAMPAGNE} strokeOpacity=".35" strokeWidth=".6" mask="url(#moon-cut)" />
          </g>
        </g>
        <g transform="translate(578 548)">
          <g className="cx-float cx-float-alt">
            <circle r="16" fill="url(#moon)" mask="url(#moon-cut-sm)" />
          </g>
        </g>
      </motion.g>
    </svg>
  );
}
