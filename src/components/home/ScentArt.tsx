"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, type MotionValue } from "framer-motion";
import { Botanical, BotanicalDefs, ingredientsOf } from "./Botanicals";

/**
 * SEVOURA hero artwork — "Seven Scent Worlds".
 * A floating glass-petal sculpture, liquid-gold ribbons, glass spheres, fragrance mist and the
 * botanical ingredients of the selected blend. Pure SVG, no images.
 * Motion: CSS (float / drift / spin / rise) + SMIL (liquid ribbons). Reduced motion: all paused.
 */

/* art-direction colour mood for each day's atmosphere (ingredients come from the fragrance data) */
export const MOOD: Record<string, { mist: string; glass: string }> = {
  Monday: { mist: "#F6E8CC", glass: "#FFF4DC" },
  Tuesday: { mist: "#E58197", glass: "#F7B9C4" },
  Wednesday: { mist: "#BFD6A2", glass: "#E2F0CC" },
  Thursday: { mist: "#EDB35E", glass: "#FFD9A0" },
  Friday: { mist: "#F2A3B2", glass: "#FFD0D8" },
  Saturday: { mist: "#BBA78E", glass: "#E5D7C2" },
  Sunday: { mist: "#F4B43E", glass: "#FFE1A0" },
};

const SLOTS = [
  { x: 112, y: 140, s: 1.55, r: -20, d: 9 },
  { x: 340, y: 64, s: 1.15, r: 15, d: 11 },
  { x: 630, y: 112, s: 1.4, r: 25, d: 10 },
  { x: 664, y: 470, s: 1.5, r: -35, d: 12 },
  { x: 548, y: 646, s: 1.3, r: 15, d: 8.5 },
  { x: 64, y: 330, s: 1.25, r: -10, d: 10.5 },
  { x: 236, y: 232, s: 1.05, r: 40, d: 9.5 },
  { x: 476, y: 168, s: 1.05, r: -25, d: 11.5 },
];

const PETALS = [
  { a: -46, s: 0.8, sway: 13 },
  { a: 46, s: 0.8, sway: 15 },
  { a: -23, s: 0.92, sway: 11 },
  { a: 23, s: 0.92, sway: 12 },
  { a: 0, s: 1, sway: 14 },
];
const PETAL = "M0 0 C -64 -72 -66 -214 0 -294 C 66 -214 64 -72 0 0Z";

const SPHERES = [
  { x: 580, y: 280, r: 56, d: 13 },
  { x: 150, y: 444, r: 32, d: 10 },
  { x: 528, y: 560, r: 20, d: 9 },
  { x: 650, y: 380, r: 11, d: 8 },
  { x: 300, y: 150, r: 8, d: 7 },
];

const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  x: 40 + ((i * 97) % 620),
  y: 160 + ((i * 53) % 500),
  r: 0.8 + (i % 3) * 0.55,
  d: 6 + (i % 5) * 1.3,
  delay: (i * 0.61) % 8,
}));

/* liquid gold ribbons with tapered tails — same command structure in both keyframes so SMIL can morph */
const RIBBON_BACK = {
  a: "M30 560 C 150 470 250 560 384 470 C 504 390 604 330 692 246 C 612 362 524 444 396 502 C 262 580 150 522 30 560 Z",
  b: "M30 540 C 160 500 240 520 376 452 C 514 382 612 352 692 268 C 602 382 522 424 388 486 C 252 552 160 532 30 540 Z",
  topA: "M30 560 C 150 470 250 560 384 470 C 504 390 604 330 692 246",
  topB: "M30 540 C 160 500 240 520 376 452 C 514 382 612 352 692 268",
};
const RIBBON_FRONT = {
  a: "M14 650 C 130 588 270 682 412 610 C 532 552 622 610 694 574 C 624 632 532 586 418 636 C 276 698 130 622 14 650 Z",
  b: "M14 640 C 140 610 260 652 404 596 C 542 546 616 592 694 590 C 616 622 542 572 410 620 C 264 670 140 638 14 640 Z",
  topA: "M14 650 C 130 588 270 682 412 610 C 532 552 622 610 694 574",
  topB: "M14 640 C 140 610 260 652 404 596 C 542 546 616 592 694 590",
};
const SPLINE = { calcMode: "spline", keyTimes: "0;0.5;1", keySplines: ".45 0 .55 1;.45 0 .55 1" } as const;

type Depth = { x: MotionValue<number>; y: MotionValue<number> };

export default function ScentArt({
  day,
  fragrance,
  notes,
  back,
  mid,
  front,
}: {
  day: string;
  fragrance: string;
  notes: string;
  back: Depth;
  mid: Depth;
  front: Depth;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const mood = MOOD[day] ?? MOOD.Monday;
  const ingredients = ingredientsOf(fragrance, notes);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (reduce) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [reduce]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 700 700"
      className="scent h-full w-full overflow-visible"
      style={{ "--mist": mood.mist, "--glass": mood.glass } as React.CSSProperties}
      role="img"
      aria-label={`${fragrance} — an abstract glass sculpture with liquid gold and the blend's ingredients: ${ingredients.join(", ")}`}
    >
      <defs>
        <BotanicalDefs />
        <radialGradient id="sc-mist" cx="50%" cy="50%" r="50%">
          <stop offset="0" style={{ stopColor: "var(--mist)" }} stopOpacity=".42" />
          <stop offset=".55" style={{ stopColor: "var(--mist)" }} stopOpacity=".12" />
          <stop offset="1" style={{ stopColor: "var(--mist)" }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sc-mist-white" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFF6E6" stopOpacity=".16" />
          <stop offset="1" stopColor="#FFF6E6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sc-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".34" />
          <stop offset=".45" style={{ stopColor: "var(--glass)" }} stopOpacity=".12" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity=".05" />
        </linearGradient>
        <linearGradient id="sc-glass-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset=".55" style={{ stopColor: "var(--glass)" }} stopOpacity=".35" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity=".55" />
        </linearGradient>
        <radialGradient id="sc-sphere" cx="50%" cy="68%" r="60%">
          <stop offset="0" style={{ stopColor: "var(--glass)" }} stopOpacity=".38" />
          <stop offset=".6" style={{ stopColor: "var(--glass)" }} stopOpacity=".08" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity=".1" />
        </radialGradient>
        <linearGradient id="sc-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6E420F" />
          <stop offset=".18" stopColor="#D6A64F" />
          <stop offset=".32" stopColor="#FFF0C4" />
          <stop offset=".48" stopColor="#C68E3A" />
          <stop offset=".62" stopColor="#7A4A12" />
          <stop offset=".78" stopColor="#F0D69A" />
          <stop offset="1" stopColor="#8C5B1C" />
        </linearGradient>
        <linearGradient id="sc-gold-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3CF" stopOpacity=".9" />
          <stop offset="1" stopColor="#6E420F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sc-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".12" />
          <stop offset=".3" stopColor="#FFFFFF" stopOpacity=".5" />
          <stop offset=".6" style={{ stopColor: "var(--glass)" }} stopOpacity=".2" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity=".35" />
        </linearGradient>
        <clipPath id="sc-ring-front">
          <rect x="160" y="384" width="440" height="90" />
        </clipPath>
      </defs>

      {/* ---------- BACK: fragrance mist ---------- */}
      <motion.g style={back}>
        <ellipse cx="360" cy="360" rx="330" ry="270" fill="url(#sc-mist)" className="sc-drift" />
        <ellipse cx="160" cy="240" rx="200" ry="130" fill="url(#sc-mist)" className="sc-drift sc-drift-b" />
        <ellipse cx="560" cy="520" rx="220" ry="140" fill="url(#sc-mist)" className="sc-drift sc-drift-c" />
        <ellipse cx="420" cy="180" rx="260" ry="90" fill="url(#sc-mist-white)" className="sc-drift sc-drift-c" />
        <ellipse cx="240" cy="560" rx="260" ry="80" fill="url(#sc-mist-white)" className="sc-drift" />
      </motion.g>

      {/* ---------- MID: liquid gold + glass sculpture ---------- */}
      <motion.g style={mid}>
        {/* liquid gold ribbon behind the sculpture */}
        <path d={RIBBON_BACK.a} fill="url(#sc-gold)" opacity=".95">
          <animate attributeName="d" dur="14s" repeatCount="indefinite" values={`${RIBBON_BACK.a};${RIBBON_BACK.b};${RIBBON_BACK.a}`} {...SPLINE} />
        </path>
        <path d={RIBBON_BACK.topA} fill="none" stroke="#FFF6DA" strokeOpacity=".75" strokeWidth="1.4" strokeLinecap="round">
          <animate attributeName="d" dur="14s" repeatCount="indefinite" values={`${RIBBON_BACK.topA};${RIBBON_BACK.topB};${RIBBON_BACK.topA}`} {...SPLINE} />
        </path>

        <g className="sc-float sc-float-slow">
          {/* glass ring — back half */}
          <g transform="rotate(-9 380 392)">
            <ellipse cx="380" cy="392" rx="196" ry="52" fill="none" stroke="url(#sc-ring)" strokeWidth="9" opacity=".55" />
          </g>

          {/* glass petals */}
          {PETALS.map((p, i) => (
            <g key={i} transform={`translate(380 606) rotate(${p.a}) scale(${p.s * 1.12})`}>
              <g className="sc-sway" style={{ animationDuration: `${p.sway}s`, animationDelay: `${-i * 2.3}s` }}>
                <path d={PETAL} fill="url(#sc-glass)" stroke="url(#sc-glass-edge)" strokeWidth="1.3" />
                <path d="M-6 -24 C -46 -84 -48 -196 -6 -262" fill="none" stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M12 -40 C 40 -100 40 -190 10 -250" fill="none" stroke="#FFFFFF" strokeOpacity=".14" strokeWidth="6" strokeLinecap="round" />
                <path d="M0 -6 L0 -280" stroke="#FFFFFF" strokeOpacity=".1" strokeWidth=".8" />
              </g>
            </g>
          ))}
          {/* liquid gold pooling at the base of the sculpture */}
          <ellipse cx="380" cy="606" rx="52" ry="13" fill="url(#sc-gold)" />
          <ellipse cx="380" cy="602" rx="38" ry="6" fill="#FFF3CF" opacity=".55" />

          {/* glass ring — front half */}
          <g transform="rotate(-9 380 392)" clipPath="url(#sc-ring-front)">
            <ellipse cx="380" cy="392" rx="196" ry="52" fill="none" stroke="url(#sc-ring)" strokeWidth="9" />
            <ellipse cx="380" cy="392" rx="196" ry="52" fill="none" stroke="#FFFFFF" strokeOpacity=".7" strokeWidth="1" />
          </g>
        </g>

        {/* glass spheres */}
        {SPHERES.map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y})`}>
            <g className="sc-float" style={{ animationDuration: `${s.d}s`, animationDelay: `${-i * 1.7}s` }}>
              <circle r={s.r} fill="url(#sc-sphere)" stroke="#FFFFFF" strokeOpacity=".42" strokeWidth="1" />
              <g className="sc-spin" style={{ animationDuration: `${30 + i * 8}s` }}>
                <ellipse rx={s.r * 0.94} ry={s.r * 0.3} fill="none" stroke="#FFFFFF" strokeOpacity=".09" strokeWidth={Math.max(0.5, s.r * 0.025)} />
              </g>
              <ellipse cx={-s.r * 0.36} cy={-s.r * 0.42} rx={s.r * 0.32} ry={s.r * 0.17} transform={`rotate(-32 ${-s.r * 0.36} ${-s.r * 0.42})`} fill="#FFFFFF" opacity=".85" />
              <path d={`M ${s.r * 0.55} ${s.r * 0.35} A ${s.r * 0.66} ${s.r * 0.66} 0 0 1 ${s.r * 0.05} ${s.r * 0.66}`} fill="none" stroke="#FFFFFF" strokeOpacity=".35" strokeWidth={Math.max(0.6, s.r * 0.05)} strokeLinecap="round" />
            </g>
          </g>
        ))}

        {/* liquid gold ribbon in front */}
        <path d={RIBBON_FRONT.a} fill="url(#sc-gold)" opacity=".9">
          <animate attributeName="d" dur="11s" repeatCount="indefinite" values={`${RIBBON_FRONT.a};${RIBBON_FRONT.b};${RIBBON_FRONT.a}`} {...SPLINE} />
        </path>
        <path d={RIBBON_FRONT.topA} fill="none" stroke="#FFF6DA" strokeOpacity=".7" strokeWidth="1.1" strokeLinecap="round">
          <animate attributeName="d" dur="11s" repeatCount="indefinite" values={`${RIBBON_FRONT.topA};${RIBBON_FRONT.topB};${RIBBON_FRONT.topA}`} {...SPLINE} />
        </path>
      </motion.g>

      {/* ---------- FRONT: the blend's ingredients + golden particles ---------- */}
      <motion.g style={front}>
        <AnimatePresence initial={false}>
          <motion.g key={day} initial="out" animate="in" exit="gone">
            {SLOTS.map((slot, k) => {
              const note = ingredients[k % ingredients.length];
              return (
                <g key={k} transform={`translate(${slot.x} ${slot.y})`}>
                  <motion.g
                    variants={{
                      out: { opacity: 0, scale: 0.55, y: 26 },
                      in: { opacity: 1, scale: 1, y: 0, transition: { delay: 0.15 + k * 0.07, duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
                      gone: { opacity: 0, scale: 0.85, y: -18, transition: { duration: 0.5, ease: "easeIn" } },
                    }}
                  >
                    <g className="sc-float" style={{ animationDuration: `${slot.d}s`, animationDelay: `${-k * 1.3}s` }}>
                      <g className="sc-tumble" style={{ animationDuration: `${slot.d * 1.6}s` }}>
                        <g transform={`rotate(${slot.r}) scale(${slot.s})`}>
                          <Botanical note={note} />
                        </g>
                      </g>
                    </g>
                  </motion.g>
                </g>
              );
            })}
          </motion.g>
        </AnimatePresence>

        {PARTICLES.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#F0D69A" className="sc-rise" style={{ animationDuration: `${p.d}s`, animationDelay: `${-p.delay}s` }} />
        ))}
      </motion.g>
    </svg>
  );
}
