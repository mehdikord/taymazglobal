import { getTranslations, setRequestLocale } from "next-intl/server";

import { AccountGuard } from "@/components/account/account-guard";
import { AccountNav } from "@/components/account/account-nav";
import type { AppLocale } from "@/i18n/routing";

type AccountLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AccountLayout({ children, params }: AccountLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations({ locale: locale as AppLocale, namespace: "Account" });

  return (
    <AccountGuard loginPath="/auth/login">
      <div className="min-h-[calc(100vh-4.5rem)]">
        {/* هدر صفحه */}
        <div className="border-b bg-surface">
          <div className="container-shell py-6">
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand-red">
              {t("eyebrow")}
            </p>
          </div>
        </div>

        {/* بدنه اصلی */}
        <div className="container-shell py-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
            {/* سایدبار ناوبری */}
            <aside>
              <AccountNav />
            </aside>

            {/* محتوای صفحه */}
            <main id="account-content">{children}</main>
          </div>
        </div>
      </div>
    </AccountGuard>
  );
}
