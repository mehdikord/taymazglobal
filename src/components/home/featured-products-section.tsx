import { ArrowLeft, ArrowRight, PackageCheck } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import type { HomeTeaser } from "@/types";

type FeaturedProductsSectionProps = {
  items: HomeTeaser[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
  viewAllLabel: string;
};

const PRODUCT_COPY: Record<AppLocale, string> = {
  fa: "مشاهده جزئیات",
  en: "Explore product",
  tr: "Ürünü incele",
  ru: "Подробнее о товаре",
};

export function FeaturedProductsSection({ items, locale, eyebrow, title, description, viewAllLabel }: FeaturedProductsSectionProps) {
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="featured-products-section relative isolate overflow-hidden bg-[#f8fafc] py-20 sm:py-28">
      <div aria-hidden="true" className="featured-products-grid absolute inset-0" />

      <div className="container-shell relative">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.2em] text-brand-red">
              <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
              {eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">{description}</p>
          </div>
          <Link href="/products" className="group inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-brand-navy px-5 text-sm font-bold text-white shadow-[0_15px_30px_-16px_rgb(18_57_119_/_0.75)] transition hover:-translate-y-0.5 hover:bg-brand-red focus-ring">
            {viewAllLabel}
            <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"><Arrow aria-hidden="true" className="size-4" /></span>
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <Link key={item.slug} href={item.href} className="featured-product-card group relative flex min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-[#dfe7f1] bg-white p-5 shadow-[0_16px_34px_-28px_rgb(15_23_42_/_0.45)] transition duration-300 hover:-translate-y-1 hover:border-brand-navy/30 hover:shadow-[0_24px_42px_-26px_rgb(18_57_119_/_0.35)] sm:p-6">
              <div aria-hidden="true" className="featured-product-accent absolute inset-x-0 top-0 h-1 bg-brand-red" />

              <div className="featured-product-visual relative flex h-32 items-center justify-between overflow-hidden rounded-xl bg-[#f2f6fb] px-5">
                <div aria-hidden="true" className="featured-product-visual-ring absolute -end-7 -top-10 size-36 rounded-full border border-brand-navy/10" />
                <div aria-hidden="true" className="featured-product-visual-line absolute bottom-5 start-0 h-px w-20 bg-brand-navy/15" />
                <span className="relative flex size-12 items-center justify-center rounded-xl border border-brand-navy/10 bg-white text-brand-navy shadow-sm">
                  <PackageCheck aria-hidden="true" className="size-5" />
                </span>
                <span className="relative font-mono text-3xl font-bold tracking-[-0.12em] text-brand-navy/15">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-6">
                <p className="text-xs font-extrabold tracking-wide text-brand-red">{getLocalizedText(item.category, locale)}</p>
                <h3 className="mt-3 text-balance text-xl font-extrabold leading-tight text-brand-navy transition-colors group-hover:text-brand-red sm:text-[1.35rem]">{getLocalizedText(item.title, locale)}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{getLocalizedText(item.summary, locale)}</p>
              </div>

              <span className="mt-auto flex items-center justify-between border-t border-[#e7edf4] pt-5 text-sm font-bold text-brand-navy">
                <span>{PRODUCT_COPY[locale]}</span>
                <span className="flex size-9 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition duration-300 group-hover:border-brand-red group-hover:bg-brand-red group-hover:text-white"><Arrow aria-hidden="true" className="size-4" /></span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
