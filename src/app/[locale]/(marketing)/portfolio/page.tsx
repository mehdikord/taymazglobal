import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { PortfolioFiltersBar } from "@/components/portfolio/portfolio-filters";
import { CtaSection } from "@/components/home/cta-section";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import {
  getPortfolio,
  getPortfolioCountries,
  getPortfolioYears,
} from "@/lib/repositories/portfolio";
import { getServices } from "@/lib/repositories/services";
import type { PortfolioFilters } from "@/types";

type PortfolioPageProps = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ service?: string; country?: string; year?: string }>;
};

function parseFilters(searchParams: { service?: string; country?: string; year?: string }): PortfolioFilters {
  const filters: PortfolioFilters = {};
  if (searchParams.service) filters.service = searchParams.service;
  if (searchParams.country) filters.country = searchParams.country;
  if (searchParams.year) filters.year = Number(searchParams.year);
  return filters;
}

export async function generateMetadata({ params }: Omit<PortfolioPageProps, "searchParams">): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Portfolio" });
  return { title: translations("metaTitle"), description: translations("metaDescription") };
}

export default async function PortfolioPage({ params, searchParams }: PortfolioPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const portfolio = await getTranslations({ locale, namespace: "Portfolio" });
  const home = await getTranslations({ locale, namespace: "Home" });
  const filters = parseFilters(resolvedSearchParams);
  const [results, years, countries, allServices] = await Promise.all([
    getPortfolio(filters),
    getPortfolioYears(),
    getPortfolioCountries(),
    getServices(),
  ]);
  const serviceOptions = allServices.map((service) => ({
    slug: service.slug,
    label: getLocalizedText(service.title, locale),
  }));

  return (
    <>
      <PageHero
        eyebrow={portfolio("eyebrow")}
        title={portfolio("title")}
        description={portfolio("description")}
        breadcrumbs={[{ href: "/", label: portfolio("breadcrumbHome") }]}
        breadcrumbLabel={portfolio("breadcrumbLabel")}
      />
      <section className="relative overflow-hidden bg-[#f6f8fb] py-8 sm:py-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-52 top-16 size-[28rem] rounded-full bg-brand-navy/5 blur-3xl"
        />
        <div className="container-shell relative">
          <div className="grid items-start gap-6 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-7">
            <PortfolioFiltersBar
              key={`${filters.service ?? ""}-${filters.country ?? ""}-${filters.year ?? ""}`}
              locale={locale}
              initialFilters={filters}
              years={years}
              countries={countries}
              services={serviceOptions}
              resultCount={results.length}
            />

            <div className="min-w-0">
              <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_30px_-28px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">{portfolio("browseTitle")}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{portfolio("browseDescription")}</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-navy-soft px-3 py-2 text-xs font-bold text-brand-navy">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-white font-black shadow-sm">
                    {results.length}
                  </span>
                  {portfolio("resultsCount")}
                </div>
              </div>

              {results.length === 0 ? (
                <EmptyState
                  title={portfolio("emptyTitle")}
                  description={portfolio("emptyDescription")}
                  actionLabel={portfolio("clearAll")}
                  actionHref="/portfolio"
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((item) => (
                    <PortfolioCard key={item.slug} item={item} locale={locale} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <CtaSection
        title={home("cta.title")}
        description={home("cta.description")}
        primaryLabel={home("cta.primary")}
        secondaryLabel={home("cta.secondary")}
      />
    </>
  );
}
