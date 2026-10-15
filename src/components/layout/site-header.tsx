"use client";

import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { MAIN_NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AccountButton } from "./account-button";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNavigation } from "./mobile-navigation";
import { SiteLogo } from "./site-logo";

const HOME_LABELS = { fa: "خانه", en: "Home", tr: "Ana sayfa", ru: "Главная" } as const;

export function SiteHeader() {
  const navigation = useTranslations("Navigation");
  const locale = useLocale() as keyof typeof HOME_LABELS;
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 px-3 py-3 sm:px-5">
      <div className="container-shell flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/[0.78] px-3 shadow-[0_14px_36px_-24px_rgb(15_23_42_/_0.4)] backdrop-blur-2xl sm:px-4">
        <SiteLogo className="rounded-xl px-1" />

        <nav aria-label={navigation("mainMenu")} className="hidden items-center rounded-xl border border-slate-200/80 bg-slate-100/55 p-1 lg:flex">
          {MAIN_NAVIGATION.map((item) => (
            <Link key={item.key} href={item.href} className={cn("flex min-h-9 items-center rounded-lg px-3 text-sm font-bold text-brand-navy transition hover:bg-white hover:text-brand-red hover:shadow-sm focus-ring", (item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`)) && "bg-white text-brand-red shadow-sm")}>
              {item.key === "home" ? HOME_LABELS[locale] : navigation(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 xl:flex">
          <LanguageSwitcher compact />
          <Button asChild size="sm" variant="secondary" className="rounded-xl">
            <Link href="/track">
              <Search aria-hidden="true" />
              {navigation("track")}
            </Link>
          </Button>
          <AccountButton />
        </div>

        <div className="flex items-center gap-1.5 xl:hidden">
          <AccountButton />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
