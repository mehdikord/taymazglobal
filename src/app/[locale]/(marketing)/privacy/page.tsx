import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LegalDocument } from "@/components/legal/legal-document";
import { PageHero } from "@/components/shared/page-hero";
import { PRIVACY_SECTIONS } from "@/data/legal";
import type { AppLocale } from "@/i18n/routing";

type PrivacyPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Legal" });
  return { title: translations("privacyTitle"), description: translations("privacyDescription") };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legal = await getTranslations({ locale, namespace: "Legal" });

  return (
    <>
      <PageHero eyebrow={legal("eyebrow")} title={legal("privacyTitle")} description={legal("privacyDescription")} />
      <section className="py-12 sm:py-16">
        <div className="container-shell">
          <LegalDocument sections={PRIVACY_SECTIONS} locale={locale} updatedLabel={legal("updatedLabel")} updatedDate={legal("updatedDate")} />
        </div>
      </section>
    </>
  );
}
