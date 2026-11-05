"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface BarDatum {
  label: string;      // axis label
  full: string;       // tooltip title
  value: number;      // plotted value
  secondary?: string; // tooltip extra line
}

/**
 * Single-series bar chart. One hue (brand burgundy), recessive grid,
 * 4px rounded data-ends, hover tooltip, and an accessible table fallback.
 */
export default function BarChart({
  data, format, height = 220, ariaLabel,
}: {
  data: BarDatum[]; format: (n: number) => string; height?: number; ariaLabel: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const nice = niceMax(max);
  const ticks = [0, 0.5, 1].map((t) => t * nice);
  const step = Math.ceil(data.length / 10);

  return (
    <div className="relative">
      <div className="flex gap-2" style={{ height }}>
        <div className="flex w-14 shrink-0 flex-col justify-between pb-6 text-right text-[10px] tabular-nums text-[#9A8777]">
          {[...ticks].reverse().map((t) => (
            <span key={t} className="-translate-y-1/2">{format(t)}</span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-x-0 bottom-6 top-0">
            {ticks.map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-[#E9DFD2]" style={{ bottom: `${(t / nice) * 100}%` }} />
            ))}
          </div>
          <div role="img" aria-label={ariaLabel} className="absolute inset-x-0 bottom-6 top-0 flex items-end gap-[2px]">
            {data.map((d, i) => (
              <div
                key={d.full}
                className="relative flex h-full flex-1 items-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / nice) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.012, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full rounded-t-[4px] ${hover === i ? "bg-[#501D32]" : "bg-[#792D49]"} ${d.value === 0 ? "min-h-[1px] bg-[#D9C7B4]" : ""}`}
                />
                {hover === i && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap border border-[#E2D5C3] bg-white px-3 py-2 text-[11px] shadow-lg">
                    <p className="font-medium text-[#3B2028]">{d.full}</p>
                    <p className="tabular-nums text-[#3B2028]">{format(d.value)}</p>
                    {d.secondary && <p className="text-[#9A8777]">{d.secondary}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-5 gap-[2px] text-[9px] text-[#9A8777]">
            {data.map((d, i) => (
              <span key={d.full} className="flex-1 truncate text-center">{i % step === 0 ? d.label : ""}</span>
            ))}
          </div>
        </div>
      </div>
      <details className="mt-3 text-[11px] text-[#806D60]">
        <summary className="cursor-pointer select-none">View as table</summary>
        <table className="mt-2 w-full text-left">
          <tbody>
            {data.map((d) => (
              <tr key={d.full} className="border-t border-[#EEE5D9]">
                <td className="py-1">{d.full}</td>
                <td className="py-1 text-right tabular-nums">{format(d.value)}</td>
                <td className="py-1 text-right text-[#9A8777]">{d.secondary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return m * p;
}
