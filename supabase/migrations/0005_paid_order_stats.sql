-- =====================================================================
-- SEVOURA — online-payment-only store: dashboard counts confirmed (paid) orders
-- Adds paid-only figures alongside the existing ones (nothing removed).
-- =====================================================================
create or replace function public.admin_dashboard_stats()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v jsonb;
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  perform public.assert_admin();
  select jsonb_build_object(
    'registered_users',   (select count(*) from public.profiles where role = 'customer'),
    'customers',          (select count(distinct user_id) from public.orders where user_id is not null),
    'paying_customers',   (select count(distinct user_id) from public.orders where user_id is not null and payment_status = 'paid'),
    'new_users_7d',       (select count(*) from public.profiles where role = 'customer' and created_at > now() - interval '7 days'),
    'active_users_7d',    (select count(distinct user_id) from public.login_events where event_type = 'login' and occurred_at > now() - interval '7 days'),
    'total_orders',       (select count(*) from public.orders),
    'confirmed_orders',   (select count(*) from public.orders where payment_status = 'paid' and status <> 'cancelled'),
    'today_orders',       (select count(*) from public.orders where (created_at at time zone 'Asia/Kolkata')::date = v_today),
    'today_paid_orders',  (select count(*) from public.orders where payment_status = 'paid' and (created_at at time zone 'Asia/Kolkata')::date = v_today),
    'today_revenue_paise',(select coalesce(sum(total_paise), 0) from public.orders where (created_at at time zone 'Asia/Kolkata')::date = v_today and status <> 'cancelled'),
    'today_paid_revenue_paise', (select coalesce(sum(total_paise), 0) from public.orders where payment_status = 'paid' and status <> 'cancelled' and (created_at at time zone 'Asia/Kolkata')::date = v_today),
    'pending_orders',     (select count(*) from public.orders where status not in ('delivered', 'cancelled')),
    'completed_orders',   (select count(*) from public.orders where status = 'delivered'),
    'cancelled_orders',   (select count(*) from public.orders where status = 'cancelled'),
    'paid_orders',        (select count(*) from public.orders where payment_status = 'paid'),
    'unpaid_orders',      (select count(*) from public.orders where payment_status = 'pending' and status <> 'cancelled'),
    'payment_pending_orders', (select count(*) from public.orders where payment_status = 'authorized' and status <> 'cancelled'),
    'failed_payments',    (select count(*) from public.orders where payment_status = 'failed'),
    'booked_revenue_paise',    (select coalesce(sum(total_paise), 0) from public.orders where status <> 'cancelled'),
    'collected_revenue_paise', (select coalesce(sum(total_paise), 0) from public.orders where payment_status = 'paid' and status <> 'cancelled'),
    'avg_order_paise',    (select coalesce(round(avg(total_paise)), 0) from public.orders where payment_status = 'paid' and status <> 'cancelled'),
    'orders_by_status',   (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select status, count(*) n from public.orders group by status) s),
    'payments_by_status', (select coalesce(jsonb_object_agg(payment_status, jsonb_build_object('count', n, 'amount_paise', amt)), '{}'::jsonb)
                             from (select payment_status, count(*) n, sum(total_paise) amt from public.orders where status <> 'cancelled' group by payment_status) p)
  ) into v;
  return v;
end $$;
