"use client";

import Image from "next/image";
import { useId } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";

/**
 * The SEVOURA orbit, built from separate layers so it can move with real depth:
 *   base plate (arch, plinth, light)  →  back halves of the orbits  →  the sun  →  front halves.
 * Planets and fine gold particles travel the orbits (SVG animateMotion); each orbit has its own
 * speed and a slow precession; light glides across the sphere. Geometry matches scripts/product-photos/hero.py.
 */
const W = 1500;
const H = 1800;
const SUN = { cx: 750, cy: 1109.4, r: 255 };
const ORBITS: { rx: number; ry: number; tilt: number; planets: number[]; dur: number; sway: number }[] = [
  { rx: 600, ry: 153, tilt: -11, planets: [0.35, 3.6], dur: 58, sway: 1.6 },
  { rx: 495, ry: 117, tilt: 8, planets: [1.9, 4.6], dur: 41, sway: -1.2 },
  { rx: 705, ry: 198, tilt: -4, planets: [2.6, 5.4, 0.9], dur: 76, sway: 1 },
];

const PALETTES = {
  gold: { line: "#F0D69A", hi: "#FFF3D2", p0: "#FFF0C8", p1: "#D9A852", p2: "#6E4520", spark: "#FFE7AE" },
  pearl: { line: "#E6DFD4", hi: "#FFFFFF", p0: "#FFFFFF", p1: "#D9D0C3", p2: "#6B5F66", spark: "#F7F1E6" },
  ivory: { line: "#A77B3D", hi: "#FFF6DC", p0: "#FFF0C8", p1: "#C9974E", p2: "#6E4520", spark: "#D9B06A" },
} as const;

type Layer = { x: MotionValue<number> | number; y: MotionValue<number> | number };

function ellipsePath(rx: number, ry: number) {
  const { cx, cy } = SUN;
  return `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy}`;
}

function OrbitLayer({ front, uid, pal, animate, speed }: { front: boolean; uid: string; pal: (typeof PALETTES)[keyof typeof PALETTES]; animate: boolean; speed: number }) {
  const { cx, cy } = SUN;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${uid}-planet`} cx="35%" cy="32%" r="70%">
          <stop offset="0" stopColor={pal.p0} />
          <stop offset=".45" stopColor={pal.p1} />
          <stop offset="1" stopColor={pal.p2} />
        </radialGradient>
        <radialGradient id={`${uid}-spark`}>
          <stop offset="0" stopColor={pal.spark} stopOpacity="1" />
          <stop offset="1" stopColor={pal.spark} stopOpacity="0" />
        </radialGradient>
        {/* in each orbit's own frame the far half is y < cy, the near half y > cy */}
        <clipPath id={`${uid}-${front ? "near" : "far"}`} clipPathUnits="userSpaceOnUse">
          {front ? <rect x="-500" y={cy} width={W + 1000} height={H} /> : <rect x="-500" y={-H} width={W + 1000} height={H + cy} />}
        </clipPath>
      </defs>
      {ORBITS.map((o, i) => {
        const d = ellipsePath(o.rx, o.ry);
        const dur = o.dur / speed;
        const len = Math.PI * (3 * (o.rx + o.ry) - Math.sqrt((3 * o.rx + o.ry) * (o.rx + 3 * o.ry)));
        return (
          <g key={i} transform={`rotate(${o.tilt} ${cx} ${cy})`}>
            {animate && (
              <animateTransform attributeName="transform" type="rotate" values={`${o.tilt} ${cx} ${cy};${o.tilt + o.sway} ${cx} ${cy};${o.tilt} ${cx} ${cy}`} dur={`${dur * 0.7}s`} repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" />
            )}
            <g clipPath={`url(#${uid}-${front ? "near" : "far"})`}>
              <path d={d} fill="none" stroke={pal.line} strokeOpacity={front ? 0.72 : 0.42} strokeWidth={front ? 2.2 : 1.6} />
              {/* a travelling glint along the ring */}
              <path d={d} fill="none" stroke={pal.hi} strokeOpacity={front ? 0.9 : 0.5} strokeWidth={front ? 3 : 2} strokeLinecap="round" strokeDasharray={`${len * 0.06} ${len * 0.94}`}>
                {animate && <animate attributeName="stroke-dashoffset" from="0" to={-len} dur={`${dur}s`} repeatCount="indefinite" />}
              </path>
              {o.planets.map((a, k) => {
                const frac = a / (2 * Math.PI);
                const r = 15 + i * 2.5 + k * 1.5;
                return (
                  <g key={k}>
                    <circle r={r * 2.4} fill={`url(#${uid}-spark)`} opacity=".22" />
                    <circle r={r} fill={`url(#${uid}-planet)`} />
                    {animate ? (
                      <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} begin={`-${frac * dur}s`} />
                    ) : null}
                  </g>
                );
              })}
              {/* fine gold particles drifting along the path */}
              {animate &&
                [0.12, 0.47, 0.81].map((f, k) => (
                  <circle key={`p${k}`} r={3.2 - k * 0.6} fill={pal.spark} opacity=".85">
                    <animateMotion dur={`${dur * (0.62 + k * 0.11)}s`} repeatCount="indefinite" path={d} begin={`-${f * dur}s`} />
                    <animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.15;.85;1" dur={`${dur * (0.62 + k * 0.11)}s`} repeatCount="indefinite" begin={`-${f * dur}s`} />
                  </circle>
                ))}
            </g>
            {/* static planet positions when motion is reduced */}
            {!animate && (
              <g clipPath={`url(#${uid}-${front ? "near" : "far"})`}>
                {o.planets.map((a, k) => (
                  <circle key={k} cx={cx + o.rx * Math.cos(a)} cy={cy + o.ry * Math.sin(a)} r={15 + i * 2.5 + k * 1.5} fill={`url(#${uid}-planet)`} />
                ))}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function OrbitArt({
  variant = "gold",
  priority = false,
  speed = 1,
  orbits = true,
  leaves = false,
  back,
  mid,
  front,
  className = "",
}: {
  variant?: keyof typeof PALETTES;
  priority?: boolean;
  /** 1 = default; lower is slower */
  speed?: number;
  /** animate the orbital system */
  orbits?: boolean;
  /** separate, swaying botanical shadow layer (ivory edition) */
  leaves?: boolean;
  back?: Layer;
  mid?: Layer;
  front?: Layer;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[:«»]/g, "");
  const name = variant === "gold" ? "orbit" : variant === "pearl" ? "moon" : "ivory";
  const pal = PALETTES[variant];
  const live = orbits && !reduce;
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  return (
    <div className={`relative aspect-[5/6] w-full overflow-hidden ${className}`}>
      <motion.div style={back} className="absolute inset-[-2%]">
        <Image src={`/images/art/${name}-base.jpg`} alt="" fill priority={priority} sizes="(min-width:1024px) 600px, 92vw" className="object-cover" />
      </motion.div>
      {leaves && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative transparent layer
        <img src="/images/art/ivory-leaves.webp" alt="" aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${reduce ? "" : "art-sway-slow"}`} style={{ transformOrigin: "0% 0%" }} />
      )}
      <motion.div style={mid} className="absolute inset-0">
        <OrbitLayer front={false} uid={uid} pal={pal} animate={live} speed={speed} />
      </motion.div>
      <motion.div
        style={{ ...mid, left: pct(SUN.cx - SUN.r - 4, W), top: pct(SUN.cy - SUN.r - 4, H), width: pct(2 * SUN.r + 8, W), height: pct(2 * SUN.r + 8, H) }}
        className="absolute"
      >
        <Image src={`/images/art/${name}-sun.webp`} alt="" fill priority={priority} sizes="300px" className="object-contain" />
        {/* light gliding across the polished sphere */}
        <span aria-hidden className="absolute inset-[1.5%] overflow-hidden rounded-full mix-blend-screen">
          <span className={`absolute left-[-30%] top-[-30%] h-[95%] w-[95%] rounded-full bg-[radial-gradient(circle,rgba(255,244,215,.42)_0%,rgba(255,236,190,.12)_35%,transparent_62%)] ${reduce ? "" : "art-sheen"}`} />
        </span>
      </motion.div>
      <motion.div style={front} className="absolute inset-0">
        <OrbitLayer front uid={uid} pal={pal} animate={live} speed={speed} />
      </motion.div>
    </div>
  );
}
