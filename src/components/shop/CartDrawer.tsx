"use client";

import Link from "next/link";
import Image from "@/components/shop/ProductImage";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";
import { useCart, MAX_QTY } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import StoreClosed from "./StoreClosed";

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, subtotal, count, setQuantity, remove, productsLoading, featured, add } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div className="fixed inset-0 z-[400]" initial="closed" animate="open" exit="closed">
          <motion.button
            aria-label="Close bag"
            onClick={closeDrawer}
            className="absolute inset-0 cursor-default bg-[#2A0F1C]/45 backdrop-blur-[3px]"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.35 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            data-lenis-prevent
            variants={{ open: { x: 0 }, closed: { x: "100%" } }}
            transition={{ type: "tween", duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-[#F8F1E7] text-[#481D30] shadow-[-30px_0_80px_rgba(40,15,25,.25)]"
          >
            <div className="flex items-center justify-between border-b border-[#DCCAB5] px-6 py-5">
              <div>
                <p className="text-[11px] tracking-[0.3em] text-[#A77B4D]">YOUR BAG</p>
                <p className="mt-1 font-serif text-2xl">
                  {count} {count === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D6BE99] transition hover:rotate-90 hover:bg-[#792D49] hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {!isSupabaseConfigured ? (
                <div className="flex h-full items-center justify-center"><StoreClosed compact /></div>
              ) : productsLoading ? (
                <div className="space-y-4">
                  {[0, 1].map((i) => (
                    <div key={i} className="h-24 animate-pulse bg-[#EFE3D3]" />
                  ))}
                </div>
              ) : lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C49A59]"
                  >
                    <ShoppingBag size={28} strokeWidth={1.2} className="text-[#A77B4D]" />
                  </motion.div>
                  <p className="mt-6 font-serif text-2xl">Your bag is empty.</p>
                  <p className="mt-2 max-w-[260px] text-[13px] leading-6 text-[#806D60]">
                    Begin your seven-day ritual with the complete SEVOURA collection.
                  </p>
                  {featured && (
                    <button
                      onClick={() => add(featured.id)}
                      className="mt-7 inline-flex items-center gap-3 bg-[#792D49] px-6 py-4 text-[12px] tracking-[0.2em] text-white transition hover:bg-[#501D32]"
                    >
                      ADD THE COLLECTION · {formatINR(featured.price_paise)}
                    </button>
                  )}
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.productId}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-4 border border-[#E1D2BE] bg-[#FCF7EF] p-3"
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-[#EFE3D3]">
                          {line.product.image_url && (
                            <Image src={line.product.image_url} alt={line.product.name} fill sizes="96px" className="object-cover" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="font-serif text-[17px] leading-tight">{line.product.name}</p>
                          {line.product.subtitle && <p className="mt-1 text-[12px] text-[#806D60]">{line.product.subtitle}</p>}
                          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                            <div className="flex items-center border border-[#D6BE99]">
                              <button
                                aria-label="Decrease quantity"
                                onClick={() => setQuantity(line.productId, line.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center transition hover:bg-[#EFE1D0]"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-7 text-center text-[13px] tabular-nums">{line.quantity}</span>
                              <button
                                aria-label="Increase quantity"
                                disabled={line.quantity >= Math.min(MAX_QTY, line.product.stock)}
                                onClick={() => setQuantity(line.productId, line.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center transition hover:bg-[#EFE1D0] disabled:opacity-30"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <p className="font-serif text-lg tabular-nums text-[#792D49]">{formatINR(line.lineTotal)}</p>
                          </div>
                        </div>
                        <button
                          aria-label={`Remove ${line.product.name}`}
                          onClick={() => remove(line.productId)}
                          className="self-start p-1 text-[#A08A79] transition hover:text-[#792D49]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-[#DCCAB5] bg-[#F3E8DA] px-6 py-5">
                <div className="flex items-center justify-between text-[15px]">
                  <span className="text-[#806D60]">Subtotal</span>
                  <span className="font-serif text-2xl tabular-nums">{formatINR(subtotal)}</span>
                </div>
                <p className="mt-1 text-[12px] tracking-wide text-[#A77B4D]">FREE SHIPPING · FINAL TOTAL CONFIRMED AT CHECKOUT</p>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="group mt-5 flex w-full items-center justify-center gap-4 bg-[#792D49] px-6 py-4 text-[12px] tracking-[0.22em] text-[#FFF6E9] transition hover:bg-[#501D32]"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="mt-3 block text-center text-[12px] tracking-[0.2em] text-[#792D49] underline-offset-4 hover:underline"
                >
                  VIEW FULL BAG
                </Link>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
