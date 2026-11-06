-- =====================================================================
-- SEVOURA — Razorpay payments
--  * one Razorpay order per SEVOURA order (retries reuse it → no double charge)
--  * atomic, idempotent status changes; callable ONLY by the server (service_role)
--  * an order becomes PAID only through rzp_mark_paid(), after the server has
--    verified the Razorpay signature and the captured amount
-- =====================================================================

create unique index if not exists payments_one_razorpay_order_per_order
  on public.payments (order_id) where provider = 'razorpay';

-- Register (or reuse) the Razorpay order for a SEVOURA order.
create or replace function public.rzp_attach_order(
  p_order_id uuid, p_user_id uuid, p_rzp_order_id text, p_amount_paise integer
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_order public.orders;
  v_pay   public.payments;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found or v_order.user_id is distinct from p_user_id then raise exception 'order_not_found'; end if;
  if v_order.status = 'cancelled' then raise exception 'order_not_payable'; end if;
  if v_order.payment_status in ('paid', 'refunded') then raise exception 'order_already_paid'; end if;
  if p_amount_paise <> v_order.total_paise then raise exception 'amount_mismatch'; end if;

  select * into v_pay from public.payments where order_id = p_order_id and provider = 'razorpay';
  if found then
    return jsonb_build_object('razorpay_order_id', v_pay.provider_order_id, 'reused', true);
  end if;

  insert into public.payments (order_id, provider, provider_order_id, amount_paise, status)
  values (p_order_id, 'razorpay', p_rzp_order_id, v_order.total_paise, 'pending');
  return jsonb_build_object('razorpay_order_id', p_rzp_order_id, 'reused', false);
end $$;

-- Existing Razorpay order for a SEVOURA order (so the server can skip creating a new one)
create or replace function public.rzp_existing_order(p_order_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select provider_order_id from public.payments where order_id = p_order_id and provider = 'razorpay';
$$;

-- Mark PAID — only after signature + amount verification on the server. Idempotent.
create or replace function public.rzp_mark_paid(
  p_rzp_order_id text, p_rzp_payment_id text, p_amount_paise integer,
  p_signature text, p_source text, p_raw jsonb default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_pay   public.payments;
  v_order public.orders;
begin
  select * into v_pay from public.payments where provider_order_id = p_rzp_order_id for update;
  if not found then raise exception 'payment_not_found'; end if;
  select * into v_order from public.orders where id = v_pay.order_id for update;

  if v_pay.status = 'paid' then
    return jsonb_build_object('order_id', v_order.id, 'already_paid', true);
  end if;
  if p_amount_paise <> v_pay.amount_paise or p_amount_paise <> v_order.total_paise then
    perform public.log_activity(null, 'payment_amount_mismatch', 'order', v_order.id::text,
      'Payment amount mismatch on ' || v_order.order_number,
      jsonb_build_object('expected', v_order.total_paise, 'received', p_amount_paise, 'payment_id', p_rzp_payment_id));
    raise exception 'amount_mismatch';
  end if;

  update public.payments
     set status = 'paid', provider_payment_id = p_rzp_payment_id,
         provider_signature = coalesce(p_signature, provider_signature),
         failure_reason = null, raw = coalesce(p_raw, raw)
   where id = v_pay.id;
  update public.orders set payment_status = 'paid' where id = v_order.id;

  perform public.log_activity(v_order.user_id, 'payment_captured', 'order', v_order.id::text,
    'Payment received for ' || v_order.order_number,
    jsonb_build_object('amount_paise', p_amount_paise, 'payment_id', p_rzp_payment_id, 'source', p_source,
                       'order_cancelled', v_order.status = 'cancelled'));
  return jsonb_build_object('order_id', v_order.id, 'already_paid', false);
end $$;

-- Payment authorised but not yet captured (shown as "Payment Pending")
create or replace function public.rzp_mark_authorized(p_rzp_order_id text, p_rzp_payment_id text)
returns void language plpgsql security definer set search_path = public as $$
declare v_pay public.payments;
begin
  select * into v_pay from public.payments where provider_order_id = p_rzp_order_id for update;
  if not found or v_pay.status = 'paid' then return; end if;
  update public.payments set status = 'authorized', provider_payment_id = p_rzp_payment_id where id = v_pay.id;
  update public.orders set payment_status = 'authorized' where id = v_pay.order_id and payment_status <> 'paid';
end $$;

-- Failed attempt — never overrides a successful payment. The customer can retry.
create or replace function public.rzp_mark_failed(
  p_rzp_order_id text, p_rzp_payment_id text, p_reason text, p_raw jsonb default null
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_pay   public.payments;
  v_order public.orders;
begin
  select * into v_pay from public.payments where provider_order_id = p_rzp_order_id for update;
  if not found or v_pay.status in ('paid', 'authorized') then return; end if;
  select * into v_order from public.orders where id = v_pay.order_id for update;
  update public.payments
     set status = 'failed', provider_payment_id = p_rzp_payment_id,
         failure_reason = left(p_reason, 300), raw = coalesce(p_raw, raw)
   where id = v_pay.id;
  update public.orders set payment_status = 'failed' where id = v_order.id and payment_status <> 'paid';
  perform public.log_activity(v_order.user_id, 'payment_failed', 'order', v_order.id::text,
    'Payment failed for ' || v_order.order_number, jsonb_build_object('payment_id', p_rzp_payment_id, 'reason', left(p_reason, 300)));
end $$;

-- Lock everything down: no browser role may call these.
revoke execute on function public.rzp_attach_order(uuid, uuid, text, integer) from public, anon, authenticated;
revoke execute on function public.rzp_existing_order(uuid) from public, anon, authenticated;
revoke execute on function public.rzp_mark_paid(text, text, integer, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.rzp_mark_authorized(text, text) from public, anon, authenticated;
revoke execute on function public.rzp_mark_failed(text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.rzp_attach_order(uuid, uuid, text, integer) to service_role;
grant execute on function public.rzp_existing_order(uuid) to service_role;
grant execute on function public.rzp_mark_paid(text, text, integer, text, text, jsonb) to service_role;
grant execute on function public.rzp_mark_authorized(text, text) to service_role;
grant execute on function public.rzp_mark_failed(text, text, text, jsonb) to service_role;

-- ---------------------------------------------------------------------
-- Webhook de-duplication: Razorpay may deliver the same event more than once.
-- Each x-razorpay-event-id is recorded after it has been processed and skipped if seen again.
-- ---------------------------------------------------------------------
create table if not exists public.payment_webhook_events (
  event_id        text primary key,
  event           text not null,
  rzp_order_id    text,
  rzp_payment_id  text,
  received_at     timestamptz not null default now()
);
alter table public.payment_webhook_events enable row level security;
drop policy if exists pwe_admin_select on public.payment_webhook_events;
create policy pwe_admin_select on public.payment_webhook_events for select to authenticated using ((select public.is_admin()));
revoke all on public.payment_webhook_events from anon, authenticated;
grant select on public.payment_webhook_events to authenticated;
grant all on public.payment_webhook_events to service_role;

create or replace function public.rzp_event_seen(p_event_id text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.payment_webhook_events where event_id = p_event_id);
$$;
create or replace function public.rzp_record_event(p_event_id text, p_event text, p_order text, p_payment text)
returns void language sql security definer set search_path = public as $$
  insert into public.payment_webhook_events (event_id, event, rzp_order_id, rzp_payment_id)
  values (p_event_id, p_event, p_order, p_payment) on conflict (event_id) do nothing;
$$;
revoke execute on function public.rzp_event_seen(text) from public, anon, authenticated;
revoke execute on function public.rzp_record_event(text, text, text, text) from public, anon, authenticated;
grant execute on function public.rzp_event_seen(text) to service_role;
grant execute on function public.rzp_record_event(text, text, text, text) to service_role;
