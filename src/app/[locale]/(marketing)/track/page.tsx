import { Radar } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { TrackForm } from "@/components/track/track-form";
import { TrackResult } from "@/components/track/track-result";
import type { AppLocale } from "@/i18n/routing";
import { buildDotsPath, type DotMapConfig } from "@/lib/geo/dot-map";

const TEST_CODES = ["2026011500000001", "2026011500000002", "2026011500000003"];
const HERO_MAP: DotMapConfig = { lon0: -12, lon1: 100, lat0: 10, lat1: 68, width: 1120, height: 580, step: 1.6, radius: 3 };
const HERO_DOTS = buildDotsPath(HERO_MAP);

type TrackPageProps = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ code?: string }>;
};

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Track" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function TrackPage({ params, searchParams }: TrackPageProps) {
  const { locale } = await params;
  const { code } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Track" });

  return (
    <>
      <section className="track-hero relative isolate overflow-hidden bg-[#050f21] text-white">
        <div aria-hidden="true" className="track-hero-grid absolute inset-0" />
        <div aria-hidden="true" className="track-hero-aura track-hero-aura-one" />
        <div aria-hidden="true" className="track-hero-aura track-hero-aura-two" />
        <svg aria-hidden="true" className="track-hero-map absolute" viewBox={`0 0 ${HERO_MAP.width} ${HERO_MAP.height}`}>
          <path className="track-hero-dots" d={HERO_DOTS} />
        </svg>

        <div className="container-shell relative pb-16 pt-6 sm:pb-20 sm:pt-8">
          <div className="track-hero-breadcrumbs">
            <Breadcrumbs items={[{ href: "/", label: t("breadcrumbHome") }, { label: t("title") }]} label={t("breadcrumbLabel")} />
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              {t("heroBadge")}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">{t("description")}</p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <Suspense
              fallback={
                <div className="flex h-56 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.04]">
                  <span className="size-6 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
                </div>
              }
            >
              <TrackForm testCodes={TEST_CODES} />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="track-results relative bg-[#f4f7fc] py-10 sm:py-14">
        <div aria-hidden="true" className="track-results-grid absolute inset-0" />
        <div className="container-shell relative max-w-6xl">
          {code ? (
            <Suspense
              fallback={
                <div className="track-card flex items-center gap-3">
                  <span className="size-6 animate-spin rounded-full border-[3px] border-brand-navy border-t-transparent" />
                  <span className="text-sm font-bold text-muted">{t("submitting")}</span>
                </div>
              }
            >
              <TrackResult code={code} locale={locale} />
            </Suspense>
          ) : (
            <div className="track-empty">
              <span className="track-empty-icon">
                <Radar className="size-6" aria-hidden="true" />
              </span>
              <p className="text-sm font-bold text-brand-navy">{t("inputLabel")}</p>
              <p className="mt-1 max-w-md text-xs leading-6 text-muted">{t("heroHint")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
