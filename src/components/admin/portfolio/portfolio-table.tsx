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
import { deletePortfolio, togglePortfolioActive } from "@/app/admins/(shell)/portfolio/actions";
import type { PortfolioAdminRow } from "@/lib/repositories/portfolio.admin";

type PortfolioTableProps = {
  rows: PortfolioAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function PortfolioTable({ rows, total, page, q, filters }: PortfolioTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: PortfolioAdminRow) {
    const result = await togglePortfolioActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "نمونه‌کار غیرفعال شد" : "نمونه‌کار فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deletePortfolio(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("نمونه‌کار حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "title",
      header: "عنوان",
      render: (row: PortfolioAdminRow) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.titleFa || "—"}</span>
          <span className="font-mono text-xs text-slate-400" dir="ltr">
            {row.slug}
          </span>
        </div>
      ),
    },
    {
      key: "service",
      header: "خدمت",
      render: (row: PortfolioAdminRow) => <span className="text-slate-600">{row.serviceName}</span>,
    },
    {
      key: "country",
      header: "کشور",
      render: (row: PortfolioAdminRow) => <span className="text-slate-600">{row.countryName}</span>,
    },
    {
      key: "year",
      header: "سال",
      className: "w-20",
      render: (row: PortfolioAdminRow) => (
        <span className="tabular-nums text-slate-600">{row.year}</span>
      ),
    },
    {
      key: "featured",
      header: "ویژه",
      className: "w-20",
      render: (row: PortfolioAdminRow) =>
        row.isFeatured ? (
          <StatusBadge status="featured" label="ویژه" />
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: "status",
      header: "وضعیت",
      className: "w-28",
      render: (row: PortfolioAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: PortfolioAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/portfolio/${row.id}/edit`}>
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
      <AdminListShell<PortfolioAdminRow>
        basePath="/admins/portfolio"
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
        title="حذف نمونه‌کار"
        description="نمونه‌کار، ترجمه‌ها، شاخص‌ها و گالری آن حذف خواهند شد."
        confirmLabel="حذف نمونه‌کار"
        onConfirm={handleDelete}
      />
    </>
  );
}
