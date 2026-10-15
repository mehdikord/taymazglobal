"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LANGUAGE_FLAGS: Record<AppLocale, string> = {
  fa: "🇮🇷",
  en: "🇬🇧",
  tr: "🇹🇷",
  ru: "🇷🇺",
};

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as AppLocale;
  const translations = useTranslations("Languages");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function changeLocale(nextLocale: AppLocale) {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className={cn("relative", !compact && "w-full")}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={translations("label")}
        aria-expanded={open}
        className={cn("flex min-h-10 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/65 px-3 text-xs font-bold text-brand-navy shadow-sm backdrop-blur-md transition hover:border-brand-navy/25 hover:bg-white focus-ring", !compact && "w-full justify-between")}
      >
        <span className="text-base leading-none" aria-hidden="true">{LANGUAGE_FLAGS[locale]}</span>
        {!compact && <span>{translations(locale)}</span>}
        {compact && <Languages className="size-3.5" aria-hidden="true" />}
        <ChevronDown className={cn("size-3.5 text-muted transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute end-0 top-[calc(100%+.5rem)] z-50 min-w-40 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-[0_20px_45px_-18px_rgb(15_23_42_/_0.35)] backdrop-blur-xl">
          {routing.locales.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => changeLocale(item)}
              className={cn("flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-start text-xs font-bold text-brand-navy transition hover:bg-brand-navy-soft", locale === item && "bg-brand-navy-soft")}
            >
              <span className="text-base leading-none" aria-hidden="true">{LANGUAGE_FLAGS[item]}</span>
              <span className="flex-1">{translations(item)}</span>
              {locale === item && <Check className="size-3.5 text-brand-red" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
