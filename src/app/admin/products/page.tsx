"use client";

import Image from "@/components/shop/ProductImage";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Upload, X, Eye, EyeOff } from "lucide-react";
import { Card, PageTitle, ErrorBox, Skeleton, Empty } from "@/components/admin/ui";
import { useAdminData, unwrap } from "@/components/admin/useAdminData";
import { Field } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import { getSupabase } from "@/lib/supabase/client";
import { useCart } from "@/components/providers/CartProvider";
import { formatINR } from "@/lib/format";
import { friendlyError } from "@/lib/errors";
import type { Product } from "@/lib/types";

interface FormState {
  name: string; slug: string; subtitle: string; description: string;
  price: string; mrp: string; stock: string; sort_order: string; image_url: string; is_active: boolean;
}

const blank: FormState = { name: "", slug: "", subtitle: "", description: "", price: "", mrp: "", stock: "0", sort_order: "0", image_url: "", is_active: true };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export default function AdminProducts() {
  const { refreshProducts } = useCart();
  const { data, error, loading, reload } = useAdminData(async (sb) =>
    unwrap(await sb.from("products").select("*").order("sort_order").order("created_at")) as Product[]
  );
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [form, setForm] = useState<FormState>(blank);
  const [errs, setErrs] = useState<Partial<Record<keyof FormState, string>>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function open(p: Product | "new") {
    setEditing(p);
    setErrs({});
    setMsg(null);
    setForm(
      p === "new"
        ? blank
        : {
            name: p.name, slug: p.slug, subtitle: p.subtitle ?? "", description: p.description ?? "",
            price: String(p.price_paise / 100), mrp: p.mrp_paise ? String(p.mrp_paise / 100) : "",
            stock: String(p.stock), sort_order: String(p.sort_order), image_url: p.image_url ?? "", is_active: p.is_active,
          }
    );
  }
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value, ...(k === "name" && editing === "new" ? { slug: slugify(e.target.value) } : {}) }));

  async function upload(file: File) {
    if (file.size > 5 * 1024 * 1024) return setMsg("Image must be under 5 MB.");
    setUploading(true);
    const sb = getSupabase()!;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slugify(form.slug || form.name || "product")}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("product-images").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    setUploading(false);
    if (error) return setMsg(friendlyError(error));
    const { data } = sb.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const er: Partial<Record<keyof FormState, string>> = {};
    const price = Math.round(Number(form.price) * 100);
    const mrp = form.mrp ? Math.round(Number(form.mrp) * 100) : null;
    const stock = Number(form.stock);
    if (form.name.trim().length < 2) er.name = "Name is required.";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) er.slug = "Lowercase letters, numbers and dashes only.";
    if (!Number.isFinite(price) || price < 0 || form.price === "") er.price = "Enter a valid price.";
    if (mrp !== null && (!Number.isFinite(mrp) || mrp < price)) er.mrp = "MRP must be ≥ price.";
    if (!Number.isInteger(stock) || stock < 0) er.stock = "Whole number, 0 or more.";
    setErrs(er);
    if (Object.keys(er).length) return;

    const row = {
      name: form.name.trim(), slug: form.slug, subtitle: form.subtitle.trim() || null, description: form.description.trim() || null,
      price_paise: price, mrp_paise: mrp, stock, sort_order: Number(form.sort_order) || 0, image_url: form.image_url.trim() || null, is_active: form.is_active,
    };
    setBusy(true);
    const sb = getSupabase()!;
    const res = editing === "new" ? await sb.from("products").insert(row) : await sb.from("products").update(row).eq("id", (editing as Product).id);
    setBusy(false);
    if (res.error) return setMsg(friendlyError(res.error.code === "23505" ? "That slug is already used by another product." : res.error));
    setEditing(null);
    reload();
    refreshProducts();
  }

  async function remove(p: Product) {
    if (!window.confirm(`Delete “${p.name}”? Past orders keep their details. Consider hiding it instead.`)) return;
    const { error } = await getSupabase()!.from("products").delete().eq("id", p.id);
    if (error) return window.alert(friendlyError(error));
    reload();
    refreshProducts();
  }

  async function toggle(p: Product) {
    await getSupabase()!.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    reload();
    refreshProducts();
  }

  return (
    <>
      <PageTitle
        title="Products"
        sub="Prices here are the single source of truth — checkout always charges the database price."
        action={<button onClick={() => open("new")} className="inline-flex items-center gap-2 bg-[#792D49] px-4 py-2.5 text-[13px] text-white"><Plus size={14} /> Add product</button>}
      />
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : (data ?? []).length === 0 ? <Card><Empty>No products yet.</Empty></Card> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data!.map((p) => (
            <Card key={p.id} className={`overflow-hidden ${p.is_active ? "" : "opacity-60"}`}>
              <div className="relative aspect-[4/3] bg-[#EFE3D3]">
                {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="400px" className="object-cover" />}
                <span className={`absolute left-3 top-3 px-2 py-1 text-[11px] tracking-wider ${p.is_active ? "bg-[#3E5B2E] text-white" : "bg-[#806D60] text-white"}`}>{p.is_active ? "LIVE" : "HIDDEN"}</span>
                {p.stock <= 5 && <span className="absolute right-3 top-3 bg-[#8A2E2E] px-2 py-1 text-[11px] tracking-wider text-white">{p.stock === 0 ? "OUT OF STOCK" : "LOW STOCK"}</span>}
              </div>
              <div className="p-4">
                <p className="font-serif text-xl leading-tight">{p.name}</p>
                <p className="mt-1 text-[13px] text-[#9A8777]">/{p.slug}</p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="font-serif text-2xl text-[#792D49]">{formatINR(p.price_paise)} {p.mrp_paise && <span className="text-[15px] text-[#9A8777] line-through">{formatINR(p.mrp_paise)}</span>}</p>
                  <p className="text-[14px]">Stock: <strong>{p.stock}</strong></p>
                </div>
                <div className="mt-4 flex gap-2 border-t border-[#EEE5D9] pt-3 text-[13px]">
                  <button onClick={() => open(p)} className="inline-flex items-center gap-1 text-[#792D49] hover:underline"><Pencil size={12} /> Edit</button>
                  <button onClick={() => toggle(p)} className="inline-flex items-center gap-1 text-[#806D60] hover:underline">{p.is_active ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Publish</>}</button>
                  <button onClick={() => remove(p)} className="ml-auto inline-flex items-center gap-1 text-[#8A2E2E] hover:underline"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close" onClick={() => setEditing(null)} className="absolute inset-0 bg-black/40" />
            <motion.form
              onSubmit={save}
              noValidate
              data-lenis-prevent
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-[#F8F1E7] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-serif text-3xl">{editing === "new" ? "New product" : "Edit product"}</p>
                <button type="button" onClick={() => setEditing(null)} className="p-2"><X size={18} /></button>
              </div>
              {msg && <div className="mb-4"><Notice tone="error">{msg}</Notice></div>}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Product name" value={form.name} onChange={set("name")} error={errs.name} className="sm:col-span-2" />
                <Field label="URL slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} error={errs.slug} />
                <Field label="Subtitle" value={form.subtitle} onChange={set("subtitle")} />
                <Field label="Price (₹)" inputMode="decimal" value={form.price} onChange={set("price")} error={errs.price} />
                <Field label="MRP / strike price (₹, optional)" inputMode="decimal" value={form.mrp} onChange={set("mrp")} error={errs.mrp} />
                <Field label="Stock" inputMode="numeric" value={form.stock} onChange={set("stock")} error={errs.stock} />
                <Field label="Sort order" inputMode="numeric" value={form.sort_order} onChange={set("sort_order")} hint="Lower shows first. The first live product is the featured collection." />
                <div className="sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] text-[#A77B4D]">Description</label>
                  <textarea value={form.description} onChange={set("description")} rows={3} className="mt-1 w-full border border-[#DCCAB5] bg-[#FCF8F1] px-4 py-3 text-[15px] outline-none focus:border-[#B28B4E]" />
                </div>
                <div className="flex gap-4 sm:col-span-2">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-[#DCCAB5] bg-[#EFE3D3]">
                    {form.image_url && <Image src={form.image_url} alt="" fill sizes="112px" className="object-cover" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Field label="Image URL" value={form.image_url} onChange={set("image_url")} />
                    <label className="inline-flex cursor-pointer items-center gap-2 border border-[#D6C4AD] bg-white px-3 py-2 text-[13px] hover:border-[#792D49]">
                      <Upload size={13} /> {uploading ? "Uploading…" : "Upload image"}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                    </label>
                  </div>
                </div>
                <label className="flex items-center gap-3 text-[15px] sm:col-span-2">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4 accent-[#792D49]" />
                  Visible in the store
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <Button type="submit" loading={busy}>SAVE PRODUCT</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>CANCEL</Button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
