import { Plus } from "lucide-react";
import Link from "next/link";

import type { ListFilter } from "@/components/admin/admin-list-shell";
import { PageHeader } from "@/components/admin/page-header";
import { TeamTable } from "@/components/admin/team/team-table";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { DEPARTMENT_LABELS } from "@/lib/admin/helpers";
import { listTeamAdmin } from "@/lib/repositories/team.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; page?: string; active?: string; department?: string }>;
};

export default async function TeamPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const { rows, total } = await listTeamAdmin({
    q: params.q,
    department: params.department,
    active: params.active,
    page,
  });

  const filters: ListFilter[] = [
    {
      key: "department",
      label: "بخش",
      allLabel: "همه بخش‌ها",
      options: Object.entries(DEPARTMENT_LABELS).map(([value, label]) => ({ value, label })),
      value: params.department ?? "all",
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
        title="اعضای تیم"
        description="مدیریت اعضای تیم در بخش‌های مختلف."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "تیم" }]}
        actions={
          <Link href="/admins/team/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن عضو
            </Button>
          </Link>
        }
      />
      <TeamTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
