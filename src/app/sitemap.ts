import type { MetadataRoute } from "next";

const BASE = "https://www.sevoura.com";
const PATHS = ["", "/shop", "/our-story", "/our-story/astrology-behind-rituals", "/the-seven", "/the-experience", "/ritual-finder", "/journal", "/faq", "/contact", "/shipping-returns", "/privacy-policy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({ url: BASE + p, changeFrequency: p === "" || p === "/shop" ? "weekly" : "monthly", priority: p === "" ? 1 : p === "/shop" ? 0.9 : 0.6 }));
}
