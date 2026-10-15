"use client";

import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { ProductCategory, ProductFilters, ProductType } from "@/types";

type ProductFiltersBarProps = {
  locale: AppLocale;
  initialFilters: ProductFilters;
  resultCount: number;
  categories: ProductCategory[];
};

export function ProductFiltersBar({ locale, initialFilters, resultCount, categories }: ProductFiltersBarProps) {
  const products = useTranslations("Products");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialFilters.q ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const replaceFilters = useCallback(
    (next: ProductFilters) => {
      const params = new URLSearchParams();
      if (next.q) params.set("q", next.q);
      if (next.category) params.set("category", next.category);
      if (next.type) params.set("type", next.type);
      if (next.price) params.set("price", next.price);

      const search = params.toString();
      startTransition(() => {
        router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  const updateFilters = useCallback(
    (updates: Partial<ProductFilters>) => {
      replaceFilters({ ...initialFilters, ...updates });
    },
    [initialFilters, replaceFilters],
  );

  const clearFilter = (key: keyof ProductFilters) => {
    const next = { ...initialFilters };
    delete next[key];
    replaceFilters(next);
  };

  const clearAll = () => {
    setQuery("");
    replaceFilters({});
  };

  const activeFilters: { key: keyof ProductFilters; label: string }[] = [];
  if (initialFilters.q) activeFilters.push({ key: "q", label: `"${initialFilters.q}"` });
  if (initialFilters.category) {
    const category = categories.find((item) => item.slug === initialFilters.category);
    if (category) activeFilters.push({ key: "category", label: getLocalizedText(category.title, locale) });
  }
  if (initialFilters.type) {
    activeFilters.push({
      key: "type",
      label: initialFilters.type === "physical" ? products("typePhysical") : products("typeService"),
    });
  }
  if (initialFilters.price) {
    activeFilters.push({
      key: "price",
      label: initialFilters.price === "inquiry" ? products("priceInquiry") : products("priceFixed"),
    });
  }

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
                <h2 className="text-sm font-extrabold text-slate-900">{products("filtersTitle")}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  <span className="font-black text-brand-navy">{resultCount}</span> {products("resultsCount")}
                </p>
              </div>
            </div>
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-red transition-colors hover:text-brand-red-dark"
              >
                <RotateCcw aria-hidden="true" className="size-3.5" />
                {products("clearAll")}
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") updateFilters({ q: query.trim() || undefined });
                }}
                placeholder={products("searchPlaceholder")}
                className="min-h-12 border-slate-200 bg-slate-50 ps-10"
                aria-label={products("searchPlaceholder")}
              />
            </div>
            <Button
              onClick={() => updateFilters({ q: query.trim() || undefined })}
              disabled={isPending}
              size="icon"
              className="size-12 rounded-xl"
              aria-label={products("search")}
            >
              <Search aria-hidden="true" className="size-4" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="mt-3 flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-200 px-3.5 text-sm font-bold text-brand-navy lg:hidden"
            aria-expanded={filtersOpen}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              {filtersOpen ? products("hideFilters") : products("showFilters")}
              {activeFilters.length > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-brand-red text-[0.65rem] text-white">
                  {activeFilters.length}
                </span>
              )}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn("size-4 transition-transform", filtersOpen && "rotate-180")}
            />
          </button>
        </div>

        <div className={cn("space-y-6 p-4 sm:p-5", !filtersOpen && "hidden lg:block")}>
          <FilterGroup title={products("categoryLabel")}>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <FilterOption
                active={!initialFilters.category}
                onClick={() => updateFilters({ category: undefined })}
                label={products("allCategories")}
              />
              {categories.map((category) => (
                <FilterOption
                  key={category.slug}
                  active={initialFilters.category === category.slug}
                  onClick={() =>
                    updateFilters({
                      category: initialFilters.category === category.slug ? undefined : category.slug,
                    })
                  }
                  label={getLocalizedText(category.title, locale)}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title={products("filterType")}>
            <div className="grid grid-cols-2 gap-2">
              {(["physical", "service"] as ProductType[]).map((type) => (
                <FilterOption
                  key={type}
                  active={initialFilters.type === type}
                  onClick={() => updateFilters({ type: initialFilters.type === type ? undefined : type })}
                  label={type === "physical" ? products("typePhysical") : products("typeService")}
                  centered
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title={products("filterPrice")}>
            <div className="grid grid-cols-2 gap-2">
              <FilterOption
                active={initialFilters.price === "fixed"}
                onClick={() =>
                  updateFilters({ price: initialFilters.price === "fixed" ? undefined : "fixed" })
                }
                label={products("priceFixed")}
                centered
              />
              <FilterOption
                active={initialFilters.price === "inquiry"}
                onClick={() =>
                  updateFilters({ price: initialFilters.price === "inquiry" ? undefined : "inquiry" })
                }
                label={products("priceInquiry")}
                centered
              />
            </div>
          </FilterGroup>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => clearFilter(filter.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-navy/10 bg-white px-3 py-1.5 text-xs font-bold text-brand-navy shadow-sm transition-colors hover:border-brand-red/20 hover:text-brand-red"
            >
              <span className="max-w-32 truncate">{filter.label}</span>
              <X aria-hidden="true" className="size-3" />
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-extrabold text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

function FilterOption({
  active,
  onClick,
  label,
  centered = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  centered?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-10 items-center rounded-xl border px-3 text-xs font-bold transition-all duration-200",
        centered && "justify-center text-center",
        active
          ? "border-brand-navy bg-brand-navy text-white shadow-[0_8px_20px_-12px_rgba(18,57,119,0.75)]"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-navy/25 hover:bg-brand-navy-soft/60 hover:text-brand-navy",
      )}
    >
      {label}
    </button>
  );
}
