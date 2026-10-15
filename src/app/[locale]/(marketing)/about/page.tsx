import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin } from "lucide-react";

import { CtaSection } from "@/components/home/cta-section";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { ABOUT_TIMELINE, ABOUT_VALUES } from "@/data/home";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getOffices } from "@/lib/repositories/offices";

type AboutPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "About" });
  return { title: translations("metaTitle"), description: translations("metaDescription") };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const about = await getTranslations({ locale, namespace: "About" });
  const home = await getTranslations({ locale, namespace: "Home" });
  const offices = await getOffices();

  return (
    <>
      <PageHero
        eyebrow={about("eyebrow")}
        title={about("title")}
        description={about("description")}
        breadcrumbs={[{ href: "/", label: about("breadcrumbHome") }]}
        breadcrumbLabel={about("breadcrumbLabel")}
      />

      <section className="py-16 sm:py-20">
        <div className="container-shell max-w-3xl">
          <SectionHeading title={about("storyTitle")} description={about("storyDescription")} />
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-shell">
          <SectionHeading title={about("valuesTitle")} description={about("valuesDescription")} />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {ABOUT_VALUES.map((value) => (
              <Card key={getLocalizedText(value.title, locale)}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-extrabold text-brand-navy">{getLocalizedText(value.title, locale)}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{getLocalizedText(value.description, locale)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-shell">
          <SectionHeading title={about("timelineTitle")} description={about("timelineDescription")} />
          <ol className="relative mt-10 space-y-8 border-s border-border ps-8">
            {ABOUT_TIMELINE.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -start-[2.35rem] flex size-8 items-center justify-center rounded-full bg-brand-red text-xs font-extrabold text-white">
                  {item.year.slice(2)}
                </span>
                <h3 className="text-lg font-extrabold text-brand-navy">{getLocalizedText(item.title, locale)}</h3>
                <p className="mt-1 text-xs font-bold text-brand-red">{item.year}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{getLocalizedText(item.description, locale)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title={about("geographyTitle")} description={about("geographyDescription")} />
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-brand-navy shadow-[0_10px_26px_-22px_rgba(15,23,42,0.5)]">
              <MapPin aria-hidden="true" className="size-4 text-brand-red" />
              {offices.length} {about("officesCount")}
            </div>
          </div>

          {/* Office cards */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {offices.map((office) => (
              <article
                key={office.id}
                className="group relative flex flex-col overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-navy/15 hover:shadow-[0_26px_54px_-30px_rgba(18,57,119,0.42)]"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-navy-soft text-brand-navy transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-white">
                    <MapPin aria-hidden="true" className="size-5" />
                  </span>
                  {office.isHeadOffice && (
                    <span className="rounded-full bg-brand-red px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-wider text-white shadow-[0_8px_18px_-10px_rgba(252,20,34,0.8)]">
                      HQ
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-brand-navy">{getLocalizedText(office.city, locale)}</h3>
                <p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-muted">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-red" />
                  {getLocalizedText(office.country, locale)}
                </p>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-red to-brand-red-dark transition-transform duration-300 group-hover:scale-x-100"
                />
              </article>
            ))}
          </div>
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
