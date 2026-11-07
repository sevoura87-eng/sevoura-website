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
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/sevoura_official?vrfl=MXVkbnhhM21iM25kYg%3D%3D&utm_source=qr" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/share/19kXWSaDZS/?mibextid=wwXIfr" },
  { key: "youtube", label: "YouTube", href: "https://youtube.com/@sevoura_official?si=M3WjW8SJWvnNdQAN" },
];

export const activeSocial = () => SOCIAL.filter((s) => /^https:\/\//.test(s.href));
