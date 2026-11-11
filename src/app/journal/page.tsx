"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUp, BookOpen, PenLine, Search, Sparkles, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { JournalMasthead, QuestionCard, SignInNudge, ease } from "@/components/journal/ui";
import { community, SORTS, type Category, type Kind, type QuestionCard as Q, type Sort, type Stats, type TopAnswer } from "@/lib/community";
import { friendlyError } from "@/lib/errors";

const PAGE = 12;

function Feed() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sort = (SORTS.some((s) => s.key === params.get("sort")) ? params.get("sort") : "latest") as Sort;
  const category = params.get("category");
  const tag = params.get("tag");
  const kind = (params.get("kind") === "question" || params.get("kind") === "experience" ? params.get("kind") : null) as Kind | null;
  const q = params.get("q") ?? "";

  const [items, setItems] = useState<Q[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState(q);
  const [cats, setCats] = useState<Category[]>([]);
  const [top, setTop] = useState<TopAnswer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [nudge, setNudge] = useState(false);

  const setParam = useCallback(
    (next: Record<string, string | null>) => {
      const sp = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(next)) {
        if (v) sp.set(k, v);
        else sp.delete(k);
      }
      const qs = sp.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  useEffect(() => {
    let live = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset while the new query loads
    setItems(null);
    setError(null);
    community
      .feed({ sort, category, tag, kind, search: q, limit: PAGE })
      .then((r) => {
        if (!live) return;
        setItems(r.items);
        setTotal(r.total);
      })
      .catch((e) => live && setError(friendlyError(e)));
    return () => {
      live = false;
    };
  }, [sort, category, tag, kind, q]);

  useEffect(() => {
    community.categories().then(setCats).catch(() => {});
    community.topAnswers(4).then(setTop).catch(() => {});
    community.stats().then(setStats).catch(() => {});
  }, []);

  async function more() {
    if (!items) return;
    setLoadingMore(true);
    try {
      const r = await community.feed({ sort, category, tag, kind, search: q, limit: PAGE, offset: items.length });
      setItems([...items, ...r.items]);
      setTotal(r.total);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoadingMore(false);
    }
  }

  const activeCategory = useMemo(() => cats.find((c) => c.slug === category), [cats, category]);
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setParam({ q: search.trim() || null });
  };

  return (
    <>
      <JournalMasthead
        active="community"
        eyebrow="THE SEVOURA JOURNAL"
        title={
          <>
            Questions, rituals
            <br />
            <span className="italic text-[#E2B45E]">&amp; shared experiences.</span>
          </>
        }
        intro="A considered space for the SEVOURA community — ask about the seven blends, share how a ritual made you feel, and learn from one another."
      >
        <form onSubmit={onSearch} className="mt-10 flex max-w-[640px] lg:mt-[4svh] items-stretch border border-[#D6A64F]/40 bg-[#26000D]/40 backdrop-blur">
          <Search size={18} className="ml-5 mt-[18px] shrink-0 text-[#D6A64F]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions, answers and experiences"
            aria-label="Search the community"
            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-[16px] text-[#F7F0E6] outline-none placeholder:text-[#C9AFA2]/70"
          />
          <button type="submit" className="bg-[#D6A64F] px-6 text-[12px] font-semibold tracking-[0.22em] text-[#26000D] transition-colors hover:bg-[#F0D69A]">
            SEARCH
          </button>
        </form>
        <div className="mt-8 flex flex-wrap gap-4 lg:mt-[3svh]">
          <Link href="/journal/ask" className="inline-flex items-center gap-3 bg-[#F7F0E6] px-7 py-4 text-[12px] font-semibold tracking-[0.22em] text-[#390014] transition-colors hover:bg-[#F0D69A]">
            <PenLine size={16} /> ASK A QUESTION
          </Link>
          <Link href="/journal/ask?kind=experience" className="inline-flex items-center gap-3 border border-[#D6A64F]/50 px-7 py-4 text-[12px] font-semibold tracking-[0.22em] text-[#F0D69A] transition-colors hover:border-[#F0D69A] hover:bg-white/5">
            <Sparkles size={16} /> SHARE AN EXPERIENCE
          </Link>
        </div>
      </JournalMasthead>

      <section className="mx-auto grid max-w-[1320px] gap-14 px-6 py-14 md:px-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
        {/* FEED */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#DCCAB5]">
            <div role="tablist" aria-label="Sort discussions" className="-mb-px flex gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={sort === s.key}
                  onClick={() => setParam({ sort: s.key === "latest" ? null : s.key })}
                  className={`shrink-0 border-b-2 pb-4 text-[13px] font-semibold tracking-[0.18em] transition-colors ${
                    sort === s.key ? "border-[#792D49] text-[#792D49]" : "border-transparent text-[#8A766A] hover:text-[#3A2228]"
                  }`}
                >
                  {s.label.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="mb-3 flex gap-1 text-[13px]">
              {[
                { k: null, l: "All" },
                { k: "question", l: "Questions" },
                { k: "experience", l: "Experiences" },
              ].map((o) => (
                <button
                  key={o.l}
                  type="button"
                  onClick={() => setParam({ kind: o.k })}
                  className={`px-3.5 py-1.5 transition-colors ${kind === o.k ? "bg-[#481D30] text-[#FFF6E9]" : "text-[#6E5A50] hover:text-[#3A2228]"}`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {(activeCategory || tag || q) && (
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[#6E5A50]">
              <span>Showing</span>
              {activeCategory && <Chip label={activeCategory.name} onClear={() => setParam({ category: null })} />}
              {tag && <Chip label={`#${tag}`} onClear={() => setParam({ tag: null })} />}
              {q && (
                <Chip
                  label={`“${q}”`}
                  onClear={() => {
                    setSearch("");
                    setParam({ q: null });
                  }}
                />
              )}
            </div>
          )}

          <div className="mt-4">
            {error && <p className="py-10 text-[15px] text-[#9A2E3E]">{error}</p>}
            {!error && items === null && (
              <div className="space-y-8 py-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="animate-pulse space-y-4 border-b border-[#E2D4C2] pb-8">
                    <div className="h-3 w-40 bg-[#E9DCCB]" />
                    <div className="h-8 w-4/5 bg-[#E9DCCB]" />
                    <div className="h-4 w-full bg-[#F0E5D6]" />
                  </div>
                ))}
              </div>
            )}
            {items && items.length === 0 && <EmptyFeed filtered={!!(category || tag || q || kind || sort === "unanswered")} />}
            {items?.map((it, i) => <QuestionCard key={it.id} q={it} index={i} onNeedLogin={() => setNudge(true)} />)}
            {items && items.length < total && (
              <div className="pt-10 text-center">
                <button
                  type="button"
                  onClick={more}
                  disabled={loadingMore}
                  className="border border-[#481D30] px-9 py-4 text-[12px] font-semibold tracking-[0.22em] text-[#481D30] transition-colors hover:bg-[#481D30] hover:text-[#FFF6E9] disabled:opacity-60"
                >
                  {loadingMore ? "LOADING…" : `SHOW MORE · ${total - items.length} MORE`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-12 lg:sticky lg:top-28 lg:self-start">
          {stats && (
            <div className="grid grid-cols-3 border-y border-[#DCCAB5] py-6 text-center">
              {[
                { n: stats.questions + stats.experiences, l: "Discussions" },
                { n: stats.answers, l: "Answers" },
                { n: stats.members, l: "Members" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[34px] leading-none text-[#481D30]">{s.n}</p>
                  <p className="mt-2 text-[12px] tracking-[0.16em] text-[#8A766A]">{s.l.toUpperCase()}</p>
                </div>
              ))}
            </div>
          )}

          <SideBlock title="Categories">
            <ul className="space-y-1">
              <li>
                <button type="button" onClick={() => setParam({ category: null })} className={`flex w-full items-center justify-between py-2.5 text-left text-[16px] transition-colors ${!category ? "text-[#792D49]" : "text-[#3A2228] hover:text-[#792D49]"}`}>
                  All discussions
                </button>
              </li>
              {cats.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setParam({ category: c.slug === category ? null : c.slug })}
                    className={`flex w-full items-center justify-between gap-4 py-2.5 text-left text-[16px] transition-colors ${c.slug === category ? "text-[#792D49]" : "text-[#3A2228] hover:text-[#792D49]"}`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[13px] tabular-nums text-[#A08A79]">{c.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </SideBlock>

          {top.length > 0 && (
            <SideBlock title="Most helpful answers">
              <ul className="space-y-6">
                {top.map((a) => (
                  <li key={a.id}>
                    <Link href={`/journal/q/${a.question_id}`} className="group block">
                      <p className="font-display text-[20px] leading-snug text-[#2E1A20] transition-colors group-hover:text-[#792D49]">{a.question_title}</p>
                      <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#6E5A50]">{a.excerpt}</p>
                      <p className="mt-2 flex items-center gap-2 text-[12px] text-[#8A766A]">
                        <ArrowUp size={12} /> {a.vote_score} · {a.is_official ? "SEVOURA" : a.author.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </SideBlock>
          )}

          {stats && stats.tags.length > 0 && (
            <SideBlock title="Trending topics">
              <div className="flex flex-wrap gap-2">
                {stats.tags.map((t) => (
                  <button
                    key={t.tag}
                    type="button"
                    onClick={() => setParam({ tag: t.tag === tag ? null : t.tag })}
                    className={`border px-3 py-1.5 text-[13px] transition-colors ${t.tag === tag ? "border-[#792D49] bg-[#792D49] text-white" : "border-[#DCCAB5] text-[#5A3A44] hover:border-[#792D49]"}`}
                  >
                    #{t.tag}
                  </button>
                ))}
              </div>
            </SideBlock>
          )}

          <Link href="/journal/editorial" className="group block bg-[#481D30] p-8 text-[#F7F0E6]">
            <BookOpen size={20} className="text-[#D6A64F]" />
            <p className="mt-5 font-display text-[28px] leading-tight">From the editors</p>
            <p className="mt-3 text-[15px] leading-7 text-[#E2CBB8]">Stories on fragrance, ritual and intention from the SEVOURA team.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.22em] text-[#F0D69A]">
              READ THE EDITORIAL <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </aside>
      </section>
      <SignInNudge open={nudge} onClose={() => setNudge(false)} next="/journal" />
    </>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 border border-[#792D49] px-3 py-1.5 text-[13px] text-[#792D49]">
      {label}
      <button type="button" onClick={onClear} aria-label={`Clear ${label}`} className="hover:text-[#3A2228]">
        <X size={13} />
      </button>
    </span>
  );
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-5 flex items-center gap-3 text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">
        <span className="h-px w-6 bg-[#C9A15C]" /> {title.toUpperCase()}
      </p>
      {children}
    </div>
  );
}

function EmptyFeed({ filtered }: { filtered: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease }} className="py-20 text-center">
      <p className="font-display text-[36px] leading-tight text-[#2E1A20]">{filtered ? "Nothing here yet." : "Be the first to begin the conversation."}</p>
      <p className="mx-auto mt-4 max-w-[440px] text-[16px] leading-7 text-[#6E5A50]">
        {filtered ? "Try another category or search — or ask the question yourself." : "Ask about a blend, a note or a ritual. Our team and community will answer."}
      </p>
      <Link href="/journal/ask" className="mt-8 inline-flex items-center gap-3 bg-[#481D30] px-8 py-4 text-[12px] font-semibold tracking-[0.22em] text-[#FFF6E9] transition-colors hover:bg-[#792D49]">
        <PenLine size={16} /> ASK A QUESTION
      </Link>
    </motion.div>
  );
}

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#F7F0E6] text-[#3A2228]">
      <SiteHeader />
      <Suspense fallback={<div className="h-[60vh] bg-[#2A0010]" />}>
        <Feed />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
