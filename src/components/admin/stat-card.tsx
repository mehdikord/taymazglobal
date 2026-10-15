import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  brand: "bg-brand-navy/10 text-brand-navy",
  red: "bg-brand-red/10 text-brand-red",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-600",
} as const;

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  tone?: keyof typeof TONES;
};

export function StatCard({ icon: Icon, label, value, hint, tone = "brand" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={cn("inline-flex size-11 items-center justify-center rounded-xl", TONES[tone])}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <p className="mt-4 text-3xl font-extrabold tabular-nums text-slate-900">{value}</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {hint ? <p className="text-[11px] font-medium text-slate-400">{hint}</p> : null}
      </div>
    </div>
  );
}
