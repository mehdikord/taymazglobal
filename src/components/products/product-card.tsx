"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Package } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { formatProductPrice } from "@/lib/formatters/price";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  locale: AppLocale;
  variant?: "default" | "compact";
};

export function ProductCard({ product, locale, variant = "default" }: ProductCardProps) {
  const products = useTranslations("Products");
  const categoryTitle = product.categoryTitle
    ? getLocalizedText(product.categoryTitle, locale)
    : null;
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const title = getLocalizedText(product.title, locale);
  const summary = getLocalizedText(product.summary, locale);
  const cover = product.media[0];
  const priceLabel = formatProductPrice(product, locale, {
    inquiry: products("priceInquiry"),
    from: products("priceFrom"),
    perUnit: products("pricePerUnit"),
  });

  if (variant === "compact") {
    return (
      <article className="group/card flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_26px_-22px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-navy/15 hover:shadow-[0_20px_44px_-26px_rgba(18,57,119,0.38)] sm:flex-row">
        <Link
          href={`/products/${product.slug}`}
          className="group/image relative block aspect-[16/10] shrink-0 overflow-hidden bg-[#f1f3f5] sm:aspect-auto sm:w-36"
          aria-label={title}
        >
          {cover?.imageUrl ? (
            <Image
              src={cover.imageUrl}
              alt={getLocalizedText(cover.alt, locale)}
              fill
              sizes="144px"
              className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.05]"
            />
          ) : (
            <>
              <div className={cn("absolute inset-0 bg-gradient-to-br", cover?.gradient ?? "from-brand-navy to-brand-navy-soft")} />
              <Package aria-hidden="true" className="absolute inset-0 m-auto size-8 text-white/80" />
            </>
          )}
          {product.featured && (
            <Badge className="absolute start-2 top-2 border-0 bg-brand-red px-2 py-1 text-[0.62rem] text-white shadow-md">
              {products("featured")}
            </Badge>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-1 p-4">
          <p className="truncate text-[0.65rem] font-extrabold uppercase tracking-wider text-brand-red">
            {categoryTitle ? categoryTitle : products("allCategories")}
          </p>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="line-clamp-1 text-sm font-extrabold text-slate-900 transition-colors group-hover/card:text-brand-navy">
              {title}
            </h3>
          </Link>
          <p className="mt-auto truncate pt-1 text-xs font-bold text-muted">{priceLabel}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="group/card flex h-full min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_8px_30px_-22px_rgba(15,23,42,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-navy/15 hover:shadow-[0_24px_54px_-28px_rgba(18,57,119,0.38)]">
      <Link
        href={`/products/${product.slug}`}
        className="group/image relative block aspect-[4/3] overflow-hidden bg-[#f1f3f5]"
        aria-label={title}
      >
        {cover?.imageUrl ? (
          <Image
            src={cover.imageUrl}
            alt={getLocalizedText(cover.alt, locale)}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.05]"
          />
        ) : (
          <>
            <div className={cn("absolute inset-0 bg-gradient-to-br", cover?.gradient ?? "from-brand-navy to-brand-navy-soft")} />
            <Package aria-hidden="true" className="absolute inset-0 m-auto size-12 text-white/80" />
          </>
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.featured ? (
            <Badge className="border-0 bg-brand-red px-2.5 py-1.5 text-white shadow-[0_8px_20px_-10px_rgba(252,20,34,0.8)]">
              {products("featured")}
            </Badge>
          ) : (
            <span />
          )}
          <Badge className="border-white/60 bg-white/90 px-2.5 py-1.5 text-brand-navy shadow-sm backdrop-blur-md">
            {product.type === "physical" ? products("typePhysical") : products("typeService")}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4.5 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold text-brand-red">
            {categoryTitle ? categoryTitle : products("allCategories")}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 text-[0.7rem] font-bold text-emerald-700">
            <CheckCircle2 aria-hidden="true" className="size-3.5" />
            {products("available")}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="mt-2 block">
          <h3 className="line-clamp-2 text-[1.05rem] font-extrabold leading-7 text-slate-900 transition-colors group-hover/card:text-brand-navy">
            {title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">{summary}</p>

        <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={getLocalizedText(tag, locale)}
              className="rounded-md bg-slate-100 px-2 py-1 text-[0.68rem] font-bold text-slate-600"
            >
              {getLocalizedText(tag, locale)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold text-slate-400">{products("priceLabel")}</p>
            <p className="mt-0.5 truncate text-sm font-black text-brand-navy">{priceLabel}</p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy-soft text-brand-navy transition-all group-hover/card:bg-brand-navy group-hover/card:text-white"
            aria-label={`${products("viewProduct")} ${title}`}
          >
            <Arrow aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
