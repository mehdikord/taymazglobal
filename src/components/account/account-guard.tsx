"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth-store";

type AccountGuardProps = {
  children: React.ReactNode;
  loginPath: string;
};

/**
 * حفاظت مسیرهای /account/* — hydration-safe
 * اگر کاربر احراز هویت نشده باشد به login redirect می‌شود.
 */
export function AccountGuard({ children, loginPath }: AccountGuardProps) {
  const [hydrated, setHydrated] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated()) {
      router.replace(loginPath as "/auth/login");
    }
  }, [hydrated, isAuthenticated, loginPath, router]);

  // قبل از hydration چیزی نشان نمی‌دهیم
  if (!hydrated) return null;
  if (!isAuthenticated()) return null;

  return <>{children}</>;
}
