"use client";

import { LayoutDashboard, LogOut, Package, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { key: "overview", href: "/account", icon: LayoutDashboard, exact: true },
  { key: "orders", href: "/account/orders", icon: Package, exact: false },
  { key: "profile", href: "/account/profile", icon: User, exact: false },
] as const;

export function AccountNav() {
  const t = useTranslations("Account");
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await new Promise((r) => setTimeout(r, 300));
    logout();
    setIsLoggingOut(false);
    router.replace("/");
    toast.success(t("logout"));
  }

  return (
    <nav aria-label={t("eyebrow")}>
      {/* Desktop sidebar */}
      <ul className="hidden flex-col gap-1 lg:flex">
        {NAV_ITEMS.map(({ key, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={key}>
              <Link
                href={href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-brand-navy text-white"
                    : "text-brand-navy hover:bg-brand-navy-soft",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {t(`nav.${key}`)}
              </Link>
            </li>
          );
        })}
        <li className="mt-2 border-t pt-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-danger hover:bg-danger/10 hover:text-danger"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut aria-hidden="true" className="size-4 shrink-0" />
            {isLoggingOut ? t("loggingOut") : t("logout")}
          </Button>
        </li>
      </ul>

      {/* Mobile tabs */}
      <ul className="flex gap-1 rounded-xl bg-surface p-1 lg:hidden">
        {NAV_ITEMS.map(({ key, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex min-h-9 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors",
                  isActive
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-muted hover:text-brand-navy",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" className="size-4" />
                {t(`nav.${key}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
