import Link from "next/link";
import Image from "next/image";

export default function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className="inline-block shrink-0">
      <span className="relative inline-block">
        <Image
          src="/sevoura-logo.png"
          alt="SEVOURA"
          width={2172}
          height={724}
          priority={!footer}
          sizes={footer ? "175px" : "(max-width: 768px) 145px, 170px"}
          className={`h-auto object-contain ${
            footer ? "w-[175px]" : "w-[145px] md:w-[170px]"
          }`}
        />
        <span
          className={`absolute right-[-3px] top-[58%] font-semibold ${
            footer
              ? "text-[11px] text-[#E9D1A7]"
              : "text-[11px] text-[#B28B4E]"
          }`}
        >
          ™
        </span>
      </span>
    </Link>
  );
}
