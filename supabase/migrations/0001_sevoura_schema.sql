-- =====================================================================
-- SEVOURA — complete database schema, security and business logic
-- ---------------------------------------------------------------------
-- Run this ONCE in Supabase → SQL Editor → New query → paste → Run.
-- It is written to be safely re-runnable (it will not duplicate data).
--
-- Contents
--   1. Types
--   2. Tables  (profiles, sessions, login events, addresses, products,
--               orders, order items, payments, status history, activity)
--   3. Helper functions + triggers (auth sync, login tracking, timestamps)
--   4. Customer RPCs  (place_order, cancel_my_order, session tracking)
--   5. Admin RPCs     (stats, sales, customers, order status updates)
--   6. Row Level Security policies
--   7. Grants
--   8. Storage bucket for product images
--   9. Seed product
--
-- Money is stored as integer PAISE (₹1 = 100 paise) to avoid rounding.
-- Prices are ALWAYS calculated in the database — never trusted from
-- the browser. Payment status can only be changed by the server
-- (service role) after a verified payment-gateway confirmation.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TYPES
-- ---------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.account_status as enum ('active', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.order_status as enum (
    'order_placed', 'confirmed', 'processing', 'shipped',
    'out_for_delivery', 'delivered', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum (
    'pending', 'authorized', 'paid', 'failed', 'refunded'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 2. TABLES
-- ---------------------------------------------------------------------

-- A. USER MANAGEMENT ---------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  full_name       text not null default '',
  email           text not null default '',
  phone           text,
  role            public.user_role not null default 'customer',
  account_status  public.account_status not null default 'active',
  created_at      timestamptz not null default now(),   -- registration date
  last_login_at   timestamptz,
  updated_at      timestamptz not null default now(),
  constraint profiles_full_name_len check (char_length(full_name) <= 120),
  constraint profiles_phone_fmt check (phone is null or phone ~ '^[6-9][0-9]{9}$')
);
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_created_idx on public.profiles (created_at desc);

-- B. LOGIN HISTORY + SESSIONS -----------------------------------------
create table if not exists public.user_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  session_id    uuid not null,              -- Supabase auth session id (JWT claim)
  user_agent    text,
  started_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  ended_at      timestamptz,
  unique (user_id, session_id)
);
create index if not exists user_sessions_user_idx on public.user_sessions (user_id, started_at desc);

create table if not exists public.login_events (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  event_type   text not null check (event_type in ('signup', 'login', 'logout', 'password_reset')),
  session_id   uuid,
  user_agent   text,
  occurred_at  timestamptz not null default now()
);
create index if not exists login_events_user_idx on public.login_events (user_id, occurred_at desc);
create index if not exists login_events_time_idx on public.login_events (occurred_at desc);

-- D. CUSTOMER ADDRESSES -----------------------------------------------
create table if not exists public.addresses (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  full_name        text not null,
  phone            text not null,
  house_number     text not null,
  street_locality  text not null,
  city             text not null,
  state            text not null,
  pincode          text not null,
  landmark         text,
  is_default       boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint addresses_phone_fmt   check (phone ~ '^[6-9][0-9]{9}$'),
  constraint addresses_pincode_fmt check (pincode ~ '^[1-9][0-9]{5}$'),
  constraint addresses_lengths check (
    char_length(full_name) between 2 and 120 and
    char_length(house_number) between 1 and 120 and
    char_length(street_locality) between 2 and 200 and
    char_length(city) between 2 and 80 and
    char_length(state) between 2 and 80 and
    (landmark is null or char_length(landmark) <= 120)
  )
);
create index if not exists addresses_user_idx on public.addresses (user_id);

-- PRODUCTS -------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         text not null check (char_length(name) between 2 and 160),
  subtitle     text,
  description  text,
  price_paise  integer not null check (price_paise >= 0),
  mrp_paise    integer check (mrp_paise is null or mrp_paise >= 0),
  stock        integer not null default 0 check (stock >= 0),
  image_url    text,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- C. ORDERS --------------------------------------------------------------
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  order_number          text not null unique,
  user_id               uuid references public.profiles (id) on delete set null,
  -- customer snapshot (kept even if the account is later deleted)
  customer_name         text not null,
  customer_email        text not null,
  customer_phone        text not null,
  -- delivery address snapshot
  address_id            uuid references public.addresses (id) on delete set null,
  ship_full_name        text not null,
  ship_phone            text not null,
  ship_house_number     text not null,
  ship_street_locality  text not null,
  ship_city             text not null,
  ship_state            text not null,
  ship_pincode          text not null,
  ship_landmark         text,
  -- money (paise)
  subtotal_paise        integer not null check (subtotal_paise >= 0),
  shipping_paise        integer not null default 0 check (shipping_paise >= 0),
  discount_paise        integer not null default 0 check (discount_paise >= 0),
  total_paise           integer not null check (total_paise >= 0),
  currency              text not null default 'INR',
  -- lifecycle
  status                public.order_status not null default 'order_placed',
  payment_status        public.payment_status not null default 'pending',
  payment_method        text not null default 'razorpay',
  notes                 text check (notes is null or char_length(notes) <= 500),
  created_at            timestamptz not null default now(),   -- order date
  updated_at            timestamptz not null default now(),
  cancelled_at          timestamptz,
  delivered_at          timestamptz
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_idx on public.orders (created_at desc);

create table if not exists public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders (id) on delete cascade,
  product_id        uuid references public.products (id) on delete set null,
  product_name      text not null,
  product_slug      text,
  image_url         text,
  unit_price_paise  integer not null check (unit_price_paise >= 0),
  quantity          integer not null check (quantity between 1 and 10),
  line_total_paise  integer not null check (line_total_paise >= 0)
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- PAYMENTS (ready for Razorpay; written only by the server) -------------
create table if not exists public.payments (
  id                   uuid primary key default gen_random_uuid(),
  order_id             uuid not null references public.orders (id) on delete cascade,
  provider             text not null default 'razorpay',
  provider_order_id    text unique,      -- e.g. Razorpay order_xxx
  provider_payment_id  text unique,      -- e.g. Razorpay pay_xxx
  provider_signature   text,
  amount_paise         integer not null check (amount_paise >= 0),
  currency             text not null default 'INR',
  status               public.payment_status not null default 'pending',
  failure_reason       text,
  raw                  jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists payments_order_idx on public.payments (order_id);

-- ORDER STATUS HISTORY ------------------------------------------------
create table if not exists public.order_status_history (
  id           bigint generated always as identity primary key,
  order_id     uuid not null references public.orders (id) on delete cascade,
  from_status  public.order_status,
  to_status    public.order_status not null,
  note         text,
  changed_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists osh_order_idx on public.order_status_history (order_id, created_at);

-- F. ACTIVITY LOG -------------------------------------------------------
create table if not exists public.activity_log (
  id           bigint generated always as identity primary key,
  actor_id     uuid references public.profiles (id) on delete set null,
  event_type   text not null,  -- user_registered, user_login, user_logout, order_placed, order_status_changed, order_cancelled, product_created, product_updated, product_deleted, account_status_changed
  entity_type  text,
  entity_id    text,
  summary      text not null,
  details      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists activity_time_idx on public.activity_log (created_at desc);
create index if not exists activity_type_idx on public.activity_log (event_type, created_at desc);

-- ---------------------------------------------------------------------
-- 3. HELPER FUNCTIONS + TRIGGERS
-- ---------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists trg_addresses_updated on public.addresses;
create trigger trg_addresses_updated before update on public.addresses
  for each row execute function public.set_updated_at();
drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated before update on public.products
  for each row execute function public.set_updated_at();
drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();
drop trigger if exists trg_payments_updated on public.payments;
create trigger trg_payments_updated before update on public.payments
  for each row execute function public.set_updated_at();

-- Is the current request made by an active admin? (server-side check)
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and account_status = 'active'
  );
$$;

-- Internal: write to the activity log
create or replace function public.log_activity(
  p_actor uuid, p_event text, p_entity_type text, p_entity_id text,
  p_summary text, p_details jsonb default '{}'::jsonb
) returns void
language sql security definer
set search_path = public
as $$
  insert into public.activity_log (actor_id, event_type, entity_type, entity_id, summary, details)
  values (p_actor, p_event, p_entity_type, p_entity_id, p_summary, coalesce(p_details, '{}'::jsonb));
$$;

-- Normalise an Indian mobile number to 10 digits (or null if invalid)
create or replace function public.normalize_phone(p text)
returns text language sql immutable as $$
  select case
    when p is null then null
    else (
      with d as (select regexp_replace(p, '[^0-9]', '', 'g') as v)
      select case
        when v ~ '^[6-9][0-9]{9}$' then v
        when v ~ '^91[6-9][0-9]{9}$' then substr(v, 3)
        when v ~ '^0[6-9][0-9]{9}$' then substr(v, 2)
        else null
      end from d
    )
  end;
$$;

-- New auth user → profile + signup event
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  v_name  text := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), ''), 120);
  v_phone text := public.normalize_phone(new.raw_user_meta_data ->> 'phone');
begin
  insert into public.profiles (id, full_name, email, phone, created_at)
  values (new.id, v_name, coalesce(new.email, ''), v_phone, coalesce(new.created_at, now()))
  on conflict (id) do nothing;

  insert into public.login_events (user_id, event_type) values (new.id, 'signup');
  perform public.log_activity(new.id, 'user_registered', 'profile', new.id::text,
    coalesce(nullif(v_name, ''), new.email, 'A customer') || ' created an account',
    jsonb_build_object('email', new.email));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auth user signed in (last_sign_in_at changes) / email changed
create or replace function public.handle_user_auth_update()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = coalesce(new.email, '') where id = new.id;
  end if;

  if new.last_sign_in_at is not null
     and new.last_sign_in_at is distinct from old.last_sign_in_at then
    update public.profiles set last_login_at = new.last_sign_in_at where id = new.id;
    insert into public.login_events (user_id, event_type, occurred_at)
      values (new.id, 'login', new.last_sign_in_at);
    perform public.log_activity(new.id, 'user_login', 'profile', new.id::text,
      coalesce((select nullif(full_name, '') from public.profiles where id = new.id), new.email) || ' signed in');
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.handle_user_auth_update();

-- Order number: SEV-YYMMDD-XXXXXX (IST date + random)
create or replace function public.generate_order_number()
returns text language plpgsql volatile
set search_path = public
as $$
declare v text;
begin
  loop
    v := 'SEV-' || to_char(now() at time zone 'Asia/Kolkata', 'YYMMDD') || '-'
         || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (select 1 from public.orders where order_number = v);
  end loop;
  return v;
end $$;

-- ---------------------------------------------------------------------
-- 4. CUSTOMER RPCs
-- ---------------------------------------------------------------------

-- Called by the website after sign-in / on return visits to track the session
create or replace function public.touch_session(p_user_agent text default null)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_sid uuid;
begin
  if v_uid is null then return; end if;
  begin
    v_sid := nullif(auth.jwt() ->> 'session_id', '')::uuid;
  exception when others then v_sid := null;
  end;
  if v_sid is null then return; end if;

  insert into public.user_sessions (user_id, session_id, user_agent)
  values (v_uid, v_sid, left(p_user_agent, 300))
  on conflict (user_id, session_id)
  do update set last_seen_at = now(),
                user_agent = coalesce(excluded.user_agent, public.user_sessions.user_agent);

  update public.login_events
     set session_id = v_sid, user_agent = coalesce(user_agent, left(p_user_agent, 300))
   where id = (
     select id from public.login_events
      where user_id = v_uid and event_type = 'login' and session_id is null
        and occurred_at > now() - interval '10 minutes'
      order by occurred_at desc limit 1
   );
end $$;

-- Called by the website right before signing out
create or replace function public.record_logout(p_user_agent text default null)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_sid uuid;
begin
  if v_uid is null then return; end if;
  begin
    v_sid := nullif(auth.jwt() ->> 'session_id', '')::uuid;
  exception when others then v_sid := null;
  end;

  update public.user_sessions set ended_at = now(), last_seen_at = now()
   where user_id = v_uid and session_id = v_sid and ended_at is null;

  insert into public.login_events (user_id, event_type, session_id, user_agent)
  values (v_uid, 'logout', v_sid, left(p_user_agent, 300));

  perform public.log_activity(v_uid, 'user_logout', 'profile', v_uid::text,
    coalesce((select nullif(full_name, '') from public.profiles where id = v_uid), 'A customer') || ' signed out');
end $$;

-- Place an order. Prices, totals and stock are computed HERE, not in the browser.
-- p_items:   [{ "product_id": "<uuid>", "quantity": 2 }, ...]
-- p_address: { full_name, phone, house_number, street_locality, city, state, pincode, landmark }
create or replace function public.place_order(
  p_items jsonb,
  p_address jsonb,
  p_save_address boolean default false,
  p_notes text default null
) returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  v_uid       uuid := auth.uid();
  v_profile   public.profiles%rowtype;
  v_order_id  uuid;
  v_number    text;
  v_subtotal  integer := 0;
  v_shipping  integer := 0;      -- free shipping (prepaid)
  v_total     integer;
  v_item      record;
  v_product   public.products%rowtype;
  v_count     integer;
  v_addr_id   uuid;
  -- address fields
  a_name      text := left(trim(coalesce(p_address ->> 'full_name', '')), 120);
  a_phone     text := public.normalize_phone(p_address ->> 'phone');
  a_house     text := left(trim(coalesce(p_address ->> 'house_number', '')), 120);
  a_street    text := left(trim(coalesce(p_address ->> 'street_locality', '')), 200);
  a_city      text := left(trim(coalesce(p_address ->> 'city', '')), 80);
  a_state     text := left(trim(coalesce(p_address ->> 'state', '')), 80);
  a_pin       text := trim(coalesce(p_address ->> 'pincode', ''));
  a_landmark  text := nullif(left(trim(coalesce(p_address ->> 'landmark', '')), 120), '');
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into v_profile from public.profiles where id = v_uid;
  if not found then raise exception 'profile_missing'; end if;
  if v_profile.account_status <> 'active' then raise exception 'account_suspended'; end if;

  -- basic abuse protection: max 5 orders per 10 minutes
  select count(*) into v_count from public.orders
   where user_id = v_uid and created_at > now() - interval '10 minutes';
  if v_count >= 5 then raise exception 'too_many_orders'; end if;

  -- validate address
  if char_length(a_name) < 2 then raise exception 'invalid_full_name'; end if;
  if a_phone is null then raise exception 'invalid_phone'; end if;
  if char_length(a_house) < 1 then raise exception 'invalid_house_number'; end if;
  if char_length(a_street) < 2 then raise exception 'invalid_street'; end if;
  if char_length(a_city) < 2 then raise exception 'invalid_city'; end if;
  if char_length(a_state) < 2 then raise exception 'invalid_state'; end if;
  if a_pin !~ '^[1-9][0-9]{5}$' then raise exception 'invalid_pincode'; end if;

  -- validate items
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 20 then
    raise exception 'invalid_items';
  end if;

  v_number := public.generate_order_number();

  insert into public.orders (
    order_number, user_id, customer_name, customer_email, customer_phone,
    ship_full_name, ship_phone, ship_house_number, ship_street_locality,
    ship_city, ship_state, ship_pincode, ship_landmark,
    subtotal_paise, shipping_paise, total_paise, notes
  ) values (
    v_number, v_uid,
    coalesce(nullif(v_profile.full_name, ''), a_name),
    v_profile.email,
    coalesce(v_profile.phone, a_phone),
    a_name, a_phone, a_house, a_street, a_city, a_state, a_pin, a_landmark,
    0, v_shipping, 0, nullif(left(trim(coalesce(p_notes, '')), 500), '')
  ) returning id into v_order_id;

  -- aggregate duplicates, lock product rows, check stock
  for v_item in
    select (e ->> 'product_id')::uuid as product_id,
           sum((e ->> 'quantity')::int)::int as quantity
      from jsonb_array_elements(p_items) e
     group by 1
     order by 1
  loop
    if v_item.quantity is null or v_item.quantity < 1 or v_item.quantity > 10 then
      raise exception 'invalid_quantity';
    end if;

    select * into v_product from public.products where id = v_item.product_id for update;
    if not found or not v_product.is_active then
      raise exception 'product_unavailable';
    end if;
    if v_product.stock < v_item.quantity then
      raise exception 'insufficient_stock:%', v_product.name;
    end if;

    insert into public.order_items (order_id, product_id, product_name, product_slug, image_url,
                                    unit_price_paise, quantity, line_total_paise)
    values (v_order_id, v_product.id, v_product.name, v_product.slug, v_product.image_url,
            v_product.price_paise, v_item.quantity, v_product.price_paise * v_item.quantity);

    perform set_config('sevoura.stock_adjust', 'on', true);
    update public.products set stock = stock - v_item.quantity where id = v_product.id;
    v_subtotal := v_subtotal + v_product.price_paise * v_item.quantity;
  end loop;

  v_total := v_subtotal + v_shipping;
  update public.orders set subtotal_paise = v_subtotal, total_paise = v_total where id = v_order_id;

  -- optionally save the address to the customer's address book
  if p_save_address then
    select id into v_addr_id from public.addresses
     where user_id = v_uid and full_name = a_name and phone = a_phone
       and house_number = a_house and street_locality = a_street
       and city = a_city and state = a_state and pincode = a_pin
     limit 1;
    if v_addr_id is null then
      insert into public.addresses (user_id, full_name, phone, house_number, street_locality,
                                    city, state, pincode, landmark, is_default)
      values (v_uid, a_name, a_phone, a_house, a_street, a_city, a_state, a_pin, a_landmark,
              not exists (select 1 from public.addresses where user_id = v_uid))
      returning id into v_addr_id;
    end if;
    update public.orders set address_id = v_addr_id where id = v_order_id;
  end if;

  -- keep the customer's phone on file if they did not have one
  if v_profile.phone is null then
    update public.profiles set phone = a_phone where id = v_uid;
  end if;

  insert into public.order_status_history (order_id, from_status, to_status, note, changed_by)
  values (v_order_id, null, 'order_placed', 'Order placed by customer', v_uid);

  perform public.log_activity(v_uid, 'order_placed', 'order', v_order_id::text,
    'Order ' || v_number || ' placed (₹' || to_char(v_total / 100.0, 'FM999G999G990D00') || ')',
    jsonb_build_object('order_number', v_number, 'total_paise', v_total));

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_number,
    'total_paise', v_total,
    'status', 'order_placed',
    'payment_status', 'pending'
  );
end $$;

-- Customer may cancel their own order while it is still "Order Placed" and unpaid
create or replace function public.cancel_my_order(p_order_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_order public.orders%rowtype;
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  select * into v_order from public.orders where id = p_order_id and user_id = v_uid for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_order.status <> 'order_placed' then raise exception 'order_not_cancellable'; end if;
  if v_order.payment_status in ('paid', 'authorized') then raise exception 'order_paid_contact_support'; end if;

  update public.orders set status = 'cancelled', cancelled_at = now() where id = p_order_id;
  perform set_config('sevoura.stock_adjust', 'on', true);
  update public.products p set stock = p.stock + oi.quantity
    from public.order_items oi where oi.order_id = p_order_id and oi.product_id = p.id;

  insert into public.order_status_history (order_id, from_status, to_status, note, changed_by)
  values (p_order_id, v_order.status, 'cancelled', 'Cancelled by customer', v_uid);
  perform public.log_activity(v_uid, 'order_cancelled', 'order', p_order_id::text,
    'Order ' || v_order.order_number || ' cancelled by customer');
end $$;

-- ---------------------------------------------------------------------
-- 5. ADMIN RPCs  (every one verifies is_admin() on the server)
-- ---------------------------------------------------------------------

create or replace function public.assert_admin()
returns void language plpgsql stable security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin_only' using errcode = '42501';
  end if;
end $$;

create or replace function public.admin_update_order_status(
  p_order_id uuid, p_status public.order_status, p_note text default null
) returns void
language plpgsql security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
begin
  perform public.assert_admin();
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_order.status = p_status then return; end if;
  if v_order.status in ('cancelled', 'delivered') then
    raise exception 'order_status_final';
  end if;

  update public.orders
     set status = p_status,
         cancelled_at = case when p_status = 'cancelled' then now() else cancelled_at end,
         delivered_at = case when p_status = 'delivered' then now() else delivered_at end
   where id = p_order_id;

  if p_status = 'cancelled' then
    perform set_config('sevoura.stock_adjust', 'on', true);
    update public.products p set stock = p.stock + oi.quantity
      from public.order_items oi where oi.order_id = p_order_id and oi.product_id = p.id;
  end if;

  insert into public.order_status_history (order_id, from_status, to_status, note, changed_by)
  values (p_order_id, v_order.status, p_status, nullif(left(trim(coalesce(p_note, '')), 300), ''), auth.uid());

  perform public.log_activity(auth.uid(), 'order_status_changed', 'order', p_order_id::text,
    'Order ' || v_order.order_number || ': ' || replace(v_order.status::text, '_', ' ')
      || ' → ' || replace(p_status::text, '_', ' '),
    jsonb_build_object('order_number', v_order.order_number, 'from', v_order.status, 'to', p_status));
end $$;

create or replace function public.admin_set_account_status(p_user_id uuid, p_status public.account_status)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  perform public.assert_admin();
  if p_user_id = auth.uid() then raise exception 'cannot_change_own_status'; end if;
  update public.profiles set account_status = p_status where id = p_user_id;
  perform public.log_activity(auth.uid(), 'account_status_changed', 'profile', p_user_id::text,
    'Account ' || p_status::text || ': ' || coalesce((select email from public.profiles where id = p_user_id), p_user_id::text));
end $$;

-- E. ANALYTICS — headline numbers for the dashboard
create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare v jsonb;
begin
  perform public.assert_admin();
  select jsonb_build_object(
    'registered_users',   (select count(*) from public.profiles where role = 'customer'),
    'customers',          (select count(distinct user_id) from public.orders where user_id is not null),
    'new_users_7d',       (select count(*) from public.profiles where role = 'customer' and created_at > now() - interval '7 days'),
    'active_users_7d',    (select count(distinct user_id) from public.login_events where event_type = 'login' and occurred_at > now() - interval '7 days'),
    'total_orders',       (select count(*) from public.orders),
    'pending_orders',     (select count(*) from public.orders where status not in ('delivered', 'cancelled')),
    'completed_orders',   (select count(*) from public.orders where status = 'delivered'),
    'cancelled_orders',   (select count(*) from public.orders where status = 'cancelled'),
    'booked_revenue_paise',    (select coalesce(sum(total_paise), 0) from public.orders where status <> 'cancelled'),
    'collected_revenue_paise', (select coalesce(sum(total_paise), 0) from public.orders where payment_status = 'paid'),
    'avg_order_paise',    (select coalesce(round(avg(total_paise)), 0) from public.orders where status <> 'cancelled'),
    'orders_by_status',   (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb)
                             from (select status, count(*) n from public.orders group by status) s),
    'payments_by_status', (select coalesce(jsonb_object_agg(payment_status, jsonb_build_object('count', n, 'amount_paise', amt)), '{}'::jsonb)
                             from (select payment_status, count(*) n, sum(total_paise) amt
                                     from public.orders where status <> 'cancelled' group by payment_status) p)
  ) into v;
  return v;
end $$;

-- Daily sales for the last N days (IST calendar days)
create or replace function public.admin_sales_daily(p_days integer default 30)
returns table (day date, orders bigint, revenue_paise bigint)
language plpgsql stable security definer
set search_path = public
as $$
begin
  perform public.assert_admin();
  return query
  with days as (
    select generate_series(
      (now() at time zone 'Asia/Kolkata')::date - (least(greatest(p_days, 1), 366) - 1),
      (now() at time zone 'Asia/Kolkata')::date, interval '1 day')::date as d
  )
  select d.d,
         count(o.id),
         coalesce(sum(o.total_paise), 0)::bigint
    from days d
    left join public.orders o
      on (o.created_at at time zone 'Asia/Kolkata')::date = d.d and o.status <> 'cancelled'
   group by d.d order by d.d;
end $$;

-- Monthly sales for the last N months
create or replace function public.admin_sales_monthly(p_months integer default 12)
returns table (month date, orders bigint, revenue_paise bigint)
language plpgsql stable security definer
set search_path = public
as $$
begin
  perform public.assert_admin();
  return query
  with months as (
    select generate_series(
      date_trunc('month', (now() at time zone 'Asia/Kolkata'))::date - make_interval(months => least(greatest(p_months, 1), 60) - 1),
      date_trunc('month', (now() at time zone 'Asia/Kolkata'))::date, interval '1 month')::date as m
  )
  select m.m,
         count(o.id),
         coalesce(sum(o.total_paise), 0)::bigint
    from months m
    left join public.orders o
      on date_trunc('month', o.created_at at time zone 'Asia/Kolkata')::date = m.m and o.status <> 'cancelled'
   group by m.m order by m.m;
end $$;

-- Customers with order counts and spend
create or replace function public.admin_list_customers()
returns table (
  id uuid, full_name text, email text, phone text, role public.user_role,
  account_status public.account_status, created_at timestamptz, last_login_at timestamptz,
  order_count bigint, total_spent_paise bigint, last_order_at timestamptz
)
language plpgsql stable security definer
set search_path = public
as $$
begin
  perform public.assert_admin();
  return query
  select p.id, p.full_name, p.email, p.phone, p.role, p.account_status, p.created_at, p.last_login_at,
         count(o.id),
         coalesce(sum(o.total_paise) filter (where o.status <> 'cancelled'), 0)::bigint,
         max(o.created_at)
    from public.profiles p
    left join public.orders o on o.user_id = p.id
   group by p.id
   order by p.created_at desc;
end $$;

-- Product delete/insert/update logging
create or replace function public.log_product_change()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_activity(auth.uid(), 'product_created', 'product', new.id::text, 'Product added: ' || new.name);
    return new;
  elsif tg_op = 'UPDATE' then
    -- stock movements caused by orders/cancellations are not "product edits"
    if coalesce(current_setting('sevoura.stock_adjust', true), '') = 'on' then
      return new;
    end if;
    perform public.log_activity(auth.uid(), 'product_updated', 'product', new.id::text, 'Product updated: ' || new.name,
      jsonb_build_object('price_paise', new.price_paise, 'stock', new.stock, 'is_active', new.is_active));
    return new;
  else
    perform public.log_activity(auth.uid(), 'product_deleted', 'product', old.id::text, 'Product deleted: ' || old.name);
    return old;
  end if;
end $$;

drop trigger if exists trg_products_log on public.products;
create trigger trg_products_log after insert or update or delete on public.products
  for each row execute function public.log_product_change();

-- ---------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.profiles             enable row level security;
alter table public.user_sessions        enable row level security;
alter table public.login_events         enable row level security;
alter table public.addresses            enable row level security;
alter table public.products             enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.payments             enable row level security;
alter table public.order_status_history enable row level security;
alter table public.activity_log         enable row level security;

-- profiles: you see yourself; admins see everyone. You may edit only name/phone (see grants).
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- sessions + login events: read-only to owner and admins (written by functions)
drop policy if exists sessions_select on public.user_sessions;
create policy sessions_select on public.user_sessions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists login_events_select on public.login_events;
create policy login_events_select on public.login_events for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- addresses: owner full control; admins read
drop policy if exists addresses_select on public.addresses;
create policy addresses_select on public.addresses for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists addresses_insert on public.addresses;
create policy addresses_insert on public.addresses for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists addresses_update on public.addresses;
create policy addresses_update on public.addresses for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists addresses_delete on public.addresses;
create policy addresses_delete on public.addresses for delete to authenticated
  using (user_id = auth.uid());

-- products: everyone can read active products; admins manage everything
drop policy if exists products_select on public.products;
create policy products_select on public.products for select to anon, authenticated
  using (is_active or public.is_admin());
drop policy if exists products_admin_insert on public.products;
create policy products_admin_insert on public.products for insert to authenticated
  with check (public.is_admin());
drop policy if exists products_admin_update on public.products;
create policy products_admin_update on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists products_admin_delete on public.products;
create policy products_admin_delete on public.products for delete to authenticated
  using (public.is_admin());

-- orders: customers read ONLY their own; admins read all. No direct writes (RPC only).
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id
                 and (o.user_id = auth.uid() or public.is_admin())));

drop policy if exists osh_select on public.order_status_history;
create policy osh_select on public.order_status_history for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id
                 and (o.user_id = auth.uid() or public.is_admin())));

-- payments: read-only to order owner and admins; written only by the server (service role)
drop policy if exists payments_select on public.payments;
create policy payments_select on public.payments for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id
                 and (o.user_id = auth.uid() or public.is_admin())));

-- activity log: admins only
drop policy if exists activity_select on public.activity_log;
create policy activity_select on public.activity_log for select to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 7. GRANTS  (defence in depth on top of RLS)
-- ---------------------------------------------------------------------
revoke all on all tables in schema public from anon;
revoke insert, update, delete on all tables in schema public from authenticated;

grant select on public.products to anon, authenticated;
grant select on public.profiles, public.user_sessions, public.login_events, public.addresses,
                public.orders, public.order_items, public.payments, public.order_status_history,
                public.activity_log to authenticated;

-- customers may change only their name and phone (never role/status/email)
grant update (full_name, phone) on public.profiles to authenticated;
-- address book
grant insert, update, delete on public.addresses to authenticated;
-- product management (RLS restricts to admins)
grant insert, update, delete on public.products to authenticated;

-- functions: lock down, then open only what the website needs
revoke execute on all functions in schema public from public, anon;
grant execute on function public.is_admin() to anon, authenticated;  -- used inside RLS policies
grant execute on function public.touch_session(text) to authenticated;
grant execute on function public.record_logout(text) to authenticated;
grant execute on function public.place_order(jsonb, jsonb, boolean, text) to authenticated;
grant execute on function public.cancel_my_order(uuid) to authenticated;
grant execute on function public.admin_update_order_status(uuid, public.order_status, text) to authenticated;
grant execute on function public.admin_set_account_status(uuid, public.account_status) to authenticated;
grant execute on function public.admin_dashboard_stats() to authenticated;
grant execute on function public.admin_sales_daily(integer) to authenticated;
grant execute on function public.admin_sales_monthly(integer) to authenticated;
grant execute on function public.admin_list_customers() to authenticated;
grant execute on function public.normalize_phone(text) to authenticated;
-- internal helpers stay private
revoke execute on function public.log_activity(uuid, text, text, text, text, jsonb) from authenticated;
revoke execute on function public.generate_order_number() from authenticated;
revoke execute on function public.assert_admin() from authenticated;

-- new functions created later should not be callable by anon by default
alter default privileges in schema public revoke execute on functions from public, anon;

-- ---------------------------------------------------------------------
-- 8. STORAGE — product images (public read, admin write)
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('product-images', 'product-images', true, 5242880,
            array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
    on conflict (id) do nothing;

    execute 'drop policy if exists "product images public read" on storage.objects';
    execute 'create policy "product images public read" on storage.objects for select to anon, authenticated using (bucket_id = ''product-images'')';
    execute 'drop policy if exists "product images admin insert" on storage.objects';
    execute 'create policy "product images admin insert" on storage.objects for insert to authenticated with check (bucket_id = ''product-images'' and public.is_admin())';
    execute 'drop policy if exists "product images admin update" on storage.objects';
    execute 'create policy "product images admin update" on storage.objects for update to authenticated using (bucket_id = ''product-images'' and public.is_admin())';
    execute 'drop policy if exists "product images admin delete" on storage.objects';
    execute 'create policy "product images admin delete" on storage.objects for delete to authenticated using (bucket_id = ''product-images'' and public.is_admin())';
  end if;
end $$;

-- Realtime: lets a customer's order page update live when the admin changes status
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables
                      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders') then
    execute 'alter publication supabase_realtime add table public.orders';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 9. SEED — the SEVOURA collection (edit price/stock later in /admin)
-- ---------------------------------------------------------------------
insert into public.products (slug, name, subtitle, description, price_paise, mrp_paise, stock, image_url, sort_order)
values (
  'seven-day-planetary-blend-collection',
  'SEVOURA 7-Day Planetary Blend Collection',
  '7 × 4 ml alcohol-free fragrance blends',
  'Seven planetary inspirations. Seven fragrance expressions. One complete collection.',
  179900, 249900, 100, '/sevoura-bottle.jpeg', 1
)
on conflict (slug) do nothing;

-- Backfill profiles for any users who signed up before this script ran
insert into public.profiles (id, full_name, email, created_at)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', ''), coalesce(u.email, ''), u.created_at
  from auth.users u
 where not exists (select 1 from public.profiles p where p.id = u.id);

-- =====================================================================
-- FIRST ADMIN: sign up on the website, then run (with your email):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- =====================================================================
