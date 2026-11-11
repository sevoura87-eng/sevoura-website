"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, BadgeCheck, Flag, MessageSquare, Pin, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { community, REPORT_REASONS, type Author, type Me, type QuestionCard as Q } from "@/lib/community";
import { friendlyError } from "@/lib/errors";
import { timeAgo } from "@/lib/format";

export const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- the signed-in member's community identity ---------- */
export function useCommunityMe() {
  const { user, loading } = useAuth();
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  useEffect(() => {
    if (loading) return;
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- signed-out state
      setMe(null);
      return;
    }
    community.me().then(setMe).catch(() => setMe(null));
  }, [user, loading]);
  return { me, setMe, signedIn: !!user, loading: loading || me === undefined };
}

/* ---------- avatar ---------- */
export function Avatar({ author, size = 36 }: { author: Pick<Author, "name" | "avatar_url" | "is_admin">; size?: number }) {
  const initials = author.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${
        author.is_admin ? "bg-[#481D30] text-[#F0D69A] ring-1 ring-[#C9A15C]" : "bg-[#E9DCCB] text-[#6B3049]"
      }`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
    >
      {author.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- user-uploaded avatar from Supabase storage
        <img src={author.avatar_url} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="font-display font-semibold">{initials || "S"}</span>
      )}
    </span>
  );
}

export function OfficialBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#481D30] px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#F0D69A]">
      <BadgeCheck size={13} strokeWidth={1.8} /> {compact ? "OFFICIAL" : "OFFICIAL SEVOURA ANSWER"}
    </span>
  );
}

export function AuthorLine({ author, date, size = 32, extra }: { author: Author; date?: string; size?: number; extra?: ReactNode }) {
  const name = (
    <span className="font-medium text-[#3A2228]">
      {author.name}
      {author.is_admin && <span className="ml-2 align-middle text-[10px] font-semibold tracking-[0.18em] text-[#A77B4D]">SEVOURA TEAM</span>}
    </span>
  );
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar author={author} size={size} />
      <div className="min-w-0 text-[14px] leading-5">
        {author.username ? (
          <Link href={`/journal/u/${author.username}`} className="hover:underline hover:underline-offset-4">
            {name}
          </Link>
        ) : (
          name
        )}
        {date && <p className="text-[13px] text-[#8A766A]">{timeAgo(date)}</p>}
      </div>
      {extra}
    </div>
  );
}

/* ---------- upvote ---------- */
export function VoteButton({
  type,
  id,
  score,
  voted,
  disabled,
  onNeedLogin,
  layout = "row",
}: {
  type: "question" | "answer";
  id: string;
  score: number;
  voted: boolean;
  disabled?: boolean;
  onNeedLogin?: () => void;
  layout?: "row" | "stack";
}) {
  const { user } = useAuth();
  const [state, setState] = useState({ score, voted });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function toggle() {
    if (!user) return onNeedLogin?.();
    if (disabled || busy) return;
    setBusy(true);
    setErr(null);
    // optimistic
    setState((s) => ({ voted: !s.voted, score: s.score + (s.voted ? -1 : 1) }));
    try {
      const r = await community.vote(type, id);
      setState({ voted: r.voted, score: r.vote_score });
    } catch (e) {
      setState({ score, voted });
      setErr(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={state.voted}
        title={disabled ? "You can't upvote your own post" : state.voted ? "Remove upvote" : "Upvote — this is helpful"}
        className={`group inline-flex items-center gap-2 border px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
          layout === "stack" ? "flex-col px-3 py-2.5" : ""
        } ${
          state.voted
            ? "border-[#792D49] bg-[#792D49] text-[#FFF6E9]"
            : "border-[#D9C8B3] text-[#5A3A44] hover:border-[#792D49] hover:text-[#792D49]"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <ArrowUp size={15} strokeWidth={1.8} className={state.voted ? "" : "transition-transform duration-300 group-hover:-translate-y-0.5"} />
        <span className="tabular-nums">{state.score}</span>
        {layout === "row" && <span className="hidden sm:inline">{state.score === 1 ? "upvote" : "upvotes"}</span>}
      </button>
      {err && <span className="mt-1 text-[12px] text-[#9A2E3E]">{err}</span>}
    </span>
  );
}

/* ---------- report ---------- */
export function ReportButton({ type, id, onNeedLogin }: { type: "question" | "answer" | "comment"; id: string; onNeedLogin?: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | string>("idle");

  async function send() {
    setState("busy");
    try {
      await community.report(type, id, reason, details);
      setState("done");
    } catch (e) {
      setState(friendlyError(e));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => (user ? setOpen(true) : onNeedLogin?.())}
        className="inline-flex items-center gap-1.5 text-[13px] text-[#8A766A] transition-colors hover:text-[#9A2E3E]"
      >
        <Flag size={13} strokeWidth={1.6} /> Report
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[450] flex items-end justify-center bg-[#26000D]/50 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Report content"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[460px] border border-[#DCCAB5] bg-[#FBF6EE] p-7 sm:p-9"
            >
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 p-2 text-[#8A766A] hover:text-[#3A2228]">
                <X size={18} />
              </button>
              {state === "done" ? (
                <div className="py-4 text-center">
                  <p className="font-display text-3xl text-[#3A2228]">Thank you.</p>
                  <p className="mt-3 text-[15px] leading-7 text-[#6E5A50]">Our team will review this. Content reported by several members is hidden until it has been checked.</p>
                  <button type="button" onClick={() => setOpen(false)} className="mt-6 text-[12px] font-semibold tracking-[0.2em] text-[#792D49]">
                    CLOSE
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-semibold tracking-[0.28em] text-[#A77B4D]">REPORT</p>
                  <h3 className="mt-2 font-display text-3xl text-[#3A2228]">What&apos;s wrong with this {type}?</h3>
                  <div className="mt-6 space-y-2">
                    {REPORT_REASONS.map((r) => (
                      <label key={r.key} className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-[15px] transition-colors ${reason === r.key ? "border-[#792D49] bg-white" : "border-[#E2D4C2]"}`}>
                        <input type="radio" name="reason" value={r.key} checked={reason === r.key} onChange={() => setReason(r.key)} className="accent-[#792D49]" />
                        {r.label}
                      </label>
                    ))}
                  </div>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    maxLength={600}
                    rows={3}
                    placeholder="Anything else we should know? (optional)"
                    className="mt-4 w-full border border-[#E2D4C2] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#B28B4E]"
                  />
                  {state !== "idle" && state !== "busy" && <p className="mt-3 text-[13px] text-[#9A2E3E]">{state}</p>}
                  <button
                    type="button"
                    disabled={state === "busy"}
                    onClick={send}
                    className="mt-6 w-full bg-[#481D30] py-4 text-[12px] font-semibold tracking-[0.22em] text-[#FFF6E9] transition-colors hover:bg-[#792D49] disabled:opacity-60"
                  >
                    {state === "busy" ? "SENDING…" : "SEND REPORT"}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- feed card ---------- */
export function QuestionCard({ q, index = 0, onNeedLogin }: { q: Q; index?: number; onNeedLogin?: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: Math.min(index, 6) * 0.05, ease }}
      className="group relative border-b border-[#E2D4C2] py-9 first:pt-2"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] tracking-[0.18em] text-[#A77B4D]">
        {q.is_pinned && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#792D49]">
            <Pin size={12} strokeWidth={2} /> PINNED
          </span>
        )}
        <span className="font-semibold">{q.kind === "experience" ? "EXPERIENCE" : "QUESTION"}</span>
        {q.category && (
          <Link href={`/journal?category=${q.category.slug}`} className="transition-colors hover:text-[#792D49]">
            {q.category.name.toUpperCase()}
          </Link>
        )}
        {q.has_official && <OfficialBadge compact />}
      </div>

      <h2 className="mt-4 font-display text-[28px] font-medium leading-[1.15] text-[#2E1A20] md:text-[32px]">
        <Link href={`/journal/q/${q.id}`} className="transition-colors duration-300 hover:text-[#792D49]">
          {q.title}
        </Link>
      </h2>

      {q.top_answer ? (
        <div className="mt-5 border-l-2 border-[#C9A15C] pl-5">
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#8A766A]">
            <span className="font-medium text-[#5A3A44]">{q.top_answer.author.name}</span>
            {q.top_answer.is_official ? <span className="text-[11px] font-semibold tracking-[0.18em] text-[#792D49]">OFFICIAL</span> : <span>answered</span>}
          </div>
          <p className="mt-2 line-clamp-3 text-[16px] leading-[1.75] text-[#5A4A44]">{q.top_answer.excerpt}</p>
        </div>
      ) : (
        q.excerpt && <p className="mt-4 line-clamp-3 text-[16px] leading-[1.75] text-[#5A4A44]">{q.excerpt}</p>
      )}

      {q.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {q.tags.map((t) => (
            <Link key={t} href={`/journal?tag=${encodeURIComponent(t)}`} className="border border-[#E2D4C2] px-3 py-1 text-[13px] text-[#6E5A50] transition-colors hover:border-[#792D49] hover:text-[#792D49]">
              #{t}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <AuthorLine author={q.author} date={q.created_at} size={34} />
        <div className="flex items-center gap-3">
          <VoteButton type="question" id={q.id} score={q.vote_score} voted={q.voted} onNeedLogin={onNeedLogin} />
          <Link
            href={`/journal/q/${q.id}`}
            className="inline-flex items-center gap-2 border border-[#D9C8B3] px-3.5 py-2 text-[13px] font-medium text-[#5A3A44] transition-colors hover:border-[#792D49] hover:text-[#792D49]"
          >
            <MessageSquare size={15} strokeWidth={1.6} />
            <span className="tabular-nums">{q.answer_count}</span>
            <span className="hidden sm:inline">{q.kind === "experience" ? (q.answer_count === 1 ? "reply" : "replies") : q.answer_count === 1 ? "answer" : "answers"}</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- sign-in nudge used by votes / reports / answers ---------- */
export function SignInNudge({ open, onClose, next }: { open: boolean; onClose: () => void; next: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[440] flex justify-center p-4"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="flex w-full max-w-[560px] flex-wrap items-center justify-between gap-4 border border-[#C9A15C]/60 bg-[#390014] px-6 py-5 text-[#F7F0E6] shadow-2xl">
            <p className="text-[15px]">Sign in to join the conversation.</p>
            <div className="flex items-center gap-3">
              <Link href={`/login?next=${encodeURIComponent(next)}`} className="bg-[#D6A64F] px-5 py-3 text-[12px] font-semibold tracking-[0.2em] text-[#26000D]">
                SIGN IN
              </Link>
              <button type="button" onClick={onClose} aria-label="Dismiss" className="p-2 text-[#E2CBB8] hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function JournalNav({ active }: { active: "community" | "ask" | "editorial" | "profile" }) {
  const items = [
    { key: "community", href: "/journal", label: "Community" },
    { key: "ask", href: "/journal/ask", label: "Ask a question" },
    { key: "editorial", href: "/journal/editorial", label: "Editorial" },
  ];
  const { me } = useCommunityMe();
  if (me?.username) items.push({ key: "profile", href: `/journal/u/${me.username}`, label: "My profile" });
  return (
    <nav aria-label="Journal" className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px] tracking-[0.2em]">
      {items.map((i) => (
        <Link
          key={i.key}
          href={i.href}
          aria-current={active === i.key ? "page" : undefined}
          className={`relative py-2 transition-colors ${active === i.key ? "text-[#F0D69A]" : "text-[#E2CBB8] hover:text-[#F7F0E6]"}`}
        >
          {i.label.toUpperCase()}
          <span className={`absolute inset-x-0 -bottom-0.5 h-px bg-[#D6A64F] transition-transform duration-500 ${active === i.key ? "scale-x-100" : "scale-x-0"}`} />
        </Link>
      ))}
    </nav>
  );
}

/** Burgundy masthead shared by the Journal pages. */
export function JournalMasthead({ active, eyebrow, title, intro, children }: { active: "community" | "ask" | "editorial" | "profile"; eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#2A0010] text-[#F7F0E6]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_120%_at_85%_0%,#70243F_0%,#390014_45%,#26000D_100%)]" />
      <div aria-hidden className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#D6A64F]/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1320px] px-6 pb-16 pt-12 md:px-12 md:pb-20 md:pt-16">
        <JournalNav active={active} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mt-14 max-w-[820px]">
          <p className="flex items-center gap-4 text-[12px] font-semibold tracking-[0.32em] text-[#D6A64F]">
            <span className="h-px w-10 bg-[#D6A64F]" /> {eyebrow}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.9rem,6.4vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.01em]">{title}</h1>
          {intro && <p className="mt-6 max-w-[620px] text-[17px] leading-8 text-[#E8D3C3]/90">{intro}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  );
}
