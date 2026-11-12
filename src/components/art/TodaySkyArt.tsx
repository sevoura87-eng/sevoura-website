"use client";

import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Today's Sky — the Shop hero plate. No product photography: the ruling planet of the day rises over a
 * horizon whose light follows the hour in India (dawn, day, dusk, night). Everything is vector and moves
 * on its own — the planet breathes and turns, light glows, stars twinkle at night, motes drift by day.
 */

export type Phase = "dawn" | "day" | "dusk" | "night";

export function phaseFor(hour: number): Phase {
  if (hour >= 5 && hour < 10) return "dawn";
  if (hour >= 10 && hour < 16) return "day";
  if (hour >= 16 && hour < 19) return "dusk";
  return "night";
}

export const PHASE_LABEL: Record<Phase, string> = { dawn: "DAWN", day: "DAYLIGHT", dusk: "DUSK", night: "NIGHT" };

const SKY: Record<Phase, { top: string; mid: string; low: string; glow: string; haze: string; ground: string; line: string }> = {
  dawn: { top: "#3B1A33", mid: "#A86B7E", low: "#F1C9AE", glow: "rgba(255,214,182,.55)", haze: "rgba(255,236,220,.35)", ground: "#4A2232", line: "#F3D2B4" },
  day: { top: "#B9895A", mid: "#E7C892", low: "#F8ECD6", glow: "rgba(255,246,214,.7)", haze: "rgba(255,250,236,.45)", ground: "#6B4A2E", line: "#FFF1D2" },
  dusk: { top: "#24071A", mid: "#7B2546", low: "#E29466", glow: "rgba(242,160,104,.5)", haze: "rgba(255,190,150,.25)", ground: "#2B0915", line: "#F2B98A" },
  night: { top: "#0E0208", mid: "#2A0817", low: "#4E1729", glow: "rgba(226,190,120,.28)", haze: "rgba(226,190,120,.10)", ground: "#14040B", line: "#C9A35E" },
};

/* how each planet is painted: base light → shadow, optional bands, rings, craters or corona */
const PLANET: Record<string, { hi: string; mid: string; lo: string; bands?: string[]; ring?: boolean; craters?: boolean; corona?: boolean; size: number }> = {
  Moon: { hi: "#FBF6EC", mid: "#D9D1C2", lo: "#6E665C", craters: true, size: 0.4 },
  Mars: { hi: "#F4B48E", mid: "#C0613D", lo: "#4E170C", bands: ["#A9502F", "#D98058"], size: 0.36 },
  Mercury: { hi: "#E7E2D2", mid: "#A9A691", lo: "#3F3D33", craters: true, size: 0.32 },
  Jupiter: { hi: "#FBE6C0", mid: "#D6A66A", lo: "#5A3416", bands: ["#B9834B", "#EBCB98", "#A86E3B", "#F1D7AA", "#C08A55"], size: 0.48 },
  Venus: { hi: "#FFF0E4", mid: "#E7B7A2", lo: "#7A4436", bands: ["#F3D3C2", "#E2AE98"], size: 0.4 },
  Saturn: { hi: "#F7E6BE", mid: "#CDAA6A", lo: "#4E3816", bands: ["#BF9A5C", "#E3C68E", "#B08A4E"], ring: true, size: 0.36 },
  Sun: { hi: "#FFF8D8", mid: "#FFC95A", lo: "#D8741A", corona: true, size: 0.42 },
};

const STARS = Array.from({ length: 46 }, (_, k) => {
  const r = (n: number) => ((Math.sin(k * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 1000, y: r(2) * 700, s: 0.6 + r(3) * 1.8, d: r(4) * 6, t: 3 + r(5) * 4 };
});

export default function TodaySkyArt({ planet, phase, className = "" }: { planet: string | null; phase: Phase | null; className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:«»]/g, "");
  const sky = SKY[phase ?? "night"];
  const P = planet ? PLANET[planet] : null;
  const W = 1000;
  const H = 1200;
  const CX = 500;
  const CY = 520;
  const R = P ? P.size * 500 : 0;
  const HORIZON = 900;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} style={{ background: sky.top, transition: "background 1.6s ease" }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={planet ? `${planet} rising in the ${phase} sky` : "Evening sky"}>
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky.top} />
            <stop offset=".55" stopColor={sky.mid} />
            <stop offset=".75" stopColor={sky.low} />
            <stop offset="1" stopColor={sky.ground} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" stopColor={sky.glow} />
            <stop offset="1" stopColor={sky.glow} stopOpacity="0" />
          </radialGradient>
          {P && (
            <>
              <radialGradient id={`${uid}-body`} cx="34%" cy="30%" r="78%">
                <stop offset="0" stopColor={P.hi} />
                <stop offset=".5" stopColor={P.mid} />
                <stop offset="1" stopColor={P.lo} />
              </radialGradient>
              <radialGradient id={`${uid}-shade`} cx="30%" cy="28%" r="85%">
                <stop offset=".55" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity=".55" />
              </radialGradient>
              <clipPath id={`${uid}-clip`}>
                <circle cx={CX} cy={CY} r={R} />
              </clipPath>
            </>
          )}
          <linearGradient id={`${uid}-ground`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky.ground} stopOpacity=".2" />
            <stop offset=".35" stopColor={sky.ground} stopOpacity=".85" />
            <stop offset="1" stopColor={sky.ground} />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill={`url(#${uid}-sky)`} style={{ transition: "fill 1.6s" }} />

        {/* stars — only after dark */}
        {(phase === "night" || phase === "dusk") &&
          STARS.map((s, k) => (
            <circle
              key={k}
              cx={s.x}
              cy={s.y * (phase === "dusk" ? 0.55 : 1)}
              r={s.s}
              fill="#FFF3D6"
              className={reduce ? "" : "sky-twinkle"}
              style={{ animationDelay: `-${s.d}s`, animationDuration: `${s.t}s`, opacity: phase === "dusk" ? 0.5 : 0.85 }}
            />
          ))}

        {/* the great orbit the planet travels on */}
        <g style={reduce ? undefined : { animation: "art-spin 240s linear infinite", transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}>
          <circle cx={CX} cy={CY} r="420" fill="none" stroke={sky.line} strokeOpacity=".35" strokeWidth="1.2" strokeDasharray="2 10" />
          <circle cx={CX + 420} cy={CY} r="5" fill={sky.line} fillOpacity=".8" />
        </g>
        <ellipse cx={CX} cy={CY} rx="470" ry="120" transform={`rotate(-14 ${CX} ${CY})`} fill="none" stroke={sky.line} strokeOpacity=".22" strokeWidth="1" />

        {/* glow behind the planet */}
        <circle cx={CX} cy={CY} r={P ? R * 2.3 : 320} fill={`url(#${uid}-glow)`} className={reduce ? "" : "sky-breathe"} />
      </svg>

      {/* the planet rises; switching day sets one and raises the next */}
      <AnimatePresence mode="wait">
        {P && (
          <motion.svg
            key={planet}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            aria-hidden
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: "18%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: "10%" }}
            transition={{ duration: reduce ? 0.3 : 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {P.corona && (
              <g style={reduce ? undefined : { animation: "art-spin 90s linear infinite", transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}>
                {Array.from({ length: 36 }, (_, k) => {
                  const t = (k / 36) * Math.PI * 2;
                  const L = k % 2 ? 60 : 110;
                  return <line key={k} x1={CX + Math.cos(t) * (R + 18)} y1={CY + Math.sin(t) * (R + 18)} x2={CX + Math.cos(t) * (R + 18 + L)} y2={CY + Math.sin(t) * (R + 18 + L)} stroke="#FFE3A0" strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />;
                })}
              </g>
            )}
            {P.ring && <ellipse cx={CX} cy={CY} rx={R * 1.95} ry={R * 0.42} transform={`rotate(-16 ${CX} ${CY})`} fill="none" stroke="#EBD3A0" strokeOpacity=".55" strokeWidth={R * 0.11} />}
            <circle cx={CX} cy={CY} r={R} fill={`url(#${uid}-body)`} />
            <g clipPath={`url(#${uid}-clip)`}>
              {/* bands drift slowly, as if the planet were turning */}
              {P.bands && (
                <g className={reduce ? "" : "sky-turn"} opacity=".55">
                  {P.bands.map((c, k) => {
                    const y = CY - R + ((k + 0.7) / (P.bands!.length + 0.4)) * R * 2;
                    return <ellipse key={k} cx={CX} cy={y} rx={R * 1.6} ry={R * (0.07 + (k % 2) * 0.04)} fill={c} />;
                  })}
                </g>
              )}
              {P.craters &&
                [[-0.35, -0.2, 0.16], [0.25, 0.1, 0.12], [-0.05, 0.42, 0.09], [0.42, -0.38, 0.07], [-0.5, 0.3, 0.06]].map(([x, y, r], k) => (
                  <circle key={k} cx={CX + x * R} cy={CY + y * R} r={r * R} fill={P.lo} opacity=".22" />
                ))}
              <circle cx={CX} cy={CY} r={R} fill={`url(#${uid}-shade)`} />
            </g>
            {P.ring && (
              /* the front half of the ring passes in front of the planet */
              <path
                d={`M ${CX - R * 1.95} ${CY} A ${R * 1.95} ${R * 0.42} 0 0 0 ${CX + R * 1.95} ${CY}`}
                transform={`rotate(-16 ${CX} ${CY})`}
                fill="none"
                stroke="#F3DDB0"
                strokeOpacity=".75"
                strokeWidth={R * 0.11}
              />
            )}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#FFF6E0" strokeOpacity=".35" strokeWidth="1.5" />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* horizon: a quiet ground with the planet's reflected light */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill={`url(#${uid}-ground)`} />
        <line x1="60" x2="940" y1={HORIZON} y2={HORIZON} stroke={sky.line} strokeOpacity=".55" strokeWidth="1.2" />
        <ellipse cx={CX} cy={HORIZON + 30} rx="260" ry="26" fill={sky.haze} className={reduce ? "" : "sky-breathe"} />
        <rect x={CX - 3} y={HORIZON + 8} width="6" height="200" fill={sky.line} opacity=".18" />
      </svg>

      {/* drifting motes catch the light */}
      {[
        [16, 24, 0], [80, 18, 3], [24, 64, 6], [72, 58, 2], [52, 10, 8], [10, 44, 5], [88, 70, 9], [40, 78, 4],
      ].map(([l, t, d], k) => (
        <span key={k} aria-hidden className="art-mote absolute h-[3px] w-[3px] rounded-full bg-[#FFE9C2]" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `-${d * 1.6}s` }} />
      ))}
    </div>
  );
}
