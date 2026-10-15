import { Plus } from "lucide-react";
import Link from "next/link";

import type { ListFilter } from "@/components/admin/admin-list-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ServicesTable } from "@/components/admin/services/services-table";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listServicesAdmin } from "@/lib/repositories/services.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; active?: string; featured?: string }>;
};

export default async function ServicesPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const { rows, total } = await listServicesAdmin({
    q: params.q,
    active: params.active,
    featured: params.featured,
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
    {
      key: "featured",
      label: "ویژه",
      allLabel: "همه",
      options: [
        { value: "featured", label: "فقط ویژه" },
        { value: "regular", label: "عادی" },
      ],
      value: params.featured ?? "all",
    },
  ];

  return (
    <div>
      <PageHeader
        title="خدمات"
        description="خدمات صادراتی و تجاری؛ با ترجمه، کشورها و تگ‌های مرتبط."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "خدمات" }]}
        actions={
          <Link href="/admins/services/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن خدمت
            </Button>
          </Link>
        }
      />
      <ServicesTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
