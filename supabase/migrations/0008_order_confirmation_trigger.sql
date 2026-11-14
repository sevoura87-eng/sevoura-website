-- 0008 — send the order confirmation from the database, independent of the web host
-- When an order's payment_status becomes 'paid' (checkout verification, webhook or admin), the
-- order-confirmation Edge Function is called asynchronously. Every 15 minutes a retry sweep
-- re-attempts confirmations that failed. Duplicates are impossible: email_claim() (0007) lets
-- each order's confirmation through once.

create extension if not exists pg_net;
create extension if not exists pg_cron;

-- orders whose confirmation still needs sending: paid, not cancelled, recent, and either never
-- attempted or failed (≤ 20 attempts). Orders from before this system existed are never emailed.
create or replace function public.email_confirmations_due()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select o.id
    from public.orders o
    left join public.email_log l on l.kind = 'order_confirmation' and l.ref_id = o.id::text
   where o.payment_status = 'paid'
     and o.status <> 'cancelled'
     and o.created_at >= timestamptz '2026-11-14 00:00:00+05:30'
     and o.updated_at >= now() - interval '3 days'
     and (l.id is null
          or (l.status = 'failed' and l.attempts < 20)
          or (l.status = 'sending' and l.updated_at < now() - interval '10 minutes'))
   order by o.created_at
   limit 25;
$$;
revoke all on function public.email_confirmations_due() from public, anon, authenticated;
grant execute on function public.email_confirmations_due() to service_role;

create or replace function public.orders_send_confirmation()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(
    url     := 'https://igvkiplyqcookmgjqnus.supabase.co/functions/v1/order-confirmation',
    body    := jsonb_build_object('order_id', new.id),
    headers := jsonb_build_object('Content-Type', 'application/json'),
    timeout_milliseconds := 15000
  );
  return new;
exception when others then
  -- an email problem must never block the payment update
  raise warning 'order confirmation trigger: %', sqlerrm;
  return new;
end $$;
revoke all on function public.orders_send_confirmation() from public, anon, authenticated;

drop trigger if exists orders_send_confirmation on public.orders;
create trigger orders_send_confirmation
  after insert or update of payment_status on public.orders
  for each row
  when (new.payment_status = 'paid')
  execute function public.orders_send_confirmation();

-- retry sweep
select cron.unschedule(jobid) from cron.job where jobname = 'email-confirmation-retry';
select cron.schedule(
  'email-confirmation-retry',
  '*/15 * * * *',
  $cron$
    select net.http_post(
      url     := 'https://igvkiplyqcookmgjqnus.supabase.co/functions/v1/order-confirmation',
      body    := '{"sweep": true}'::jsonb,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      timeout_milliseconds := 60000
    )
    where exists (select 1 from public.email_confirmations_due());
  $cron$
);
