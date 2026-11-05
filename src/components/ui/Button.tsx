"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "outline" | "ghost" | "gold";
  children: ReactNode;
}

const variants = {
  primary: "bg-[#792D49] text-[#FFF6E9] hover:bg-[#501D32] shadow-[0_12px_30px_rgba(83,29,51,.18)]",
  outline: "border border-[#792D49]/60 text-[#792D49] hover:bg-[#792D49] hover:text-white",
  ghost: "text-[#792D49] hover:bg-[#EFE1D0]",
  gold: "bg-[#E5C48B] text-[#4D1D35] hover:bg-[#F0D6A5]",
};

export default function Button({ loading, variant = "primary", className = "", children, disabled, ...rest }: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`sev-shine inline-flex items-center justify-center gap-3 px-7 py-4 text-[10px] font-semibold tracking-[0.22em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}
