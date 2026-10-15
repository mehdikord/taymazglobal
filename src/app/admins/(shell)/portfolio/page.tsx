import { Plus } from "lucide-react";
import Link from "next/link";

import type { ListFilter } from "@/components/admin/admin-list-shell";
import { PageHeader } from "@/components/admin/page-header";
import { PortfolioTable } from "@/components/admin/portfolio/portfolio-table";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listPortfolioAdmin } from "@/lib/repositories/portfolio.admin";
import { listServiceOptions } from "@/lib/repositories/services.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; active?: string; featured?: string; service?: string }>;
};

export default async function PortfolioPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const [services, { rows, total }] = await Promise.all([
    listServiceOptions(),
    listPortfolioAdmin({
      q: params.q,
      service: params.service,
      active: params.active,
      featured: params.featured,
      page,
    }),
  ]);

  const filters: ListFilter[] = [
    {
      key: "service",
      label: "خدمت",
      allLabel: "همه خدمات",
      options: services,
      value: params.service ?? "all",
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
        title="نمونه‌کارها"
        description="پروژه‌های موفق با خدمت مرتبط، کشور، شاخص‌ها و گالری."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "نمونه‌کارها" }]}
        actions={
          <Link href="/admins/portfolio/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن نمونه‌کار
            </Button>
          </Link>
        }
      />
      <PortfolioTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
