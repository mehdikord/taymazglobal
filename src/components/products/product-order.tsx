"use client";

import { ClipboardCheck, Package, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

type ProductOrderCtaProps = {
  productSlug: string;
  primaryLabel: string;
  secondaryLabel: string;
};

export function ProductOrderCta({ productSlug, primaryLabel, secondaryLabel }: ProductOrderCtaProps) {
  const products = useTranslations("Products");
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const handleOrder = () => {
    const orderPath = `/products/${productSlug}/order`;
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(orderPath)}`);
      return;
    }
    router.push(orderPath);
  };

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full" onClick={handleOrder}>
        <Package aria-hidden="true" className="size-4" />
        {primaryLabel}
      </Button>
      <Button size="lg" variant="outline" className="w-full" onClick={() => router.push("/contact")}>
        {secondaryLabel}
      </Button>
      {!isAuthenticated && (
        <p className="text-center text-xs leading-6 text-muted">{products("loginHint")}</p>
      )}
    </div>
  );
}

export function ProductStickyBar({
  productSlug,
  title,
  priceLabel,
  orderLabel,
}: {
  productSlug: string;
  title: string;
  priceLabel: string;
  orderLabel: string;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const handleOrder = () => {
    const orderPath = `/products/${productSlug}/order`;
    if (!isAuthenticated) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(orderPath)}`);
      return;
    }
    router.push(orderPath);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-4 shadow-[0_-12px_40px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl lg:hidden">
      <div className="container-shell flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-brand-navy">{title}</p>
          <p className="text-xs font-bold text-brand-red">{priceLabel}</p>
        </div>
        <Button onClick={handleOrder} className="shrink-0">
          {orderLabel}
        </Button>
      </div>
    </div>
  );
}

export function OrderConfirmation({
  orderNumber,
  title,
  description,
  trackingHint,
  trackLabel,
  homeLabel,
}: {
  orderNumber: string;
  title: string;
  description: string;
  trackingHint: string;
  trackLabel: string;
  homeLabel: string;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-success/10 text-success shadow-[var(--shadow-soft)]">
        <ClipboardCheck aria-hidden="true" className="size-10" />
      </div>
      <h2 className="mt-6 text-2xl font-extrabold text-brand-navy">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>

      <div className="mt-6 rounded-2xl border bg-brand-navy-soft p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">{orderNumber.split("-")[0]}</p>
        <p className="mt-1 font-mono text-xl font-extrabold text-brand-navy">{orderNumber}</p>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
        <Search aria-hidden="true" className="size-4 text-brand-red" />
        {trackingHint}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={() => router.push("/track")}>{trackLabel}</Button>
        <Button variant="outline" onClick={() => router.push("/")}>{homeLabel}</Button>
      </div>
    </div>
  );
}
