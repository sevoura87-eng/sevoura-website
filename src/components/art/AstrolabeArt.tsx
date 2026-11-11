"use client";

import Image from "next/image";
import { useId } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The Seven: a living astrolabe. The burgundy plate is a still photograph-like base; every ring, tick,
 * planet and particle is vector and moves on its own — the dial turns one way, the meridians the other,
 * each of the seven planets keeps its own orbital period, and light moves across the sun.
 */
const W = 1500;
const H = 1800;
const CX = 750;
const CY = 846;
const RADII = [150, 215, 280, 345, 410, 475, 540];
const PERIODS = [34, 47, 61, 78, 96, 118, 142]; // seconds per revolution, inner planets fastest

export default function AstrolabeArt({ priority = false, className = "", fit = "portrait" }: { priority?: boolean; className?: string; fit?: "portrait" | "cover" }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:«»]/g, "");
  const spin = (s: number, reverse = false) =>
    reduce ? undefined : ({ animation: `art-spin ${s}s linear infinite${reverse ? " reverse" : ""}`, transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" } as React.CSSProperties);
  const ticks = Array.from({ length: 168 }, (_, k) => {
    const t = (k / 168) * Math.PI * 2;
    const L = k % 24 === 0 ? 26 : k % 6 === 0 ? 14 : 7;
    return { x1: CX + Math.cos(t) * 540, y1: CY + Math.sin(t) * 540, x2: CX + Math.cos(t) * (540 + L), y2: CY + Math.sin(t) * (540 + L), major: L > 7 };
  });
  return (
    <div className={`relative w-full overflow-hidden ${fit === "portrait" ? "aspect-[5/6]" : "h-full"} ${className}`}>
      <Image src="/images/art/astrolabe-base.jpg" alt="" fill priority={priority} sizes="(min-width:1024px) 600px, 92vw" className="object-cover" />
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id={`${uid}-p`} cx="35%" cy="32%" r="70%">
            <stop offset="0" stopColor="#FFF0C8" />
            <stop offset=".45" stopColor="#D9A852" />
            <stop offset="1" stopColor="#5A3415" />
          </radialGradient>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" stopColor="#F0C878" stopOpacity=".5" />
            <stop offset="1" stopColor="#F0C878" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-sheen`}>
            <stop offset="0" stopColor="#FFF6DD" stopOpacity=".85" />
            <stop offset="1" stopColor="#FFF6DD" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-sun`}>
            <circle cx={CX} cy={CY} r="62" />
          </clipPath>
        </defs>

        {/* the dial: ticks + outer ring, turning slowly clockwise */}
        <g style={spin(240)}>
          <circle cx={CX} cy={CY} r="540" fill="none" stroke="#E2BE78" strokeOpacity=".8" strokeWidth="2" />
          {ticks.map((t, k) => (
            <line key={k} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#E2BE78" strokeOpacity={t.major ? 0.75 : 0.45} strokeWidth="1.2" />
          ))}
        </g>
        {/* seven meridians, turning the other way */}
        <g style={spin(300, true)}>
          {Array.from({ length: 7 }, (_, k) => {
            const t = -Math.PI / 2 + (k / 7) * Math.PI * 2;
            return <line key={k} x1={CX + Math.cos(t) * 150} y1={CY + Math.sin(t) * 150} x2={CX + Math.cos(t) * 540} y2={CY + Math.sin(t) * 540} stroke="#E2BE78" strokeOpacity=".22" strokeWidth="1" />;
          })}
        </g>
        {/* two tilted ecliptics, each precessing at its own pace */}
        <g style={spin(180)}>
          <ellipse cx={CX} cy={CY} rx="540" ry="170" transform={`rotate(-24 ${CX} ${CY})`} fill="none" stroke="#E2BE78" strokeOpacity=".32" strokeWidth="1.2" />
        </g>
        <g style={spin(220, true)}>
          <ellipse cx={CX} cy={CY} rx="540" ry="170" transform={`rotate(24 ${CX} ${CY})`} fill="none" stroke="#E2BE78" strokeOpacity=".32" strokeWidth="1.2" />
        </g>

        {/* the seven orbits — each planet keeps its own period */}
        {RADII.map((r, i) => {
          const a = -Math.PI / 2 + (i / 7) * Math.PI * 2 + 0.35;
          const pr = 13 + i * 1.6;
          return (
            <g key={r}>
              <circle cx={CX} cy={CY} r={r} fill="none" stroke="#E2BE78" strokeOpacity={i === 0 ? 0.7 : 0.36} strokeWidth={i === 0 ? 1.8 : 1.2} />
              <g style={spin(PERIODS[i], i % 2 === 1)}>
                <circle cx={CX + Math.cos(a) * r} cy={CY + Math.sin(a) * r} r={pr * 2.6} fill={`url(#${uid}-glow)`} />
                <circle cx={CX + Math.cos(a) * r} cy={CY + Math.sin(a) * r} r={pr} fill={`url(#${uid}-p)`} />
                {/* a fine particle trailing a quarter-orbit behind */}
                <circle cx={CX + Math.cos(a - 1.6) * r} cy={CY + Math.sin(a - 1.6) * r} r="2.6" fill="#FFE7AE" opacity=".75" />
              </g>
            </g>
          );
        })}

        {/* the sun with light drifting across it */}
        <circle cx={CX} cy={CY} r="160" fill={`url(#${uid}-glow)`} />
        <circle cx={CX} cy={CY} r="62" fill={`url(#${uid}-p)`} />
        <g clipPath={`url(#${uid}-sun)`}>
          <circle cx={CX - 18} cy={CY - 20} r="40" fill={`url(#${uid}-sheen)`} className={reduce ? "" : "art-sheen-svg"} style={{ transformBox: "view-box", transformOrigin: `${CX}px ${CY}px` }} />
        </g>
      </svg>
    </div>
  );
}
