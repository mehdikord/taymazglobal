import type { Metadata } from "next";
import { ArrowUpRight, Check, MapPin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ServiceInquiryForm } from "@/components/forms/service-inquiry-form";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getServiceBySlug, getServiceSlugs } from "@/lib/repositories/services";
import { getServiceIcon } from "@/lib/service-icons";

type ServiceDetailPageProps = { params: Promise<{ locale: AppLocale; slug: string }> };

export async function generateStaticParams() {
  return (await getServiceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: getLocalizedText(service.title, locale),
    description: getLocalizedText(service.summary, locale),
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const detail = await getTranslations({ locale, namespace: "Services" });
  const Icon = getServiceIcon(service.icon);
  const title = getLocalizedText(service.title, locale);

  return (
    <>
      <PageHero
        eyebrow={detail("detailEyebrow")}
        title={title}
        description={getLocalizedText(service.description, locale)}
        breadcrumbs={[
          { href: "/", label: detail("breadcrumbHome") },
          { href: "/services", label: detail("breadcrumbServices") },
          { label: title },
        ]}
        breadcrumbLabel={detail("breadcrumbLabel")}
      >
        <div className="flex size-20 items-center justify-center rounded-2xl border border-brand-navy/10 bg-white shadow-[0_18px_35px_-24px_rgb(18_57_119_/_0.42)]">
          <Icon aria-hidden="true" className="size-8 text-brand-navy" />
        </div>
      </PageHero>

      <section className="service-detail-overview py-12 sm:py-16">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_.42fr] lg:items-start">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e2eaf3] bg-white p-6 shadow-[0_16px_34px_-28px_rgb(18_57_119_/_0.3)] sm:p-7">
              <SectionHeading title={detail("benefitsTitle")} />
              <ul className="mt-6 space-y-4">
              {service.benefits.map((benefit) => (
                <li key={getLocalizedText(benefit, locale)} className="flex items-start gap-3 text-sm leading-7 text-muted">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red"><Check aria-hidden="true" className="size-3.5" /></span>
                  {getLocalizedText(benefit, locale)}
                </li>
              ))}
            </ul>
            </div>
            <div className="rounded-2xl border border-[#e2eaf3] bg-[#f8fbfe] p-6 sm:p-7">
              <SectionHeading title={detail("stepsTitle")} />
              <ol className="mt-6 space-y-5">
              {service.steps.map((step, index) => (
                <li key={getLocalizedText(step, locale)} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-extrabold text-white shadow-[0_8px_16px_-10px_rgb(18_57_119_/_0.9)]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-7 text-muted">{getLocalizedText(step, locale)}</p>
                </li>
              ))}
            </ol>
            </div>
          </div>

          <aside className="service-request-rail relative overflow-hidden rounded-2xl bg-brand-navy p-6 text-white shadow-[0_22px_42px_-28px_rgb(18_57_119_/_0.82)] sm:p-7">
            <div aria-hidden="true" className="absolute -end-12 -top-10 size-36 rounded-full border border-white/15" />
            <Icon aria-hidden="true" className="relative size-8 text-[#9ec9ff]" />
            <p className="relative mt-6 text-lg font-extrabold leading-8">{getLocalizedText(service.summary, locale)}</p>
            <div className="relative mt-6 flex flex-wrap gap-2">{service.tags.map((tag) => <Badge key={getLocalizedText(tag, locale)} className="border-white/15 bg-white/10 text-white">{getLocalizedText(tag, locale)}</Badge>)}</div>
            <Button asChild className="relative mt-8 w-full bg-brand-red hover:bg-brand-red-dark"><Link href="#inquiry-form">{detail("requestCta")}<ArrowUpRight aria-hidden="true" className="size-4" /></Link></Button>
          </aside>
        </div>
      </section>

      <section className="bg-[#f5f8fc] py-14 sm:py-16">
        <div className="container-shell grid gap-10 lg:grid-cols-[.78fr_1.22fr]">
          <div>
            <SectionHeading title={detail("countriesTitle")} description={detail("countriesDescription")} />
            <div className="mt-7 flex flex-wrap gap-2.5">
            {service.countries.map((country) => (
              <span key={getLocalizedText(country, locale)} className="inline-flex items-center gap-2 rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm font-bold text-brand-navy shadow-sm"><MapPin aria-hidden="true" className="size-3.5 text-brand-red" />{getLocalizedText(country, locale)}</span>
            ))}
            </div>
          </div>
          {service.faq.length > 0 && (
          <div>
            <SectionHeading title={detail("faqTitle")} />
            <Accordion type="single" collapsible className="mt-6 rounded-2xl border border-[#e2eaf3] bg-white px-5 sm:px-6">
              {service.faq.map((item, index) => (
                <AccordionItem key={getLocalizedText(item.question, locale)} value={`faq-${index}`}>
                  <AccordionTrigger>{getLocalizedText(item.question, locale)}</AccordionTrigger>
                  <AccordionContent>{getLocalizedText(item.answer, locale)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          )}
        </div>
      </section>

      <section id="inquiry-form" className="service-inquiry-section relative isolate overflow-hidden bg-[#071b38] py-16 text-white sm:py-20">
        <div aria-hidden="true" className="service-inquiry-grid absolute inset-0" />
        <div className="container-shell relative grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div className="max-w-md">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] text-[#9ec9ff]"><Icon aria-hidden="true" className="size-5" /></span>
            <h2 className="mt-6 text-balance text-3xl font-extrabold sm:text-4xl">{detail("formTitle")}</h2>
            <p className="mt-4 text-base leading-8 text-blue-100/75">{detail("formDescription")}</p>
          </div>
          <Card className="border-white/10 bg-white shadow-[0_28px_52px_-30px_rgb(0_0_0_/_0.75)]">
            <CardContent className="p-6 sm:p-8">
              <ServiceInquiryForm serviceSlug={service.slug} />
            </CardContent>
          </Card>
        </div>
      </section>

    </>
  );
}
