"use client";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useOrderStore } from "@/store/order-store";
import type { AppLocale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { CommerceOrder, CommerceOrderStatus } from "@/types";

const STATUS_VARIANT: Record<
  CommerceOrderStatus,
  "default" | "warning" | "success" | "danger" | "neutral"
> = {
  pending_approval: "warning",
  preparing: "default",
  in_transit: "default",
  completed: "success",
  cancelled: "danger",
};

function OrderRow({
  order,
  locale,
  t,
  tStatus,
}: {
  order: CommerceOrder;
  locale: AppLocale;
  t: ReturnType<typeof useTranslations<"Account">>;
  tStatus: ReturnType<typeof useTranslations<"Track.statuses">>;
}) {
  const date = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(order.createdAt));

  return (
    <li className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      {/* اطلاعات اصلی */}
      <div className="flex min-w-0 flex-col gap-2">
        {/* شماره سفارش + وضعیت */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-extrabold text-brand-navy">
            {order.orderNumber}
          </span>
          <Badge variant={STATUS_VARIANT[order.status]}>
            {tStatus(order.status)}
          </Badge>
        </div>

        {/* عنوان محصول */}
        <p className="truncate text-sm font-bold text-brand-navy">
          {getLocalizedText(order.productTitle, locale)}
        </p>

        {/* متادیتا */}
        <div className="flex flex-wrap gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3 shrink-0" />
            {order.destination}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays aria-hidden="true" className="size-3 shrink-0" />
            {date}
          </span>
        </div>

        {/* کد رهگیری */}
        {order.trackingCode && (
          <p className="text-xs text-muted">
            <span className="font-semibold">{t("orders.trackingCode")}:</span>{" "}
            <code className="font-mono tracking-widest">
              {order.trackingCode}
            </code>
          </p>
        )}
      </div>

      {/* دکمه پیگیری */}
      {order.trackingCode && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="shrink-0 self-start sm:self-center"
        >
          <Link href={`/track?code=${order.trackingCode}`}>
            <Search aria-hidden="true" className="size-3.5" />
            {t("orders.trackOrder")}
          </Link>
        </Button>
      )}
    </li>
  );
}

export function AccountOrders({ locale }: { locale: AppLocale }) {
  const t = useTranslations("Account");
  const tStatus = useTranslations("Track.statuses");
  const orders = useOrderStore((s) => s.orders);

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy">
            {t("orders.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("orders.description")}</p>
        </div>
        {orders.length > 0 && (
          <span className="rounded-full bg-brand-navy-soft px-3 py-1 text-xs font-extrabold text-brand-navy">
            {orders.length}
          </span>
        )}
      </div>

      {/* لیست یا Empty State */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-navy/15 bg-surface p-10 text-center">
          <ShoppingBag
            aria-hidden="true"
            className="mx-auto size-10 text-brand-navy/20"
          />
          <p className="mt-4 font-bold text-brand-navy">{t("orders.empty")}</p>
          <p className="mt-1 text-sm text-muted">
            {t("orders.emptyDescription")}
          </p>
          <Button asChild className="mt-5" size="sm">
            <Link href="/products">
              {t("orders.browseCatalogue")}
              <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={t("orders.title")}>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              locale={locale}
              t={t}
              tStatus={tStatus}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
