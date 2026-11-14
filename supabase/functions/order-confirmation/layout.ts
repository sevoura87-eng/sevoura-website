/**
 * Shared SEVOURA email shell — warm ivory, deep burgundy, champagne gold.
 * Table-based with inline styles so it renders in Gmail, Outlook, Apple Mail and on phones.
 */

export const SITE = "https://www.sevoura.com";

export const C = {
  ivory: "#F8F1E7",
  paper: "#FFFCF7",
  burgundy: "#481D30",
  wine: "#792D49",
  gold: "#B98C4E",
  goldSoft: "#E5C48B",
  ink: "#2E1A20",
  body: "#5E4A44",
  line: "#E7D9C6",
};

export const SERIF = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif";
export const SANS = "-apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
  <tr><td bgcolor="${C.burgundy}" style="background:${C.burgundy};">
    <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:17px 38px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#FFF6E9;text-decoration:none;border:1px solid ${C.burgundy};">${esc(label)}</a>
  </td></tr></table>`;
}

export function divider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  <td style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td>
  <td width="14" align="center" style="color:${C.gold};font-size:10px;line-height:10px;padding:0 10px;">&#9670;</td>
  <td style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

export function layout({ preheader, body }: { preheader: string; body: string }) {
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>SEVOURA</title>
<style>
  @media (max-width:620px){ .px{padding-left:22px!important;padding-right:22px!important} .h1{font-size:34px!important;line-height:40px!important} .stack{display:block!important;width:100%!important;box-sizing:border-box!important} }
  a{color:${C.wine}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.ivory};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.ivory}" style="background:${C.ivory};">
<tr><td align="center" style="padding:32px 12px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
    <!-- burgundy band with the wordmark -->
    <tr><td bgcolor="${C.burgundy}" align="center" style="background:${C.burgundy};padding:34px 24px 30px;border-top:3px solid ${C.goldSoft};">
      <a href="${SITE}" target="_blank" style="text-decoration:none;">
        <img src="${SITE}/_next/image?url=%2Fsevoura-logo.png&amp;w=640&amp;q=75" width="200" alt="SEVOURA" style="display:block;width:200px;max-width:60%;height:auto;border:0;margin:0 auto;">
      </a>
      <p style="margin:16px 0 0;font-family:${SANS};font-size:10px;letter-spacing:4px;color:${C.goldSoft};">CLEANSE &nbsp;·&nbsp; ELEVATE &nbsp;·&nbsp; RADIATE</p>
    </td></tr>
    <!-- content card -->
    <tr><td bgcolor="${C.paper}" class="px" style="background:${C.paper};padding:44px 48px 46px;border-left:1px solid ${C.line};border-right:1px solid ${C.line};">
      ${body}
    </td></tr>
    <!-- footer -->
    <tr><td bgcolor="${C.paper}" align="center" class="px" style="background:${C.paper};padding:0 48px 34px;border:1px solid ${C.line};border-top:0;">
      ${divider()}
      <p style="margin:22px 0 6px;font-family:${SERIF};font-size:18px;font-style:italic;color:${C.wine};">Written in the stars. Worn as your signature.</p>
      <p style="margin:0;font-family:${SANS};font-size:12px;line-height:20px;color:${C.body};">
        Questions? Simply reply to this email or write to <a href="mailto:hello@sevoura.com" style="color:${C.wine};">hello@sevoura.com</a>
      </p>
      <p style="margin:14px 0 0;font-family:${SANS};font-size:11px;letter-spacing:1px;color:#9A8070;">
        <a href="${SITE}" style="color:#9A8070;text-decoration:none;">sevoura.com</a> &nbsp;·&nbsp; © ${new Date().getFullYear()} SEVOURA
      </p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
