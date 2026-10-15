import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Manrope, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getOffices } from "@/lib/repositories/offices";
import { getSiteSettings } from "@/lib/repositories/settings";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap"
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap"
});

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<LocaleLayoutProps, "children">): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const translations = await getTranslations({ locale: resolvedLocale, namespace: "Metadata" });
  const languageAlternates = Object.fromEntries(routing.locales.map((item) => [item, `/${item}`]));

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: translations("title"), template: `%s | ${SITE_NAME}` },
    description: translations("description"),
    alternates: { canonical: `/${resolvedLocale}`, languages: languageAlternates },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: resolvedLocale,
      title: translations("title"),
      description: translations("description"),
      url: `/${resolvedLocale}`
    },
    twitter: { card: "summary_large_image", title: translations("title"), description: translations("description") }
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const isValid = hasLocale(routing.locales, locale);
  const resolvedLocale = isValid ? locale : routing.defaultLocale;

  if (isValid) setRequestLocale(resolvedLocale);

  const messages = await getMessages({ locale: resolvedLocale });
  const common = await getTranslations({ locale: resolvedLocale, namespace: "Common" });
  const [settings, offices] = await Promise.all([getSiteSettings(), getOffices()]);
  const direction = locale === "fa" ? "rtl" : "ltr";

  if (!isValid) notFound();

  return (
    <html lang={locale} dir={direction} className={`${manrope.variable} ${vazirmatn.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
          <TooltipProvider delayDuration={250}>
            <a
              href="#main-content"
              className="fixed start-4 top-3 z-[100] -translate-y-24 rounded-xl bg-brand-red px-4 py-3 text-sm font-bold text-white transition-transform focus:translate-y-0"
            >
              {common("skipToContent")}
            </a>
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter settings={settings} offices={offices} />
            <Toaster />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
