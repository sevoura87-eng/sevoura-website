-- =====================================================================
-- SEVOURA Journal — community questions & answers
--  * every table has RLS on and NO direct grants: all reads/writes go through
--    SECURITY DEFINER functions that check auth.uid(), ownership and admin rights
--  * public author data is limited to username, display name, avatar, bio, admin badge
--    (email / phone never leave the profiles table)
--  * content is stored as plain text and rendered as text (no HTML)
-- =====================================================================

-- ---------- profile extensions ----------
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists community_restricted boolean not null default false;
alter table public.profiles add column if not exists community_restricted_reason text;
create unique index if not exists profiles_username_key on public.profiles (lower(username));

-- ---------- tables ----------
create table if not exists public.community_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),
  name        text not null check (char_length(name) between 2 and 60),
  description text check (char_length(description) <= 240),
  sort_order  int not null default 100,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.community_questions (
  id               uuid primary key default gen_random_uuid(),
  author_id        uuid not null references public.profiles(id) on delete cascade,
  kind             text not null default 'question' check (kind in ('question', 'experience')),
  title            text not null check (char_length(title) between 8 and 200),
  body             text not null default '' check (char_length(body) <= 6000),
  category_id      uuid references public.community_categories(id) on delete set null,
  tags             text[] not null default '{}',
  status           text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  is_pinned        boolean not null default false,
  vote_score       int not null default 0,
  answer_count     int not null default 0,
  view_count       int not null default 0,
  last_activity_at timestamptz not null default now(),
  edited_at        timestamptz,
  created_at       timestamptz not null default now()
);
create index if not exists cq_feed_idx on public.community_questions (status, is_pinned desc, last_activity_at desc);
create index if not exists cq_author_idx on public.community_questions (author_id);
create index if not exists cq_category_idx on public.community_questions (category_id);
create index if not exists cq_tags_idx on public.community_questions using gin (tags);

create table if not exists public.community_answers (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.community_questions(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null check (char_length(body) between 2 and 8000),
  is_official boolean not null default false,
  status      text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  vote_score  int not null default 0,
  edited_at   timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists ca_question_idx on public.community_answers (question_id, status);
create index if not exists ca_author_idx on public.community_answers (author_id);

create table if not exists public.community_comments (
  id         uuid primary key default gen_random_uuid(),
  answer_id  uuid not null references public.community_answers(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  status     text not null default 'published' check (status in ('published', 'hidden', 'removed')),
  created_at timestamptz not null default now()
);
create index if not exists cc_answer_idx on public.community_comments (answer_id);

create table if not exists public.community_votes (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('question', 'answer')),
  target_id   uuid not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);
create index if not exists cv_target_idx on public.community_votes (target_type, target_id);

create table if not exists public.community_reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('question', 'answer', 'comment')),
  target_id   uuid not null,
  reason      text not null check (reason in ('spam', 'abuse', 'off_topic', 'misinformation', 'other')),
  details     text check (char_length(details) <= 600),
  status      text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);
create index if not exists cr_status_idx on public.community_reports (status, created_at desc);

alter table public.community_categories enable row level security;
alter table public.community_questions  enable row level security;
alter table public.community_answers    enable row level security;
alter table public.community_comments   enable row level security;
alter table public.community_votes      enable row level security;
alter table public.community_reports    enable row level security;
revoke all on public.community_categories, public.community_questions, public.community_answers,
              public.community_comments, public.community_votes, public.community_reports from anon, authenticated;

-- ---------- helpers ----------
create or replace function public.community_author(p_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', p.id,
    'username', p.username,
    'name', coalesce(nullif(p.full_name, ''), p.username, 'Member'),
    'avatar_url', p.avatar_url,
    'is_admin', p.role = 'admin'
  ) from public.profiles p where p.id = p_id;
$$;

/* make sure the signed-in member has a username (derived from their name/email) */
create or replace function public.community_ensure_username(p_uid uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_name text; v_base text; v_try text; n int := 0;
begin
  select username into v_name from public.profiles where id = p_uid;
  if v_name is not null then return v_name; end if;
  select lower(regexp_replace(coalesce(nullif(full_name, ''), split_part(email, '@', 1), 'member'), '[^a-zA-Z0-9]+', '', 'g'))
    into v_base from public.profiles where id = p_uid;
  v_base := left(coalesce(nullif(v_base, ''), 'member'), 18);
  if char_length(v_base) < 3 then v_base := v_base || 'member'; end if;
  v_try := v_base;
  while exists (select 1 from public.profiles where lower(username) = v_try) loop
    n := n + 1;
    v_try := v_base || (floor(random() * 9000) + 1000)::int::text;
    exit when n > 20;
  end loop;
  update public.profiles set username = v_try where id = p_uid;
  return v_try;
end $$;

/* guard for every community write */
create or replace function public.community_assert_member()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_p public.profiles;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  select * into v_p from public.profiles where id = v_uid;
  if not found then raise exception 'not_authenticated'; end if;
  if v_p.account_status = 'suspended' or v_p.community_restricted then raise exception 'community_restricted'; end if;
  return v_uid;
end $$;

create or replace function public.community_clean_tags(p_tags text[])
returns text[] language sql immutable as $$
  select coalesce(array_agg(distinct t) filter (where t <> ''), '{}')
  from (select left(lower(regexp_replace(trim(x), '[^a-zA-Z0-9 -]', '', 'g')), 24) t from unnest(coalesce(p_tags, '{}')) x limit 5) s;
$$;

-- ---------- public reads ----------
create or replace function public.community_categories_list()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'slug', c.slug, 'name', c.name, 'description', c.description,
    'count', (select count(*) from public.community_questions q where q.category_id = c.id and q.status = 'published')
  ) order by c.sort_order, c.name), '[]'::jsonb)
  from public.community_categories c where c.is_active;
$$;

create or replace function public.community_question_card(q public.community_questions)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', q.id, 'kind', q.kind, 'title', q.title,
    'excerpt', left(regexp_replace(q.body, '\s+', ' ', 'g'), 260),
    'tags', q.tags, 'is_pinned', q.is_pinned, 'vote_score', q.vote_score,
    'answer_count', q.answer_count, 'view_count', q.view_count,
    'created_at', q.created_at, 'last_activity_at', q.last_activity_at,
    'author', public.community_author(q.author_id),
    'category', (select jsonb_build_object('slug', c.slug, 'name', c.name) from public.community_categories c where c.id = q.category_id),
    'has_official', exists (select 1 from public.community_answers a where a.question_id = q.id and a.is_official and a.status = 'published'),
    'top_answer', (select jsonb_build_object('id', a.id, 'excerpt', left(regexp_replace(a.body, '\s+', ' ', 'g'), 220), 'vote_score', a.vote_score,
                    'is_official', a.is_official, 'author', public.community_author(a.author_id))
                   from public.community_answers a where a.question_id = q.id and a.status = 'published'
                   order by a.is_official desc, a.vote_score desc, a.created_at limit 1),
    'voted', exists (select 1 from public.community_votes v where v.user_id = auth.uid() and v.target_type = 'question' and v.target_id = q.id)
  );
$$;

create or replace function public.community_feed(
  p_sort text default 'latest', p_category text default null, p_search text default null,
  p_kind text default null, p_tag text default null, p_limit int default 20, p_offset int default 0
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb; v_total int;
begin
  with base as (
    select q.* from public.community_questions q
    left join public.community_categories c on c.id = q.category_id
    where q.status = 'published'
      and (p_category is null or c.slug = p_category)
      and (p_kind is null or q.kind = p_kind)
      and (p_tag is null or lower(p_tag) = any (q.tags))
      and (p_search is null or p_search = '' or q.title ilike '%' || p_search || '%' or q.body ilike '%' || p_search || '%'
           or exists (select 1 from public.community_answers a where a.question_id = q.id and a.status = 'published' and a.body ilike '%' || p_search || '%'))
      and (p_sort <> 'unanswered' or q.answer_count = 0)
  ), ordered as (
    select b.id, count(*) over () total, row_number() over (order by
      case when p_sort = 'latest' then b.is_pinned end desc nulls last,
      case when p_sort = 'popular' then b.vote_score * 2 + b.answer_count * 3 + b.view_count / 25 end desc nulls last,
      case when p_sort = 'trending' then (b.vote_score * 2 + b.answer_count * 3 + b.view_count / 25 + 1)
                                          / power(extract(epoch from now() - b.last_activity_at) / 3600 + 2, 1.3) end desc nulls last,
      case when p_sort = 'helpful' then (select coalesce(max(a.vote_score), -1) from public.community_answers a where a.question_id = b.id and a.status = 'published') end desc nulls last,
      b.last_activity_at desc) ord
    from base b
  )
  select coalesce(jsonb_agg(public.community_question_card(q) order by o.ord), '[]'::jsonb), max(o.total)
    into v, v_total
  from ordered o join public.community_questions q on q.id = o.id
  where o.ord > greatest(p_offset, 0) and o.ord <= greatest(p_offset, 0) + least(greatest(p_limit, 1), 50);
  return jsonb_build_object('items', v, 'total', coalesce(v_total, 0));
end $$;

create or replace function public.community_top_answers(p_limit int default 6)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x order by (x->>'vote_score')::int desc), '[]'::jsonb) from (
    select jsonb_build_object('id', a.id, 'question_id', q.id, 'question_title', q.title,
      'excerpt', left(regexp_replace(a.body, '\s+', ' ', 'g'), 220), 'vote_score', a.vote_score,
      'is_official', a.is_official, 'author', public.community_author(a.author_id)) x
    from public.community_answers a join public.community_questions q on q.id = a.question_id
    where a.status = 'published' and q.status = 'published' and a.vote_score > 0
    order by a.vote_score desc, a.created_at desc limit least(greatest(p_limit, 1), 20)
  ) s;
$$;

create or replace function public.community_stats()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'questions', (select count(*) from public.community_questions where status = 'published' and kind = 'question'),
    'experiences', (select count(*) from public.community_questions where status = 'published' and kind = 'experience'),
    'answers', (select count(*) from public.community_answers where status = 'published'),
    'members', (select count(distinct author_id) from (select author_id from public.community_questions where status = 'published'
                  union all select author_id from public.community_answers where status = 'published') s),
    'tags', (select coalesce(jsonb_agg(jsonb_build_object('tag', t, 'count', n) order by n desc, t), '[]'::jsonb) from (
               select unnest(tags) t, count(*) n from public.community_questions
               where status = 'published' and created_at > now() - interval '60 days' group by 1 order by 2 desc, 1 limit 12) s)
  );
$$;

create or replace function public.community_question(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare q public.community_questions; v_uid uuid := auth.uid(); v_admin boolean := public.is_admin();
begin
  select * into q from public.community_questions where id = p_id;
  if not found then return null; end if;
  if not v_admin and (q.status = 'removed' or (q.status = 'hidden' and q.author_id is distinct from v_uid)) then return null; end if;
  return public.community_question_card(q) || jsonb_build_object(
    'body', q.body, 'status', q.status, 'edited_at', q.edited_at,
    'category_id', q.category_id,
    'is_mine', q.author_id = v_uid,
    'answers', (select coalesce(jsonb_agg(jsonb_build_object(
        'id', a.id, 'body', a.body, 'is_official', a.is_official, 'vote_score', a.vote_score, 'status', a.status,
        'created_at', a.created_at, 'edited_at', a.edited_at, 'author', public.community_author(a.author_id),
        'is_mine', a.author_id = v_uid,
        'voted', exists (select 1 from public.community_votes v where v.user_id = v_uid and v.target_type = 'answer' and v.target_id = a.id),
        'comments', (select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'body', c.body, 'created_at', c.created_at,
                       'author', public.community_author(c.author_id), 'is_mine', c.author_id = v_uid) order by c.created_at), '[]'::jsonb)
                     from public.community_comments c where c.answer_id = a.id and c.status = 'published')
      ) order by a.is_official desc, a.vote_score desc, a.created_at), '[]'::jsonb)
      from public.community_answers a where a.question_id = q.id and (a.status = 'published' or (v_admin and a.status = 'hidden'))),
    'related', (select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'title', r.title, 'answer_count', r.answer_count)), '[]'::jsonb) from (
        select r.id, r.title, r.answer_count from public.community_questions r
        where r.status = 'published' and r.id <> q.id and (r.category_id = q.category_id or r.tags && q.tags)
        order by r.vote_score desc, r.last_activity_at desc limit 5) r)
  );
end $$;

create or replace function public.community_view(p_id uuid)
returns void language sql volatile security definer set search_path = public as $$
  update public.community_questions set view_count = view_count + 1 where id = p_id and status = 'published';
$$;

create or replace function public.community_profile(p_username text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare p public.profiles; v_uid uuid := auth.uid();
begin
  select * into p from public.profiles where lower(username) = lower(p_username);
  if not found then return null; end if;
  return public.community_author(p.id) || jsonb_build_object(
    'bio', p.bio, 'joined_at', p.created_at, 'is_me', p.id = v_uid,
    'stats', jsonb_build_object(
      'questions', (select count(*) from public.community_questions where author_id = p.id and status = 'published'),
      'answers', (select count(*) from public.community_answers where author_id = p.id and status = 'published'),
      'upvotes', (select coalesce(sum(vote_score), 0) from public.community_answers where author_id = p.id and status = 'published')
               + (select coalesce(sum(vote_score), 0) from public.community_questions where author_id = p.id and status = 'published')),
    'questions', (select coalesce(jsonb_agg(public.community_question_card(q) order by q.created_at desc), '[]'::jsonb)
                  from public.community_questions q
                  where q.id in (select id from public.community_questions where author_id = p.id and status = 'published' order by created_at desc limit 30)),
    'answers', (select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'question_id', q.id, 'question_title', q.title,
                  'excerpt', left(regexp_replace(a.body, '\s+', ' ', 'g'), 220), 'vote_score', a.vote_score, 'is_official', a.is_official,
                  'created_at', a.created_at) order by a.created_at desc), '[]'::jsonb)
                from (select * from public.community_answers where author_id = p.id and status = 'published' order by created_at desc limit 30) a
                join public.community_questions q on q.id = a.question_id and q.status = 'published')
  );
end $$;

create or replace function public.community_me()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); p public.profiles;
begin
  if v_uid is null then return null; end if;
  perform public.community_ensure_username(v_uid);
  select * into p from public.profiles where id = v_uid;
  return public.community_author(v_uid) || jsonb_build_object('bio', p.bio, 'restricted', p.community_restricted or p.account_status = 'suspended');
end $$;

-- ---------- member writes ----------
create or replace function public.community_update_profile(p_username text, p_bio text, p_avatar_url text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_u text := lower(trim(p_username));
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  if v_u !~ '^[a-z0-9_]{3,24}$' then raise exception 'invalid_username'; end if;
  if exists (select 1 from public.profiles where lower(username) = v_u and id <> v_uid) then raise exception 'username_taken'; end if;
  if p_avatar_url is not null and p_avatar_url <> '' and p_avatar_url !~ '^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/avatars/' then
    raise exception 'invalid_avatar';
  end if;
  update public.profiles set username = v_u, bio = nullif(left(trim(coalesce(p_bio, '')), 280), ''),
         avatar_url = nullif(p_avatar_url, '') where id = v_uid;
  return public.community_me();
end $$;

create or replace function public.community_ask(p_kind text, p_title text, p_body text, p_category text, p_tags text[])
returns uuid language plpgsql security definer set search_path = public as $$
declare v_uid uuid := public.community_assert_member(); v_id uuid; v_cat uuid;
begin
  if (select count(*) from public.community_questions where author_id = v_uid and created_at > now() - interval '1 hour') >= 6 then
    raise exception 'rate_limited';
  end if;
  select id into v_cat from public.community_categories where slug = p_category and is_active;
  perform public.community_ensure_username(v_uid);
  insert into public.community_questions (author_id, kind, title, body, category_id, tags)
  values (v_uid, case when p_kind = 'experience' then 'experience' else 'question' end, trim(p_title), trim(coalesce(p_body, '')), v_cat, public.community_clean_tags(p_tags))
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.community_update_question(p_id uuid, p_title text, p_body text, p_category text, p_tags text[])
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := public.community_assert_member(); q public.community_questions;
begin
  select * into q from public.community_questions where id = p_id for update;
  if not found or q.status = 'removed' then raise exception 'not_found'; end if;
  if q.author_id <> v_uid and not public.is_admin() then raise exception 'forbidden'; end if;
  update public.community_questions set title = trim(p_title), body = trim(coalesce(p_body, '')),
    category_id = (select id from public.community_categories where slug = p_category),
    tags = public.community_clean_tags(p_tags), edited_at = now() where id = p_id;
end $$;

create or replace function public.community_delete_question(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); q public.community_questions;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  select * into q from public.community_questions where id = p_id for update;
  if not found then raise exception 'not_found'; end if;
  if q.author_id <> v_uid and not public.is_admin() then raise exception 'forbidden'; end if;
  update public.community_questions set status = 'removed', is_pinned = false where id = p_id;
  if q.author_id <> v_uid then
    perform public.log_activity(v_uid, 'community_removed', 'community_question', p_id::text, 'Removed question: ' || left(q.title, 80), '{}'::jsonb);
  end if;
end $$;

create or replace function public.community_refresh_question(p_qid uuid)
returns void language sql security definer set search_path = public as $$
  update public.community_questions set
    answer_count = (select count(*) from public.community_answers where question_id = p_qid and status = 'published'),
    last_activity_at = greatest(created_at, coalesce((select max(created_at) from public.community_answers where question_id = p_qid and status = 'published'), created_at))
  where id = p_qid;
$$;

create or replace function public.community_answer(p_question_id uuid, p_body text, p_official boolean default false)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_uid uuid := public.community_assert_member(); v_id uuid; v_official boolean := coalesce(p_official, false);
begin
  if v_official and not public.is_admin() then raise exception 'forbidden'; end if;
  if not exists (select 1 from public.community_questions where id = p_question_id and status = 'published') then raise exception 'not_found'; end if;
  if (select count(*) from public.community_answers where author_id = v_uid and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'rate_limited';
  end if;
  perform public.community_ensure_username(v_uid);
  insert into public.community_answers (question_id, author_id, body, is_official)
  values (p_question_id, v_uid, trim(p_body), v_official) returning id into v_id;
  perform public.community_refresh_question(p_question_id);
  if v_official then
    perform public.log_activity(v_uid, 'community_official_answer', 'community_question', p_question_id::text, 'Official answer posted', '{}'::jsonb);
  end if;
  return v_id;
end $$;

create or replace function public.community_update_answer(p_id uuid, p_body text)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := public.community_assert_member(); a public.community_answers;
begin
  select * into a from public.community_answers where id = p_id for update;
  if not found or a.status = 'removed' then raise exception 'not_found'; end if;
  if a.author_id <> v_uid and not public.is_admin() then raise exception 'forbidden'; end if;
  update public.community_answers set body = trim(p_body), edited_at = now() where id = p_id;
end $$;

create or replace function public.community_delete_answer(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); a public.community_answers;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  select * into a from public.community_answers where id = p_id for update;
  if not found then raise exception 'not_found'; end if;
  if a.author_id <> v_uid and not public.is_admin() then raise exception 'forbidden'; end if;
  update public.community_answers set status = 'removed' where id = p_id;
  perform public.community_refresh_question(a.question_id);
end $$;

create or replace function public.community_comment(p_answer_id uuid, p_body text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_uid uuid := public.community_assert_member(); v_id uuid;
begin
  if not exists (select 1 from public.community_answers a join public.community_questions q on q.id = a.question_id
                 where a.id = p_answer_id and a.status = 'published' and q.status = 'published') then raise exception 'not_found'; end if;
  if (select count(*) from public.community_comments where author_id = v_uid and created_at > now() - interval '1 hour') >= 40 then
    raise exception 'rate_limited';
  end if;
  perform public.community_ensure_username(v_uid);
  insert into public.community_comments (answer_id, author_id, body) values (p_answer_id, v_uid, trim(p_body)) returning id into v_id;
  return v_id;
end $$;

create or replace function public.community_delete_comment(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); c public.community_comments;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  select * into c from public.community_comments where id = p_id;
  if not found then raise exception 'not_found'; end if;
  if c.author_id <> v_uid and not public.is_admin() then raise exception 'forbidden'; end if;
  update public.community_comments set status = 'removed' where id = p_id;
end $$;

create or replace function public.community_vote(p_type text, p_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_uid uuid := public.community_assert_member(); v_owner uuid; v_voted boolean; v_score int;
begin
  if p_type = 'question' then select author_id into v_owner from public.community_questions where id = p_id and status = 'published';
  elsif p_type = 'answer' then select author_id into v_owner from public.community_answers where id = p_id and status = 'published';
  else raise exception 'invalid_target'; end if;
  if v_owner is null then raise exception 'not_found'; end if;
  if v_owner = v_uid then raise exception 'own_content'; end if;

  if exists (select 1 from public.community_votes where user_id = v_uid and target_type = p_type and target_id = p_id) then
    delete from public.community_votes where user_id = v_uid and target_type = p_type and target_id = p_id;
    v_voted := false;
  else
    insert into public.community_votes (user_id, target_type, target_id) values (v_uid, p_type, p_id);
    v_voted := true;
  end if;
  v_score := (select count(*) from public.community_votes where target_type = p_type and target_id = p_id);
  if p_type = 'question' then update public.community_questions set vote_score = v_score where id = p_id;
  else update public.community_answers set vote_score = v_score where id = p_id; end if;
  return jsonb_build_object('voted', v_voted, 'vote_score', v_score);
end $$;

create or replace function public.community_report(p_type text, p_id uuid, p_reason text, p_details text)
returns void language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid(); v_open int;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  if p_type not in ('question', 'answer', 'comment') then raise exception 'invalid_target'; end if;
  insert into public.community_reports (reporter_id, target_type, target_id, reason, details)
  values (v_uid, p_type, p_id, case when p_reason in ('spam','abuse','off_topic','misinformation') then p_reason else 'other' end, nullif(left(trim(coalesce(p_details, '')), 600), ''))
  on conflict (reporter_id, target_type, target_id) do nothing;
  -- three independent reports hide the content until an admin reviews it
  select count(*) into v_open from public.community_reports where target_type = p_type and target_id = p_id and status = 'open';
  if v_open >= 3 then
    if p_type = 'question' then update public.community_questions set status = 'hidden' where id = p_id and status = 'published';
    elsif p_type = 'answer' then update public.community_answers set status = 'hidden' where id = p_id and status = 'published';
    else update public.community_comments set status = 'hidden' where id = p_id and status = 'published'; end if;
  end if;
end $$;

-- ---------- admin ----------
create or replace function public.admin_community_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return jsonb_build_object(
    'questions', (select count(*) from public.community_questions where status <> 'removed'),
    'hidden', (select count(*) from public.community_questions where status = 'hidden') + (select count(*) from public.community_answers where status = 'hidden'),
    'answers', (select count(*) from public.community_answers where status = 'published'),
    'official_answers', (select count(*) from public.community_answers where status = 'published' and is_official),
    'unanswered', (select count(*) from public.community_questions where status = 'published' and answer_count = 0),
    'open_reports', (select count(*) from public.community_reports where status = 'open'),
    'members', (select count(*) from public.profiles where username is not null),
    'restricted', (select count(*) from public.profiles where community_restricted),
    'questions_7d', (select count(*) from public.community_questions where created_at > now() - interval '7 days'),
    'answers_7d', (select count(*) from public.community_answers where created_at > now() - interval '7 days'),
    'votes_7d', (select count(*) from public.community_votes where created_at > now() - interval '7 days'),
    'by_day', (select coalesce(jsonb_agg(jsonb_build_object('day', d::date, 'questions', qn, 'answers', an) order by d), '[]'::jsonb) from (
        select d, (select count(*) from public.community_questions q where (q.created_at at time zone 'Asia/Kolkata')::date = d::date) qn,
                  (select count(*) from public.community_answers a where (a.created_at at time zone 'Asia/Kolkata')::date = d::date) an
        from generate_series((now() at time zone 'Asia/Kolkata')::date - 13, (now() at time zone 'Asia/Kolkata')::date, interval '1 day') d) s)
  );
end $$;

create or replace function public.admin_community_questions(p_status text default null, p_search text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return (select coalesce(jsonb_agg(public.community_question_card(q) || jsonb_build_object('status', q.status,
            'open_reports', (select count(*) from public.community_reports r where r.target_type = 'question' and r.target_id = q.id and r.status = 'open'))
          order by q.is_pinned desc, q.created_at desc), '[]'::jsonb)
          from public.community_questions q
          where q.id in (select x.id from public.community_questions x
                where (p_status is null or p_status = 'all' or x.status = p_status
                       or (p_status = 'unanswered' and x.status = 'published' and x.answer_count = 0))
                  and (p_search is null or p_search = '' or x.title ilike '%' || p_search || '%')
                order by x.created_at desc limit 200));
end $$;

create or replace function public.admin_community_answers(p_status text default null, p_search text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return (select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'question_id', a.question_id, 'question_title', q.title,
            'body', a.body, 'status', a.status, 'is_official', a.is_official, 'vote_score', a.vote_score, 'created_at', a.created_at,
            'author', public.community_author(a.author_id),
            'open_reports', (select count(*) from public.community_reports r where r.target_type = 'answer' and r.target_id = a.id and r.status = 'open'))
          order by a.created_at desc), '[]'::jsonb)
          from (select * from public.community_answers a
                where (p_status is null or p_status = 'all' or a.status = p_status or (p_status = 'official' and a.is_official))
                  and (p_search is null or p_search = '' or a.body ilike '%' || p_search || '%')
                order by a.created_at desc limit 200) a
          join public.community_questions q on q.id = a.question_id);
end $$;

create or replace function public.admin_community_reports(p_status text default 'open')
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return (select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'target_type', r.target_type, 'target_id', r.target_id,
            'reason', r.reason, 'details', r.details, 'status', r.status, 'created_at', r.created_at,
            'reporter', public.community_author(r.reporter_id),
            'target', case r.target_type
              when 'question' then (select jsonb_build_object('title', q.title, 'body', left(q.body, 400), 'status', q.status, 'question_id', q.id, 'author', public.community_author(q.author_id)) from public.community_questions q where q.id = r.target_id)
              when 'answer' then (select jsonb_build_object('title', q.title, 'body', left(a.body, 400), 'status', a.status, 'question_id', q.id, 'author', public.community_author(a.author_id)) from public.community_answers a join public.community_questions q on q.id = a.question_id where a.id = r.target_id)
              else (select jsonb_build_object('title', q.title, 'body', c.body, 'status', c.status, 'question_id', q.id, 'author', public.community_author(c.author_id)) from public.community_comments c join public.community_answers a on a.id = c.answer_id join public.community_questions q on q.id = a.question_id where c.id = r.target_id)
            end) order by r.created_at desc), '[]'::jsonb)
          from public.community_reports r where p_status is null or p_status = 'all' or r.status = p_status);
end $$;

create or replace function public.admin_community_moderate(p_type text, p_id uuid, p_action text)
returns void language plpgsql security definer set search_path = public as $$
declare v_qid uuid;
begin
  perform public.assert_admin();
  if p_action not in ('publish', 'hide', 'remove', 'pin', 'unpin', 'official', 'unofficial') then raise exception 'invalid_action'; end if;
  if p_type = 'question' then
    if p_action in ('publish', 'hide', 'remove') then
      update public.community_questions set status = case p_action when 'publish' then 'published' when 'hide' then 'hidden' else 'removed' end,
        is_pinned = case when p_action = 'publish' then is_pinned else false end where id = p_id;
    elsif p_action in ('pin', 'unpin') then
      update public.community_questions set is_pinned = (p_action = 'pin') where id = p_id;
    else raise exception 'invalid_action'; end if;
  elsif p_type = 'answer' then
    if p_action in ('publish', 'hide', 'remove') then
      update public.community_answers set status = case p_action when 'publish' then 'published' when 'hide' then 'hidden' else 'removed' end
        where id = p_id returning question_id into v_qid;
      perform public.community_refresh_question(v_qid);
    elsif p_action in ('official', 'unofficial') then
      -- only answers written by an admin can carry the official badge
      update public.community_answers a set is_official = (p_action = 'official')
        where a.id = p_id and (p_action = 'unofficial' or exists (select 1 from public.profiles p where p.id = a.author_id and p.role = 'admin'));
    else raise exception 'invalid_action'; end if;
  elsif p_type = 'comment' and p_action in ('publish', 'hide', 'remove') then
    update public.community_comments set status = case p_action when 'publish' then 'published' when 'hide' then 'hidden' else 'removed' end where id = p_id;
  else raise exception 'invalid_target'; end if;
  perform public.log_activity(auth.uid(), 'community_' || p_action, 'community_' || p_type, p_id::text, 'Community ' || p_type || ': ' || p_action, '{}'::jsonb);
end $$;

create or replace function public.admin_community_resolve_report(p_id uuid, p_action text)
returns void language plpgsql security definer set search_path = public as $$
declare r public.community_reports;
begin
  perform public.assert_admin();
  select * into r from public.community_reports where id = p_id;
  if not found then raise exception 'not_found'; end if;
  if p_action = 'remove_content' then
    perform public.admin_community_moderate(r.target_type, r.target_id, 'remove');
  elsif p_action = 'keep_content' then
    perform public.admin_community_moderate(r.target_type, r.target_id, 'publish');
  elsif p_action <> 'dismiss' then raise exception 'invalid_action'; end if;
  -- close every open report on the same item
  update public.community_reports set status = case when p_action = 'remove_content' then 'resolved' else 'dismissed' end,
    resolved_by = auth.uid(), resolved_at = now()
  where target_type = r.target_type and target_id = r.target_id and status = 'open';
end $$;

create or replace function public.admin_community_category_save(p_id uuid, p_slug text, p_name text, p_description text, p_sort int, p_active boolean)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  perform public.assert_admin();
  if p_id is null then
    insert into public.community_categories (slug, name, description, sort_order, is_active)
    values (lower(trim(p_slug)), trim(p_name), nullif(trim(coalesce(p_description, '')), ''), coalesce(p_sort, 100), coalesce(p_active, true))
    returning id into v_id;
  else
    update public.community_categories set slug = lower(trim(p_slug)), name = trim(p_name), description = nullif(trim(coalesce(p_description, '')), ''),
      sort_order = coalesce(p_sort, sort_order), is_active = coalesce(p_active, is_active) where id = p_id returning id into v_id;
  end if;
  return v_id;
end $$;

create or replace function public.admin_community_categories()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return (select coalesce(jsonb_agg(jsonb_build_object('id', c.id, 'slug', c.slug, 'name', c.name, 'description', c.description,
           'sort_order', c.sort_order, 'is_active', c.is_active,
           'count', (select count(*) from public.community_questions q where q.category_id = c.id and q.status <> 'removed')) order by c.sort_order, c.name), '[]'::jsonb)
          from public.community_categories c);
end $$;

create or replace function public.admin_community_members(p_search text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public.assert_admin();
  return (select coalesce(jsonb_agg(x order by (x->>'activity')::int desc), '[]'::jsonb) from (
    select public.community_author(p.id) || jsonb_build_object('email', p.email, 'restricted', p.community_restricted,
      'restricted_reason', p.community_restricted_reason, 'joined_at', p.created_at,
      'questions', (select count(*) from public.community_questions q where q.author_id = p.id and q.status <> 'removed'),
      'answers', (select count(*) from public.community_answers a where a.author_id = p.id and a.status <> 'removed'),
      'reports_against', (select count(*) from public.community_reports r where r.status <> 'dismissed' and (
          (r.target_type = 'question' and exists (select 1 from public.community_questions q where q.id = r.target_id and q.author_id = p.id)) or
          (r.target_type = 'answer' and exists (select 1 from public.community_answers a where a.id = r.target_id and a.author_id = p.id)))),
      'activity', (select count(*) from public.community_questions q where q.author_id = p.id) + (select count(*) from public.community_answers a where a.author_id = p.id)) x
    from public.profiles p
    where (p.username is not null or p.community_restricted)
      and (p_search is null or p_search = '' or p.username ilike '%' || p_search || '%' or p.email ilike '%' || p_search || '%' or p.full_name ilike '%' || p_search || '%')
    limit 300) s);
end $$;

create or replace function public.admin_community_restrict(p_user_id uuid, p_restricted boolean, p_reason text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public.assert_admin();
  if p_user_id = auth.uid() then raise exception 'cannot_restrict_self'; end if;
  if exists (select 1 from public.profiles where id = p_user_id and role = 'admin') then raise exception 'cannot_restrict_admin'; end if;
  update public.profiles set community_restricted = p_restricted,
    community_restricted_reason = case when p_restricted then nullif(left(trim(coalesce(p_reason, '')), 200), '') else null end
  where id = p_user_id;
  perform public.log_activity(auth.uid(), case when p_restricted then 'community_user_restricted' else 'community_user_unrestricted' end,
    'profile', p_user_id::text, case when p_restricted then 'Member restricted from the community' else 'Member restriction lifted' end,
    jsonb_build_object('reason', p_reason));
end $$;

-- ---------- grants ----------
do $$
declare f text;
begin
  foreach f in array array[
    'community_author(uuid)', 'community_ensure_username(uuid)', 'community_assert_member()', 'community_question_card(public.community_questions)',
    'community_refresh_question(uuid)'
  ] loop
    execute format('revoke execute on function public.%s from public, anon, authenticated', f);
  end loop;
  foreach f in array array[
    'community_categories_list()', 'community_feed(text, text, text, text, text, int, int)', 'community_top_answers(int)',
    'community_stats()', 'community_question(uuid)', 'community_view(uuid)', 'community_profile(text)'
  ] loop
    execute format('revoke execute on function public.%s from public', f);
    execute format('grant execute on function public.%s to anon, authenticated', f);
  end loop;
  foreach f in array array[
    'community_me()', 'community_update_profile(text, text, text)', 'community_ask(text, text, text, text, text[])',
    'community_update_question(uuid, text, text, text, text[])', 'community_delete_question(uuid)',
    'community_answer(uuid, text, boolean)', 'community_update_answer(uuid, text)', 'community_delete_answer(uuid)',
    'community_comment(uuid, text)', 'community_delete_comment(uuid)', 'community_vote(text, uuid)',
    'community_report(text, uuid, text, text)',
    'admin_community_overview()', 'admin_community_questions(text, text)', 'admin_community_answers(text, text)',
    'admin_community_reports(text)', 'admin_community_moderate(text, uuid, text)', 'admin_community_resolve_report(uuid, text)',
    'admin_community_category_save(uuid, text, text, text, int, boolean)', 'admin_community_categories()',
    'admin_community_members(text)', 'admin_community_restrict(uuid, boolean, text)'
  ] loop
    execute format('revoke execute on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;

-- ---------- avatars bucket (public read; members write only inside their own folder) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "avatars_insert_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatars_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatars_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------- starting categories (structure, not content) ----------
insert into public.community_categories (slug, name, description, sort_order) values
  ('the-seven-blends', 'The Seven Blends', 'Questions about each day''s blend, its notes and how it wears.', 10),
  ('rituals', 'Rituals & Routines', 'How you use SEVOURA through the week.', 20),
  ('fragrance-notes', 'Fragrance Notes', 'Ingredients, accords and how scent works.', 30),
  ('reviews', 'Reviews & Experiences', 'Share how a blend made you feel.', 40),
  ('gifting', 'Gifting', 'Choosing SEVOURA for someone else.', 50),
  ('orders-delivery', 'Orders & Delivery', 'Shipping, payments and order questions.', 60)
on conflict (slug) do nothing;
