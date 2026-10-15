"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AdminListShell,
  type ListFilter,
} from "@/components/admin/admin-list-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { deleteCountry, toggleCountryActive } from "@/app/admins/(shell)/countries/actions";
import type { CountryAdminRow } from "@/lib/repositories/countries.admin";

type CountriesTableProps = {
  rows: CountryAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function CountriesTable({ rows, total, page, q, filters }: CountriesTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: CountryAdminRow) {
    const result = await toggleCountryActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "کشور غیرفعال شد" : "کشور فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteCountry(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("کشور حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "code",
      header: "کد",
      render: (row: CountryAdminRow) => (
        <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-brand-navy">
          {row.code}
        </code>
      ),
    },
    {
      key: "name",
      header: "نام",
      render: (row: CountryAdminRow) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">{row.nameFa || "—"}</span>
          {row.nameEn ? <span className="text-xs text-slate-400">({row.nameEn})</span> : null}
        </div>
      ),
    },
    {
      key: "region",
      header: "منطقه",
      render: (row: CountryAdminRow) => <span className="text-slate-600">{row.regionFa || "—"}</span>,
    },
    {
      key: "sort",
      header: "ترتیب",
      className: "w-20",
      render: (row: CountryAdminRow) => (
        <span className="tabular-nums text-slate-600">{row.sortOrder}</span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "w-28",
      render: (row: CountryAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: CountryAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/countries/${row.id}/edit`}>
            <Button variant="ghost" size="sm">
              ویرایش
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggle(row)}
            disabled={busy}
          >
            {row.isActive ? "غیرفعال" : "فعال"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteId(row.id)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminListShell<CountryAdminRow>
        basePath="/admins/countries"
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={20}
        rowKey={(row) => row.id}
        q={q}
        searchPlaceholder="جست‌وجوی نام یا کد…"
        filters={filters}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="حذف کشور"
        description="با حذف، تمام ترجمه‌های این کشور نیز پاک می‌شود. اگر در خدمات، نمونه‌کارها یا دفاتر استفاده شده باشد، حذف مسدود می‌شود."
        confirmLabel="حذف کشور"
        onConfirm={handleDelete}
      />
    </>
  );
}
