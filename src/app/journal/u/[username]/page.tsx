"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAuth } from "@/components/providers/AuthProvider";
import { Avatar, OfficialBadge, QuestionCard } from "@/components/journal/ui";
import { community, type Profile } from "@/lib/community";
import { friendlyError } from "@/lib/errors";
import { formatDate } from "@/lib/format";

function Editor({ p, onSaved }: { p: Profile; onSaved: (username: string) => void }) {
  const { user } = useAuth();
  const [username, setUsername] = useState(p.username ?? "");
  const [bio, setBio] = useState(p.bio ?? "");
  const [avatar, setAvatar] = useState<string | null>(p.avatar_url);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function pick(file: File | undefined) {
    if (!file || !user) return;
    setBusy(true);
    setMsg(null);
    try {
      setAvatar(await community.uploadAvatar(file, user.id));
    } catch (e) {
      setMsg({ ok: false, text: friendlyError(e) });
    } finally {
      setBusy(false);
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const me = await community.updateProfile(username, bio, avatar);
      setMsg({ ok: true, text: "Profile saved." });
      onSaved(me.username ?? username);
    } catch (err) {
      setMsg({ ok: false, text: friendlyError(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="border border-[#DCCAB5] bg-[#FCF8F1] p-7 md:p-9">
      <p className="text-[12px] font-semibold tracking-[0.28em] text-[#A77B4D]">EDIT YOUR PROFILE</p>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <Avatar author={{ name: p.name, avatar_url: avatar, is_admin: p.is_admin }} size={84} />
        <label className="inline-flex cursor-pointer items-center gap-2 border border-[#CDB89F] px-5 py-3 text-[12px] font-semibold tracking-[0.2em] text-[#481D30] hover:border-[#792D49]">
          <Camera size={15} /> {busy ? "UPLOADING…" : "CHANGE PHOTO"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        {avatar && (
          <button type="button" onClick={() => setAvatar(null)} className="text-[13px] text-[#8A766A] underline underline-offset-4">
            Remove photo
          </button>
        )}
      </div>
      <p className="mt-2 text-[13px] text-[#A08A79]">JPG, PNG or WebP, up to 2 MB.</p>
      <label className="mt-8 block">
        <span className="text-[12px] font-semibold tracking-[0.24em] text-[#A77B4D]">USERNAME</span>
        <div className="mt-3 flex items-center border border-[#DCCAB5] bg-white focus-within:border-[#B28B4E]">
          <span className="pl-4 text-[16px] text-[#A08A79]">@</span>
          <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} maxLength={24} className="min-w-0 flex-1 bg-transparent px-2 py-3.5 text-[16px] outline-none" />
        </div>
        <span className="mt-2 block text-[13px] text-[#A08A79]">3–24 characters: letters, numbers and underscores.</span>
      </label>
      <label className="mt-6 block">
        <span className="text-[12px] font-semibold tracking-[0.24em] text-[#A77B4D]">ABOUT YOU</span>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={3} placeholder="Your favourite blend, your daily ritual…" className="mt-3 w-full border border-[#DCCAB5] bg-white px-4 py-3.5 text-[16px] leading-7 outline-none focus:border-[#B28B4E]" />
      </label>
      {msg && <p className={`mt-4 text-[14px] ${msg.ok ? "text-[#3E5B2E]" : "text-[#9A2E3E]"}`}>{msg.text}</p>}
      <button type="submit" disabled={busy} className="mt-6 bg-[#481D30] px-8 py-4 text-[12px] font-semibold tracking-[0.22em] text-white hover:bg-[#792D49] disabled:opacity-50">
        SAVE PROFILE
      </button>
    </form>
  );
}

function ProfileView() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [p, setP] = useState<Profile | null | undefined>(undefined);
  const [tab, setTab] = useState<"posts" | "answers">("posts");
  const [editing, setEditing] = useState(false);

  const load = useCallback(() => {
    community
      .profile(decodeURIComponent(username))
      .then(setP)
      .catch(() => setP(null));
  }, [username]);

  useEffect(() => {
    load();
  }, [load, user]);

  if (p === undefined) return <div className="h-[60vh] animate-pulse bg-[#2A0010]" />;
  if (p === null)
    return (
      <div className="mx-auto max-w-[720px] px-6 py-32 text-center">
        <p className="font-display text-[44px] leading-tight text-[#2E1A20]">Member not found.</p>
        <Link href="/journal" className="mt-8 inline-block bg-[#481D30] px-8 py-4 text-[12px] font-semibold tracking-[0.22em] text-white">
          BACK TO THE COMMUNITY
        </Link>
      </div>
    );

  return (
    <>
      <section className="relative overflow-hidden bg-[#2A0010] text-[#F7F0E6]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_120%_at_85%_0%,#70243F_0%,#390014_45%,#26000D_100%)]" />
        <div className="relative mx-auto flex max-w-[1100px] flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:px-12 md:py-20">
          <div className="rounded-full p-1 ring-1 ring-[#C9A15C]/60">
            <Avatar author={p} size={112} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold tracking-[0.28em] text-[#D6A64F]">{p.is_admin ? "SEVOURA TEAM" : "COMMUNITY MEMBER"}</p>
            <h1 className="mt-3 break-words font-display text-[clamp(2.4rem,5vw,3.8rem)] font-medium leading-[1.05]">{p.name}</h1>
            <p className="mt-2 text-[15px] text-[#C9AFA2]">
              @{p.username} · Joined {formatDate(p.joined_at)}
            </p>
            {p.bio && <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-[#E8D7C8]">{p.bio}</p>}
          </div>
          <dl className="grid grid-cols-3 gap-px self-start border border-[#C9A15C]/30 bg-[#C9A15C]/30 md:self-center">
            {[
              ["Posts", p.stats.questions],
              ["Answers", p.stats.answers],
              ["Upvotes", p.stats.upvotes],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#2E0614] px-5 py-4 text-center md:px-7">
                <dd className="font-display text-[34px] leading-none text-[#F0D69A]">{v}</dd>
                <dt className="mt-2 text-[11px] font-semibold tracking-[0.2em] text-[#C9AFA2]">{String(k).toUpperCase()}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-12 md:px-12 md:py-16">
        {p.is_me && (
          <div className="mb-12">
            {editing ? (
              <Editor
                p={p}
                onSaved={(u) => {
                  setEditing(false);
                  if (u !== p.username) router.replace(`/journal/u/${u}`);
                  else load();
                }}
              />
            ) : (
              <button type="button" onClick={() => setEditing(true)} className="border border-[#481D30] px-7 py-3.5 text-[12px] font-semibold tracking-[0.22em] text-[#481D30] transition-colors hover:bg-[#481D30] hover:text-white">
                EDIT PROFILE
              </button>
            )}
          </div>
        )}

        <div role="tablist" className="flex gap-8 border-b border-[#DCCAB5]">
          {(
            [
              ["posts", `Posts (${p.stats.questions})`],
              ["answers", `Answers (${p.stats.answers})`],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`-mb-px border-b-2 pb-4 text-[14px] font-semibold tracking-[0.16em] transition-colors ${tab === k ? "border-[#792D49] text-[#481D30]" : "border-transparent text-[#8A766A] hover:text-[#481D30]"}`}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "posts" ? (
          p.questions.length ? (
            <div>
              {p.questions.map((q, i) => (
                <QuestionCard key={q.id} q={q} index={i} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-[16px] text-[#8A766A]">No posts yet.</p>
          )
        ) : p.answers.length ? (
          <ul className="divide-y divide-[#E2D4C2]">
            {p.answers.map((a) => (
              <li key={a.id} className="py-8">
                <Link href={`/journal/q/${a.question_id}#answer-${a.id}`} className="font-display text-[24px] leading-snug text-[#2E1A20] hover:text-[#792D49]">
                  {a.question_title}
                </Link>
                {a.is_official && (
                  <div className="mt-3">
                    <OfficialBadge compact />
                  </div>
                )}
                <p className="mt-3 text-[16px] leading-7 text-[#5A4A44]">{a.excerpt}</p>
                <p className="mt-3 text-[13px] text-[#8A766A]">
                  {a.vote_score} {a.vote_score === 1 ? "upvote" : "upvotes"} · {formatDate(a.created_at)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center text-[16px] text-[#8A766A]">No answers yet.</p>
        )}
      </section>
    </>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#F7F0E6] text-[#3A2228]">
      <SiteHeader />
      <Suspense fallback={<div className="h-[60vh] bg-[#2A0010]" />}>
        <ProfileView />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
