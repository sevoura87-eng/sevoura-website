-- 0007 — transactional email delivery log
-- One row per (kind, reference). The unique key is what guarantees an order confirmation is sent at
-- most once, even when the checkout verification and the Razorpay webhook both confirm the payment.
-- Only the server (service role) writes here; admins can read it.

create table if not exists public.email_log (
  id           bigint generated always as identity primary key,
  kind         text not null,                 -- e.g. 'order_confirmation'
  ref_id       text not null,                 -- e.g. the order id
  to_email     text not null,
  status       text not null default 'sending' check (status in ('sending', 'sent', 'failed', 'skipped')),
  provider_id  text,                          -- message id returned by the email provider
  error        text,
  attempts     integer not null default 1,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  sent_at      timestamptz,
  unique (kind, ref_id)
);

alter table public.email_log enable row level security;

drop policy if exists email_log_admin_read on public.email_log;
create policy email_log_admin_read on public.email_log for select using (public.is_admin());

-- Claim the right to send. Returns the log id, or null when this email was already sent
-- (or is being sent right now by another request). A failed attempt, or one stuck in
-- 'sending' for over 10 minutes, can be claimed again so a later trigger retries it.
create or replace function public.email_claim(p_kind text, p_ref_id text, p_to text)
returns bigint
language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  insert into public.email_log (kind, ref_id, to_email)
  values (p_kind, p_ref_id, p_to)
  on conflict (kind, ref_id) do update
     set status = 'sending', to_email = excluded.to_email, error = null,
         attempts = email_log.attempts + 1, updated_at = now()
   where email_log.status = 'failed'
      or (email_log.status = 'sending' and email_log.updated_at < now() - interval '10 minutes')
  returning id into v_id;
  return v_id;  -- null => nothing to do
end $$;

create or replace function public.email_mark(p_id bigint, p_status text, p_provider_id text default null, p_error text default null)
returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.email_log
     set status = p_status,
         provider_id = coalesce(p_provider_id, provider_id),
         error = left(p_error, 500),
         sent_at = case when p_status = 'sent' then now() else sent_at end,
         updated_at = now()
   where id = p_id;
end $$;

revoke all on function public.email_claim(text, text, text) from public, anon, authenticated;
revoke all on function public.email_mark(bigint, text, text, text) from public, anon, authenticated;
grant execute on function public.email_claim(text, text, text) to service_role;
grant execute on function public.email_mark(bigint, text, text, text) to service_role;
