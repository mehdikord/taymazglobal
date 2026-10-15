"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

type PortfolioCardProps = {
  item: PortfolioItem;
  locale: AppLocale;
};

export function PortfolioCard({ item, locale }: PortfolioCardProps) {
  const portfolio = useTranslations("Portfolio");
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const title = getLocalizedText(item.title, locale);
  const summary = getLocalizedText(item.summary, locale);
  const country = getLocalizedText(item.country, locale);
  const cover = item.gallery[0];
  const coverAlt = cover ? getLocalizedText(cover.alt, locale) : title;
  const serviceTitle = item.serviceName ? getLocalizedText(item.serviceName, locale) : null;

  return (
    <article className="group/card flex h-full min-w-0 flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_8px_30px_-22px_rgba(15,23,42,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-navy/15 hover:shadow-[0_24px_54px_-28px_rgba(18,57,119,0.38)]">
      <Link
        href={`/portfolio/${item.slug}`}
        className="group/image relative block aspect-[4/3] overflow-hidden bg-[#f1f3f5]"
        aria-label={title}
      >
        {cover?.imageUrl ? (
          <Image
            src={cover.imageUrl}
            alt={coverAlt}
            fill
            sizes="(min-width: 1280px) 320px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.05]"
          />
        ) : (
          <PortfolioVisual item={item} />
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {item.featured ? (
            <Badge className="border-0 bg-brand-red px-2.5 py-1.5 text-white shadow-[0_8px_20px_-10px_rgba(252,20,34,0.8)]">
              {portfolio("featured")}
            </Badge>
          ) : (
            <span />
          )}
          <span className="rounded-lg bg-brand-navy-dark/45 px-2.5 py-1.5 text-[0.68rem] font-black tracking-widest text-white backdrop-blur-sm">
            {item.year}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4.5 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-1 truncate text-xs font-bold text-brand-navy/70">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-brand-red" />
            {country}
          </p>
          {serviceTitle && (
            <span className="shrink-0 truncate rounded-md bg-brand-navy-soft px-2 py-1 text-[0.68rem] font-extrabold text-brand-navy">
              {serviceTitle}
            </span>
          )}
        </div>

        <Link href={`/portfolio/${item.slug}`} className="mt-2 block">
          <h3 className="line-clamp-2 text-[1.02rem] font-extrabold leading-7 text-slate-900 transition-colors group-hover/card:text-brand-navy">
            {title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">{summary}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy transition-colors group-hover/card:text-brand-red">
            {portfolio("viewCase")}
            <Arrow aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/card:translate-x-1 rtl:group-hover/card:-translate-x-1" />
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-navy-soft text-brand-navy transition-all group-hover/card:bg-brand-navy group-hover/card:text-white">
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/card:rotate-45" />
          </span>
        </div>
      </div>
    </article>
  );
}

function PortfolioVisual({ item }: { item: PortfolioItem }) {
  const cover = item.gallery[0];
  return (
    <>
      <div className={cn("absolute inset-0 bg-gradient-to-br", cover?.gradient ?? "from-brand-navy to-brand-navy-soft")} />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,255,255,0.32),transparent_52%)]" />
      <div aria-hidden="true" className="portfolio-card-grid absolute inset-0 opacity-[0.14]" />
      <div aria-hidden="true" className="absolute -bottom-14 -end-14 size-40 rounded-full bg-white/10 blur-2xl" />
      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <path className="portfolio-visual-route" d="M18 168 C96 170, 96 58, 182 64 S252 148, 300 40" />
        <circle cx="18" cy="168" r="5" className="portfolio-visual-node" />
        <circle cx="182" cy="64" r="4" className="portfolio-visual-node opacity-70" />
        <circle cx="300" cy="40" r="6" className="fill-brand-red" />
      </svg>
    </>
  );
}
