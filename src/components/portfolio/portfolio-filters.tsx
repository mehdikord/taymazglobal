"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { PortfolioFilters } from "@/types";

type ServiceOption = { slug: string; label: string };

type PortfolioFiltersBarProps = {
  locale: AppLocale;
  initialFilters: PortfolioFilters;
  years: number[];
  countries: string[];
  services: ServiceOption[];
  resultCount: number;
};

export function PortfolioFiltersBar({
  locale,
  initialFilters,
  years,
  countries,
  services,
  resultCount,
}: PortfolioFiltersBarProps) {
  const portfolio = useTranslations("Portfolio");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const updateFilters = useCallback(
    (updates: Partial<PortfolioFilters>) => {
      const next: PortfolioFilters = { ...initialFilters, ...updates };
      const params = new URLSearchParams();
      if (next.service) params.set("service", next.service);
      if (next.country) params.set("country", next.country);
      if (next.year) params.set("year", String(next.year));
      const search = params.toString();
      startTransition(() => router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false }));
    },
    [initialFilters, pathname, router],
  );

  const clearAll = () => startTransition(() => router.replace(pathname, { scroll: false }));

  const hasFilters = Boolean(initialFilters.service || initialFilters.country || initialFilters.year);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.4)]">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-navy-soft text-brand-navy">
                <SlidersHorizontal aria-hidden="true" className="size-4" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">{portfolio("filterLabel")}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  <span className="font-black text-brand-navy">{resultCount}</span> {portfolio("resultsCount")}
                </p>
              </div>
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-red transition-colors hover:text-brand-red-dark"
              >
                <RotateCcw aria-hidden="true" className="size-3.5" />
                {portfolio("clearAll")}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <FilterGroup label={portfolio("filterService")}>
            <FilterPill
              active={!initialFilters.service}
              onClick={() => updateFilters({ service: undefined })}
              label={portfolio("allServices")}
            />
            {services.map((option) => {
              return (
                <FilterPill
                  key={option.slug}
                  active={initialFilters.service === option.slug}
                  onClick={() => updateFilters({ service: initialFilters.service === option.slug ? undefined : option.slug })}
                  label={option.label}
                />
              );
            })}
          </FilterGroup>

          <FilterGroup label={portfolio("filterCountry")}>
            <FilterPill
              active={!initialFilters.country}
              onClick={() => updateFilters({ country: undefined })}
              label={portfolio("allCountries")}
            />
            {countries.map((country) => (
              <FilterPill
                key={country}
                active={initialFilters.country === country}
                onClick={() => updateFilters({ country: initialFilters.country === country ? undefined : country })}
                label={country}
              />
            ))}
          </FilterGroup>

          <FilterGroup label={portfolio("filterYear")}>
            <FilterPill
              active={!initialFilters.year}
              onClick={() => updateFilters({ year: undefined })}
              label={portfolio("allYears")}
            />
            {years.map((year) => (
              <FilterPill
                key={year}
                active={initialFilters.year === year}
                onClick={() => updateFilters({ year: initialFilters.year === year ? undefined : year })}
                label={String(year)}
              />
            ))}
          </FilterGroup>
        </div>
      </div>
      {isPending && <p className="sr-only" aria-live="polite">{portfolio("filtering")}</p>}
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3.5 text-xs font-bold transition-all duration-200 focus-ring",
        active
          ? "border-brand-navy bg-brand-navy text-white shadow-[0_8px_18px_-12px_rgba(18,57,119,0.8)]"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-navy/30 hover:text-brand-navy",
      )}
    >
      {label}
    </button>
  );
}
