"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { OrderForm } from "@/components/forms/order-form";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/shared/loading-state";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { AppLocale } from "@/i18n/routing";
import type { Product } from "@/types";

type ProductOrderGuardProps = {
  product: Product;
  locale: AppLocale;
};

export function ProductOrderGuard({ product, locale }: ProductOrderGuardProps) {
  const products = useTranslations("Products");
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      const orderPath = `/products/${product.slug}/order`;
      router.replace(`/auth/login?callbackUrl=${encodeURIComponent(orderPath)}`);
    }
  }, [hydrated, isAuthenticated, product.slug, router]);

  if (!hydrated || !isAuthenticated) {
    return <LoadingState label={products("orderTitle")} cards={1} />;
  }

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <OrderForm product={product} locale={locale} />
      </CardContent>
    </Card>
  );
}
