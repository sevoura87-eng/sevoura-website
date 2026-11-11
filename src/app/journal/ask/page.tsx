"use client";

import Link from "next/link";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, HelpCircle, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RequireAuth from "@/components/account/RequireAuth";
import { useAuth } from "@/components/providers/AuthProvider";
import { JournalMasthead, useCommunityMe } from "@/components/journal/ui";
import { community, type Category, type Kind } from "@/lib/community";
import { friendlyError } from "@/lib/errors";

function AskForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("edit");
  const { me } = useCommunityMe();
  const { isAdmin } = useAuth();
  const [kind, setKind] = useState<Kind>(params.get("kind") === "experience" ? "experience" : "question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedEdit, setLoadedEdit] = useState(!editId);

  useEffect(() => {
    community.categories().then(setCats).catch(() => {});
  }, []);

  useEffect(() => {
    if (!editId) return;
    community
      .question(editId)
      .then((q) => {
        if (!q || (!q.is_mine && !isAdmin)) {
          setError("You can only edit your own posts.");
          return;
        }
        setKind(q.kind);
        setTitle(q.title);
        setBody(q.body);
        setCategory(q.category?.slug ?? "");
        setTags(q.tags.join(", "));
      })
      .catch((e) => setError(friendlyError(e)))
      .finally(() => setLoadedEdit(true));
  }, [editId, isAdmin]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 8) return setError("Please write a title of at least 8 characters.");
    if (!category) return setError("Please choose a category.");
    const tagList = tags
      .split(/[,#]/)
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 5);
    setBusy(true);
    try {
      if (editId) {
        await community.updateQuestion(editId, title, body, category, tagList);
        router.push(`/journal/q/${editId}`);
      } else {
        const id = await community.ask(kind, title, body, category, tagList);
        router.push(`/journal/q/${id}?posted=1`);
      }
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  }

  const isExp = kind === "experience";
  return (
    <section className="mx-auto max-w-[880px] px-6 py-14 md:px-12 md:py-20">
      <Link href="/journal" className="inline-flex items-center gap-2 text-[13px] tracking-[0.18em] text-[#8A766A] transition-colors hover:text-[#792D49]">
        <ArrowLeft size={15} /> BACK TO THE COMMUNITY
      </Link>

      {me?.restricted && (
        <p className="mt-8 border border-[#E2B3B3] bg-[#F9E9E9] px-5 py-4 text-[15px] text-[#8A2E2E]">
          Your account can&apos;t post in the community at the moment. Please contact hello@sevoura.com.
        </p>
      )}

      <form onSubmit={submit} className="mt-10 space-y-10">
        {!editId && (
          <fieldset>
            <legend className="text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">WHAT WOULD YOU LIKE TO SHARE?</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { k: "question" as Kind, icon: HelpCircle, t: "Ask a question", d: "Get answers from the community and the SEVOURA team." },
                { k: "experience" as Kind, icon: Sparkles, t: "Share an experience", d: "A review, a ritual, how a blend made you feel." },
              ].map((o) => (
                <button
                  key={o.k}
                  type="button"
                  onClick={() => setKind(o.k)}
                  aria-pressed={kind === o.k}
                  className={`flex items-start gap-4 border p-6 text-left transition-colors duration-300 ${kind === o.k ? "border-[#792D49] bg-white" : "border-[#DCCAB5] hover:border-[#B28B4E]"}`}
                >
                  <o.icon size={22} strokeWidth={1.5} className={kind === o.k ? "text-[#792D49]" : "text-[#A77B4D]"} />
                  <span>
                    <span className="block font-display text-[24px] leading-tight text-[#2E1A20]">{o.t}</span>
                    <span className="mt-1 block text-[14px] leading-6 text-[#6E5A50]">{o.d}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <label className="block">
          <span className="text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">{isExp ? "TITLE" : "YOUR QUESTION"}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            required
            placeholder={isExp ? "e.g. How the Sunday Saffron blend changed my mornings" : "e.g. How long does the Friday Rose blend last on skin?"}
            className="mt-4 w-full border-0 border-b border-[#CDB89F] bg-transparent pb-4 font-display text-[28px] leading-tight text-[#2E1A20] outline-none transition-colors placeholder:text-[#B9A595] focus:border-[#792D49] md:text-[34px]"
          />
          <span className="mt-2 block text-right text-[12px] text-[#A08A79]">{title.length}/200</span>
        </label>

        <label className="block">
          <span className="text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">{isExp ? "YOUR EXPERIENCE" : "DETAILS"} <span className="font-normal tracking-normal text-[#A08A79]">(optional)</span></span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            maxLength={6000}
            placeholder={isExp ? "Tell the community what you noticed — the notes, the moment, the mood." : "Add any context that will help people give a good answer."}
            className="mt-4 w-full border border-[#DCCAB5] bg-[#FCF8F1] px-5 py-4 text-[16px] leading-[1.75] text-[#3A2228] outline-none transition-colors focus:border-[#B28B4E] focus:bg-white"
          />
        </label>

        <div className="grid gap-8 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">CATEGORY</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-4 w-full border border-[#DCCAB5] bg-[#FCF8F1] px-4 py-4 text-[16px] text-[#3A2228] outline-none focus:border-[#B28B4E]"
            >
              <option value="">Choose a category</option>
              {cats.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">TAGS <span className="font-normal tracking-normal text-[#A08A79]">(up to 5)</span></span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="rose, longevity, gifting"
              className="mt-4 w-full border border-[#DCCAB5] bg-[#FCF8F1] px-4 py-4 text-[16px] text-[#3A2228] outline-none focus:border-[#B28B4E]"
            />
          </label>
        </div>

        {error && <p className="border border-[#E2B3B3] bg-[#F9E9E9] px-5 py-4 text-[15px] text-[#8A2E2E]">{error}</p>}

        <div className="flex flex-wrap items-center gap-6 border-t border-[#DCCAB5] pt-8">
          <button
            type="submit"
            disabled={busy || !loadedEdit || (!!me?.restricted && !isAdmin)}
            className="bg-[#481D30] px-10 py-5 text-[12px] font-semibold tracking-[0.24em] text-[#FFF6E9] transition-colors hover:bg-[#792D49] disabled:opacity-50"
          >
            {busy ? "PUBLISHING…" : editId ? "SAVE CHANGES" : isExp ? "SHARE EXPERIENCE" : "POST QUESTION"}
          </button>
          <p className="max-w-[420px] text-[14px] leading-6 text-[#8A766A]">
            Please keep it kind and relevant. Posts are public and shown with your community name{me?.username ? ` (@${me.username})` : ""}.
          </p>
        </div>
      </form>
    </section>
  );
}

export default function AskPage() {
  return (
    <main className="min-h-screen bg-[#F7F0E6] text-[#3A2228]">
      <SiteHeader />
      <JournalMasthead
        active="ask"
        eyebrow="THE SEVOURA JOURNAL"
        title={
          <>
            Begin a <span className="italic text-[#E2B45E]">conversation.</span>
          </>
        }
        intro="Ask about a blend, a note or a ritual — or share your own experience with the community."
      />
      <Suspense fallback={null}>
        <RequireAuth>
          <AskForm />
        </RequireAuth>
      </Suspense>
      <SiteFooter />
    </main>
  );
}
