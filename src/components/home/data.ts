export const SEVEN = [
  { day: "Monday", planet: "Moon", symbol: "☾", fragrance: "Jasmine", notes: "Green Tea · White Musk", intention: "Calm · Emotional Balance", quality: "Calm & Reflection", image: "/images/products/monday.jpg", tint: "#D8C5A5" },
  { day: "Tuesday", planet: "Mars", symbol: "♂", fragrance: "Clove", notes: "Rose · Woods · Spice", intention: "Courage · Confidence · Action", quality: "Courage & Action", image: "/images/products/tuesday.jpg", tint: "#7A304A" },
  { day: "Wednesday", planet: "Mercury", symbol: "☿", fragrance: "Green Tea", notes: "Rose · Amber", intention: "Clarity · Communication · Focus", quality: "Clarity & Expression", image: "/images/products/wednesday.jpg", tint: "#A8B39A" },
  { day: "Thursday", planet: "Jupiter", symbol: "♃", fragrance: "Vanilla", notes: "Cocoa · Amber", intention: "Abundance · Expansion · Prosperity", quality: "Growth & Wisdom", image: "/images/products/thursday.jpg", tint: "#C89B55" },
  { day: "Friday", planet: "Venus", symbol: "♀", fragrance: "Rose", notes: "Neroli · Musk · Woods", intention: "Love · Attraction · Luxury", quality: "Beauty & Harmony", image: "/images/products/friday.jpg", tint: "#C88C91" },
  { day: "Saturday", planet: "Saturn", symbol: "♄", fragrance: "Vetiver", notes: "Patchouli · Cedarwood · Musk", intention: "Grounding · Stability · Strength", quality: "Grounding & Patience", image: "/images/products/saturday.jpg", tint: "#85776D" },
  { day: "Sunday", planet: "Sun", symbol: "☉", fragrance: "Saffron", notes: "Sandalwood · Vanilla · Dry Woods", intention: "Radiance · Vitality · Charisma", quality: "Confidence & Radiance", image: "/images/products/sunday.jpg", tint: "#D4A64E" },
] as const;

/** Index into SEVEN for today's date in India (Mon = 0 … Sun = 6) */
export function todayIndex(): number {
  const wd = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });
  const i = SEVEN.findIndex((s) => s.day === wd);
  return i < 0 ? 0 : i;
}

export const DESTINATIONS = [
  { no: "01", title: "The Collection", subtitle: "DISCOVER THE SEVEN", href: "/shop", image: "/sevoura-bottle.jpeg" },
  { no: "02", title: "Our Story", subtitle: "THE SOUL OF SEVOURA", href: "/our-story", image: "/images/founder-jasleen.jpg" },
  { no: "03", title: "The Seven", subtitle: "PLANETARY INSPIRATIONS", href: "/the-seven", image: "/images/products/wednesday.jpg" },
  { no: "04", title: "The Experience", subtitle: "A PERSONAL RITUAL", href: "/the-experience", image: "/images/products/friday.jpg" },
  { no: "05", title: "The Journal", subtitle: "THOUGHTS & STORIES", href: "/journal", image: "/images/products/saturday.jpg" },
];
