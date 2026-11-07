import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, paymentTone, statusTone } from "@/lib/format";

/** Online-payment-only store: an order is only "placed" once it is paid. */
export function isAwaitingPayment(status: OrderStatus, payment?: PaymentStatus) {
  return status === "order_placed" && payment !== undefined && payment !== "paid" && payment !== "authorized";
}

export function OrderStatusBadge({ status, payment }: { status: OrderStatus; payment?: PaymentStatus }) {
  const awaiting = isAwaitingPayment(status, payment);
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] ${
        awaiting ? "border-[#E6CF9C] bg-[#FBF1DC] text-[#8A5A12]" : statusTone(status)
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {awaiting ? "Awaiting payment" : ORDER_STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] ${paymentTone(status)}`}>
      {PAYMENT_STATUS_LABEL[status]}
    </span>
  );
}
