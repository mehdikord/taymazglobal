import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AccountProfile } from "@/components/account/account-profile";
import type { AppLocale } from "@/i18n/routing";

type ProfilePageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account" });
  return { title: t("profile.title"), description: t("profile.description") };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccountProfile />;
}
