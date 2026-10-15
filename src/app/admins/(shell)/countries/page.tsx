import { Plus } from "lucide-react";
import Link from "next/link";

import { CountriesTable } from "@/components/admin/countries/countries-table";
import { PageHeader } from "@/components/admin/page-header";
import type { ListFilter } from "@/components/admin/admin-list-shell";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listCountriesAdmin } from "@/lib/repositories/countries.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; active?: string }>;
};

export default async function CountriesPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const { rows, total } = await listCountriesAdmin({
    q: params.q,
    active: params.active,
    page,
  });

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
        title="کشورها"
        description="کشورهای هدف بازار؛ در خدمات، نمونه‌کارها و دفاتر استفاده می‌شوند."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "کشورها" }]}
        actions={
          <Link href="/admins/countries/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن کشور
            </Button>
          </Link>
        }
      />
      <CountriesTable
        rows={rows}
        total={total}
        page={page}
        q={params.q ?? ""}
        filters={filters}
      />
    </div>
  );
}
