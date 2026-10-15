import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalDocument } from "@/components/legal/legal-document";
import { PageHero } from "@/components/shared/page-hero";
import { TERMS_SECTIONS } from "@/data/legal";
import type { AppLocale } from "@/i18n/routing";

type TermsPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Legal" });
  return { title: translations("termsTitle"), description: translations("termsDescription") };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await getTranslations({ locale, namespace: "Legal" });

  return (
    <>
      <PageHero eyebrow={legal("eyebrow")} title={legal("termsTitle")} description={legal("termsDescription")} />
      <section className="py-12 sm:py-16">
        <div className="container-shell">
          <LegalDocument sections={TERMS_SECTIONS} locale={locale} updatedLabel={legal("updatedLabel")} updatedDate={legal("updatedDate")} />
        </div>
      </section>
    </>
  );
}
