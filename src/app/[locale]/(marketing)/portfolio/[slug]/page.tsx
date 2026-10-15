import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CtaSection } from "@/components/home/cta-section";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { PortfolioMetrics, PortfolioRoute, PortfolioStory } from "@/components/portfolio/portfolio-detail-sections";
import { RelatedPortfolio } from "@/components/portfolio/related-portfolio";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getPortfolioBySlug, getRelatedPortfolio } from "@/lib/repositories/portfolio";
import { getServiceBySlug } from "@/lib/repositories/services";
import { cn } from "@/lib/utils";

type PortfolioDetailPageProps = { params: Promise<{ locale: AppLocale; slug: string }> };

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) return {};
  return {
    title: getLocalizedText(item.title, locale),
    description: getLocalizedText(item.summary, locale),
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getPortfolioBySlug(slug);
  if (!item) notFound();

  const portfolio = await getTranslations({ locale, namespace: "Portfolio" });
  const home = await getTranslations({ locale, namespace: "Home" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const [related, service] = await Promise.all([
    getRelatedPortfolio(item),
    getServiceBySlug(item.serviceSlug),
  ]);
  const title = getLocalizedText(item.title, locale);
  const country = getLocalizedText(item.country, locale);
  const isRtl = locale === "fa";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", item.gradient)} />
        <div className="absolute inset-0 bg-brand-navy-dark/80" />
        <div className="portfolio-card-grid absolute inset-0 opacity-10" aria-hidden="true" />
        <div aria-hidden="true" className="absolute -end-28 -top-28 size-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -start-24 bottom-0 size-72 rounded-full bg-brand-red/15 blur-3xl" />

        <div className="container-shell relative py-14 sm:py-20 lg:py-24">
          <div className="max-w-3xl text-white">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-bold text-white/70 transition-colors hover:text-white"
            >
              <BackArrow aria-hidden="true" className="size-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
              {portfolio("viewAll")}
            </Link>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Badge className="border border-white/15 bg-white/10 px-3 py-1.5 text-white backdrop-blur-sm">{item.year}</Badge>
              <Badge className="border-0 bg-brand-red px-3 py-1.5 text-white">{country}</Badge>
              {service && (
                <Badge className="border border-white/15 bg-white/10 px-3 py-1.5 text-white backdrop-blur-sm">
                  {getLocalizedText(service.title, locale)}
                </Badge>
              )}
            </div>

            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">{getLocalizedText(item.summary, locale)}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">{portfolio("similarCta")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                <Link href="/portfolio">{portfolio("viewAll")}</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-white/[0.06] backdrop-blur-sm">
          <div className="container-shell py-6 sm:py-7">
            <PortfolioMetrics metrics={item.metrics} locale={locale} />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-shell space-y-10">
          <SectionHeading
            eyebrow={portfolio("eyebrow")}
            title={portfolio("storyTitle")}
            description={portfolio("storyDescription")}
          />
          <PortfolioRoute route={getLocalizedText(item.route, locale)} label={portfolio("routeLabel")} />
          <PortfolioStory
            item={item}
            locale={locale}
            challengeLabel={portfolio("challenge")}
            solutionLabel={portfolio("solution")}
            outcomeLabel={portfolio("outcome")}
          />
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-20">
        <div className="container-shell space-y-8">
          <SectionHeading title={portfolio("galleryTitle")} description={portfolio("galleryDescription")} />
          <PortfolioGallery
            gallery={item.gallery}
            locale={locale}
            closeLabel={common("closeMenu")}
            openLabel={portfolio("openGallery")}
          />
        </div>
      </section>

      <RelatedPortfolio items={related} locale={locale} />

      <CtaSection
        title={home("cta.title")}
        description={home("cta.description")}
        primaryLabel={home("cta.primary")}
        secondaryLabel={home("cta.secondary")}
      />
    </>
  );
}
