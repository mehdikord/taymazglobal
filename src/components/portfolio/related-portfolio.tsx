"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { PortfolioItem } from "@/types";

type RelatedPortfolioProps = {
  items: PortfolioItem[];
  locale: AppLocale;
};

export function RelatedPortfolio({ items, locale }: RelatedPortfolioProps) {
  const portfolio = useTranslations("Portfolio");
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  if (items.length === 0) return null;

  return (
    <section className="border-t bg-surface py-16 sm:py-20">
      <div className="container-shell">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading title={portfolio("relatedTitle")} description={portfolio("relatedDescription")} />
          <Link href="/portfolio" className="hidden items-center gap-2 text-sm font-bold text-brand-red hover:text-brand-red-dark sm:inline-flex">
            {portfolio("viewAll")}
            <Arrow aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PortfolioCard key={item.slug} item={item} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
