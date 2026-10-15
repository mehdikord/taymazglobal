import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function SiteLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const common = useTranslations("Common");
  return <Link href="/" className={cn("group inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-3 focus-visible:outline-brand-red", className)} aria-label={common("brandName")}><span aria-hidden="true" className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-navy text-white shadow-[0_10px_24px_-14px_rgba(18,57,119,0.9)]"><span className="absolute -end-2 -top-3 size-7 rounded-full border-2 border-white/25" /><span className="absolute -bottom-2 -start-1 size-6 rounded-full bg-brand-red" /><span className="relative text-base font-extrabold tracking-tight">TG</span></span>{!compact && <span className="text-[0.95rem] font-extrabold tracking-tight text-brand-navy">{common("brandName")}</span>}</Link>;
}
