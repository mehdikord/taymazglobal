"use client";

import Image from "next/image";
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
import { deleteTeamMember, toggleTeamMemberActive } from "@/app/admins/(shell)/team/actions";
import { DEPARTMENT_LABELS } from "@/lib/admin/helpers";
import type { TeamAdminRow } from "@/lib/repositories/team.admin";

type TeamTableProps = {
  rows: TeamAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function TeamTable({ rows, total, page, q, filters }: TeamTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: TeamAdminRow) {
    const result = await toggleTeamMemberActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "عضو غیرفعال شد" : "عضو فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteTeamMember(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("عضو تیم حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "avatar",
      header: "",
      className: "w-16",
      render: (row: TeamAdminRow) =>
        row.imagePath ? (
          <Image
            src={row.imagePath}
            alt={row.nameFa}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover ring-1 ring-slate-200"
          />
        ) : (
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-brand-navy/10 text-sm font-bold text-brand-navy">
            {row.nameFa.slice(0, 1) || "؟"}
          </span>
        ),
    },
    {
      key: "name",
      header: "نام",
      render: (row: TeamAdminRow) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.nameFa || "—"}</span>
          <span className="text-xs text-slate-400">{row.roleFa || "—"}</span>
        </div>
      ),
    },
    {
      key: "department",
      header: "بخش",
      render: (row: TeamAdminRow) => (
        <span className="inline-flex rounded-full bg-brand-navy/10 px-2.5 py-1 text-xs font-bold text-brand-navy">
          {DEPARTMENT_LABELS[row.department]}
        </span>
      ),
    },
    {
      key: "sort",
      header: "ترتیب",
      className: "w-20",
      render: (row: TeamAdminRow) => (
        <span className="tabular-nums text-slate-600">{row.sortOrder}</span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "w-28",
      render: (row: TeamAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: TeamAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/team/${row.id}/edit`}>
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
      <AdminListShell<TeamAdminRow>
        basePath="/admins/team"
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={20}
        rowKey={(row) => row.id}
        q={q}
        searchPlaceholder="جست‌وجوی نام…"
        filters={filters}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="حذف عضو تیم"
        description="عضو تیم و ترجمه‌های او حذف خواهند شد."
        confirmLabel="حذف عضو"
        onConfirm={handleDelete}
      />
    </>
  );
}
