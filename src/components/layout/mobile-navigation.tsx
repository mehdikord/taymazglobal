"use client";

import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { MAIN_NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./language-switcher";
import { SiteLogo } from "./site-logo";

const HOME_LABELS = { fa: "خانه", en: "Home", tr: "Ana sayfa", ru: "Главная" } as const;

export function MobileNavigation() {
  const navigation = useTranslations("Navigation");
  const locale = useLocale() as keyof typeof HOME_LABELS;
  const common = useTranslations("Common");
  const pathname = usePathname();

  return (
    <div className="xl:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <IconButton variant="ghost" aria-label={common("openMenu")}>
            <Menu aria-hidden="true" />
          </IconButton>
        </SheetTrigger>
        <SheetContent side="end" closeLabel={common("closeMenu")}>
          <SheetHeader>
            <SheetTitle>
              <SiteLogo />
            </SheetTitle>
          </SheetHeader>

          {/* ناوبری اصلی */}
          <nav
            aria-label={navigation("mainMenu")}
            className="mt-8 flex flex-col gap-1"
          >
            {MAIN_NAVIGATION.map((item) => (
              <SheetClose asChild key={item.key}>
                <Link
                  href={item.href}
                  className={cn("flex min-h-12 items-center rounded-xl px-3 font-bold text-brand-navy transition-colors hover:bg-brand-navy-soft", (item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`)) && "bg-brand-navy-soft text-brand-red")}
                >
                  {item.key === "home" ? HOME_LABELS[locale] : navigation(item.key)}
                </Link>
              </SheetClose>
            ))}
          </nav>

          {/* اکشن‌ها */}
          <div className="mt-6 grid gap-3 border-t pt-6">
            <SheetClose asChild>
              <Button asChild>
                <Link href="/contact">{navigation("consultation")}</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild variant="outline">
                <Link href="/track">{navigation("track")}</Link>
              </Button>
            </SheetClose>

          </div>

          <div className="mt-6 border-t pt-6">
            <LanguageSwitcher />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
