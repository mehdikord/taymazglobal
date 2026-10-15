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
import { deleteCategory, toggleCategoryActive } from "@/app/admins/(shell)/categories/actions";
import type { CategoryAdminRow } from "@/lib/repositories/categories.admin";

type CategoriesTableProps = {
  rows: CategoryAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function CategoriesTable({ rows, total, page, q, filters }: CategoriesTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: CategoryAdminRow) {
    const result = await toggleCategoryActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "دسته غیرفعال شد" : "دسته فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteCategory(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("دسته حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "gradient",
      header: "",
      className: "w-14",
      render: (row: CategoryAdminRow) => (
        <span
          className="inline-block size-8 rounded-lg"
          style={{ background: row.gradient || "linear-gradient(135deg,#123977,#1c55c0)" }}
          aria-hidden="true"
        />
      ),
    },
    {
      key: "title",
      header: "عنوان",
      render: (row: CategoryAdminRow) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.titleFa || "—"}</span>
          <span className="font-mono text-xs text-slate-400" dir="ltr">
            {row.slug}
          </span>
        </div>
      ),
    },
    {
      key: "sort",
      header: "ترتیب",
      className: "w-20",
      render: (row: CategoryAdminRow) => (
        <span className="tabular-nums text-slate-600">{row.sortOrder}</span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "w-28",
      render: (row: CategoryAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: CategoryAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/categories/${row.id}/edit`}>
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
      <AdminListShell<CategoryAdminRow>
        basePath="/admins/categories"
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
        title="حذف دسته‌بندی"
        description="اگر محصولی به این دسته متصل باشد، حذف مسدود می‌شود."
        confirmLabel="حذف دسته"
        onConfirm={handleDelete}
      />
    </>
  );
}
