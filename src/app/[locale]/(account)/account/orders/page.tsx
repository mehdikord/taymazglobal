import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AccountOrders } from "@/components/account/account-orders";
import type { AppLocale } from "@/i18n/routing";

type OrdersPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: OrdersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account" });
  return { title: t("orders.title"), description: t("orders.description") };
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccountOrders locale={locale} />;
}
