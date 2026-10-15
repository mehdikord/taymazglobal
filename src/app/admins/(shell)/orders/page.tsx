import type { ListFilter } from "@/components/admin/admin-list-shell";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { ORDER_STATUS_LABELS } from "@/lib/admin/helpers";
import { listOrdersAdmin } from "@/lib/repositories/orders.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
};

export default async function OrdersPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const { rows, total } = await listOrdersAdmin({ q: params.q, status: params.status, page });

  const filters: ListFilter[] = [
    {
      key: "status",
      label: "وضعیت",
      allLabel: "همه وضعیت‌ها",
      options: Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
      value: params.status ?? "all",
    },
  ];

  return (
    <div>
      <PageHeader
        title="سفارش‌ها"
        description="سفارش‌های ثبت‌شده مشتریان برای محصولات."
        breadcrumb={[{ label: "مدیریت فروش", href: "/admins/dashboard" }, { label: "سفارش‌ها" }]}
      />
      <OrdersTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
