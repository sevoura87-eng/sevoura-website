"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

const base =
  "peer w-full border bg-[#FCF8F1] px-4 pb-2.5 pt-6 text-[14px] text-[#3B2028] outline-none transition-all duration-300 placeholder:text-transparent focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,154,89,.14)]";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, className = "", type = "text", ...rest },
  ref
) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div className={className}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={isPw && show ? "text" : type}
          placeholder={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${base} ${isPw ? "pr-12" : ""} ${
            error ? "border-[#B5485D]" : "border-[#DCCAB5] focus:border-[#B28B4E]"
          }`}
          {...rest}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#A77B4D] transition-all duration-300 peer-placeholder-shown:top-[17px] peer-placeholder-shown:text-[12px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[#9A8777] peer-focus:top-2 peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-[#A77B4D]"
        >
          {label}
        </label>
        {isPw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#9A8777] hover:text-[#792D49]"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[11px] text-[#A23B52]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[11px] text-[#9A8777]">{hint}</p>
      ) : null}
    </div>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: string[];
}

export function SelectField({ label, error, options, className = "", ...rest }: SelectProps) {
  const id = useId();
  return (
    <div className={className}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          className={`w-full appearance-none border bg-[#FCF8F1] px-4 pb-2.5 pt-6 text-[14px] text-[#3B2028] outline-none transition focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,154,89,.14)] ${
            error ? "border-[#B5485D]" : "border-[#DCCAB5] focus:border-[#B28B4E]"
          }`}
          {...rest}
        >
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <label htmlFor={id} className="pointer-events-none absolute left-4 top-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#A77B4D]">
          {label}
        </label>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#A77B4D]">▾</span>
      </div>
      {error && <p className="mt-1.5 text-[11px] text-[#A23B52]">{error}</p>}
    </div>
  );
}
