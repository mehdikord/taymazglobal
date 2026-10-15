import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CtaSection } from "@/components/home/cta-section";
import { ServicesIndex } from "@/components/services/services-index";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getServices } from "@/lib/repositories/services";

type ServicesPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Services" });
  return { title: translations("metaTitle"), description: translations("metaDescription") };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const services = await getTranslations({ locale, namespace: "Services" });
  const home = await getTranslations({ locale, namespace: "Home" });
  const allServices = await getServices();
  const count = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(allServices.length);

  return (
    <>
      <section className="services-hero relative overflow-hidden bg-[#f4f7fc]">
        <div aria-hidden="true" className="services-hero-grid absolute inset-0" />
        <div aria-hidden="true" className="services-hero-aura services-hero-aura-one" />
        <div aria-hidden="true" className="services-hero-aura services-hero-aura-two" />
        <div className="container-shell relative pb-14 pt-6 sm:pb-20 sm:pt-8 lg:pb-24">
          <Breadcrumbs items={[{ href: "/", label: services("breadcrumbHome") }, { label: services("breadcrumbServices") }]} label={services("breadcrumbLabel")} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red">
                <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
                {services("eyebrow")}
              </p>
              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">{services("title")}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted sm:text-lg">{services("description")}</p>
            </div>
            <div className="flex flex-col gap-5 lg:items-end">
              <ul className="flex flex-wrap gap-2 lg:justify-end">
                <li className="services-hero-chip services-hero-chip-main">{services("count", { count })}</li>
                <li className="services-hero-chip">{services("factCountries")}</li>
                <li className="services-hero-chip">{services("factResponse")}</li>
              </ul>
              <Link href="/contact" className="group inline-flex min-h-12 w-fit items-center gap-3 rounded-xl bg-brand-red px-5 text-sm font-extrabold text-white shadow-[0_16px_30px_-16px_rgb(252_20_34_/_0.85)] transition hover:-translate-y-0.5 hover:bg-brand-red-dark focus-ring">
                {services("heroCta")}
                <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="services-list-section relative bg-[#f4f7fc] pb-20 sm:pb-28" aria-label={services("indexLabel")}>
        <div className="container-shell">
          <ServicesIndex services={allServices} locale={locale} />
        </div>
      </section>

      <CtaSection
        title={home("cta.title")}
        description={home("cta.description")}
        primaryLabel={home("cta.primary")}
        secondaryLabel={home("cta.secondary")}
      />
    </>
  );
}
