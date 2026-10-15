"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="footer-top group inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-3 text-xs font-bold text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-ring"
    >
      {label}
      <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
    </button>
  );
}
