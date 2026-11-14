/**
 * Writes the branded Supabase Auth templates to supabase/templates/.
 *   npx tsx scripts/build-email-templates.ts
 * Then paste each file into Supabase → Authentication → Emails → Templates (subjects listed in README there).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { confirmSignupTemplate, resetPasswordTemplate } from "../src/lib/email/authTemplates";

process.env.NEXT_PUBLIC_SITE_URL ||= "https://www.sevoura.com";
mkdirSync("supabase/templates", { recursive: true });
const out = [
  ["confirm-signup.html", confirmSignupTemplate()],
  ["reset-password.html", resetPasswordTemplate()],
] as const;
for (const [file, t] of out) {
  writeFileSync(`supabase/templates/${file}`, t.html);
  console.log(`${file}  subject: ${t.subject}`);
}
