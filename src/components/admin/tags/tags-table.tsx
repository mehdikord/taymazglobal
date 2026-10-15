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
import { deleteTag, toggleTagActive } from "@/app/admins/(shell)/tags/actions";
import type { TagAdminRow } from "@/lib/repositories/tags.admin";

type TagsTableProps = {
  rows: TagAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function TagsTable({ rows, total, page, q, filters }: TagsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: TagAdminRow) {
    const result = await toggleTagActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "تگ غیرفعال شد" : "تگ فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteTag(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("تگ حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "slug",
      header: "اسلاگ",
      render: (row: TagAdminRow) => (
        <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-brand-navy">
          {row.slug}
        </code>
      ),
    },
    {
      key: "name",
      header: "نام",
      render: (row: TagAdminRow) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">{row.nameFa || "—"}</span>
          {row.nameEn ? <span className="text-xs text-slate-400">({row.nameEn})</span> : null}
        </div>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "w-28",
      render: (row: TagAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: TagAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/tags/${row.id}/edit`}>
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
      <AdminListShell<TagAdminRow>
        basePath="/admins/tags"
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={20}
        rowKey={(row) => row.id}
        q={q}
        searchPlaceholder="جست‌وجوی نام یا اسلاگ…"
        filters={filters}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="حذف تگ"
        description="اگر این تگ به محصولات یا خدمات متصل باشد، حذف مسدود می‌شود."
        confirmLabel="حذف تگ"
        onConfirm={handleDelete}
      />
    </>
  );
}
