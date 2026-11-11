"use client";

import Link from "next/link";
import Image from "@/components/shop/ProductImage";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, MapPin, CreditCard, Check, ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RequireAuth from "@/components/account/RequireAuth";
import { Field, SelectField } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { getSupabase } from "@/lib/supabase/client";
import { formatINR } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import { INDIAN_STATES, emptyAddress, normalizePhone, validateAddress, type AddressInput } from "@/lib/validation";
import type { Address } from "@/lib/types";
import { getPaymentStatus, payForOrder } from "@/lib/payments/checkout";

const ease = [0.22, 1, 0.36, 1] as const;

function Step({ title, icon: Icon, children }: { title: string; icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease }}
      className="border border-[#DCCAB5] bg-[#FCF7EF] p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C49A59] text-[#A77B4D]"><Icon size={16} strokeWidth={1.4} /></span>
        <h2 className="font-serif text-2xl sm:text-3xl">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { lines, subtotal, productsLoading, clear, refreshProducts } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | "new">("new");
  const [addr, setAddr] = useState<AddressInput>(emptyAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressInput, string>>>({});
  const [save, setSave] = useState(true);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [payments, setPayments] = useState<{ enabled: boolean; mode: "test" | "live" | null } | null>(null);
  const [stage, setStage] = useState<"idle" | "saving" | "paying" | "verifying">("idle");

  useEffect(() => {
    getPaymentStatus().then(setPayments);
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !user) return;
    sb.from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const list = (data as Address[]) ?? [];
        setAddresses(list);
        if (list.length) setSelected(list[0].id);
      });
  }, [user]);

  // Pre-fill a new address with what we know
  useEffect(() => {
    if (!profile) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill from profile
    setAddr((a) => ({
      ...a,
      full_name: a.full_name || profile.full_name || "",
      phone: a.phone || profile.phone || "",
    }));
  }, [profile]);

  const chosen = useMemo(() => addresses.find((a) => a.id === selected), [addresses, selected]);
  const set = (k: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddr((a) => ({ ...a, [k]: k === "pincode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!lines.length) return setError("Your bag is empty.");

    let payload: AddressInput;
    if (selected !== "new" && chosen) {
      payload = { ...chosen, landmark: chosen.landmark ?? "" };
    } else {
      const errs = validateAddress(addr);
      setErrors(errs);
      if (Object.keys(errs).length) {
        setError("Please check the highlighted delivery details.");
        document.getElementById("delivery")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      payload = { ...addr, phone: normalizePhone(addr.phone)! };
    }

    const sb = getSupabase();
    if (!sb) return setError("The store is not connected yet.");
    // Online payment only — never create an order that cannot be paid immediately.
    if (!payments?.enabled) return setError("Online payment is temporarily unavailable, so orders can't be placed right now. Please try again shortly.");
    setBusy(true);
    setPlacing(true);
    setStage("saving");
    const { data, error } = await sb.rpc("place_order", {
      p_items: lines.map((l) => ({ product_id: l.productId, quantity: l.quantity })),
      p_address: payload,
      p_save_address: selected === "new" ? save : false,
      p_notes: notes || null,
    });
    if (error) {
      setBusy(false);
      setPlacing(false);
      setStage("idle");
      setError(friendlyError(error));
      refreshProducts();
      return;
    }
    const result = data as { order_id: string };
    // The order now exists (status Unpaid). Clearing the bag prevents a second order on retry —
    // a failed or abandoned payment is retried from the order page against the SAME order.
    clear();
    refreshProducts();
    if (!payments?.enabled) {
      // Online payment only: should not happen (the button is disabled), but never treat this as placed.
      router.replace(`/account/orders/${result.order_id}?payment=error`);
      return;
    }
    setStage("paying");
    const outcome = await payForOrder(result.order_id);
    setStage("verifying");
    const q =
      outcome.status === "paid" ? "paid=1" :
      outcome.status === "authorized" ? "payment=processing" :
      outcome.status === "failed" ? "payment=failed" :
      outcome.status === "dismissed" ? "payment=cancelled" : "payment=error";
    router.replace(`/account/orders/${result.order_id}?${q}`);
  }

  if (productsLoading) return <div className="mx-auto mt-20 h-64 max-w-5xl animate-pulse bg-[#EFE3D3]" />;

  if (!lines.length && !placing) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <p className="font-serif text-3xl">Your bag is empty.</p>
        <Link href="/shop" className="mt-6 inline-block text-[13px] tracking-[0.2em] text-[#792D49] underline underline-offset-4">
          RETURN TO THE SHOP
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={placeOrder} noValidate className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
      <div className="space-y-6">
        <Step title="Contact" icon={Check}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-[#E3D5C3] bg-[#F8F1E7] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#A77B4D]">Signed in as</p>
              <p className="mt-1 truncate text-[15px]">{profile?.full_name || "—"}</p>
            </div>
            <div className="border border-[#E3D5C3] bg-[#F8F1E7] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#A77B4D]">Email</p>
              <p className="mt-1 truncate text-[15px]">{user?.email}</p>
            </div>
          </div>
        </Step>

        <div id="delivery" className="scroll-mt-28">
          <Step title="Delivery address" icon={MapPin}>
            {addresses.length > 0 && (
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => setSelected(a.id)}
                    className={`relative border p-4 text-left text-[14px] leading-5 transition-all duration-300 ${
                      selected === a.id ? "border-[#792D49] bg-white shadow-[0_10px_30px_rgba(121,45,73,.12)]" : "border-[#DCCAB5] hover:border-[#B28B4E]"
                    }`}
                  >
                    {selected === a.id && (
                      <motion.span layoutId="addr-check" className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#792D49] text-white">
                        <Check size={11} />
                      </motion.span>
                    )}
                    <p className="font-medium text-[#481D30]">{a.full_name}</p>
                    <p className="text-[#806D60]">{a.house_number}, {a.street_locality}</p>
                    <p className="text-[#806D60]">{a.city}, {a.state} — {a.pincode}</p>
                    {a.landmark && <p className="text-[#9A8777]">Near {a.landmark}</p>}
                    <p className="mt-1 text-[#806D60]">+91 {a.phone}</p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelected("new")}
                  className={`border border-dashed p-4 text-[14px] transition ${selected === "new" ? "border-[#792D49] bg-white text-[#792D49]" : "border-[#C9B496] text-[#806D60] hover:border-[#792D49]"}`}
                >
                  + Deliver to a new address
                </button>
              </div>
            )}

            {selected === "new" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" autoComplete="name" value={addr.full_name} onChange={set("full_name")} error={errors.full_name} />
                <Field label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" value={addr.phone} onChange={set("phone")} error={errors.phone} />
                <Field label="House / flat no., building" autoComplete="address-line1" value={addr.house_number} onChange={set("house_number")} error={errors.house_number} />
                <Field label="Street & locality" autoComplete="address-line2" value={addr.street_locality} onChange={set("street_locality")} error={errors.street_locality} />
                <Field label="City" autoComplete="address-level2" value={addr.city} onChange={set("city")} error={errors.city} />
                <SelectField label="State" options={INDIAN_STATES} value={addr.state} onChange={set("state")} error={errors.state} />
                <Field label="Pincode" inputMode="numeric" autoComplete="postal-code" value={addr.pincode} onChange={set("pincode")} error={errors.pincode} />
                <Field label="Landmark (optional)" value={addr.landmark} onChange={set("landmark")} error={errors.landmark} />
                <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[#6B5650] sm:col-span-2">
                  <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="h-4 w-4 accent-[#792D49]" />
                  Save this address for next time
                </label>
              </motion.div>
            )}

            <div className="mt-5">
              <label className="text-[11px] uppercase tracking-[0.2em] text-[#A77B4D]" htmlFor="notes">Order note (optional)</label>
              <textarea
                id="notes"
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Gift message or delivery instructions"
                className="mt-2 w-full border border-[#DCCAB5] bg-[#FCF8F1] px-4 py-3 text-[15px] outline-none transition focus:border-[#B28B4E] focus:bg-white"
              />
            </div>
          </Step>
        </div>

        <Step title="Payment" icon={CreditCard}>
          {payments === null ? (
            <div className="h-14 animate-pulse bg-[#EFE3D3]" />
          ) : payments.enabled ? (
            <div className="space-y-3">
              <Notice>
                Pay securely online with UPI, debit or credit cards, net banking or wallets. The secure payment
                window opens after you click <em>Place order &amp; pay</em>. SEVOURA accepts prepaid orders only —
                Cash on Delivery is not available.
              </Notice>
              {payments.mode === "test" && (
                <Notice tone="error">
                  <strong>Test mode:</strong> payments are simulated and no real money is charged.
                </Notice>
              )}
            </div>
          ) : (
            <Notice tone="error">
              <strong>Online payment is temporarily unavailable.</strong> SEVOURA accepts prepaid orders only, so
              orders can&apos;t be placed right now. Please try again in a little while.
            </Notice>
          )}
        </Step>
      </div>

      {/* SUMMARY */}
      <motion.aside
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease }}
        className="h-fit border border-[#DCCAB5] bg-[#F3E8DA] p-6 sm:p-8 lg:sticky lg:top-28"
      >
        <p className="text-[11px] tracking-[0.3em] text-[#A77B4D]">ORDER SUMMARY</p>
        <ul className="mt-5 space-y-4">
          {lines.map((l) => (
            <li key={l.productId} className="flex gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#EFE3D3]">
                {l.product.image_url && <Image src={l.product.image_url} alt="" fill sizes="64px" className="object-cover" />}
                <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center bg-[#792D49] px-1 text-[12px] text-white">{l.quantity}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[16px] leading-tight">{l.product.name}</p>
                <p className="text-[13px] text-[#806D60]">{formatINR(l.product.price_paise)} × {l.quantity}</p>
              </div>
              <p className="text-[15px] tabular-nums">{formatINR(l.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-[#DCCAB5] pt-5 text-[15px]">
          <div className="flex justify-between"><dt className="text-[#806D60]">Subtotal</dt><dd className="tabular-nums">{formatINR(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-[#806D60]">Shipping</dt><dd className="text-[#3E5B2E]">Free</dd></div>
        </dl>
        <div className="mt-4 flex items-end justify-between border-t border-[#DCCAB5] pt-4">
          <span>Total</span>
          <span className="font-serif text-4xl tabular-nums text-[#792D49]">{formatINR(subtotal)}</span>
        </div>
        {error && <div className="mt-5"><Notice tone="error">{error}</Notice></div>}
        <Button type="submit" loading={busy} disabled={!payments?.enabled} className="mt-6 w-full py-5">
          <Lock size={14} />{" "}
          {stage === "saving" ? "SAVING ORDER…" : stage === "paying" ? "COMPLETE PAYMENT IN THE WINDOW…" : stage === "verifying" ? "CONFIRMING…" : payments?.enabled ? `PLACE ORDER & PAY ${formatINR(subtotal)}` : payments === null ? "LOADING…" : "ONLINE PAYMENT UNAVAILABLE"}
        </Button>
        <p className="mt-4 text-center text-[12px] leading-5 text-[#9A8777]">
          The final amount is calculated securely on our server. By placing the order you agree to our{" "}
          <Link href="/terms" className="underline">Terms</Link> and{" "}
          <Link href="/shipping-returns" className="underline">Shipping &amp; Returns</Link>.
        </p>
      </motion.aside>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[70vh] overflow-x-clip bg-[#F8F1E7] px-5 py-14 text-[#481D30] md:px-10 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <Link href="/cart" className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] text-[#806D60] hover:text-[#792D49]">
            <ArrowLeft size={13} /> BACK TO BAG
          </Link>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="mb-10 mt-5 font-serif text-5xl md:text-6xl">
            Secure <span className="italic text-[#792D49]">checkout.</span>
          </motion.h1>
          <RequireAuth>
            <CheckoutInner />
          </RequireAuth>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
