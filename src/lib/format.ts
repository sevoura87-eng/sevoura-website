import type { OrderStatus, PaymentStatus } from "./types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inrExact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** paise → "₹1,799" (shows decimals only when needed) */
export function formatINR(paise: number | null | undefined): string {
  const v = (paise ?? 0) / 100;
  return Number.isInteger(v) ? inr.format(v) : inrExact.format(v);
}

export function formatDate(iso: string | null | undefined, withTime = false): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  });
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(iso);
}

export const ORDER_STATUSES: OrderStatus[] = [
  "order_placed",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  order_placed: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Unpaid",
  authorized: "Payment Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export function statusTone(status: OrderStatus): string {
  switch (status) {
    case "delivered":
      return "bg-[#E4EEDC] text-[#3E5B2E] border-[#B9CFA8]";
    case "cancelled":
      return "bg-[#F4DADA] text-[#8A2E2E] border-[#E2B3B3]";
    case "shipped":
    case "out_for_delivery":
      return "bg-[#E2E8F2] text-[#2F4A72] border-[#B8C6DD]";
    case "confirmed":
    case "processing":
      return "bg-[#F3E6CF] text-[#7A5418] border-[#DDC197]";
    default:
      return "bg-[#F1E4EA] text-[#792D49] border-[#D9B4C3]";
  }
}

export function paymentTone(status: PaymentStatus): string {
  switch (status) {
    case "paid":
      return "bg-[#E4EEDC] text-[#3E5B2E] border-[#B9CFA8]";
    case "failed":
      return "bg-[#F4DADA] text-[#8A2E2E] border-[#E2B3B3]";
    case "refunded":
      return "bg-[#E2E8F2] text-[#2F4A72] border-[#B8C6DD]";
    default:
      return "bg-[#F6EFE3] text-[#7A6650] border-[#DCCAB0]";
  }
}
