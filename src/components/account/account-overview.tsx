"use client";

import {
  ArrowRight,
  CheckCircle2,
  Package,
  PackageSearch,
  Search,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useOrderStore } from "@/store/order-store";
import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  accent: string;
};

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          accent,
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-extrabold text-brand-navy">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </Card>
  );
}

export function AccountOverview({ locale }: { locale: AppLocale }) {
  const t = useTranslations("Account");
  const user = useAuthStore((s) => s.user);
  const orders = useOrderStore((s) => s.orders);

  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled",
  ).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="space-y-8">
      {/* خوش‌آمدید */}
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">
          {t("overview.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t("overview.welcomeBack")}{user?.name ? `, ${user.name}` : ""}
        </p>
      </div>

      {/* آمار */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={ShoppingBag}
          label={t("overview.totalOrders")}
          value={orders.length}
          accent="bg-brand-navy-soft text-brand-navy"
        />
        <StatCard
          icon={PackageSearch}
          label={t("overview.activeOrders")}
          value={activeOrders}
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={CheckCircle2}
          label={t("overview.completedOrders")}
          value={completedOrders}
          accent="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* CTAها */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* مشاهده سفارش‌ها */}
        <Card className="group relative overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-navy-soft">
              <Package aria-hidden="true" className="size-5 text-brand-navy" />
            </span>
            <div>
              <h2 className="font-extrabold text-brand-navy">
                {t("overview.viewOrders")}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {t("orders.description")}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start">
              <Link href="/account/orders">
                {t("overview.viewOrders")}
                <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardContent>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -end-8 -top-8 size-24 rounded-full bg-brand-navy/4"
          />
        </Card>

        {/* پیگیری سفارش */}
        <Card className="group relative overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-red/10">
              <Search aria-hidden="true" className="size-5 text-brand-red" />
            </span>
            <div>
              <h2 className="font-extrabold text-brand-navy">
                {t("overview.trackOrder")}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {t("overview.noOrdersDescription")}
              </p>
            </div>
            <Button asChild size="sm" className="self-start">
              <Link href="/track">
                {t("overview.trackOrder")}
                <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
              </Link>
            </Button>
          </CardContent>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -end-8 -top-8 size-24 rounded-full bg-brand-red/4"
          />
        </Card>
      </div>

      {/* اگر هنوز سفارشی نیست */}
      {orders.length === 0 && (
        <div className="rounded-2xl border border-dashed border-brand-navy/15 bg-surface p-8 text-center">
          <ShoppingBag
            aria-hidden="true"
            className="mx-auto size-10 text-brand-navy/20"
          />
          <p className="mt-4 font-bold text-brand-navy">
            {t("overview.noOrders")}
          </p>
          <p className="mt-1 text-sm text-muted">
            {t("overview.noOrdersDescription")}
          </p>
          <Button asChild className="mt-5" size="sm">
            <Link href="/products">
              {t("overview.browseCatalogue")}
              <ArrowRight aria-hidden="true" className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
