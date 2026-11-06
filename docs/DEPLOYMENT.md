# SEVOURA — Setup & Deployment Guide

Follow these steps in order. It takes about 20 minutes. You need free accounts on
**GitHub**, **Supabase** and **Vercel**.

---

## 1. Create the Supabase project

1. Go to <https://supabase.com/dashboard> → **New project**.
   - Name: `sevoura` · Region: **South Asia (Mumbai)** · set a strong database password (save it).
2. When the project is ready, open **SQL Editor → New query**.
3. Open `supabase/migrations/0001_sevoura_schema.sql` from this repository, copy **all** of it,
   paste it into the editor and click **Run**. You should see *Success. No rows returned*.
   (It is safe to run again; it won't duplicate anything.)
4. Check **Table Editor** — you should see `profiles`, `orders`, `order_items`, `products` (with one row:
   the 7-Day Collection at ₹1,799), `addresses`, `payments`, `login_events`, `user_sessions`,
   `order_status_history`, `activity_log`.

### Auth settings (Supabase → Authentication)

| Setting | Where | Value |
|---|---|---|
| Site URL | Authentication → URL Configuration | your live URL, e.g. `https://sevoura.vercel.app` |
| Redirect URLs | same page → *Add URL* | `https://sevoura.vercel.app/**` and `http://localhost:3000/**` (add your custom domain later too) |
| Email confirmation | Authentication → Sign In / Providers → Email | **On** is recommended (customers click a link to activate). Turn *Confirm email* **off** if you want instant sign-in after signup. |
| Session length | Authentication → Sessions | Defaults keep customers signed in indefinitely (access token refreshes automatically) until they sign out. Optionally set a *time-box* (e.g. 30 days). |

> **Email sending limit:** Supabase's built-in email service only sends a few emails per hour
> and is meant for testing. Before launch, connect your own SMTP (Authentication → Emails → SMTP
> Settings — e.g. Resend, Brevo, Zoho, Amazon SES) so confirmation and password-reset emails
> are delivered reliably. You can also customise the email templates there.

### Copy your keys (Supabase → Project Settings → API / API Keys)

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key (or **publishable** key) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** / **secret** key → keep private. Only needed later for Razorpay
  (`SUPABASE_SERVICE_ROLE_KEY`, server-only). Never put it in a `NEXT_PUBLIC_` variable.

---

## 2. Put the code on GitHub

If Claude already pushed the code for you, skip to step 3.

```bash
cd sevoura-website
git init -b main            # skip if already a git repo
git add .
git commit -m "SEVOURA store"
git remote add origin https://github.com/<your-username>/sevoura-website.git
git push -u origin main
```

`.env.local` is ignored by git, so no keys are uploaded.

---

## 3. Deploy on Vercel

1. Go to <https://vercel.com/new> → **Import Git Repository** → choose `sevoura-website`
   (click *Adjust GitHub App Permissions* if it isn't listed).
2. Framework preset: **Next.js** (auto-detected). Build command `next build`, output default. Node 20+.
3. Open **Environment Variables** and add (for Production, Preview and Development):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon / publishable key |
   | `NEXT_PUBLIC_SITE_URL` | your Vercel URL, e.g. `https://sevoura.vercel.app` |

4. Click **Deploy**. When it finishes you get the live URL (e.g. `https://sevoura.vercel.app`).
5. Go back to Supabase → Authentication → URL Configuration and make sure the **Site URL** and
   **Redirect URLs** match this live URL.

From now on, every push to `main` deploys automatically; pull requests get preview URLs.

---

## 4. Create your first admin account

> The first admin (`sevoura87@gmail.com`) exists with a temporary password and
> `must_change_password = true` — the dashboard forces a new password on first sign-in.
> Run `0002_admin_upgrades.sql` and `0003_razorpay.sql` after `0001` on any new project.


1. On the live site open **/signup** and register with the email you want to use as admin.
   Confirm the email if confirmation is on.
2. In Supabase → **SQL Editor**, run (with your email):

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

3. Open **`https://<your-site>/admin`** and sign in. You'll see the dashboard.
   Anyone without the admin role who visits `/admin` sees "Access restricted", and the database
   refuses every admin query from them anyway.

To remove admin rights: `update public.profiles set role = 'customer' where email = '...';`

---

## 5. Test the live store (checklist)

1. Register a new customer account → you land on **My Account**.
2. Close the browser, reopen the site → still signed in.
3. Shop → **Add to bag** → change quantity in the bag → **Checkout**.
4. Fill in the delivery address → **Place order** → confirmation page shows *Payment Pending*.
5. Supabase → Table Editor → `orders` → the order is there with items and address.
6. `/admin/orders` → open the order → mark **Confirmed** / **Shipped**.
7. As the customer, open the order page → status updates live.
8. **Sign out** from My Account.

---

## 6. Environment variables — complete list

| Variable | Required | Exposed to browser? | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SEVOURA_SUPABASE_URL` | **Yes** | Yes (safe) | Supabase project URL |
| `NEXT_PUBLIC_SEVOURA_SUPABASE_ANON_KEY` | **Yes** | Yes (safe, RLS-protected) | Public anon / publishable key |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Yes | Canonical site URL (`https://www.sevoura.com`) |
| `SEVOURA_SUPABASE_SERVICE_ROLE_KEY` | Payments | **No — server only** | Lets the payment routes record verified payments |
| `RAZORPAY_KEY_ID` | Payments | key id is shown to Razorpay's checkout | `rzp_test_…` while testing |
| `RAZORPAY_KEY_SECRET` | Payments | **No** | Creates orders, verifies checkout signatures |
| `RAZORPAY_WEBHOOK_SECRET` | Payments | **No** | Verifies webhook signatures |
| `RAZORPAY_ALLOW_LIVE` | Only for live | No | Must be `true` before a `rzp_live_…` key is accepted |

Online payment switches on only when the key pair, webhook secret and service key are all present
(and, for live keys, `RAZORPAY_ALLOW_LIVE=true`). Until then checkout records orders as *Unpaid*.
`GET /api/payments/status?verify=1` reports pass/fail for each piece of configuration (never a value).

---

## 7. Razorpay

How it works:

1. Customer places the order → `place_order()` computes the price in the database (status *Unpaid*).
2. `POST /api/payments/razorpay/order` creates **one** Razorpay order for that SEVOURA order using the
   database total. Retries reuse it, so an order can never be charged twice.
3. Razorpay Checkout opens. On success the browser sends Razorpay's response to
   `POST /api/payments/razorpay/verify`, which checks the HMAC signature, the order owner and asks
   Razorpay whether the payment is captured for the exact amount — only then is the order **Paid**.
4. A failed attempt (`/failed`, confirmed with Razorpay) marks it **Failed**; the customer can retry
   from *My Account → order → Retry payment* or cancel.
5. `POST /api/payments/razorpay/webhook` (signature-verified; each `X-Razorpay-Event-Id` processed once)
   is the safety net if the customer closes the browser after paying. A full refund issued in the
   Razorpay Dashboard marks the order *Refunded* and removes it from revenue.

Setup (test mode):

1. Razorpay Dashboard → switch to **Test Mode** → Account & Settings → API Keys → *Generate Test Key*.
2. Razorpay → Webhooks (test mode) → *Add New Webhook*: URL
   `https://www.sevoura.com/api/payments/razorpay/webhook`, a secret of your choice,
   events `payment.captured`, `payment.failed`, `payment.authorized`, `order.paid`, `refund.processed`.
3. Vercel → Project → Settings → Environment Variables (Production): add the variables from §6.
4. Redeploy. Test with Razorpay test card `4100 2800 0000 1007` (any future expiry, any CVV) or UPI
   `success@razorpay` / `failure@razorpay`.

Going live (only with the owner's approval): replace the key id/secret with the live pair, create the
same webhook in live mode, set `RAZORPAY_ALLOW_LIVE=true`, redeploy.

---

## 8. Custom domain (optional)

Vercel → Project → Settings → Domains → add `sevoura.com` and follow the DNS instructions.
Then update `NEXT_PUBLIC_SITE_URL` and the Supabase Site URL / Redirect URLs to the new domain.
