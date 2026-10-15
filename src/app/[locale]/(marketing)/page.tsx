import { getTranslations, setRequestLocale } from "next-intl/server";

import { AdvantagesSection, TeaserSection } from "@/components/home/advantages-section";
import { CountryNetworkSection } from "@/components/home/country-network-section";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturedServicesSection } from "@/components/home/featured-services-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { HomeHero } from "@/components/home/home-hero";
import { OfficesSection } from "@/components/home/offices-section";
import { ProcessSection } from "@/components/home/process-section";
import { StatsSection } from "@/components/home/stats-section";
import {
  ADVANTAGES,
  COUNTRY_MARKETS,
  FEATURED_PORTFOLIO_TEASERS,
  FEATURED_PRODUCT_TEASERS,
  PROCESS_STEPS,
  STATS,
} from "@/data/home";
import type { AppLocale } from "@/i18n/routing";
import { getOffices } from "@/lib/repositories/offices";
import { getFeaturedServices } from "@/lib/repositories/services";

type HomePageProps = { params: Promise<{ locale: AppLocale }> };

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const home = await getTranslations({ locale, namespace: "Home" });
  const [featuredServices, offices] = await Promise.all([
    getFeaturedServices(),
    getOffices(),
  ]);

  return (
    <>
      <HomeHero
        eyebrow={home("hero.eyebrow")}
        title={home("hero.title")}
        description={home("hero.description")}
        primaryCta={home("hero.primaryCta")}
        secondaryCta={home("hero.secondaryCta")}
      />
      <StatsSection stats={STATS} locale={locale} />
      <OfficesSection
        offices={offices}
        locale={locale}
        eyebrow={home("offices.eyebrow")}
        title={home("offices.title")}
        description={home("offices.description")}
        headOfficeLabel={home("offices.headOffice")}
      />
      <FeaturedServicesSection
        services={featuredServices}
        locale={locale}
        eyebrow={home("services.eyebrow")}
        title={home("services.title")}
        description={home("services.description")}
        viewAllLabel={home("services.viewAll")}
      />
      <CountryNetworkSection
        countries={COUNTRY_MARKETS}
        locale={locale}
        eyebrow={home("markets.eyebrow")}
        title={home("markets.title")}
        description={home("markets.description")}
      />
      <FeaturedProductsSection
        items={FEATURED_PRODUCT_TEASERS}
        locale={locale}
        eyebrow={home("products.eyebrow")}
        title={home("products.title")}
        description={home("products.description")}
        viewAllLabel={home("products.viewAll")}
      />
      <ProcessSection
        steps={PROCESS_STEPS}
        locale={locale}
        eyebrow={home("process.eyebrow")}
        title={home("process.title")}
        description={home("process.description")}
      />
      <TeaserSection
        items={FEATURED_PORTFOLIO_TEASERS}
        locale={locale}
        eyebrow={home("portfolio.eyebrow")}
        title={home("portfolio.title")}
        description={home("portfolio.description")}
        viewAllHref="/portfolio"
        viewAllLabel={home("portfolio.viewAll")}
      />
      <AdvantagesSection
        advantages={ADVANTAGES}
        stats={STATS}
        locale={locale}
        eyebrow={home("advantages.eyebrow")}
        title={home("advantages.title")}
        description={home("advantages.description")}
      />
      <CtaSection
        title={home("cta.title")}
        description={home("cta.description")}
        primaryLabel={home("cta.primary")}
        secondaryLabel={home("cta.secondary")}
      />
    </>
  );
}
