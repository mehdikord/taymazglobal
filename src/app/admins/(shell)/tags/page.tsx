import { Plus } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/admin/page-header";
import type { ListFilter } from "@/components/admin/admin-list-shell";
import { TagsTable } from "@/components/admin/tags/tags-table";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listTagsAdmin } from "@/lib/repositories/tags.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; active?: string }>;
};

export default async function TagsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const { rows, total } = await listTagsAdmin({ q: params.q, active: params.active, page });

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
        title="تگ‌ها"
        description="تگ‌ها برای جست‌وجوی محصولات و خدمات استفاده می‌شوند."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "تگ‌ها" }]}
        actions={
          <Link href="/admins/tags/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن تگ
            </Button>
          </Link>
        }
      />
      <TagsTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
