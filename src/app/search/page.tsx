"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/format";

const PAGES = [
  { title: "The Collection", href: "/shop", text: "SEVOURA 7-Day Planetary Blend Collection — seven alcohol-free fragrance blends, 7 × 4 ml." },
  { title: "The Seven", href: "/the-seven", text: "Seven fragrance identities — Moon, Mars, Mercury, Jupiter, Venus, Saturn, Sun." },
  { title: "Planetary Fragrance Finder", href: "/ritual-finder", text: "Find the ritual, intention and fragrance that resonates with you." },
  { title: "Our Story", href: "/our-story", text: "The vision, beginnings and philosophy of SEVOURA and founder Dr. Jasleen Bhatti." },
  { title: "Astrology Behind the Rituals", href: "/our-story/astrology-behind-rituals", text: "The planetary symbolism and inspiration behind the seven rituals." },
  { title: "The Experience", href: "/the-experience", text: "The art of everyday ritual — a more thoughtful world of fragrance." },
  { title: "Journal", href: "/journal", text: "Stories, blogs and editorial from the world of SEVOURA." },
  { title: "FAQ", href: "/faq", text: "Frequently asked questions about the collection, orders and shipping." },
  { title: "Shipping & Returns", href: "/shipping-returns", text: "Delivery timelines, free shipping and our returns policy." },
  { title: "Contact Us", href: "/contact", text: "Email hello@sevoura.com or call +91-9211877712." },
  { title: "Privacy Policy", href: "/privacy-policy", text: "How we collect, use and protect your information." },
  { title: "Terms & Conditions", href: "/terms", text: "Terms of use for the SEVOURA website and store." },
];

const BLENDS = [
  ["Monday", "Moon", "Jasmine · Green Tea · White Musk", "Calm · Emotional Balance"],
  ["Tuesday", "Mars", "Clove · Rose · Woods · Spice", "Courage · Confidence · Action"],
  ["Wednesday", "Mercury", "Green Tea · Rose · Amber", "Clarity · Communication · Focus"],
  ["Thursday", "Jupiter", "Vanilla · Cocoa · Amber", "Abundance · Expansion · Prosperity"],
  ["Friday", "Venus", "Rose · Neroli · Musk · Woods", "Love · Attraction · Luxury"],
  ["Saturday", "Saturn", "Vetiver · Patchouli · Cedarwood · Musk", "Grounding · Stability · Strength"],
  ["Sunday", "Sun", "Saffron · Sandalwood · Vanilla · Dry Woods", "Radiance · Vitality · Charisma"],
].map(([day, planet, notes, intention]) => ({
  title: `${day} — ${planet}`,
  href: "/the-seven",
  text: `${notes}. ${intention}.`,
}));

export default function SearchPage() {
  const [q, setQ] = useState("");
  const { products } = useCart();
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const prod = products.map((p) => ({ title: p.name, href: "/shop", text: `${p.subtitle ?? ""} ${p.description ?? ""}`, price: p.price_paise }));
    const all = [...prod, ...BLENDS, ...PAGES];
    if (!term) return [];
    return all.filter((r) => `${r.title} ${r.text}`.toLowerCase().includes(term)).slice(0, 20);
  }, [q, products]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] overflow-x-clip bg-[#F8F1E7] px-5 py-16 text-[#481D30] md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] tracking-[0.34em] text-[#A77B4D]">SEARCH SEVOURA</p>
          <label className="mt-6 flex items-center gap-4 border-b-2 border-[#792D49]/70 pb-4 focus-within:border-[#B28B4E]">
            <Search size={26} strokeWidth={1.2} className="text-[#A77B4D]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rose, Saturn, shipping…"
              className="w-full bg-transparent font-serif text-3xl outline-none placeholder:text-[#C8B49B] md:text-5xl"
            />
          </label>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Rose", "Vanilla", "Moon", "Alcohol-free", "Shipping", "Gift"].map((s) => (
              <button key={s} onClick={() => setQ(s)} className="border border-[#D6BE99] px-3 py-1.5 text-[13px] text-[#806D60] transition hover:border-[#792D49] hover:text-[#792D49]">
                {s}
              </button>
            ))}
          </div>
          <ul className="mt-10 divide-y divide-[#DCCAB5]">
            <AnimatePresence>
              {results.map((r, i) => (
                <motion.li key={r.title + r.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }} exit={{ opacity: 0 }}>
                  <Link href={r.href} className="group flex items-start justify-between gap-6 py-5">
                    <div>
                      <p className="font-serif text-2xl transition group-hover:text-[#792D49]">{r.title}</p>
                      <p className="mt-1 text-[15px] leading-6 text-[#806D60]">{r.text}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {"price" in r && typeof r.price === "number" && <span className="font-serif text-xl text-[#792D49]">{formatINR(r.price)}</span>}
                      <ArrowUpRight size={18} className="text-[#A77B4D] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {q && !results.length && <p className="mt-10 text-[15px] text-[#806D60]">No results for “{q}”.</p>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
