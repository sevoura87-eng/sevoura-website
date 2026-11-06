-- =====================================================================
-- SEVOURA — Razorpay live hardening
--  * webhook event log: each x-razorpay-event-id is processed once
--  * refunds: a full refund marks the order Refunded (excluded from revenue)
-- =====================================================================

create table if not exists public.razorpay_webhook_events (
  event_id     text primary key,
  event        text not null,
  received_at  timestamptz not null default now()
);
alter table public.razorpay_webhook_events enable row level security;
-- no policies: only the server (service_role) can read or write it
revoke all on public.razorpay_webhook_events from anon, authenticated;

create or replace function public.rzp_mark_refunded(
  p_rzp_payment_id text, p_amount_refunded integer, p_full boolean, p_raw jsonb default null
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_pay   public.payments;
  v_order public.orders;
begin
  select * into v_pay from public.payments where provider_payment_id = p_rzp_payment_id for update;
  if not found then return; end if;
  select * into v_order from public.orders where id = v_pay.order_id for update;
  if p_full then
    update public.payments set status = 'refunded', raw = coalesce(p_raw, raw) where id = v_pay.id;
    update public.orders set payment_status = 'refunded' where id = v_order.id;
  end if;
  perform public.log_activity(null, 'payment_refunded', 'order', v_order.id::text,
    case when p_full then 'Full refund for ' else 'Partial refund for ' end || v_order.order_number,
    jsonb_build_object('payment_id', p_rzp_payment_id, 'amount_refunded_paise', p_amount_refunded));
end $$;

revoke execute on function public.rzp_mark_refunded(text, integer, boolean, jsonb) from public, anon, authenticated;
grant execute on function public.rzp_mark_refunded(text, integer, boolean, jsonb) to service_role;
