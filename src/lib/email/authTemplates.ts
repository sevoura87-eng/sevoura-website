import { C, SANS, SERIF, button, divider, layout } from "./layout";

/**
 * Supabase Auth email templates (Dashboard → Authentication → Emails → Templates).
 * They keep Supabase's own variables — {{ .ConfirmationURL }} — so the existing verification
 * and password-reset flows are untouched; only the look and wording change.
 * Generated into supabase/templates/*.html by scripts/build-email-templates.ts.
 */

const p = (t: string) => `<p style="margin:18px auto 0;max-width:440px;font-family:${SANS};font-size:15px;line-height:25px;color:${C.body};text-align:center;">${t}</p>`;

function fallbackLink() {
  return `<p style="margin:26px 0 30px;font-family:${SANS};font-size:12px;line-height:19px;color:#9A8070;text-align:center;">
      If the button doesn't work, copy this link into your browser:<br>
      <a href="{{ .ConfirmationURL }}" style="color:${C.wine};word-break:break-all;">{{ .ConfirmationURL }}</a>
    </p>`;
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
    ${fallbackLink()}
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
    ${fallbackLink()}
    ${divider()}
    <p style="margin:22px 0 0;font-family:${SANS};font-size:12px;line-height:20px;color:#9A8070;text-align:center;">
      Didn't ask for this? Ignore this email — your password stays the same.
    </p>`,
    }),
  };
}
