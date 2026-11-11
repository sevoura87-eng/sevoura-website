"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

/**
 * Architectural / botanical plates with their light and shadows on separate layers,
 * each moving on its own slow cycle (CSS transforms and opacity only).
 */
const SCENES = {
  colonnade: { base: "colonnade-base.jpg", layers: [{ src: "colonnade-beams.webp", cls: "art-beams", blend: "screen" }, { src: "colonnade-palm.webp", cls: "art-sway", origin: "40% 100%" }] },
  colonnade_dusk: { base: "colonnade_dusk-base.jpg", layers: [{ src: "colonnade_dusk-beams.webp", cls: "art-beams", blend: "screen" }, { src: "colonnade_dusk-palm.webp", cls: "art-sway", origin: "40% 100%" }] },
  window: { base: "window-base.jpg", layers: [{ src: "window-light.webp", cls: "art-breathe", blend: "screen" }, { src: "window-leaves.webp", cls: "art-sway", origin: "90% 0%" }], dust: true },
  folio: { base: "folio-base.jpg", layers: [{ src: "folio-leaves.webp", cls: "art-sway-slow", origin: "100% 0%" }], orbit: true },
} as const;

type Scene = keyof typeof SCENES;

const MOTES = [
  [62, 30, 0], [70, 52, 3], [58, 66, 6], [76, 40, 9], [66, 22, 12], [72, 74, 2], [80, 58, 7], [55, 45, 10],
] as const;

export default function LightArt({ scene, priority = false, position = "50% 50%", className = "" }: { scene: Scene; priority?: boolean; position?: string; className?: string }) {
  const reduce = useReducedMotion();
  const s = SCENES[scene];
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <Image src={`/images/art/${s.base}`} alt="" fill priority={priority} sizes="100vw" style={{ objectPosition: position }} className="object-cover" />
      {s.layers.map((l) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative transparent animation layer
        <img
          key={l.src}
          src={`/images/art/${l.src}`}
          alt=""
          aria-hidden
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${reduce ? "" : l.cls}`}
          style={{ objectPosition: position, mixBlendMode: "blend" in l ? (l.blend as "screen") : undefined, transformOrigin: "origin" in l ? l.origin : "50% 50%" }}
        />
      ))}
      {"dust" in s && !reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {MOTES.map(([x, y, d], i) => (
            <span key={i} className="art-mote absolute h-[3px] w-[3px] rounded-full bg-[#FFE9C2]" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `-${d}s` }} />
          ))}
        </div>
      )}
      {"orbit" in s && (
        <svg viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden style={{ objectPosition: position }}>
          <circle cx="992" cy="550" r="210" fill="none" stroke="#A77B3D" strokeOpacity=".6" strokeWidth="1.4" />
          <g style={reduce ? undefined : { animation: "art-spin 60s linear infinite", transformOrigin: "992px 550px", transformBox: "view-box" }}>
            <circle cx={992 + 210 * Math.cos(-0.9)} cy={550 + 210 * Math.sin(-0.9)} r="16" fill="#D9A852" />
            <circle cx={992 + 210 * Math.cos(-0.9) - 5} cy={550 + 210 * Math.sin(-0.9) - 5} r="6" fill="#FFF0C8" opacity=".8" />
            <circle cx={992 + 210 * Math.cos(2.2)} cy={550 + 210 * Math.sin(2.2)} r="3" fill="#C9974E" opacity=".7" />
          </g>
        </svg>
      )}
    </div>
  );
}
