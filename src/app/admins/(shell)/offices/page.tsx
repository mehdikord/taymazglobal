import { Plus } from "lucide-react";
import Link from "next/link";

import type { ListFilter } from "@/components/admin/admin-list-shell";
import { OfficesTable } from "@/components/admin/offices/offices-table";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listOfficesAdmin } from "@/lib/repositories/offices.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; active?: string }>;
};

export default async function OfficesPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const { rows, total } = await listOfficesAdmin({ q: params.q, active: params.active, page });

  const filters: ListFilter[] = [
    {
      key: "active",
      label: "وضعیت",
      allLabel: "همه وضعیت‌ها",
      options: [
        { value: "active", label: "فعال" },
        { value: "inactive", label: "غیرفعال" },
      ],
      value: params.active ?? "all",
    },
  ];

  return (
    <div>
      <PageHeader
        title="دفاتر"
        description="دفاتر و شعب در کشورهای مختلف؛ در صفحه تماس نمایش داده می‌شوند."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "دفاتر" }]}
        actions={
          <Link href="/admins/offices/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن دفتر
            </Button>
          </Link>
        }
      />
      <OfficesTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
