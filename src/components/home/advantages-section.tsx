import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { WhyTaymaz } from "@/components/home/why-taymaz";
import { Link } from "@/i18n/navigation";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import type { Advantage, HomeTeaser, StatItem } from "@/types";

type AdvantagesSectionProps = {
  advantages: Advantage[];
  stats: StatItem[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
};

export function AdvantagesSection(props: AdvantagesSectionProps) {
  return <WhyTaymaz {...props} />;
}

type TeaserSectionProps = {
  items: HomeTeaser[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
};

export function TeaserSection({ items, locale, eyebrow, title, description, viewAllHref, viewAllLabel }: TeaserSectionProps) {
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="recent-projects-section relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="container-shell relative">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.2em] text-brand-red"><span aria-hidden="true" className="h-px w-8 bg-brand-red" />{eyebrow}</p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">{description}</p>
          </div>
          <Link href={viewAllHref} className="group inline-flex min-h-11 w-fit items-center gap-2 border-b border-brand-navy/20 pb-1 text-sm font-bold text-brand-navy transition hover:border-brand-red hover:text-brand-red focus-ring">
            {viewAllLabel}
            <Arrow aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <Link key={item.slug} href={item.href} className="recent-project-card group flex overflow-hidden rounded-2xl border border-[#e1e8f1] bg-[#fbfcfe] transition duration-300 hover:-translate-y-1 hover:border-brand-navy/25 hover:bg-white hover:shadow-[0_20px_38px_-28px_rgb(18_57_119_/_0.38)]">
              <div className="relative w-[42%] shrink-0 overflow-hidden bg-brand-navy sm:w-[40%]">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={getLocalizedText(item.title, locale)} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-brand-navy" />
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/15 transition group-hover:bg-brand-navy/5" />
              </div>
              <div className="flex min-h-48 flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-extrabold tracking-wide text-brand-red">{getLocalizedText(item.category, locale)}</span>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition duration-300 group-hover:border-brand-red group-hover:bg-brand-red group-hover:text-white"><ArrowUpRight aria-hidden="true" className="size-3.5" /></span>
                </div>
                <h3 className="mt-4 text-balance text-lg font-extrabold leading-snug text-brand-navy transition-colors group-hover:text-brand-red sm:text-xl">{getLocalizedText(item.title, locale)}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{getLocalizedText(item.summary, locale)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
