# SEVOURA auth emails

Branded templates for Supabase Auth. They keep Supabase's own `{{ .ConfirmationURL }}`,
so the verification and password-reset flows work exactly as before.

| Supabase template (Authentication → Emails → Templates) | Subject | File |
|---|---|---|
| Confirm signup | Welcome to SEVOURA — Verify Your Email | `confirm-signup.html` |
| Reset password | Reset Your SEVOURA Password | `reset-password.html` |

Regenerate after editing `src/lib/email/authTemplates.ts`:

    npx tsx scripts/build-email-templates.ts

Sender (Authentication → Emails → SMTP Settings → Enable custom SMTP):

- Sender email: `hello@sevoura.com`  ·  Sender name: `SEVOURA`
- Host `smtp.resend.com` · Port `465` · Username `resend` · Password: the Resend API key
