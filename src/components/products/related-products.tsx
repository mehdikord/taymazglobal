"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/types";

type RelatedProductsProps = {
  products: Product[];
  locale: AppLocale;
};

export function RelatedProducts({ products, locale }: RelatedProductsProps) {
  const t = useTranslations("Products");
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  if (products.length === 0) return null;

  return (
    <section className="border-t bg-surface py-12 sm:py-14">
      <div className="container-shell">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading title={t("relatedTitle")} description={t("relatedDescription")} />
          <Link
            href="/products"
            className="hidden shrink-0 items-center gap-2 text-sm font-bold text-brand-red hover:text-brand-red-dark sm:inline-flex"
          >
            {t("viewAll")}
            <Arrow aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
