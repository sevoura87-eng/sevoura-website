import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const styles = {
    info: "border-[#DCCAB0] bg-[#F6EFE3] text-[#6B5440]",
    error: "border-[#E2B3B3] bg-[#FBEDED] text-[#8A2E2E]",
    success: "border-[#B9CFA8] bg-[#EEF5E8] text-[#3E5B2E]",
  }[tone];
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 border px-4 py-3 text-[15px] leading-6 ${styles}`}>
      <Icon size={17} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
