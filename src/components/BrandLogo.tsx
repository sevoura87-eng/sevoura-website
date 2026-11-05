import Link from "next/link";

export default function BrandLogo({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className="inline-block shrink-0">
      <span className="relative inline-block">
        <img
          src="/sevoura-logo.png"
          alt="SEVOURA"
          className={`h-auto object-contain ${
            footer ? "w-[175px]" : "w-[145px] md:w-[170px]"
          }`}
        />
        <span
          className={`absolute right-[-3px] top-[58%] font-semibold ${
            footer
              ? "text-[9px] text-[#E9D1A7]"
              : "text-[9px] text-[#B28B4E]"
          }`}
        >
          ™
        </span>
      </span>
    </Link>
  );
}
