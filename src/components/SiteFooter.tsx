import Link from "next/link";
import BrandLogo from "./BrandLogo";
import SocialIcon from "./SocialIcon";
import { SITE, activeSocial } from "@/lib/site";

export default function SiteFooter() {
  const socials = activeSocial();
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

            {socials.length > 0 ? (
              <ul className="flex flex-wrap items-center gap-2.5">
                {socials.map((social) => (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`SEVOURA on ${social.label}`}
                      title={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9D1A7]/50 text-[#F5EBDD] transition duration-300 hover:-translate-y-0.5 hover:border-[#F5EBDD] hover:bg-[#F5EBDD] hover:text-[#792D49]"
                    >
                      <SocialIcon name={social.key} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 border-b border-[#E9D1A7]/60 pb-1 text-[11px] text-[#F5EBDD] hover:text-[#E9D1A7]">
                Write to us · {SITE.email}
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-[#D9B9BD]/40 border-b py-5">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-5">
            <h3 className="text-[10px] font-semibold tracking-[2px] text-[#E9D1A7]">
              CONTACT
            </h3>

            <div className="flex flex-col sm:flex-row flex-wrap gap-x-5 gap-y-3 text-[10px]">
              <a href={`mailto:${SITE.email}`} className="hover:text-[#E9D1A7]">
                {SITE.email}
              </a>
              <a href={SITE.phoneHref} className="hover:text-[#E9D1A7]">
                {SITE.phone}
              </a>
              <span>{SITE.hours}</span>
            </div>

            <p className="text-[9px] text-[#F0DFD7] lg:text-right">
              We aim to respond to all enquiries within 1–2 business days.
            </p>
          </div>
        </div>

        <div className="pt-5">
          <p className="text-[9px] text-[#E8D5D5]">
            © 2026 SEVOURA™. All rights reserved. · Traditional associations are presented for cultural and personal exploration.
          </p>
        </div>
      </div>
    </footer>
  );
}
