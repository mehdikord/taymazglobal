import type { Metadata } from "next";
import { Boxes, ShieldCheck, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ProductCard } from "@/components/products/product-card";
import { ProductFiltersBar } from "@/components/products/product-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import type { AppLocale } from "@/i18n/routing";
import { getProductCategories } from "@/lib/repositories/categories";
import { getProducts } from "@/lib/repositories/products";
import type { ProductFilters, ProductType } from "@/types";

type ProductsPageProps = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ q?: string; category?: string; type?: string; price?: string }>;
};

function parseFilters(searchParams: { q?: string; category?: string; type?: string; price?: string }): ProductFilters {
  const filters: ProductFilters = {};
  if (searchParams.q) filters.q = searchParams.q;
  if (searchParams.category) filters.category = searchParams.category;
  if (searchParams.type === "physical" || searchParams.type === "service") filters.type = searchParams.type as ProductType;
  if (searchParams.price === "fixed" || searchParams.price === "inquiry") filters.price = searchParams.price;
  return filters;
}

export async function generateMetadata({ params }: Omit<ProductsPageProps, "searchParams">): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Products" });
  return { title: translations("metaTitle"), description: translations("metaDescription") };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  setRequestLocale(locale);

  const products = await getTranslations({ locale, namespace: "Products" });
  const filters = parseFilters(resolvedSearchParams);
  const [results, categories] = await Promise.all([
    getProducts(filters, locale),
    getProductCategories(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={products("eyebrow")}
        title={products("title")}
        description={products("description")}
        breadcrumbs={[{ href: "/", label: products("breadcrumbHome") }]}
        breadcrumbLabel={products("breadcrumbLabel")}
      />

      <section className="relative overflow-hidden bg-[#f6f8fb] py-8 sm:py-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-52 top-16 size-[28rem] rounded-full bg-brand-navy/5 blur-3xl"
        />
        <div className="container-shell relative">
          <div className="mb-7 grid overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_16px_45px_-36px_rgba(15,23,42,0.45)] sm:grid-cols-3">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-e">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy-soft text-brand-navy">
                <Boxes aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{products("catalogBenefitTitle")}</p>
                <p className="mt-0.5 text-xs text-slate-500">{products("catalogBenefitDescription")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-e">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{products("qualityBenefitTitle")}</p>
                <p className="mt-0.5 text-xs text-slate-500">{products("qualityBenefitDescription")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-brand-red">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{products("supportBenefitTitle")}</p>
                <p className="mt-0.5 text-xs text-slate-500">{products("supportBenefitDescription")}</p>
              </div>
            </div>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-7">
            <ProductFiltersBar
              key={`${filters.q ?? ""}-${filters.category ?? ""}-${filters.type ?? ""}-${filters.price ?? ""}`}
              locale={locale}
              initialFilters={filters}
              resultCount={results.length}
              categories={categories}
            />

            <div className="min-w-0">
              <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_30px_-28px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">{products("browseTitle")}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{products("browseDescription")}</p>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-brand-navy-soft px-3 py-2 text-xs font-bold text-brand-navy">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-white font-black shadow-sm">
                    {results.length}
                  </span>
                  {products("resultsCount")}
                </div>
              </div>

              {results.length === 0 ? (
                <div className="rounded-[1.6rem] border border-slate-200 bg-white py-8">
                  <EmptyState
                    title={products("emptyTitle")}
                    description={products("emptyDescription")}
                    actionLabel={products("clearAll")}
                    actionHref="/products"
                  />
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((product) => (
                    <ProductCard key={product.slug} product={product} locale={locale} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
