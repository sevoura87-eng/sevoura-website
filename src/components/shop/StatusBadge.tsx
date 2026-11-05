import type { OrderStatus, PaymentStatus } from "@/lib/types";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, paymentTone, statusTone } from "@/lib/format";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] ${statusTone(status)}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ORDER_STATUS_LABEL[status]}
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
