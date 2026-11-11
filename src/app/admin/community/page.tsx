"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AlertTriangle, BadgeCheck, ExternalLink, EyeOff, HelpCircle, MessageSquare, Pin, ShieldBan, Users } from "lucide-react";
import { Card, Empty, ErrorBox, PageTitle, Skeleton, StatTile } from "@/components/admin/ui";
import { unwrap, useAdminData } from "@/components/admin/useAdminData";
import { getSupabase } from "@/lib/supabase/client";
import { friendlyError } from "@/lib/errors";
import { formatDate, timeAgo } from "@/lib/format";
import type { Author, QuestionCard } from "@/lib/community";

type Overview = {
  questions: number; hidden: number; answers: number; official_answers: number; unanswered: number; open_reports: number;
  members: number; restricted: number; questions_7d: number; answers_7d: number; votes_7d: number;
  by_day: { day: string; questions: number; answers: number }[];
};
type AdminQuestion = QuestionCard & { status: string; open_reports: number };
type AdminAnswer = { id: string; question_id: string; question_title: string; body: string; status: string; is_official: boolean; vote_score: number; created_at: string; author: Author; open_reports: number };
type Report = {
  id: string; target_type: "question" | "answer" | "comment"; target_id: string; reason: string; details: string | null; status: string; created_at: string;
  reporter: Author; target: { title: string; body: string; status: string; question_id: string; author: Author } | null;
};
type AdminCategory = { id: string; slug: string; name: string; description: string | null; sort_order: number; is_active: boolean; count: number };
type Member = Author & { email: string; restricted: boolean; restricted_reason: string | null; joined_at: string; questions: number; answers: number; reports_against: number };

const TABS = ["overview", "questions", "answers", "reports", "categories", "members"] as const;
type Tab = (typeof TABS)[number];

async function rpc(fn: string, args: Record<string, unknown>) {
  const sb = getSupabase();
  if (!sb) throw new Error("Not connected");
  const { error } = await sb.rpc(fn, args);
  if (error) throw error;
}

function StatusPill({ status }: { status: string }) {
  const tone = status === "published" ? "bg-[#E7F0DF] text-[#3E5B2E]" : status === "hidden" ? "bg-[#FBEBD2] text-[#8A5A16]" : "bg-[#F4DADA] text-[#8A2E2E]";
  return <span className={`px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${tone}`}>{status}</span>;
}

function ActionBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${danger ? "border-[#E2B3B3] text-[#8A2E2E] hover:bg-[#FBEDED]" : "border-[#D6C4AD] bg-white text-[#4A2A36] hover:border-[#792D49] hover:text-[#792D49]"}`}>
      {children}
    </button>
  );
}

function useAct(reload: () => void) {
  const [err, setErr] = useState<string | null>(null);
  const act = async (fn: string, args: Record<string, unknown>, confirmText?: string) => {
    if (confirmText && !confirm(confirmText)) return;
    setErr(null);
    try {
      await rpc(fn, args);
      reload();
    } catch (e) {
      setErr(friendlyError(e));
    }
  };
  return { err, act };
}

/* ---------------- overview ---------------- */
function OverviewTab({ go }: { go: (t: Tab) => void }) {
  const { data, error, loading } = useAdminData(async (sb) => unwrap(await sb.rpc("admin_community_overview")) as Overview);
  if (error) return <ErrorBox message={error} />;
  if (loading || !data) return <Skeleton h={320} />;
  const max = Math.max(1, ...data.by_day.map((d) => Number(d.questions) + Number(d.answers)));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Posts" value={Number(data.questions)} icon={HelpCircle} hint={`${data.questions_7d} this week`} index={0} />
        <StatTile label="Answers" value={Number(data.answers)} icon={MessageSquare} hint={`${data.official_answers} official · ${data.answers_7d} this week`} index={1} />
        <StatTile label="Open reports" value={Number(data.open_reports)} icon={AlertTriangle} tone={Number(data.open_reports) > 0 ? "accent" : "default"} hint={`${data.hidden} items hidden`} index={2} />
        <StatTile label="Members" value={Number(data.members)} icon={Users} hint={`${data.restricted} restricted`} index={3} />
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => go("questions")} className="border border-[#792D49] bg-[#792D49] px-4 py-2.5 text-[13px] text-white">
          {data.unanswered} unanswered — reply officially
        </button>
        {Number(data.open_reports) > 0 && (
          <button onClick={() => go("reports")} className="border border-[#D6C4AD] bg-white px-4 py-2.5 text-[13px]">
            Review {data.open_reports} report{Number(data.open_reports) === 1 ? "" : "s"}
          </button>
        )}
      </div>
      <Card className="p-5">
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#9A8070]">Community activity · last 14 days</p>
        <p className="mt-1 text-[13px] text-[#9A8777]">Questions and answers posted per day (IST) · {data.votes_7d} upvotes this week</p>
        <div className="mt-6 flex h-40 items-end gap-1.5" role="img" aria-label="Daily posts over the last 14 days">
          {data.by_day.map((d) => {
            const total = Number(d.questions) + Number(d.answers);
            return (
              <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
                <div className="rounded-t-[4px] bg-[#792D49] transition-colors group-hover:bg-[#B28B4E]" style={{ height: `${(total / max) * 100}%`, minHeight: total ? 4 : 1, opacity: total ? 1 : 0.25 }} />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap bg-[#2E1A20] px-2.5 py-1.5 text-[12px] text-white group-hover:block">
                  {formatDate(d.day)}: {d.questions} questions · {d.answers} answers
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[12px] text-[#9A8777]">
          <span>{formatDate(data.by_day[0]?.day)}</span>
          <span>Today</span>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- questions ---------------- */
function QuestionsTab() {
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, error, loading, reload } = useAdminData(async (sb) => unwrap(await sb.rpc("admin_community_questions", { p_status: status, p_search: search || null })) as AdminQuestion[], [status, search]);
  const { err, act } = useAct(() => reload({ silent: true }));
  const mod = (id: string, action: string, c?: string) => act("admin_community_moderate", { p_type: "question", p_id: id, p_action: action }, c);
  return (
    <>
      <Filters value={status} onChange={setStatus} options={["all", "published", "unanswered", "hidden", "removed"]} q={q} setQ={setQ} onSearch={() => setSearch(q.trim())} placeholder="Search titles…" />
      {err && <div className="mb-3"><ErrorBox message={err} /></div>}
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : !data?.length ? <Card><Empty>No posts here.</Empty></Card> : (
        <Card>
          <ul className="divide-y divide-[#EEE5D9]">
            {data.map((x) => (
              <li key={x.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={x.status} />
                    {x.is_pinned && <span className="inline-flex items-center gap-1 text-[12px] text-[#792D49]"><Pin size={12} /> Pinned</span>}
                    {x.open_reports > 0 && <span className="bg-[#F4DADA] px-2 py-0.5 text-[11px] text-[#8A2E2E]">{x.open_reports} reports</span>}
                    {x.has_official && <span className="inline-flex items-center gap-1 text-[12px] text-[#3E5B2E]"><BadgeCheck size={12} /> Official answer</span>}
                    <span className="text-[12px] uppercase tracking-[0.12em] text-[#9A8070]">{x.kind} · {x.category?.name ?? "—"}</span>
                  </div>
                  <Link href={`/journal/q/${x.id}`} target="_blank" className="mt-1.5 block break-words font-serif text-[21px] leading-snug text-[#3B1626] hover:text-[#792D49]">{x.title}</Link>
                  <p className="mt-1 text-[13px] text-[#806D60]">
                    {x.author.name}{x.author.username ? ` (@${x.author.username})` : ""} · {timeAgo(x.created_at)} · {x.answer_count} answers · {x.vote_score} upvotes · {x.view_count} views
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  <Link href={`/journal/q/${x.id}#answer`} target="_blank" className="inline-flex items-center gap-1 border border-[#792D49] bg-[#792D49] px-2.5 py-1.5 text-[12px] font-medium text-white">
                    Answer officially <ExternalLink size={11} />
                  </Link>
                  <Link href={`/journal/ask?edit=${x.id}`} target="_blank" className="border border-[#D6C4AD] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#4A2A36] hover:border-[#792D49]">Edit</Link>
                  {x.is_pinned ? <ActionBtn onClick={() => mod(x.id, "unpin")}>Unpin</ActionBtn> : x.status === "published" && <ActionBtn onClick={() => mod(x.id, "pin")}>Pin</ActionBtn>}
                  {x.status !== "published" && <ActionBtn onClick={() => mod(x.id, "publish")}>Publish</ActionBtn>}
                  {x.status === "published" && <ActionBtn onClick={() => mod(x.id, "hide")}>Hide</ActionBtn>}
                  {x.status !== "removed" && <ActionBtn danger onClick={() => mod(x.id, "remove", "Remove this post from the community?")}>Remove</ActionBtn>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

/* ---------------- answers ---------------- */
function AnswersTab() {
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, error, loading, reload } = useAdminData(async (sb) => unwrap(await sb.rpc("admin_community_answers", { p_status: status, p_search: search || null })) as AdminAnswer[], [status, search]);
  const { err, act } = useAct(() => reload({ silent: true }));
  const mod = (id: string, action: string, c?: string) => act("admin_community_moderate", { p_type: "answer", p_id: id, p_action: action }, c);
  return (
    <>
      <Filters value={status} onChange={setStatus} options={["all", "published", "official", "hidden", "removed"]} q={q} setQ={setQ} onSearch={() => setSearch(q.trim())} placeholder="Search answer text…" />
      {err && <div className="mb-3"><ErrorBox message={err} /></div>}
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : !data?.length ? <Card><Empty>No answers here.</Empty></Card> : (
        <Card>
          <ul className="divide-y divide-[#EEE5D9]">
            {data.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={a.status} />
                    {a.is_official && <span className="inline-flex items-center gap-1 bg-[#481D30] px-2 py-0.5 text-[11px] tracking-[0.12em] text-[#F0D69A]"><BadgeCheck size={11} /> OFFICIAL</span>}
                    {a.open_reports > 0 && <span className="bg-[#F4DADA] px-2 py-0.5 text-[11px] text-[#8A2E2E]">{a.open_reports} reports</span>}
                  </div>
                  <Link href={`/journal/q/${a.question_id}#answer-${a.id}`} target="_blank" className="mt-1.5 block text-[14px] text-[#792D49] hover:underline">On: {a.question_title}</Link>
                  <p className="mt-1 line-clamp-3 whitespace-pre-line break-words text-[15px] leading-6 text-[#3F2E2E]">{a.body}</p>
                  <p className="mt-1 text-[13px] text-[#806D60]">{a.author.name}{a.author.is_admin ? " · SEVOURA team" : ""} · {timeAgo(a.created_at)} · {a.vote_score} upvotes</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {a.author.is_admin && (a.is_official ? <ActionBtn onClick={() => mod(a.id, "unofficial")}>Remove official badge</ActionBtn> : <ActionBtn onClick={() => mod(a.id, "official")}>Mark official</ActionBtn>)}
                  {a.status !== "published" && <ActionBtn onClick={() => mod(a.id, "publish")}>Publish</ActionBtn>}
                  {a.status === "published" && <ActionBtn onClick={() => mod(a.id, "hide")}>Hide</ActionBtn>}
                  {a.status !== "removed" && <ActionBtn danger onClick={() => mod(a.id, "remove", "Remove this answer?")}>Remove</ActionBtn>}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

/* ---------------- reports ---------------- */
function ReportsTab() {
  const [status, setStatus] = useState("open");
  const { data, error, loading, reload } = useAdminData(async (sb) => unwrap(await sb.rpc("admin_community_reports", { p_status: status })) as Report[], [status]);
  const { err, act } = useAct(() => reload({ silent: true }));
  const resolve = (id: string, action: string, c?: string) => act("admin_community_resolve_report", { p_id: id, p_action: action }, c);
  return (
    <>
      <Filters value={status} onChange={setStatus} options={["open", "resolved", "dismissed", "all"]} />
      {err && <div className="mb-3"><ErrorBox message={err} /></div>}
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : !data?.length ? <Card><Empty>{status === "open" ? "No open reports — the community is in good shape." : "Nothing here."}</Empty></Card> : (
        <Card>
          <ul className="divide-y divide-[#EEE5D9]">
            {data.map((r) => (
              <li key={r.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="bg-[#F4DADA] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A2E2E]">{r.reason.replace("_", " ")}</span>
                  <span className="uppercase tracking-[0.12em] text-[#9A8070]">{r.target_type}</span>
                  {r.target && <StatusPill status={r.target.status} />}
                  <span className="text-[#806D60]">reported by {r.reporter.name} · {timeAgo(r.created_at)}</span>
                </div>
                {r.target ? (
                  <div className="mt-2 border-l-2 border-[#E2D5C3] pl-4">
                    <Link href={`/journal/q/${r.target.question_id}`} target="_blank" className="text-[14px] text-[#792D49] hover:underline">{r.target.title}</Link>
                    <p className="mt-1 line-clamp-4 whitespace-pre-line break-words text-[15px] leading-6 text-[#3F2E2E]">{r.target.body || "—"}</p>
                    <p className="mt-1 text-[13px] text-[#806D60]">Written by {r.target.author.name}</p>
                  </div>
                ) : <p className="mt-2 text-[14px] text-[#806D60]">The reported item no longer exists.</p>}
                {r.details && <p className="mt-2 text-[14px] italic text-[#5A4A44]">“{r.details}”</p>}
                {r.status === "open" && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <ActionBtn danger onClick={() => resolve(r.id, "remove_content", "Remove the reported content and close its reports?")}>Remove content</ActionBtn>
                    <ActionBtn onClick={() => resolve(r.id, "keep_content")}>Keep & republish</ActionBtn>
                    <ActionBtn onClick={() => resolve(r.id, "dismiss")}>Dismiss report</ActionBtn>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

/* ---------------- categories ---------------- */
function CategoriesTab() {
  const { data, error, loading, reload } = useAdminData(async (sb) => unwrap(await sb.rpc("admin_community_categories")) as AdminCategory[]);
  const [edit, setEdit] = useState<Partial<AdminCategory> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setErr(null);
    try {
      await rpc("admin_community_category_save", {
        p_id: edit.id ?? null, p_slug: edit.slug ?? "", p_name: edit.name ?? "", p_description: edit.description ?? "",
        p_sort: Number(edit.sort_order ?? 100), p_active: edit.is_active ?? true,
      });
      setEdit(null);
      reload({ silent: true });
    } catch (e2) {
      setErr(friendlyError(e2));
    }
  }

  const toggle = async (c: AdminCategory) => {
    try {
      await rpc("admin_community_category_save", { p_id: c.id, p_slug: c.slug, p_name: c.name, p_description: c.description ?? "", p_sort: c.sort_order, p_active: !c.is_active });
      reload({ silent: true });
    } catch (e) {
      setErr(friendlyError(e));
    }
  };

  return (
    <>
      <div className="mb-4">
        <button onClick={() => setEdit({ is_active: true, sort_order: 100 })} className="border border-[#792D49] bg-[#792D49] px-4 py-2.5 text-[13px] text-white">New category</button>
      </div>
      {err && <div className="mb-3"><ErrorBox message={err} /></div>}
      {edit && (
        <Card className="mb-4 p-5">
          <form onSubmit={save} className="grid gap-3 md:grid-cols-2">
            <label className="text-[13px] text-[#806D60]">Name<input required value={edit.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value, slug: edit.id ? edit.slug : e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} className="mt-1 w-full border border-[#D6C4AD] bg-white px-3 py-2.5 text-[15px] text-[#3B1626] outline-none focus:border-[#792D49]" /></label>
            <label className="text-[13px] text-[#806D60]">Slug (used in links)<input required pattern="[a-z0-9-]{2,40}" value={edit.slug ?? ""} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} className="mt-1 w-full border border-[#D6C4AD] bg-white px-3 py-2.5 text-[15px] text-[#3B1626] outline-none focus:border-[#792D49]" /></label>
            <label className="text-[13px] text-[#806D60] md:col-span-2">Description<input value={edit.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} className="mt-1 w-full border border-[#D6C4AD] bg-white px-3 py-2.5 text-[15px] text-[#3B1626] outline-none focus:border-[#792D49]" /></label>
            <label className="text-[13px] text-[#806D60]">Sort order<input type="number" value={edit.sort_order ?? 100} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} className="mt-1 w-full border border-[#D6C4AD] bg-white px-3 py-2.5 text-[15px] text-[#3B1626] outline-none focus:border-[#792D49]" /></label>
            <label className="flex items-center gap-2 self-end pb-3 text-[15px] text-[#3B1626]"><input type="checkbox" checked={edit.is_active ?? true} onChange={(e) => setEdit({ ...edit, is_active: e.target.checked })} className="accent-[#792D49]" /> Visible to members</label>
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" className="bg-[#792D49] px-5 py-2.5 text-[13px] text-white">Save category</button>
              <button type="button" onClick={() => setEdit(null)} className="px-4 py-2.5 text-[13px] text-[#806D60]">Cancel</button>
            </div>
          </form>
        </Card>
      )}
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={240} /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead className="bg-[#F8F2EA] text-[12px] uppercase tracking-[0.14em] text-[#9A8070]">
                <tr><th className="px-5 py-3 font-medium">Category</th><th className="px-3 py-3 font-medium">Posts</th><th className="px-3 py-3 font-medium">Order</th><th className="px-3 py-3 font-medium">Status</th><th className="px-5 py-3" /></tr>
              </thead>
              <tbody>
                {(data ?? []).map((c) => (
                  <tr key={c.id} className="border-t border-[#EEE5D9]">
                    <td className="px-5 py-3"><p className="text-[#3B1626]">{c.name}</p><p className="text-[13px] text-[#9A8777]">/{c.slug}{c.description ? ` — ${c.description}` : ""}</p></td>
                    <td className="px-3 py-3">{c.count}</td>
                    <td className="px-3 py-3">{c.sort_order}</td>
                    <td className="px-3 py-3">{c.is_active ? <span className="text-[#3E5B2E]">Visible</span> : <span className="text-[#8A5A16]">Hidden</span>}</td>
                    <td className="px-5 py-3 text-right"><div className="flex justify-end gap-1.5"><ActionBtn onClick={() => setEdit(c)}>Edit</ActionBtn><ActionBtn onClick={() => toggle(c)}>{c.is_active ? "Hide" : "Show"}</ActionBtn></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

/* ---------------- members ---------------- */
function MembersTab() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, error, loading, reload } = useAdminData(async (sb) => unwrap(await sb.rpc("admin_community_members", { p_search: search || null })) as Member[], [search]);
  const { err, act } = useAct(() => reload({ silent: true }));
  return (
    <>
      <Filters q={q} setQ={setQ} onSearch={() => setSearch(q.trim())} placeholder="Search name, username or email…" />
      {err && <div className="mb-3"><ErrorBox message={err} /></div>}
      {error ? <ErrorBox message={error} /> : loading ? <Skeleton h={300} /> : !data?.length ? <Card><Empty>No community members yet. Members appear here once they post or set a username.</Empty></Card> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-[15px]">
              <thead className="bg-[#F8F2EA] text-[12px] uppercase tracking-[0.14em] text-[#9A8070]">
                <tr><th className="px-5 py-3 font-medium">Member</th><th className="px-3 py-3 font-medium">Joined</th><th className="px-3 py-3 font-medium">Posts</th><th className="px-3 py-3 font-medium">Answers</th><th className="px-3 py-3 font-medium">Reports against</th><th className="px-5 py-3" /></tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr key={m.id} className="border-t border-[#EEE5D9] align-top">
                    <td className="px-5 py-3">
                      {m.username ? <Link href={`/journal/u/${m.username}`} target="_blank" className="text-[#792D49] hover:underline">{m.name}</Link> : <span>{m.name}</span>}
                      {m.is_admin && <span className="ml-2 bg-[#E5C48B] px-1.5 py-0.5 text-[11px] tracking-wider text-[#46182D]">ADMIN</span>}
                      {m.restricted && <span className="ml-2 bg-[#F4DADA] px-1.5 py-0.5 text-[11px] text-[#8A2E2E]">RESTRICTED</span>}
                      <p className="text-[13px] text-[#9A8777]">{m.username ? `@${m.username} · ` : ""}{m.email}</p>
                      {m.restricted && m.restricted_reason && <p className="text-[13px] italic text-[#8A2E2E]">{m.restricted_reason}</p>}
                    </td>
                    <td className="px-3 py-3 text-[#806D60]">{formatDate(m.joined_at)}</td>
                    <td className="px-3 py-3">{m.questions}</td>
                    <td className="px-3 py-3">{m.answers}</td>
                    <td className="px-3 py-3">{m.reports_against}</td>
                    <td className="px-5 py-3 text-right">
                      {!m.is_admin && (m.restricted ? (
                        <ActionBtn onClick={() => act("admin_community_restrict", { p_user_id: m.id, p_restricted: false, p_reason: "" })}>Lift restriction</ActionBtn>
                      ) : (
                        <ActionBtn danger onClick={() => {
                          const reason = prompt(`Restrict ${m.name} from posting? Optional reason (shown to admins only):`);
                          if (reason !== null) act("admin_community_restrict", { p_user_id: m.id, p_restricted: true, p_reason: reason });
                        }}>
                          <span className="inline-flex items-center gap-1"><ShieldBan size={12} /> Restrict</span>
                        </ActionBtn>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

function Filters({ value, onChange, options, q, setQ, onSearch, placeholder }: { value?: string; onChange?: (v: string) => void; options?: string[]; q?: string; setQ?: (v: string) => void; onSearch?: () => void; placeholder?: string }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      {setQ && (
        <form onSubmit={(e) => { e.preventDefault(); onSearch?.(); }} className="flex flex-1 items-center border border-[#D6C4AD] bg-white">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="w-full bg-transparent px-3 py-2.5 text-[15px] outline-none" />
          <button type="submit" className="px-4 text-[13px] text-[#792D49]">Search</button>
        </form>
      )}
      {options && (
        <div className="flex flex-wrap gap-1">
          {options.map((o) => (
            <button key={o} onClick={() => onChange?.(o)} className={`border px-3 py-2 text-[13px] capitalize ${value === o ? "border-[#792D49] bg-[#792D49] text-white" : "border-[#D6C4AD] bg-white"}`}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCommunity() {
  const [tab, setTab] = useState<Tab>("overview");
  return (
    <>
      <PageTitle
        title="Community"
        sub="Moderate the Journal: questions, answers, reports, categories and members."
        action={<Link href="/journal" target="_blank" className="inline-flex items-center gap-2 border border-[#D6C4AD] bg-white px-4 py-2.5 text-[13px] text-[#4A2A36] hover:border-[#792D49]">Open the Journal <ExternalLink size={13} /></Link>}
      />
      <div role="tablist" className="mb-6 flex gap-6 overflow-x-auto border-b border-[#E2D5C3] [scrollbar-width:none]">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`-mb-px shrink-0 border-b-2 pb-3 text-[13px] font-medium uppercase tracking-[0.16em] ${tab === t ? "border-[#792D49] text-[#792D49]" : "border-transparent text-[#9A8070] hover:text-[#3B1626]"}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === "overview" && <OverviewTab go={setTab} />}
      {tab === "questions" && <QuestionsTab />}
      {tab === "answers" && <AnswersTab />}
      {tab === "reports" && <ReportsTab />}
      {tab === "categories" && <CategoriesTab />}
      {tab === "members" && <MembersTab />}
      <p className="mt-10 flex items-start gap-2 text-[13px] text-[#9A8777]">
        <EyeOff size={14} className="mt-0.5 shrink-0" /> Hidden items are visible only to admins. Content with three open reports is hidden automatically until reviewed. Official answers are written by an admin on the question page.
      </p>
    </>
  );
}
