import { SlidersHorizontal } from "lucide-react";

type FilterBarProps = {
  children: React.ReactNode;
};

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
      <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400">
        <SlidersHorizontal className="size-3.5" aria-hidden="true" />
        فیلتر
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
