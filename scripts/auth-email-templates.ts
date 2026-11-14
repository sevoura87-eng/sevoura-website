import { C, SANS, SERIF, button, divider, layout } from "../supabase/functions/order-confirmation/layout.ts";

/**
 * Supabase Auth email templates (Dashboard → Authentication → Emails → Templates).
 * They keep Supabase's own variables — {{ .ConfirmationURL }} — so the existing verification
 * and password-reset flows are untouched; only the look and wording change.
 * Generated into supabase/templates/*.html by scripts/build-email-templates.ts.
 * (The shared layout lives with the order-confirmation Edge Function so both use one design.)
 */

const p = (t: string) => `<p style="margin:18px auto 0;max-width:440px;font-family:${SANS};font-size:15px;line-height:25px;color:${C.body};text-align:center;">${t}</p>`;

/**
 * Fallback for email clients that block the button: one quiet line, then the full link in a soft
 * ivory panel. A table cell (not a div) keeps Outlook happy; break-all + overflow-wrap make the long
 * token wrap inside the card on any phone instead of stretching the layout. The link itself is
 * Supabase's {{ .ConfirmationURL }}, untouched.
 */
function fallbackLink(what: string) {
  return `<p style="margin:30px 0 10px;font-family:${SANS};font-size:12px;line-height:19px;color:#9A8070;text-align:center;">
      If the button doesn't work, copy this ${what} link into your browser.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;margin:0 0 30px;">
      <tr><td style="padding:12px 16px;background:${C.ivory};border:1px solid ${C.line};font-family:${SANS};font-size:11px;line-height:17px;text-align:center;word-break:break-all;overflow-wrap:anywhere;-ms-word-break:break-all;">
        <a href="{{ .ConfirmationURL }}" target="_blank" style="color:${C.wine};text-decoration:none;word-break:break-all;overflow-wrap:anywhere;">{{ .ConfirmationURL }}</a>
      </td></tr>
    </table>`;
}

export function confirmSignupTemplate() {
  return {
    subject: "Welcome to SEVOURA — Verify Your Email",
    html: layout({
      preheader: "One last step — verify your email to begin your SEVOURA ritual.",
      body: `
    <p style="margin:0 0 14px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:4px;color:${C.gold};text-align:center;">WELCOME TO SEVOURA</p>
    <h1 class="h1" style="margin:0;font-family:${SERIF};font-size:40px;line-height:46px;font-weight:500;color:${C.ink};text-align:center;">
      Your ritual <span style="font-style:italic;color:${C.wine};">begins here.</span>
    </h1>
    ${p("Thank you for joining SEVOURA — seven planetary fragrances, one for every day of the week. Please confirm your email address to activate your account.")}
    <div style="height:34px;line-height:34px;font-size:0;">&nbsp;</div>
    ${button("Verify my email", "{{ .ConfirmationURL }}")}
    ${fallbackLink("verification")}
    ${divider()}
    <p style="margin:22px 0 0;font-family:${SANS};font-size:12px;line-height:20px;color:#9A8070;text-align:center;">
      You're receiving this because this email address was used to create an account at sevoura.com.<br>If that wasn't you, you can safely ignore this email.
    </p>`,
    }),
  };
}

export function resetPasswordTemplate() {
  return {
    subject: "Reset Your SEVOURA Password",
    html: layout({
      preheader: "A secure link to choose a new password for your SEVOURA account.",
      body: `
    <p style="margin:0 0 14px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:4px;color:${C.gold};text-align:center;">PASSWORD RESET</p>
    <h1 class="h1" style="margin:0;font-family:${SERIF};font-size:40px;line-height:46px;font-weight:500;color:${C.ink};text-align:center;">
      Choose a <span style="font-style:italic;color:${C.wine};">new password.</span>
    </h1>
    ${p("We received a request to reset the password for your SEVOURA account. This link can be used once and expires shortly.")}
    <div style="height:34px;line-height:34px;font-size:0;">&nbsp;</div>
    ${button("Reset my password", "{{ .ConfirmationURL }}")}
    ${fallbackLink("reset")}
    ${divider()}
    <p style="margin:22px 0 0;font-family:${SANS};font-size:12px;line-height:20px;color:#9A8070;text-align:center;">
      Didn't ask for this? Ignore this email — your password stays the same.
    </p>`,
    }),
  };
}
