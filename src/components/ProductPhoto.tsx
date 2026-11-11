import Image from "next/image";

/**
 * The studio photograph of one SEVOURA blend.
 * Files in /public/images/products are the ORIGINAL product photographs with the bottle cut out
 * and placed on a fragrance-specific studio set (see scripts/product-photos). The bottle itself is untouched.
 * Thursday has no genuine photograph yet, so its set is shown with typography instead of an invented bottle.
 */
export const PRODUCT_PHOTO: Record<string, string | null> = {
  monday: "/images/products/monday.jpg",
  tuesday: "/images/products/tuesday.jpg",
  wednesday: "/images/products/wednesday.jpg",
  thursday: null,
  friday: "/images/products/friday.jpg",
  saturday: "/images/products/saturday.jpg",
  sunday: "/images/products/sunday.jpg",
};

export default function ProductPhoto({
  day,
  fragrance,
  notes,
  sizes = "(max-width:640px) 90vw, 400px",
  className = "",
  imgClassName = "",
  priority = false,
}: {
  day: string;
  fragrance: string;
  notes?: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const key = day.toLowerCase();
  const src = PRODUCT_PHOTO[key];
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} overflow-hidden bg-[#E9DCC7] ${className}`}>
      {src ? (
        <Image src={src} alt={`SEVOURA ${day} blend — ${fragrance}${notes ? `, ${notes}` : ""}`} fill priority={priority} sizes={sizes} className={`object-cover ${imgClassName}`} />
      ) : (
        <>
          <Image src="/images/products/thursday.jpg" alt="" fill sizes={sizes} className={`object-cover ${imgClassName}`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="text-[11px] font-semibold tracking-[0.34em] text-[#8A6A3E]">{day.toUpperCase()}</span>
            <span className="mt-3 font-display text-[clamp(2.6rem,6vw,3.6rem)] font-medium italic leading-none text-[#4A2A1A]">{fragrance}</span>
            {notes && <span className="mt-3 text-[13px] tracking-[0.08em] text-[#6E5340]">{notes}</span>}
            <span className="mt-6 h-px w-12 bg-[#A77B4D]/60" />
          </div>
        </>
      )}
    </div>
  );
}
