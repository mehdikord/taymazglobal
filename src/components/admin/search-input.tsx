"use client";

import { Search, X } from "lucide-react";
import { useRef } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "جست‌وجو…",
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function schedule(next: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next), debounceMs);
  }

  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => schedule(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl ps-10 pe-10"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="پاک کردن جست‌وجو"
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:text-slate-600"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
