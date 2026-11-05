import Link from "next/link";
import BrandLogo from "./BrandLogo";

const socialLinks = [
  { symbol: "◎", label: "Instagram", href: "https://www.instagram.com/" },
  { symbol: "f", label: "Facebook", href: "#" },
  { symbol: "▶", label: "YouTube", href: "#" },
  { symbol: "in", label: "LinkedIn", href: "#" },
  { symbol: "𝕏", label: "X", href: "#" },
  { symbol: "♪", label: "TikTok", href: "#" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#792D49] text-[#F5EBDD] px-6 md:px-12 pt-12 pb-5">
      <div className="max-w-[1350px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-10">
          <div>
            <BrandLogo footer />
            <p className="text-[11px] leading-[21px] max-w-[310px] text-[#F0DFD7] mt-4">
              Seven rituals for self, home and everything you love.
              <br />
              Cleanse. Elevate. Radiate.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold tracking-[2px] mb-6 text-[#E9D1A7]">
              CUSTOMER CARE
            </h3>
            <div className="flex flex-col gap-3 text-[11px]">
              <Link href="/faq" className="hover:text-[#E9D1A7] transition">FAQ</Link>
              <Link href="/shipping-returns" className="hover:text-[#E9D1A7] transition">Shipping & Returns</Link>
              <Link href="/contact" className="hover:text-[#E9D1A7] transition">Contact Us</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold tracking-[2px] mb-6 text-[#E9D1A7]">
              POLICIES
            </h3>
            <div className="flex flex-col gap-3 text-[11px]">
              <Link href="/privacy-policy" className="hover:text-[#E9D1A7] transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#E9D1A7] transition">Terms & Conditions</Link>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold tracking-[2px] mb-6 text-[#E9D1A7]">
              FOLLOW SEVOURA
            </h3>
            <p className="text-[11px] leading-[19px] text-[#F0DFD7] mb-5 max-w-[310px]">
              Join us across our social channels for fragrance, rituals and inspiration.
            </p>

            <div className="flex items-center gap-2 flex-wrap mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={social.label}
                  className="w-[37px] h-[37px] rounded-full border border-[#D7B5B9]/60 flex items-center justify-center text-[15px] hover:bg-[#F5EBDD] hover:text-[#792D49] transition duration-300"
                >
                  {social.symbol}
                </a>
              ))}
            </div>

            <p className="text-[9px] text-[#F0DFD7] leading-5">
              Instagram&nbsp; | &nbsp;Facebook&nbsp; | &nbsp;YouTube&nbsp; | &nbsp;X&nbsp; | &nbsp;LinkedIn&nbsp; | &nbsp;TikTok
            </p>
          </div>
        </div>

        <div className="border-t border-[#D9B9BD]/40 border-b py-5">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-5">
            <h3 className="text-[10px] font-semibold tracking-[2px] text-[#E9D1A7]">
              CONTACT
            </h3>

            <div className="flex flex-col sm:flex-row flex-wrap gap-x-5 gap-y-3 text-[10px]">
              <a href="mailto:hello@sevoura.com" className="hover:text-[#E9D1A7]">
                hello@sevoura.com
              </a>
              <a href="tel:+919211877712" className="hover:text-[#E9D1A7]">
                +91-9211877712
              </a>
              <span>Monday–Sunday · 10:00 AM–6:00 PM IST</span>
            </div>

            <p className="text-[9px] text-[#F0DFD7] lg:text-right">
              We aim to respond to all enquiries within 1–2 business days.
            </p>
          </div>
        </div>

        <div className="pt-5">
          <p className="text-[9px] text-[#E8D5D5]">
            © 2026 SEVOURA™. All rights reserved. - Traditional associations are presented for cultural and personal exploration.
          </p>
        </div>
      </div>
    </footer>
  );
}
