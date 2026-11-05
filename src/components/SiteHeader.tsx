
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  UserRound,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import BrandLogo from "./BrandLogo";

const navigation = [
  {
    name: "SHOP",
    href: "/shop",
    eyebrow: "THE COLLECTION",
    pages: [
      {
        title: "The Collection",
        description: "SEVOURA 7-Day Planetary Blend Collection",
        href: "/shop",
      },
    ],
  },
  {
    name: "OUR STORY",
    href: "/our-story",
    eyebrow: "GET TO KNOW SEVOURA",
    pages: [
      {
        title: "The SEVOURA Story",
        description: "Our vision, beginnings and philosophy.",
        href: "/our-story",
      },
      {
        title: "Astrology Behind the Rituals",
        description: "The inspiration behind our seven rituals.",
        href: "/our-story/astrology-behind-rituals",
      },
    ],
  },
  {
    name: "THE SEVEN",
    href: "/the-seven",
    eyebrow: "SEVEN DAYS. SEVEN EXPRESSIONS.",
    pages: [
      {
        title: "Explore the Seven",
        description: "Discover the seven fragrance identities.",
        href: "/the-seven",
      },
      {
        title: "Planetary Fragrance Finder",
        description: "Find the ritual that resonates with you.",
        href: "/ritual-finder",
      },
    ],
  },
  {
    name: "THE EXPERIENCE",
    href: "/the-experience",
    eyebrow: "THE ART OF EVERYDAY RITUAL",
    pages: [
      {
        title: "The SEVOURA Experience",
        description: "Discover a more thoughtful world of fragrance.",
        href: "/the-experience",
      },
    ],
  },
  {
    name: "JOURNAL",
    href: "/journal",
    eyebrow: "STORIES · BLOGS · EDITORIAL",
    pages: [
      {
        title: "Stories & Editorial",
        description: "Ideas, inspiration and the world of SEVOURA.",
        href: "/journal",
      },
    ],
  },
];

export default function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeAll = () => {
    setActiveMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <header
      className="sticky top-0 z-[100] w-full border-b border-[#D8C6AA]/70 bg-[#F7F0E6] text-[#392823] shadow-[0_3px_18px_rgba(50,30,20,0.05)]"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex h-[78px] items-center justify-between gap-5">
          <div onMouseEnter={() => setActiveMenu(null)}>
            <BrandLogo />
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden h-full items-center gap-6 xl:flex 2xl:gap-9">
            {navigation.map((item) => {
              const isOpen = activeMenu === item.name;

              return (
                <div
                  key={item.name}
                  className="relative flex h-full items-center"
                  onMouseEnter={() => setActiveMenu(item.name)}
                >
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={item.href}
                      prefetch
                      onFocus={() => setActiveMenu(item.name)}
                      className={`relative py-3 text-[10px] font-medium tracking-[1.3px] transition-colors duration-300 2xl:text-[11px] ${
                        isOpen
                          ? "text-[#A77A3E]"
                          : "text-[#392823] hover:text-[#A77A3E]"
                      }`}
                    >
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 h-px bg-[#A77A3E] transition-all duration-300 ${
                          isOpen ? "w-full" : "w-0"
                        }`}
                      />
                    </Link>

                    <ChevronDown
                      size={11}
                      className={`text-[#A77A3E] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* COMPACT LUXURY DROPDOWN */}
                  <div
                    className={`absolute left-1/2 top-full z-[120] w-[350px] -translate-x-1/2 pt-3 transition-all duration-300 ${
                      isOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="relative overflow-hidden border border-[#D6BE99] bg-[#F9F0E4] p-5 shadow-[0_18px_45px_rgba(40,20,25,0.18)]">
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#782C49]/[0.045]" />

                      <div className="relative mb-3 flex items-center gap-2">
                        <span className="h-px w-6 bg-[#B28B4E]" />
                        <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-[#A47A40]">
                          {item.eyebrow}
                        </span>
                      </div>

                      <div className="relative">
                        {item.pages.map((page, index) => (
                          <Link
                            key={page.href}
                            href={page.href}
                            prefetch
                            onClick={() => setActiveMenu(null)}
                            className="group flex items-center justify-between gap-3 border-b border-[#D9C9B5]/70 px-2 py-4 last:border-0 hover:bg-[#EFE1D0]/70"
                          >
                            <div>
                              <h3 className="font-serif text-[19px] leading-tight text-[#782C49] transition-colors duration-300 group-hover:text-[#A47A40]">
                                {page.title}
                              </h3>
                              <p className="mt-1.5 text-[10px] leading-5 text-[#806D5D]">
                                {page.description}
                              </p>
                            </div>

                            <ArrowUpRight
                              size={15}
                              className="shrink-0 text-[#A47A40] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                            />
                          </Link>
                        ))}
                      </div>

                      <div className="relative mt-3 flex items-center justify-between border-t border-[#D9C9B5]/60 pt-3">
                        <span className="font-serif text-sm tracking-[0.2em] text-[#782C49]">
                          SEVOURA
                        </span>
                        <span className="text-[7px] uppercase tracking-[0.2em] text-[#A47A40]">
                          Cleanse. Elevate. Radiate.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden shrink-0 items-center gap-5 md:flex">
            <Link
              href="/search"
              className="flex flex-col items-center gap-1 transition-colors hover:text-[#A47A40]"
            >
              <Search size={17} strokeWidth={1.3} />
              <span className="text-[9px]">Search</span>
            </Link>

            <Link
              href="/account"
              className="flex flex-col items-center gap-1 transition-colors hover:text-[#A47A40]"
            >
              <UserRound size={17} strokeWidth={1.3} />
              <span className="text-[9px]">Account</span>
            </Link>

            <Link
              href="/cart"
              className="flex flex-col items-center gap-1 transition-colors hover:text-[#A47A40]"
            >
              <ShoppingCart size={17} strokeWidth={1.3} />
              <span className="text-[9px]">Cart</span>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setActiveMenu(null);
            }}
            className="p-2 xl:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        className={`overflow-hidden border-t border-[#D9C9B5]/70 bg-[#F7F0E6] transition-all duration-300 xl:hidden ${
          mobileOpen
            ? "max-h-[85vh] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-6 py-4">
          {navigation.map((item) => {
            const expanded = mobileExpanded === item.name;

            return (
              <div
                key={item.name}
                className="border-b border-[#D9C9B5]/70"
              >
                <div className="flex items-center justify-between py-4">
                  <Link
                    href={item.href}
                    prefetch
                    onClick={closeAll}
                    className="text-[11px] font-medium tracking-[1.4px]"
                  >
                    {item.name}
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileExpanded(expanded ? null : item.name)
                    }
                    aria-label={`Expand ${item.name}`}
                    aria-expanded={expanded}
                    className="p-2 text-[#A47A40]"
                  >
                    <ChevronDown
                      size={17}
                      className={`transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`grid transition-all duration-300 ${
                    expanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mb-4 ml-2 border-l border-[#B28B4E] pl-4">
                      {item.pages.map((page) => (
                        <Link
                          key={page.href}
                          href={page.href}
                          prefetch
                          onClick={closeAll}
                          className="block py-3"
                        >
                          <span className="font-serif text-lg text-[#782C49]">
                            {page.title}
                          </span>
                          <span className="mt-1 block text-[10px] leading-5 text-[#806D5D]">
                            {page.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-8 pt-6 text-xs">
            <Link href="/search" onClick={closeAll}>Search</Link>
            <Link href="/account" onClick={closeAll}>Account</Link>
            <Link href="/cart" onClick={closeAll}>Cart</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
