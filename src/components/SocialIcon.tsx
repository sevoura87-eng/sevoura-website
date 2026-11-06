import { BRAND_PATHS } from "./brandPaths";
import type { SocialKey } from "@/lib/site";

/** Recognisable brand glyph, inherits currentColor. */
export default function SocialIcon({ name, size = 17 }: { name: SocialKey; size?: number }) {
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="currentColor">
        <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <rect x="5.6" y="9.6" width="2.9" height="8.6" />
        <circle cx="7.05" cy="6.6" r="1.7" />
        <path d="M10.6 9.6h2.75v1.2c.45-.8 1.5-1.45 2.95-1.45 2.75 0 3.3 1.8 3.3 4.15v4.7h-2.9v-4.15c0-1-.05-2.25-1.45-2.25s-1.7 1.05-1.7 2.2v4.2h-2.95z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="currentColor">
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}
