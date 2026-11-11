import Image from "next/image";

/**
 * The studio photograph of one SEVOURA blend.
 * Files in /public/images/products are the ORIGINAL product photographs with the bottle cut out
 * and placed on a fragrance-specific studio set (see scripts/product-photos). The bottle itself is untouched.
 * Thursday's only genuine photograph is the bottle inside the gift-box shot; it is enlarged with plain resampling (no AI).
 */
export const PRODUCT_PHOTO: Record<string, string> = {
  monday: "/images/products/monday.jpg",
  tuesday: "/images/products/tuesday.jpg",
  wednesday: "/images/products/wednesday.jpg",
  thursday: "/images/products/thursday-vanilla.jpg",
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
      <Image src={src} alt={`SEVOURA ${day} blend — ${fragrance}${notes ? `, ${notes}` : ""}`} fill priority={priority} sizes={sizes} className={`object-cover ${imgClassName}`} />
    </div>
  );
}
