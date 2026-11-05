# SEVOURA — Website & Store

Premium e-commerce site for the **SEVOURA 7-Day Planetary Blend Collection**.
Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, GSAP + Lenis,
and Supabase (Postgres, Auth, Storage, Realtime). Deployed on Vercel from GitHub.

> **Setting it up for the first time?** Follow **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** step by step.

---

## What's inside

| Area | Routes | Notes |
|---|---|---|
| Storefront | `/`, `/shop`, `/the-seven`, `/our-story`, `/our-story/astrology-behind-rituals`, `/the-experience`, `/ritual-finder`, `/journal`, `/faq`, `/contact`, `/shipping-returns`, `/privacy-policy`, `/terms`, `/search` | Homepage redesigned; other pages keep their design with added motion polish |
| Bag & checkout | slide-in bag, `/cart`, `/checkout` | Bag lives in the browser; **prices & totals are computed in the database** |
| Accounts | `/signup`, `/login`, `/forgot-password`, `/reset-password`, `/account`, `/account/orders/[id]` | Persistent sessions, order history, address book, live order status |
| Admin | `/admin` (+ `/orders`, `/customers`, `/products`, `/revenue`, `/activity`) | Only accounts with `role = 'admin'`; every admin action is verified in the database |
| Payments (dormant) | `/api/payments/razorpay/order`, `/api/payments/razorpay/webhook` | Ready for Razorpay; returns 503 until keys are configured |

## Architecture

```
Browser (Next.js client components)
  │  public anon key only
  ▼
Supabase
  ├─ Auth ............ email + password, sessions persisted & auto-refreshed
  ├─ Postgres ........ tables protected by Row Level Security (RLS)
  │    ├─ place_order()            — validates address, locks stock, computes totals
  │    ├─ cancel_my_order()        — customer self-cancel while "Order Placed" & unpaid
  │    ├─ admin_*()                — stats, sales, customers, status updates (is_admin() check)
  │    └─ triggers                 — profile on signup, login history, activity log
  ├─ Storage ......... product-images bucket (public read, admin write)
  └─ Realtime ........ customer order page updates live when admin changes status

Vercel (Next.js server)
  └─ /api/payments/razorpay/*  — server-only, uses SUPABASE_SERVICE_ROLE_KEY (future)
```

**Security model**

- The browser only ever has the public anon key. RLS ensures customers can read *only their own*
  profile, addresses, orders, order items, status history and payments.
- Customers cannot insert or update orders directly. Orders are created only through
  `place_order()`, which reads prices from the `products` table — a tampered browser cannot
  change what is charged.
- `payment_status` can only be changed by the server (service role) after a signature-verified
  payment confirmation. Nothing in the app simulates a successful payment.
- Admin rights are a database role (`profiles.role = 'admin'`), checked by `is_admin()` inside
  every admin function and RLS policy. No credentials are stored in the frontend. Customers cannot
  change their own role (column-level privileges allow editing only name and phone).

**Database tables** (`supabase/migrations/0001_sevoura_schema.sql`)

| Table | Purpose |
|---|---|
| `profiles` | one row per user: name, email, phone, role, account status, registration date, last login |
| `user_sessions` | sign-in sessions (device/user-agent, started, last seen, ended) |
| `login_events` | signup / login / logout history |
| `addresses` | customer address book (name, phone, house no., street & locality, city, state, pincode, landmark) |
| `products` | catalogue: price & MRP in paise, stock, image, visibility |
| `orders` | order number, customer + delivery snapshot, totals, status, payment status |
| `order_items` | products, unit prices and quantities per order |
| `payments` | payment-gateway records (Razorpay-ready) |
| `order_status_history` | every status change with note and who made it |
| `activity_log` | registrations, logins, orders, status changes, product edits |

Money is stored as integer **paise** (₹1 = 100).

## Project structure

```
src/
  app/                    routes (each folder = a URL)
    admin/                admin dashboard (layout gates access)
    api/payments/         Razorpay route handlers (dormant)
    template.tsx          page-enter transition for every route
  components/
    home/                 homepage sections (Hero, Seven journey, Showcase, …)
    admin/                admin shell, charts, tiles
    account/              auth shell, RequireAuth
    shop/                 cart drawer, add-to-cart, status badges, timeline
    providers/            Auth + Cart providers, motion setup
    motion/               smooth scroll, scroll progress, route progress
    ui/                   form fields, buttons, notices
  lib/                    supabase clients, formatting, validation, payments
supabase/migrations/      the complete database schema (run once in Supabase)
docs/DEPLOYMENT.md        setup guide: Supabase, GitHub, Vercel, first admin
```

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint && npm run typecheck
```

## Managing the store

- **Change price / stock / images:** `/admin/products`. The first *live* product (lowest sort order)
  is the featured collection shown on the homepage and shop page — its price updates there automatically.
- **Process an order:** `/admin/orders` → open the order → choose the next status
  (Order Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered, or Cancelled).
  Add a note such as a courier tracking number. Customers see the change instantly on their order page.
  Cancelling returns the stock to inventory. Delivered and Cancelled are final.
- **Export orders:** `/admin/orders` → *Export CSV*.
- **Customers:** `/admin/customers` → open a customer to see orders, saved addresses and login activity;
  suspend an account if needed (suspended accounts cannot place orders).
- **Add another admin:** in Supabase SQL Editor run
  `update public.profiles set role = 'admin' where email = 'person@example.com';`

## Deploying updates

Push to the `main` branch on GitHub → Vercel builds and deploys automatically.
Database changes go in a new file in `supabase/migrations/` and are run in the Supabase SQL Editor.
