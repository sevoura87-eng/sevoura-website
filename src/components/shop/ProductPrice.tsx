"use client";

import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/format";

/**
 * Live price from the database (falls back to the printed price while loading),
 * so admin price changes show up on the storefront automatically.
 */
export function LivePrice({ fallback, kind = "price" }: { fallback: string; kind?: "price" | "mrp" | "saving" }) {
  const { featured } = useCart();
  if (!featured) return <>{fallback}</>;
  if (kind === "mrp") return <>{featured.mrp_paise ? formatINR(featured.mrp_paise) : fallback}</>;
  if (kind === "saving") {
    if (!featured.mrp_paise || featured.mrp_paise <= featured.price_paise) return <>{fallback}</>;
    return <>{formatINR(featured.mrp_paise - featured.price_paise)}</>;
  }
  return <>{formatINR(featured.price_paise)}</>;
}
