/**
 * Brand contact + social profiles. Only links with a real URL are shown in the footer.
 * Add or change a profile here and redeploy.
 */
export const SITE = {
  email: "hello@sevoura.com",
  phone: "+91-9211877712",
  phoneHref: "tel:+919211877712",
  hours: "Monday–Sunday · 10:00 AM–6:00 PM IST",
};

export type SocialKey = "instagram" | "facebook" | "youtube" | "x" | "linkedin" | "pinterest" | "whatsapp" | "threads" | "tiktok";

export const SOCIAL: { key: SocialKey; label: string; href: string }[] = [
  { key: "instagram", label: "Instagram", href: "" },
  { key: "facebook", label: "Facebook", href: "" },
  { key: "youtube", label: "YouTube", href: "" },
  { key: "x", label: "X (Twitter)", href: "" },
  { key: "linkedin", label: "LinkedIn", href: "" },
  { key: "pinterest", label: "Pinterest", href: "" },
  { key: "whatsapp", label: "WhatsApp", href: "" },
];

export const activeSocial = () => SOCIAL.filter((s) => /^https:\/\//.test(s.href));
