import { notFound } from "next/navigation";

import { OrderStatusChanger } from "@/components/admin/orders/order-status-changer";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { formatDateFa, ORDER_STATUS_LABELS } from "@/lib/admin/helpers";
import { getOrderAdmin } from "@/lib/repositories/orders.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-800" dir="auto">
        {value}
      </span>
    </div>
  );
}

export default async function OrderDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderAdmin(id);
  if (!order) notFound();

  return (
    <div>
      <PageHeader
        title={`سفارش ${order.orderNumber}`}
        description={order.productTitle}
        breadcrumb={[{ label: "سفارش‌ها", href: "/admins/orders" }, { label: order.orderNumber }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-base font-extrabold text-slate-900">تغییر وضعیت</h2>
            <OrderStatusChanger orderId={order.id} currentStatus={order.status} currentTrackingCode={order.trackingCode} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-extrabold text-slate-900">تاریخچه سفارش</h2>
            <ol className="flex flex-col gap-4">
              {order.logs.map((log) => (
                <li key={log.id} className="relative border-s-2 border-slate-200 ps-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-bold text-brand-navy">
                      {ORDER_STATUS_LABELS[log.status]}
                    </span>
                    <span className="text-xs text-slate-400">{formatDateFa(log.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{log.note || "بدون یادداشت"}</p>
                  <p className="mt-0.5 text-xs text-slate-400">توسط {log.adminName}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-base font-extrabold text-slate-900">جزئیات سفارش</h2>
            <div className="divide-y divide-slate-100">
              <InfoRow label="شماره سفارش" value={order.orderNumber} />
              <InfoRow label="وضعیت" value={ORDER_STATUS_LABELS[order.status]} />
              <InfoRow label="تاریخ ثبت" value={formatDateFa(order.createdAt)} />
              <InfoRow label="کد رهگیری" value={order.trackingCode || "—"} />
              <InfoRow label="محصول" value={order.productTitle} />
              <InfoRow label="تعداد" value={order.quantity != null ? String(order.quantity) : "—"} />
              <InfoRow label="مقصد" value={order.destination} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-base font-extrabold text-slate-900">اطلاعات مشتری</h2>
            <div className="divide-y divide-slate-100">
              <InfoRow label="نام" value={order.contactName} />
              <InfoRow label="تلفن" value={order.contactPhone} />
              <InfoRow label="ایمیل" value={order.contactEmail || "—"} />
              <InfoRow label="یادداشت مشتری" value={order.customerNote || "—"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
