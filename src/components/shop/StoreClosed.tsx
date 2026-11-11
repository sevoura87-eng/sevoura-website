import Link from "next/link";
import { Sparkles } from "lucide-react";

/** Shown in place of bag / checkout / accounts until the store backend is connected. */
export default function StoreClosed({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`text-center ${compact ? "" : "border border-[#DCCAB5] bg-[#FCF7EF] px-6 py-16"}`}>
      <Sparkles size={28} strokeWidth={1.2} className="mx-auto text-[#A77B4D]" />
      <p className="mt-5 font-serif text-3xl text-[#481D30]">Online ordering opens soon.</p>
      <p className="mx-auto mt-3 max-w-sm text-[15px] leading-7 text-[#806D60]">
        We&apos;re putting the finishing touches on our online store. To order the SEVOURA collection today, reach out to us directly.
      </p>
      <div className="mt-7 flex flex-col items-center gap-3 text-[15px]">
        <a href="mailto:hello@sevoura.com" className="text-[#792D49] underline underline-offset-4">hello@sevoura.com</a>
        <a href="tel:+919211877712" className="text-[#792D49] underline underline-offset-4">+91-9211877712</a>
        <Link href="/contact" className="mt-3 inline-flex items-center gap-3 bg-[#792D49] px-7 py-4 text-[12px] tracking-[0.2em] text-white transition hover:bg-[#501D32]">
          CONTACT US
        </Link>
      </div>
    </div>
  );
}
