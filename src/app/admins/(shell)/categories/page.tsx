import { Plus } from "lucide-react";
import Link from "next/link";

import { CategoriesTable } from "@/components/admin/categories/categories-table";
import type { ListFilter } from "@/components/admin/admin-list-shell";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listCategoriesAdmin } from "@/lib/repositories/categories.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; active?: string }>;
};

export default async function CategoriesPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const { rows, total } = await listCategoriesAdmin({ q: params.q, active: params.active, page });

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
        title="دسته‌بندی محصولات"
        description="دسته‌بندی‌های محصولات؛ با گرادیان و رنگ تم برای نمایش در فرانت."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "دسته‌بندی‌ها" }]}
        actions={
          <Link href="/admins/categories/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن دسته
            </Button>
          </Link>
        }
      />
      <CategoriesTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
