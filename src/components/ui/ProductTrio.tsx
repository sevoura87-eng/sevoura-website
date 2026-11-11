import ProductPhoto from "@/components/ProductPhoto";
import { SEVEN } from "@/components/home/data";

/** Three studio photographs composed like an editorial spread: a tall arched centre and two offset frames. */
export default function ProductTrio({ days, tone = "dark" }: { days: [string, string, string]; tone?: "dark" | "light" }) {
  const get = (d: string) => SEVEN.find((s) => s.day === d)!;
  const [l, c, r] = days.map(get);
  const rim = tone === "dark" ? "border-[#D6A64F]/45" : "border-[#A77B4D]/45";
  return (
    <div className="relative aspect-[5/6] w-full">
      <div className={`absolute left-0 top-[16%] w-[38%] border p-1.5 ${rim}`}>
        <ProductPhoto day={l.day} fragrance={l.fragrance} sizes="220px" className="aspect-[4/5]" />
      </div>
      <div className={`absolute right-0 top-[30%] w-[38%] border p-1.5 ${rim}`}>
        <ProductPhoto day={r.day} fragrance={r.fragrance} sizes="220px" className="aspect-[4/5]" />
      </div>
      <div className={`absolute left-1/2 top-0 w-[54%] -translate-x-1/2 rounded-t-[999px] border p-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)] ${rim}`}>
        <ProductPhoto day={c.day} fragrance={c.fragrance} priority sizes="320px" className="aspect-[3/4] rounded-t-[999px]" />
      </div>
    </div>
  );
}
