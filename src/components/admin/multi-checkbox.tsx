"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type MultiCheckboxProps = {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (next: string[]) => void;
  className?: string;
};

export function MultiCheckbox({ label, options, selected, onChange, className }: MultiCheckboxProps) {
  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  if (options.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-bold text-slate-700">{label}</Label>
        <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
          گزینه‌ای برای انتخاب وجود ندارد.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label className="text-sm font-bold text-slate-700">{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition",
                checked
                  ? "border-brand-red/30 bg-brand-red/5 text-slate-900"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              )}
            >
              <Checkbox checked={checked} onChange={() => toggle(option.value)} />
              <span className="truncate font-medium">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
