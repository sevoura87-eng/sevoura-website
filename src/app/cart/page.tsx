"use client";

import Link from "next/link";
import Image from "@/components/shop/ProductImage";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2, Truck, ShoppingBag } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useCart, MAX_QTY } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import StoreClosed from "@/components/shop/StoreClosed";

export default function CartPage() {
  const { lines, subtotal, count, setQuantity, remove, productsLoading, featured, add } = useCart();

  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] overflow-x-clip bg-[#F8F1E7] px-5 py-16 text-[#481D30] md:px-10 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[9px] tracking-[0.34em] text-[#A77B4D]">YOUR BAG</p>
            <h1 className="mt-4 font-serif text-5xl md:text-6xl">
              Shopping <span className="italic text-[#792D49]">bag.</span>
            </h1>
            <p className="mt-3 text-sm text-[#806D60]">{count} {count === 1 ? "item" : "items"}</p>
          </motion.div>

          {!isSupabaseConfigured ? (
            <div className="mt-12"><StoreClosed /></div>
          ) : productsLoading ? (
            <div className="mt-12 h-48 animate-pulse bg-[#EFE3D3]" />
          ) : lines.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-14 border border-[#DCCAB5] bg-[#FCF7EF] px-6 py-20 text-center">
              <ShoppingBag size={36} strokeWidth={1.1} className="mx-auto text-[#A77B4D]" />
              <p className="mt-6 font-serif text-3xl">Your bag is waiting.</p>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#806D60]">Seven fragrances, one connected story — begin with the complete collection.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {featured && (
                  <button onClick={() => add(featured.id)} className="sev-shine inline-flex items-center gap-4 bg-[#792D49] px-8 py-4 text-[10px] tracking-[0.2em] text-white transition hover:bg-[#501D32]">
                    ADD THE COLLECTION · {formatINR(featured.price_paise)}
                  </button>
                )}
                <Link href="/shop" className="inline-flex items-center gap-4 border border-[#792D49]/50 px-8 py-4 text-[10px] tracking-[0.2em] transition hover:bg-[#792D49] hover:text-white">
                  VISIT THE SHOP
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
              <ul className="border-t border-[#DCCAB5]">
                <AnimatePresence initial={false}>
                  {lines.map((line, i) => (
                    <motion.li
                      key={line.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
                      exit={{ opacity: 0, x: -40 }}
                      className="grid grid-cols-[96px_1fr] gap-5 border-b border-[#DCCAB5] py-6 sm:grid-cols-[130px_1fr_auto]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#EFE3D3]">
                        {line.product.image_url && <Image src={line.product.image_url} alt={line.product.name} fill sizes="130px" className="object-cover transition duration-700 hover:scale-105" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-2xl leading-tight">{line.product.name}</p>
                        {line.product.subtitle && <p className="mt-1 text-xs text-[#806D60]">{line.product.subtitle}</p>}
                        <p className="mt-2 text-sm text-[#792D49]">
                          {formatINR(line.product.price_paise)}
                          {line.product.mrp_paise && line.product.mrp_paise > line.product.price_paise && (
                            <span className="ml-2 text-xs text-[#9C8B7A] line-through">{formatINR(line.product.mrp_paise)}</span>
                          )}
                        </p>
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center border border-[#D6BE99] bg-[#FCF8F1]">
                            <button aria-label="Decrease quantity" onClick={() => setQuantity(line.productId, line.quantity - 1)} className="flex h-10 w-10 items-center justify-center hover:bg-[#EFE1D0]">
                              <Minus size={14} />
                            </button>
                            <motion.span key={line.quantity} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-9 text-center text-sm tabular-nums">
                              {line.quantity}
                            </motion.span>
                            <button
                              aria-label="Increase quantity"
                              disabled={line.quantity >= Math.min(MAX_QTY, line.product.stock)}
                              onClick={() => setQuantity(line.productId, line.quantity + 1)}
                              className="flex h-10 w-10 items-center justify-center hover:bg-[#EFE1D0] disabled:opacity-30"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => remove(line.productId)} className="inline-flex items-center gap-1.5 text-[11px] text-[#9A8777] hover:text-[#792D49]">
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                        {line.quantity >= line.product.stock && (
                          <p className="mt-2 text-[11px] text-[#A23B52]">Only {line.product.stock} available.</p>
                        )}
                      </div>
                      <p className="col-span-2 text-right font-serif text-2xl tabular-nums sm:col-span-1">{formatINR(line.lineTotal)}</p>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="h-fit border border-[#DCCAB5] bg-[#FCF7EF] p-7 lg:sticky lg:top-28">
                <p className="text-[9px] tracking-[0.3em] text-[#A77B4D]">ORDER SUMMARY</p>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-[#806D60]">Subtotal</dt><dd className="tabular-nums">{formatINR(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-[#806D60]">Shipping</dt><dd className="text-[#3E5B2E]">Free</dd></div>
                </dl>
                <div className="mt-5 flex items-end justify-between border-t border-[#DCCAB5] pt-5">
                  <span className="text-sm">Total</span>
                  <span className="font-serif text-4xl tabular-nums text-[#792D49]">{formatINR(subtotal)}</span>
                </div>
                <Link href="/checkout" className="sev-shine group mt-7 flex w-full items-center justify-center gap-4 bg-[#792D49] px-6 py-4 text-[10px] tracking-[0.22em] text-white transition hover:bg-[#501D32]">
                  PROCEED TO CHECKOUT <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="mt-6 space-y-3 text-[11px] text-[#806D60]">
                  <p className="flex items-center gap-2"><Truck size={14} className="text-[#A77B4D]" /> Free shipping across India</p>
                  <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#A77B4D]" /> Prices are verified securely at checkout</p>
                </div>
              </motion.aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
