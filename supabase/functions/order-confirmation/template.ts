import { C, SANS, SERIF, SITE, button, divider, esc, layout } from "./layout.ts";

export type ConfirmationOrder = {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string | null;
  ship_full_name: string | null;
  ship_phone: string | null;
  ship_house_number: string | null;
  ship_street_locality: string | null;
  ship_landmark: string | null;
  ship_city: string | null;
  ship_state: string | null;
  ship_pincode: string | null;
  subtotal_paise: number;
  shipping_paise: number;
  discount_paise: number;
  total_paise: number;
  payment_status: string;
  items: { product_name: string; quantity: number; unit_price_paise: number; line_total_paise: number }[];
};

const inr = (paise: number) =>
  "₹" + (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: 2 });

const dateIN = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

const PAYMENT_LABEL: Record<string, string> = { paid: "Paid", pending: "Pending", authorized: "Processing", failed: "Failed", refunded: "Refunded" };

/** delivery estimate from the published shipping policy (dispatch 1–2 business days, delivery 3–7) */
export const DELIVERY_NOTE = "Your order will be dispatched within 1–2 business days and typically arrives within 3–7 business days, depending on your location.";

export function firstName(o: ConfirmationOrder) {
  const n = (o.customer_name || o.ship_full_name || "").trim();
  return n ? n.split(/\s+/)[0] : "";
}

export function renderOrderConfirmation(o: ConfirmationOrder) {
  const name = firstName(o);
  const url = `${SITE}/account/orders/${o.id}`;
  const address = [
    o.ship_full_name,
    [o.ship_house_number, o.ship_street_locality].filter(Boolean).join(", "),
    o.ship_landmark ? `Landmark: ${o.ship_landmark}` : "",
    [o.ship_city, o.ship_state].filter(Boolean).join(", ") + (o.ship_pincode ? ` – ${o.ship_pincode}` : ""),
    o.ship_phone ? `Phone: ${o.ship_phone}` : "",
  ].filter((l) => l && l.trim());
  const payment = PAYMENT_LABEL[o.payment_status] ?? o.payment_status;

  const label = (t: string) => `<p style="margin:0 0 10px;font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:3px;color:${C.gold};">${t}</p>`;

  const items = o.items
    .map(
      (it) => `<tr>
      <td style="padding:14px 0;border-bottom:1px solid ${C.line};font-family:${SERIF};font-size:19px;line-height:24px;color:${C.ink};">
        ${esc(it.product_name)}
        <div style="margin-top:3px;font-family:${SANS};font-size:12px;color:${C.body};">Qty ${it.quantity} &nbsp;×&nbsp; ${inr(it.unit_price_paise)}</div>
      </td>
      <td align="right" valign="top" style="padding:14px 0 14px 12px;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:15px;color:${C.ink};white-space:nowrap;">${inr(it.line_total_paise)}</td>
    </tr>`,
    )
    .join("");

  const sumRow = (k: string, v: string, strong = false) => `<tr>
    <td style="padding:5px 0;font-family:${SANS};font-size:${strong ? 15 : 13}px;${strong ? `font-weight:600;color:${C.ink};` : `color:${C.body};`}">${k}</td>
    <td align="right" style="padding:5px 0;font-family:${strong ? SERIF : SANS};font-size:${strong ? 24 : 13}px;${strong ? `color:${C.burgundy};` : `color:${C.body};`}white-space:nowrap;">${v}</td></tr>`;

  const body = `
    <p style="margin:0 0 14px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:4px;color:${C.gold};text-align:center;">ORDER CONFIRMED</p>
    <h1 class="h1" style="margin:0;font-family:${SERIF};font-size:40px;line-height:46px;font-weight:500;color:${C.ink};text-align:center;">
      Thank you${name ? `, <span style="font-style:italic;color:${C.wine};">${esc(name)}</span>` : ""}.
    </h1>
    <p style="margin:18px auto 0;max-width:440px;font-family:${SANS};font-size:15px;line-height:25px;color:${C.body};text-align:center;">
      Your SEVOURA ritual is on its way to you. We are preparing your order with care — here are the details for your records.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:34px 0 30px;background:${C.ivory};border:1px solid ${C.line};">
      <tr>
        <td class="stack" width="50%" style="padding:18px 22px;">
          ${label("ORDER NUMBER")}
          <p style="margin:0;font-family:${SERIF};font-size:22px;color:${C.ink};">${esc(o.order_number)}</p>
        </td>
        <td class="stack" width="50%" style="padding:18px 22px;">
          ${label("ORDER DATE")}
          <p style="margin:0;font-family:${SERIF};font-size:22px;color:${C.ink};">${dateIN(o.created_at)}</p>
        </td>
      </tr>
    </table>

    ${label("YOUR ORDER")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line};">${items}</table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
      ${sumRow("Subtotal", inr(o.subtotal_paise))}
      ${o.discount_paise ? sumRow("Discount", "− " + inr(o.discount_paise)) : ""}
      ${sumRow("Shipping", o.shipping_paise ? inr(o.shipping_paise) : "Free")}
      <tr><td colspan="2" style="padding-top:8px;border-bottom:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr>
      ${sumRow("Total", inr(o.total_paise), true)}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0;">
      <tr>
        <td class="stack" width="58%" valign="top" style="padding:0 18px 22px 0;">
          ${label("SHIPPING TO")}
          <p style="margin:0;font-family:${SANS};font-size:14px;line-height:23px;color:${C.ink};">${address.map(esc).join("<br>")}</p>
        </td>
        <td class="stack" width="42%" valign="top" style="padding:0 0 22px;">
          ${label("PAYMENT")}
          <p style="margin:0;font-family:${SANS};font-size:14px;line-height:23px;color:${C.ink};">
            <span style="display:inline-block;padding:3px 10px;background:${o.payment_status === "paid" ? "#EAF2E6" : C.ivory};color:${o.payment_status === "paid" ? "#3E6B35" : C.body};font-size:12px;font-weight:600;letter-spacing:1px;">${esc(payment.toUpperCase())}</span><br>
            <span style="font-size:12px;color:${C.body};">Paid securely online</span>
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 34px;">
      <tr><td style="padding:16px 20px;border-left:2px solid ${C.goldSoft};background:${C.ivory};font-family:${SANS};font-size:13px;line-height:21px;color:${C.body};">
        <strong style="color:${C.ink};font-weight:600;">Delivery</strong> — ${esc(DELIVERY_NOTE)} We'll email you as soon as it ships.
      </td></tr>
    </table>

    ${button("View your order", url)}
    <p style="margin:26px 0 30px;font-family:${SANS};font-size:12px;line-height:19px;color:#9A8070;text-align:center;">
      Or open <a href="${esc(url)}" style="color:${C.wine};">your order page</a> anytime from your SEVOURA account.
    </p>
    ${divider()}
    <p style="margin:24px 0 0;font-family:${SERIF};font-size:18px;line-height:27px;font-style:italic;color:${C.body};text-align:center;">
      Begin each day with intention — wear the fragrance of its planet,<br>and let your ritual become your signature.
    </p>`;

  const text = [
    `Thank you${name ? `, ${name}` : ""}.`,
    "",
    "Your SEVOURA order is confirmed.",
    "",
    `Order number: ${o.order_number}`,
    `Order date: ${dateIN(o.created_at)}`,
    "",
    ...o.items.map((it) => `${it.product_name} — Qty ${it.quantity} × ${inr(it.unit_price_paise)} = ${inr(it.line_total_paise)}`),
    "",
    `Subtotal: ${inr(o.subtotal_paise)}`,
    ...(o.discount_paise ? [`Discount: −${inr(o.discount_paise)}`] : []),
    `Shipping: ${o.shipping_paise ? inr(o.shipping_paise) : "Free"}`,
    `Total: ${inr(o.total_paise)}`,
    `Payment: ${payment}`,
    "",
    "Shipping to:",
    ...address,
    "",
    DELIVERY_NOTE,
    "",
    `View your order: ${url}`,
    "",
    "Questions? Reply to this email or write to hello@sevoura.com",
    "SEVOURA — sevoura.com",
  ].join("\n");

  return {
    subject: "Thank You for Your Order — SEVOURA",
    html: layout({ preheader: `Order ${o.order_number} is confirmed — ${inr(o.total_paise)}. Here are your details.`, body }),
    text,
  };
}
