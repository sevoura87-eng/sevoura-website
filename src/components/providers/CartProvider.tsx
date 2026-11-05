"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

/**
 * The bag itself (product ids + quantities) lives in the browser so guests can
 * shop before signing in. Prices are ALWAYS read from the database and the
 * final total is recalculated by the place_order() database function.
 */

export const MAX_QTY = 10;
const STORAGE_KEY = "sevoura-cart-v1";

export interface CartEntry {
  productId: string;
  quantity: number;
}

export interface CartLine extends CartEntry {
  product: Product;
  lineTotal: number;
}

interface CartState {
  entries: CartEntry[];
  lines: CartLine[];
  products: Product[];
  productsLoading: boolean;
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  lastAdded: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (productId: string, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  refreshProducts: () => Promise<void>;
  featured: Product | null;
}

const CartContext = createContext<CartState | null>(null);

function readStorage(): CartEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e.productId === "string" && Number.isFinite(e.quantity))
      .map((e) => ({ productId: e.productId, quantity: Math.min(MAX_QTY, Math.max(1, Math.floor(e.quantity))) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from browser storage once
    setEntries(readStorage());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEntries(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* storage unavailable — cart still works for this visit */
    }
  }, [entries, hydrated]);

  const refreshProducts = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setProductsLoading(false);
      return;
    }
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .order("created_at");
    setProducts((data as Product[]) ?? []);
    setProductsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial catalogue fetch
    refreshProducts();
  }, [refreshProducts]);

  const lines = useMemo<CartLine[]>(() => {
    return entries
      .map((e) => {
        const product = products.find((p) => p.id === e.productId);
        if (!product) return null;
        return { ...e, product, lineTotal: product.price_paise * e.quantity };
      })
      .filter((l): l is CartLine => l !== null);
  }, [entries, products]);

  const add = useCallback((productId: string, qty = 1) => {
    setEntries((prev) => {
      const found = prev.find((e) => e.productId === productId);
      if (found) {
        return prev.map((e) =>
          e.productId === productId ? { ...e, quantity: Math.min(MAX_QTY, e.quantity + qty) } : e
        );
      }
      return [...prev, { productId, quantity: Math.min(MAX_QTY, Math.max(1, qty)) }];
    });
    setLastAdded(Date.now());
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    setEntries((prev) =>
      qty <= 0
        ? prev.filter((e) => e.productId !== productId)
        : prev.map((e) => (e.productId === productId ? { ...e, quantity: Math.min(MAX_QTY, Math.floor(qty)) } : e))
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setEntries((prev) => prev.filter((e) => e.productId !== productId));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartState>(() => {
    // Only count lines that resolve to a live product (stale ids are ignored)
    const valid = productsLoading ? entries : lines;
    return {
      entries,
      lines,
      products,
      productsLoading,
      count: valid.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      drawerOpen,
      lastAdded,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      add,
      setQuantity,
      remove,
      clear,
      refreshProducts,
      featured: products[0] ?? null,
    };
  }, [entries, lines, products, productsLoading, drawerOpen, lastAdded, add, setQuantity, remove, clear, refreshProducts]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
