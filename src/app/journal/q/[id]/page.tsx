"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, MessageCircle, PenLine, Pin, Trash2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/components/providers/AuthProvider";
import { AuthorLine, Avatar, OfficialBadge, ReportButton, SignInNudge, VoteButton, ease, useCommunityMe } from "@/components/journal/ui";
import { community, type Answer, type QuestionDetail } from "@/lib/community";
import { friendlyError } from "@/lib/errors";
import { formatDate, timeAgo } from "@/lib/format";

function Body({ text, className = "" }: { text: string; className?: string }) {
  return <div className={`whitespace-pre-line break-words text-[17px] leading-[1.85] text-[#3F2E2E] ${className}`}>{text}</div>;
}

function AnswerBlock({ a, onChanged, onNeedLogin, isAdmin, next }: { a: Answer; onChanged: () => void; onNeedLogin: () => void; isAdmin: boolean; next: string }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(a.body);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(a.comments.length > 0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setErr(null);
    try {
      await fn();
      onChanged();
    } catch (e) {
      setErr(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease }}
      id={`answer-${a.id}`}
      className={`relative py-10 ${a.is_official ? "my-4 border border-[#C9A15C]/60 bg-[#FBF5EA] px-6 md:px-10" : "border-b border-[#E2D4C2]"}`}
    >
      {a.is_official && (
        <div className="mb-6">
          <OfficialBadge />
        </div>
      )}
      {a.status === "hidden" && <p className="mb-4 inline-block bg-[#F4DADA] px-3 py-1 text-[12px] font-semibold tracking-[0.14em] text-[#8A2E2E]">HIDDEN — VISIBLE TO ADMINS ONLY</p>}
      <AuthorLine author={a.author} date={a.created_at} size={40} />

      {editing ? (
        <div className="mt-6">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={7} maxLength={8000} className="w-full border border-[#DCCAB5] bg-white px-5 py-4 text-[16px] leading-[1.75] outline-none focus:border-[#B28B4E]" />
          <div className="mt-3 flex gap-3">
            <button type="button" disabled={busy} onClick={() => run(() => community.updateAnswer(a.id, draft)).then(() => setEditing(false))} className="bg-[#481D30] px-6 py-3 text-[12px] font-semibold tracking-[0.2em] text-white disabled:opacity-60">
              SAVE
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-3 text-[12px] font-semibold tracking-[0.2em] text-[#6E5A50]">
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <Body text={a.body} className="mt-6" />
      )}
      {a.edited_at && !editing && <p className="mt-3 text-[13px] italic text-[#A08A79]">Edited {timeAgo(a.edited_at)}</p>}

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <VoteButton type="answer" id={a.id} score={a.vote_score} voted={a.voted} disabled={a.is_mine} onNeedLogin={onNeedLogin} />
        <button type="button" onClick={() => setShowComments((v) => !v)} className="inline-flex items-center gap-2 text-[13px] text-[#6E5A50] hover:text-[#792D49]">
          <MessageCircle size={14} /> {a.comments.length ? `${a.comments.length} comment${a.comments.length > 1 ? "s" : ""}` : "Comment"}
        </button>
        {(a.is_mine || isAdmin) && !editing && (
          <>
            {(a.is_mine || isAdmin) && (
              <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-[13px] text-[#6E5A50] hover:text-[#792D49]">
                <PenLine size={13} /> Edit
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => confirm("Delete this answer? This can't be undone.") && run(() => community.deleteAnswer(a.id))}
              className="inline-flex items-center gap-1.5 text-[13px] text-[#6E5A50] hover:text-[#9A2E3E]"
            >
              <Trash2 size={13} /> Delete
            </button>
          </>
        )}
        {!a.is_mine && <ReportButton type="answer" id={a.id} onNeedLogin={onNeedLogin} />}
      </div>
      {err && <p className="mt-3 text-[13px] text-[#9A2E3E]">{err}</p>}

      {showComments && (
        <div className="mt-7 space-y-5 border-l border-[#DCCAB5] pl-6">
          {a.comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar author={c.author} size={28} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-[#8A766A]">
                  {c.author.username ? (
                    <Link href={`/journal/u/${c.author.username}`} className="font-medium text-[#3A2228] hover:underline">
                      {c.author.name}
                    </Link>
                  ) : (
                    <span className="font-medium text-[#3A2228]">{c.author.name}</span>
                  )}{" "}
                  · {timeAgo(c.created_at)}
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-[15px] leading-7 text-[#3F2E2E]">{c.body}</p>
                <div className="mt-1 flex gap-4">
                  {(c.is_mine || isAdmin) && (
                    <button type="button" onClick={() => run(() => community.deleteComment(c.id))} className="text-[12px] text-[#A08A79] hover:text-[#9A2E3E]">
                      Delete
                    </button>
                  )}
                  {!c.is_mine && <ReportButton type="comment" id={c.id} onNeedLogin={onNeedLogin} />}
                </div>
              </div>
            </div>
          ))}
          {user ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                run(() => community.comment(a.id, comment)).then(() => setComment(""));
              }}
              className="flex gap-3"
            >
              <input value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} placeholder="Add a comment" aria-label="Add a comment" className="min-w-0 flex-1 border-b border-[#CDB89F] bg-transparent py-2 text-[15px] outline-none focus:border-[#792D49]" />
              <button type="submit" disabled={busy || !comment.trim()} className="text-[12px] font-semibold tracking-[0.2em] text-[#792D49] disabled:opacity-40">
                POST
              </button>
            </form>
          ) : (
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-[14px] text-[#792D49] underline underline-offset-4">
              Sign in to comment
            </Link>
          )}
        </div>
      )}
    </motion.article>
  );
}

function QuestionView() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { me } = useCommunityMe();
  const [q, setQ] = useState<QuestionDetail | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [official, setOfficial] = useState(true);
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [posted] = useState(params.get("posted") === "1");
  const viewed = useRef(false);
  const next = `/journal/q/${id}`;

  const load = useCallback(() => {
    community
      .question(id)
      .then(setQ)
      .catch((e) => {
        setError(friendlyError(e));
        setQ(null);
      });
  }, [id]);

  useEffect(() => {
    load();
    if (!viewed.current) {
      viewed.current = true;
      community.view(id).catch(() => {});
    }
  }, [id, load, user]);

  async function submitAnswer(e: FormEvent) {
    e.preventDefault();
    if (answer.trim().length < 2) return;
    setBusy(true);
    setError(null);
    try {
      await community.answer(id, answer, isAdmin && official);
      setAnswer("");
      load();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function deleteQuestion() {
    if (!confirm("Delete this post and its answers? This can't be undone.")) return;
    try {
      await community.deleteQuestion(id);
      router.push("/journal");
    } catch (e) {
      setError(friendlyError(e));
    }
  }

  if (q === undefined) {
    return (
      <div className="mx-auto max-w-[1100px] animate-pulse space-y-6 px-6 py-24 md:px-12">
        <div className="h-4 w-48 bg-[#E9DCCB]" />
        <div className="h-14 w-4/5 bg-[#E9DCCB]" />
        <div className="h-5 w-full bg-[#F0E5D6]" />
      </div>
    );
  }
  if (q === null) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-32 text-center">
        <p className="font-display text-[44px] leading-tight text-[#2E1A20]">This discussion isn&apos;t available.</p>
        <p className="mt-4 text-[16px] text-[#6E5A50]">{error ?? "It may have been removed by its author or our moderators."}</p>
        <Link href="/journal" className="mt-8 inline-block bg-[#481D30] px-8 py-4 text-[12px] font-semibold tracking-[0.22em] text-white">
          BACK TO THE COMMUNITY
        </Link>
      </div>
    );
  }

  const isExp = q.kind === "experience";
  return (
    <>
      <section className="relative overflow-hidden bg-[#2A0010] text-[#F7F0E6]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_120%_at_85%_0%,#70243F_0%,#390014_45%,#26000D_100%)]" />
        <div className="relative mx-auto max-w-[1100px] px-6 pb-14 pt-12 md:px-12 md:pb-16 md:pt-14">
          <Link href="/journal" className="inline-flex items-center gap-2 text-[13px] tracking-[0.18em] text-[#E2CBB8] transition-colors hover:text-[#F0D69A]">
            <ArrowLeft size={15} /> THE COMMUNITY
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold tracking-[0.22em] text-[#D6A64F]">
            {q.is_pinned && (
              <span className="inline-flex items-center gap-1.5 text-[#F0D69A]">
                <Pin size={12} /> PINNED
              </span>
            )}
            <span>{isExp ? "EXPERIENCE" : "QUESTION"}</span>
            {q.category && (
              <Link href={`/journal?category=${q.category.slug}`} className="hover:text-[#F0D69A]">
                {q.category.name.toUpperCase()}
              </Link>
            )}
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mt-5 font-display text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1.04]">
            {q.title}
          </motion.h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-[14px] text-[#E2CBB8]">
            <div className="flex items-center gap-3">
              <Avatar author={q.author} size={40} />
              <div>
                {q.author.username ? (
                  <Link href={`/journal/u/${q.author.username}`} className="font-medium text-[#F7F0E6] hover:underline">
                    {q.author.name}
                  </Link>
                ) : (
                  <span className="font-medium text-[#F7F0E6]">{q.author.name}</span>
                )}
                <p className="text-[13px] text-[#C9AFA2]">{formatDate(q.created_at)}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2">
              <Eye size={15} /> {q.view_count} views
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-16 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          {posted && <p className="mb-8 border border-[#B9CFA8] bg-[#EEF4E8] px-5 py-4 text-[15px] text-[#3E5B2E]">Published. We&apos;ll show answers here as they arrive.</p>}
          {q.status === "hidden" && <p className="mb-8 border border-[#E2B3B3] bg-[#F9E9E9] px-5 py-4 text-[15px] text-[#8A2E2E]">This post is hidden while our team reviews it.</p>}

          {q.body && <Body text={q.body} />}
          {q.edited_at && <p className="mt-3 text-[13px] italic text-[#A08A79]">Edited {timeAgo(q.edited_at)}</p>}
          {q.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {q.tags.map((t) => (
                <Link key={t} href={`/journal?tag=${encodeURIComponent(t)}`} className="border border-[#DCCAB5] px-3 py-1.5 text-[13px] text-[#5A3A44] hover:border-[#792D49]">
                  #{t}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#DCCAB5] pb-8">
            <VoteButton type="question" id={q.id} score={q.vote_score} voted={q.voted} disabled={q.is_mine} onNeedLogin={() => setNudge(true)} />
            {(q.is_mine || isAdmin) && (
              <Link href={`/journal/ask?edit=${q.id}`} className="inline-flex items-center gap-1.5 text-[13px] text-[#6E5A50] hover:text-[#792D49]">
                <PenLine size={13} /> Edit
              </Link>
            )}
            {(q.is_mine || isAdmin) && (
              <button type="button" onClick={deleteQuestion} className="inline-flex items-center gap-1.5 text-[13px] text-[#6E5A50] hover:text-[#9A2E3E]">
                <Trash2 size={13} /> Delete
              </button>
            )}
            {!q.is_mine && <ReportButton type="question" id={q.id} onNeedLogin={() => setNudge(true)} />}
          </div>

          <h2 className="mt-14 font-display text-[34px] leading-tight text-[#2E1A20]">
            {q.answers.length === 0 ? (isExp ? "No replies yet" : "No answers yet") : `${q.answers.length} ${isExp ? (q.answers.length === 1 ? "reply" : "replies") : q.answers.length === 1 ? "answer" : "answers"}`}
          </h2>
          <div className="mt-2">
            {q.answers.map((a) => (
              <AnswerBlock key={a.id} a={a} onChanged={load} onNeedLogin={() => setNudge(true)} isAdmin={isAdmin} next={next} />
            ))}
          </div>

          <div id="answer" className="mt-14 scroll-mt-28 border-t border-[#DCCAB5] pt-10">
            <h3 className="font-display text-[30px] leading-tight text-[#2E1A20]">{isExp ? "Reply to this experience" : "Your answer"}</h3>
            {!user ? (
              <div className="mt-6 flex flex-wrap items-center gap-5 bg-[#F0E5D6] px-6 py-6">
                <p className="text-[16px] text-[#5A4A44]">Sign in to share your answer with the community.</p>
                <Link href={`/login?next=${encodeURIComponent(next)}`} className="bg-[#481D30] px-7 py-3.5 text-[12px] font-semibold tracking-[0.22em] text-white">
                  SIGN IN
                </Link>
              </div>
            ) : me?.restricted ? (
              <p className="mt-6 border border-[#E2B3B3] bg-[#F9E9E9] px-5 py-4 text-[15px] text-[#8A2E2E]">Your account can&apos;t post in the community at the moment.</p>
            ) : (
              <form onSubmit={submitAnswer} className="mt-6">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={7}
                  maxLength={8000}
                  placeholder={isExp ? "Share your thoughts…" : "Write a clear, helpful answer…"}
                  className="w-full border border-[#DCCAB5] bg-[#FCF8F1] px-5 py-4 text-[16px] leading-[1.75] outline-none transition-colors focus:border-[#B28B4E] focus:bg-white"
                />
                {isAdmin && (
                  <label className="mt-4 flex cursor-pointer items-center gap-3 text-[15px] text-[#3A2228]">
                    <input type="checkbox" checked={official} onChange={(e) => setOfficial(e.target.checked)} className="h-4 w-4 accent-[#792D49]" />
                    Post as an <strong className="font-semibold">official SEVOURA answer</strong>
                  </label>
                )}
                {error && <p className="mt-3 text-[14px] text-[#9A2E3E]">{error}</p>}
                <button type="submit" disabled={busy || answer.trim().length < 2} className="mt-5 bg-[#481D30] px-9 py-4 text-[12px] font-semibold tracking-[0.22em] text-white transition-colors hover:bg-[#792D49] disabled:opacity-50">
                  {busy ? "POSTING…" : isAdmin && official ? "POST OFFICIAL ANSWER" : isExp ? "POST REPLY" : "POST ANSWER"}
                </button>
              </form>
            )}
          </div>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
          <div className="border border-[#DCCAB5] p-7">
            <p className="text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">HAVE A QUESTION?</p>
            <p className="mt-3 font-display text-[24px] leading-tight text-[#2E1A20]">Ask the community and the SEVOURA team.</p>
            <Link href="/journal/ask" className="mt-6 inline-flex bg-[#481D30] px-6 py-3.5 text-[12px] font-semibold tracking-[0.22em] text-white hover:bg-[#792D49]">
              ASK A QUESTION
            </Link>
          </div>
          {q.related.length > 0 && (
            <div>
              <p className="mb-5 text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">RELATED DISCUSSIONS</p>
              <ul className="space-y-5">
                {q.related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/journal/q/${r.id}`} className="font-display text-[20px] leading-snug text-[#2E1A20] hover:text-[#792D49]">
                      {r.title}
                    </Link>
                    <p className="mt-1 text-[13px] text-[#8A766A]">
                      {r.answer_count} {r.answer_count === 1 ? "answer" : "answers"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
      <SignInNudge open={nudge} onClose={() => setNudge(false)} next={next} />
    </>
  );
}

export default function QuestionPage() {
  return (
    <main className="min-h-screen bg-[#F7F0E6] text-[#3A2228]">
      <SiteHeader />
      <Suspense fallback={<div className="h-[50vh] bg-[#2A0010]" />}>
        <QuestionView />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
