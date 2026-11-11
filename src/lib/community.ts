"use client";

import { getSupabase } from "@/lib/supabase/client";

/** Typed wrappers around the community database functions (supabase/migrations/0006_community.sql). */

export type Author = { id: string; username: string | null; name: string; avatar_url: string | null; is_admin: boolean };
export type Category = { id: string; slug: string; name: string; description: string | null; count: number };
export type Kind = "question" | "experience";

export type QuestionCard = {
  id: string;
  kind: Kind;
  title: string;
  excerpt: string;
  tags: string[];
  is_pinned: boolean;
  vote_score: number;
  answer_count: number;
  view_count: number;
  created_at: string;
  last_activity_at: string;
  author: Author;
  category: { slug: string; name: string } | null;
  has_official: boolean;
  voted: boolean;
  top_answer: { id: string; excerpt: string; vote_score: number; is_official: boolean; author: Author } | null;
};

export type Comment = { id: string; body: string; created_at: string; author: Author; is_mine: boolean };
export type Answer = {
  id: string;
  body: string;
  is_official: boolean;
  vote_score: number;
  status: string;
  created_at: string;
  edited_at: string | null;
  author: Author;
  is_mine: boolean;
  voted: boolean;
  comments: Comment[];
};
export type QuestionDetail = QuestionCard & {
  body: string;
  status: string;
  edited_at: string | null;
  category_id: string | null;
  is_mine: boolean;
  answers: Answer[];
  related: { id: string; title: string; answer_count: number }[];
};
export type TopAnswer = {
  id: string;
  question_id: string;
  question_title: string;
  excerpt: string;
  vote_score: number;
  is_official: boolean;
  author: Author;
};
export type Stats = { questions: number; experiences: number; answers: number; members: number; tags: { tag: string; count: number }[] };
export type Me = Author & { bio: string | null; restricted: boolean };
export type Profile = Author & {
  bio: string | null;
  joined_at: string;
  is_me: boolean;
  stats: { questions: number; answers: number; upvotes: number };
  questions: QuestionCard[];
  answers: { id: string; question_id: string; question_title: string; excerpt: string; vote_score: number; is_official: boolean; created_at: string }[];
};

export type Sort = "latest" | "popular" | "trending" | "helpful" | "unanswered";

function sb() {
  const c = getSupabase();
  if (!c) throw new Error("The community is not connected yet.");
  return c;
}

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await sb().rpc(fn, args ?? {});
  if (error) throw error;
  return data as T;
}

export const community = {
  feed: (o: { sort?: Sort; category?: string | null; search?: string | null; kind?: Kind | null; tag?: string | null; limit?: number; offset?: number }) =>
    rpc<{ items: QuestionCard[]; total: number }>("community_feed", {
      p_sort: o.sort ?? "latest",
      p_category: o.category || null,
      p_search: o.search?.trim() || null,
      p_kind: o.kind || null,
      p_tag: o.tag || null,
      p_limit: o.limit ?? 15,
      p_offset: o.offset ?? 0,
    }),
  categories: () => rpc<Category[]>("community_categories_list"),
  topAnswers: (limit = 5) => rpc<TopAnswer[]>("community_top_answers", { p_limit: limit }),
  stats: () => rpc<Stats>("community_stats"),
  question: (id: string) => rpc<QuestionDetail | null>("community_question", { p_id: id }),
  view: (id: string) => rpc<null>("community_view", { p_id: id }),
  profile: (username: string) => rpc<Profile | null>("community_profile", { p_username: username }),
  me: () => rpc<Me | null>("community_me"),
  updateProfile: (username: string, bio: string, avatarUrl: string | null) =>
    rpc<Me>("community_update_profile", { p_username: username, p_bio: bio, p_avatar_url: avatarUrl ?? "" }),
  ask: (kind: Kind, title: string, body: string, category: string, tags: string[]) =>
    rpc<string>("community_ask", { p_kind: kind, p_title: title, p_body: body, p_category: category, p_tags: tags }),
  updateQuestion: (id: string, title: string, body: string, category: string, tags: string[]) =>
    rpc<null>("community_update_question", { p_id: id, p_title: title, p_body: body, p_category: category, p_tags: tags }),
  deleteQuestion: (id: string) => rpc<null>("community_delete_question", { p_id: id }),
  answer: (questionId: string, body: string, official = false) =>
    rpc<string>("community_answer", { p_question_id: questionId, p_body: body, p_official: official }),
  updateAnswer: (id: string, body: string) => rpc<null>("community_update_answer", { p_id: id, p_body: body }),
  deleteAnswer: (id: string) => rpc<null>("community_delete_answer", { p_id: id }),
  comment: (answerId: string, body: string) => rpc<string>("community_comment", { p_answer_id: answerId, p_body: body }),
  deleteComment: (id: string) => rpc<null>("community_delete_comment", { p_id: id }),
  vote: (type: "question" | "answer", id: string) => rpc<{ voted: boolean; vote_score: number }>("community_vote", { p_type: type, p_id: id }),
  report: (type: "question" | "answer" | "comment", id: string, reason: string, details: string) =>
    rpc<null>("community_report", { p_type: type, p_id: id, p_reason: reason, p_details: details }),

  /** Upload a profile photo into avatars/<uid>/…; returns its public URL. */
  async uploadAvatar(file: File, uid: string) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 2 * 1024 * 1024) throw new Error("invalid_avatar");
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${uid}/avatar-${Date.now()}.${ext}`;
    const { error } = await sb().storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" });
    if (error) throw error;
    return sb().storage.from("avatars").getPublicUrl(path).data.publicUrl;
  },
};

export const SORTS: { key: Sort; label: string }[] = [
  { key: "latest", label: "Latest" },
  { key: "trending", label: "Trending" },
  { key: "popular", label: "Popular" },
  { key: "helpful", label: "Most helpful" },
  { key: "unanswered", label: "Unanswered" },
];

export const REPORT_REASONS = [
  { key: "spam", label: "Spam or advertising" },
  { key: "abuse", label: "Abusive or offensive" },
  { key: "off_topic", label: "Off topic" },
  { key: "misinformation", label: "Misleading information" },
  { key: "other", label: "Something else" },
];
