"use client";

import { LogOut, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * دکمه حساب کاربری در Header — client component
 * اگر authenticated: لینک به /account + دکمه خروج
 * اگر نه: لینک به /auth/login
 */
export function AccountButton() {
  const navigation = useTranslations("Navigation");
  const tAccount = useTranslations("Account");
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await new Promise((r) => setTimeout(r, 300));
    logout();
    setLoggingOut(false);
    router.replace("/");
    toast.success(tAccount("logout"));
  }

  if (!isAuthenticated()) {
    return (
      <Button asChild size="sm" className="rounded-xl shadow-[0_10px_24px_-15px_rgb(252_20_34_/_0.9)]">
        <Link href="/auth/login">
          <UserRound aria-hidden="true" />
          {navigation("account")}
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton variant="ghost" aria-label={navigation("account")} asChild>
            <Link href="/account">
              <UserRound aria-hidden="true" />
            </Link>
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>{navigation("account")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton
            variant="ghost"
            aria-label={tAccount("logout")}
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-muted hover:text-danger"
          >
            <LogOut aria-hidden="true" />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>{tAccount("logout")}</TooltipContent>
      </Tooltip>
    </div>
  );
}
