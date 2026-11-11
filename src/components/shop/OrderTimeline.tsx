"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { OrderStatus, StatusHistory } from "@/lib/types";
import { ORDER_STATUS_LABEL, formatDate } from "@/lib/format";

const FLOW: OrderStatus[] = ["order_placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

export default function OrderTimeline({ status, history }: { status: OrderStatus; history: StatusHistory[] }) {
  if (status === "cancelled") {
    const when = history.find((h) => h.to_status === "cancelled");
    return (
      <div className="flex items-center gap-4 border border-[#E2B3B3] bg-[#FBEDED] p-5 text-[#8A2E2E]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8A2E2E] text-white">
          <X size={18} />
        </span>
        <div>
          <p className="font-serif text-xl">This order was cancelled</p>
          <p className="text-[13px]">{when ? formatDate(when.created_at, true) : ""}{when?.note ? ` · ${when.note}` : ""}</p>
        </div>
      </div>
    );
  }
  const current = FLOW.indexOf(status);
  return (
    <ol className="relative grid gap-0 sm:grid-cols-6">
      {FLOW.map((s, i) => {
        const done = i <= current;
        const h = history.find((x) => x.to_status === s);
        return (
          <li key={s} className="relative flex gap-4 pb-6 sm:block sm:pb-0 sm:text-center">
            {i < FLOW.length - 1 && (
              <>
                <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-[#DCCAB5] sm:left-1/2 sm:top-[15px] sm:h-px sm:w-full" />
                <motion.span
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={{ scaleX: i < current ? 1 : 0, scaleY: i < current ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + i * 0.18 }}
                  className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px origin-top bg-[#792D49] sm:left-1/2 sm:top-[15px] sm:h-px sm:w-full sm:origin-left"
                />
              </>
            )}
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.18, type: "spring", stiffness: 300, damping: 18 }}
              className={`relative z-10 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border text-[13px] sm:mx-auto ${
                done ? "border-[#792D49] bg-[#792D49] text-white" : "border-[#D6BE99] bg-[#F8F1E7] text-[#A08A79]"
              } ${i === current ? "ring-4 ring-[#792D49]/15" : ""}`}
            >
              {done ? <Check size={14} /> : i + 1}
            </motion.span>
            <div className="sm:mt-3">
              <p className={`text-[14px] font-medium ${done ? "text-[#481D30]" : "text-[#A08A79]"}`}>{ORDER_STATUS_LABEL[s]}</p>
              {h && <p className="mt-0.5 text-[12px] text-[#9A8777]">{formatDate(h.created_at, true)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
