"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Adds the featured collection (or a given product) to the bag.
 * Keeps whatever classes the original "Shop" link used so the design is unchanged.
 */
export default function AddToCartButton({
  productId,
  className,
  children,
}: {
  productId?: string;
  className: string;
  children: ReactNode;
}) {
  const { add, featured, productsLoading, openDrawer } = useCart();
  const [added, setAdded] = useState(false);
  const id = productId ?? featured?.id;
  const soldOut = !productsLoading && featured && !productId && featured.stock <= 0;

  return (
    <button
      type="button"
      disabled={!!soldOut}
      onClick={() => {
        if (!id) {
          openDrawer();
          return;
        }
        add(id);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={`${className} sev-shine disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className="inline-flex items-center gap-3"
          >
            ADDED TO BAG <Check size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className="inline-flex items-center gap-5"
          >
            {!isSupabaseConfigured ? "ORDER — COMING SOON" : soldOut ? "CURRENTLY SOLD OUT" : children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
