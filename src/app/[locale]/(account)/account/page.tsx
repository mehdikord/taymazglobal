import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AccountOverview } from "@/components/account/account-overview";
import type { AppLocale } from "@/i18n/routing";

type AccountPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: AccountPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account" });
  return { title: t("overview.title"), description: t("overview.description") };
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccountOverview locale={locale} />;
}
