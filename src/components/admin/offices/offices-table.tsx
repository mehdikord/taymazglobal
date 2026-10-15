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
import { deleteOffice, toggleOfficeActive } from "@/app/admins/(shell)/offices/actions";
import type { OfficeAdminRow } from "@/lib/repositories/offices.admin";

type OfficesTableProps = {
  rows: OfficeAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function OfficesTable({ rows, total, page, q, filters }: OfficesTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: OfficeAdminRow) {
    const result = await toggleOfficeActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "دفتر غیرفعال شد" : "دفتر فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteOffice(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("دفتر حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "city",
      header: "شهر",
      render: (row: OfficeAdminRow) => (
        <span className="font-bold text-slate-800">{row.cityFa || "—"}</span>
      ),
    },
    {
      key: "country",
      header: "کشور",
      render: (row: OfficeAdminRow) => <span className="text-slate-600">{row.countryLabel}</span>,
    },
    {
      key: "contact",
      header: "تماس",
      render: (row: OfficeAdminRow) => (
        <div className="flex flex-col gap-0.5 text-xs text-slate-500" dir="ltr">
          <span>{row.phone}</span>
          <span>{row.email}</span>
        </div>
      ),
    },
    {
      key: "head",
      header: "دفتر مرکزی",
      className: "w-28",
      render: (row: OfficeAdminRow) =>
        row.isHeadOffice ? <StatusBadge status="featured" label="مرکزی" /> : <span className="text-xs text-slate-400">—</span>,
    },
    {
      key: "sort",
      header: "ترتیب",
      className: "w-20",
      render: (row: OfficeAdminRow) => (
        <span className="tabular-nums text-slate-600">{row.sortOrder}</span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "w-28",
      render: (row: OfficeAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: OfficeAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/offices/${row.id}/edit`}>
            <Button variant="ghost" size="sm">
              ویرایش
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => handleToggle(row)} disabled={busy}>
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
      <AdminListShell<OfficeAdminRow>
        basePath="/admins/offices"
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={20}
        rowKey={(row) => row.id}
        q={q}
        searchPlaceholder="جست‌وجوی شهر، تلفن یا ایمیل…"
        filters={filters}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="حذف دفتر"
        description="دفتر و ترجمه‌های آن حذف خواهند شد."
        confirmLabel="حذف دفتر"
        onConfirm={handleDelete}
      />
    </>
  );
}
