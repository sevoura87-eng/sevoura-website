-- =====================================================================
-- SEVOURA — admin upgrades
--  * richer dashboard numbers (today, paid / unpaid / failed)
--  * must_change_password flag for temporary admin passwords
--  * clear_password_change_flag() called after the password is changed
-- =====================================================================

alter table public.profiles add column if not exists must_change_password boolean not null default false;

-- The signed-in user clears their own flag after setting a new password
create or replace function public.clear_password_change_flag()
returns void language sql security definer set search_path = public as $$
  update public.profiles set must_change_password = false where id = auth.uid();
$$;
revoke execute on function public.clear_password_change_flag() from public, anon;
grant execute on function public.clear_password_change_flag() to authenticated;

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
    'new_users_7d',       (select count(*) from public.profiles where role = 'customer' and created_at > now() - interval '7 days'),
    'active_users_7d',    (select count(distinct user_id) from public.login_events where event_type = 'login' and occurred_at > now() - interval '7 days'),
    'total_orders',       (select count(*) from public.orders),
    'today_orders',       (select count(*) from public.orders where (created_at at time zone 'Asia/Kolkata')::date = v_today),
    'today_revenue_paise',(select coalesce(sum(total_paise), 0) from public.orders where (created_at at time zone 'Asia/Kolkata')::date = v_today and status <> 'cancelled'),
    'pending_orders',     (select count(*) from public.orders where status not in ('delivered', 'cancelled')),
    'completed_orders',   (select count(*) from public.orders where status = 'delivered'),
    'cancelled_orders',   (select count(*) from public.orders where status = 'cancelled'),
    'paid_orders',        (select count(*) from public.orders where payment_status = 'paid'),
    'unpaid_orders',      (select count(*) from public.orders where payment_status = 'pending' and status <> 'cancelled'),
    'payment_pending_orders', (select count(*) from public.orders where payment_status = 'authorized' and status <> 'cancelled'),
    'failed_payments',    (select count(*) from public.orders where payment_status = 'failed'),
    'booked_revenue_paise',    (select coalesce(sum(total_paise), 0) from public.orders where status <> 'cancelled'),
    'collected_revenue_paise', (select coalesce(sum(total_paise), 0) from public.orders where payment_status = 'paid' and status <> 'cancelled'),
    'avg_order_paise',    (select coalesce(round(avg(total_paise)), 0) from public.orders where status <> 'cancelled'),
    'orders_by_status',   (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select status, count(*) n from public.orders group by status) s),
    'payments_by_status', (select coalesce(jsonb_object_agg(payment_status, jsonb_build_object('count', n, 'amount_paise', amt)), '{}'::jsonb)
                             from (select payment_status, count(*) n, sum(total_paise) amt from public.orders where status <> 'cancelled' group by payment_status) p)
  ) into v;
  return v;
end $$;
