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
import { deleteService, toggleServiceActive } from "@/app/admins/(shell)/services/actions";
import { getServiceIcon } from "@/lib/service-icons";
import type { ServiceAdminRow } from "@/lib/repositories/services.admin";

type ServicesTableProps = {
  rows: ServiceAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function ServicesTable({ rows, total, page, q, filters }: ServicesTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: ServiceAdminRow) {
    const result = await toggleServiceActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "خدمت غیرفعال شد" : "خدمت فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteService(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("خدمت حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "icon",
      header: "",
      className: "w-12",
      render: (row: ServiceAdminRow) => {
        const Icon = getServiceIcon(row.icon as never);
        return (
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        );
      },
    },
    {
      key: "title",
      header: "عنوان",
      render: (row: ServiceAdminRow) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.titleFa || "—"}</span>
          <span className="font-mono text-xs text-slate-400" dir="ltr">
            {row.slug}
          </span>
        </div>
      ),
    },
    {
      key: "featured",
      header: "ویژه",
      className: "w-20",
      render: (row: ServiceAdminRow) =>
        row.isFeatured ? (
          <StatusBadge status="featured" label="ویژه" />
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: "sort",
      header: "ترتیب",
      className: "w-20",
      render: (row: ServiceAdminRow) => (
        <span className="tabular-nums text-slate-600">{row.sortOrder}</span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "w-28",
      render: (row: ServiceAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: ServiceAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/services/${row.id}/edit`}>
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
      <AdminListShell<ServiceAdminRow>
        basePath="/admins/services"
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={20}
        rowKey={(row) => row.id}
        q={q}
        searchPlaceholder="جست‌وجوی عنوان یا اسلاگ…"
        filters={filters}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="حذف خدمت"
        description="اگر نمونه‌کاری به این خدمت متصل باشد، حذف مسدود می‌شود."
        confirmLabel="حذف خدمت"
        onConfirm={handleDelete}
      />
    </>
  );
}
