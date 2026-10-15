import {
  ArrowUpRight,
  Inbox,
  LifeBuoy,
  MessagesSquare,
  Package,
  Plus,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { prisma } from "@/lib/db/prisma";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const faDigits = (value: number | string): string =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(date);
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    activeOrders,
    newInquiries,
    newMessages,
    activeProducts,
    recentOrders,
    recentInquiries,
    recentMessages,
    monthOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: { status: { notIn: ["completed", "cancelled"] } },
    }),
    prisma.serviceInquiry.count({ where: { status: "new" } }),
    prisma.contactMessage.count({ where: { status: "new" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        createdAt: true,
        contactName: true,
      },
    }),
    prisma.serviceInquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(thirtyDaysAgo);
    date.setDate(thirtyDaysAgo.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      label: new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "short" }).format(date),
      count: 0,
    };
  });
  for (const order of monthOrders) {
    if (!order.createdAt) continue;
    const key = order.createdAt.toISOString().slice(0, 10);
    const day = days.find((d) => d.key === key);
    if (day) day.count += 1;
  }
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  const quickActions = [
    { label: "افزودن محصول", href: "/admins/products/new", icon: Package },
    { label: "افزودن خدمت", href: "/admins/services/new", icon: Plus },
    { label: "مشاهده درخواست‌ها", href: "/admins/inquiries", icon: LifeBuoy },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`خوش آمدید، ${admin.name}`}
        description="نمای کلی وضعیت فروش، درخواست‌ها و پیام‌های اخیر"
        actions={
          <Button asChild>
            <Link href="/admins/products/new">
              <Plus className="size-4" aria-hidden="true" />
              افزودن محصول
            </Link>
          </Button>
        }
      />

      {/* آمار */}
      <section aria-label="آمار کلی" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={ShoppingCart} label="کل سفارش‌ها" value={faDigits(totalOrders)} tone="brand" />
        <StatCard icon={ArrowUpRight} label="سفارش‌های فعال" value={faDigits(activeOrders)} tone="amber" />
        <StatCard icon={LifeBuoy} label="درخواست مشاوره جدید" value={faDigits(newInquiries)} tone="violet" />
        <StatCard icon={Inbox} label="پیام جدید" value={faDigits(newMessages)} tone="red" />
        <StatCard icon={Package} label="محصولات فعال" value={faDigits(activeProducts)} tone="emerald" />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* نمودار ۳۰ روز اخیر */}
        <section
          aria-label="سفارش‌های ۳۰ روز اخیر"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">سفارش‌های ۳۰ روز اخیر</h2>
              <p className="mt-0.5 text-xs text-slate-500">تعداد سفارش ثبت‌شده به تفکیک روز</p>
            </div>
            <span className="text-xs font-bold text-slate-400">{faDigits(monthOrders.length)} سفارش</span>
          </div>
          <div className="flex h-40 items-end gap-[3px]">
            {days.map((day) => (
              <div
                key={day.key}
                className="group relative flex h-full flex-1 flex-col justify-end"
              >
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-colors",
                    day.count > 0 ? "bg-brand-navy hover:bg-brand-red" : "bg-slate-100",
                  )}
                  style={{ height: `${Math.max(4, (day.count / maxCount) * 100)}%` }}
                />
                <span className="pointer-events-none absolute -top-7 start-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white group-hover:block rtl:translate-x-1/2">
                  {day.label}: {faDigits(day.count)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
            نمایش {faDigits(days.length)} روز گذشته
          </p>
        </section>

        {/* اکشن‌های سریع */}
        <section aria-label="اکشن‌های سریع" className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900">اکشن‌های سریع</h2>
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-red/30 hover:bg-red-50/40 hover:text-brand-red"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {action.label}
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* لیست‌های اخیر */}
      <div className="grid gap-6 xl:grid-cols-3">
        <RecentSection
          title="آخرین سفارش‌ها"
          href="/admins/orders"
          count={recentOrders.length}
          empty="سفارشی ثبت نشده است"
        >
          {recentOrders.map((order) => (
            <li key={order.id.toString()} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800" dir="ltr">{order.orderNumber}</p>
                <p className="mt-0.5 text-xs text-slate-400">{formatDate(order.createdAt)}</p>
              </div>
              <StatusBadge status={order.status} />
            </li>
          ))}
        </RecentSection>

        <RecentSection
          title="آخرین درخواست‌های مشاوره"
          href="/admins/inquiries"
          count={recentInquiries.length}
          empty="درخواستی ثبت نشده است"
        >
          {recentInquiries.map((inquiry) => (
            <li key={inquiry.id.toString()} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-navy/10 text-brand-navy">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{inquiry.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{formatDate(inquiry.createdAt)}</p>
                </div>
              </div>
              <StatusBadge status={inquiry.status} />
            </li>
          ))}
        </RecentSection>

        <RecentSection
          title="آخرین پیام‌ها"
          href="/admins/messages"
          count={recentMessages.length}
          empty="پیامی دریافت نشده است"
        >
          {recentMessages.map((message) => (
            <li key={message.id.toString()} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600">
                  <MessagesSquare className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{message.name}</p>
                  <p className="truncate text-xs text-slate-400">{message.subject}</p>
                </div>
              </div>
              <StatusBadge status={message.status} />
            </li>
          ))}
        </RecentSection>
      </div>
    </div>
  );
}

function RecentSection({
  title,
  href,
  count,
  empty,
  children,
}: {
  title: string;
  href: string;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        <Link
          href={href}
          className="text-xs font-bold text-brand-red transition hover:text-brand-red-dark"
        >
          مشاهده همه
        </Link>
      </div>
      {count === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="divide-y divide-slate-100">{children}</ul>
      )}
    </section>
  );
}
