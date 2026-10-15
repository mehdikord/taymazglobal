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
import { Button } from "@/components/ui/button";
import { deleteServiceInquiry, updateServiceInquiryStatus } from "@/app/admins/(shell)/leads/actions";
import { formatDateFa, LEAD_STATUS_LABELS } from "@/lib/admin/helpers";
import type {
  LeadStatus,
  ServiceInquiryAdminRow,
} from "@/lib/repositories/leads.admin";

type ServiceInquiriesTableProps = {
  rows: ServiceInquiryAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function ServiceInquiriesTable({ rows, total, page, q, filters }: ServiceInquiriesTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleStatus(row: ServiceInquiryAdminRow, status: LeadStatus) {
    setBusy(true);
    const result = await updateServiceInquiryStatus(row.id, status);
    setBusy(false);
    if (result.ok) {
      toast.success(`وضعیت به «${LEAD_STATUS_LABELS[status]}» تغییر کرد`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteServiceInquiry(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("درخواست حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "name",
      header: "متقاضی",
      render: (row: ServiceInquiryAdminRow) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.name}</span>
          <span className="text-xs text-slate-400" dir="ltr">
            {row.phone}
          </span>
        </div>
      ),
    },
    {
      key: "service",
      header: "خدمت",
      render: (row: ServiceInquiryAdminRow) => (
        <span className="font-medium text-slate-700">{row.serviceName}</span>
      ),
    },
    {
      key: "company",
      header: "شرکت",
      render: (row: ServiceInquiryAdminRow) => (
        <span className="text-slate-600">{row.company ?? "—"}</span>
      ),
    },
    {
      key: "country",
      header: "کشور",
      render: (row: ServiceInquiryAdminRow) => (
        <span className="text-slate-600">{row.country ?? "—"}</span>
      ),
    },
    {
      key: "date",
      header: "تاریخ",
      render: (row: ServiceInquiryAdminRow) => (
        <span className="text-xs text-slate-500">{formatDateFa(row.createdAt)}</span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      render: (row: ServiceInquiryAdminRow) => (
        <span className="inline-flex rounded-full bg-brand-navy/10 px-2.5 py-1 text-xs font-bold text-brand-navy">
          {LEAD_STATUS_LABELS[row.status]}
        </span>
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-56",
      render: (row: ServiceInquiryAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/leads/inquiry/${row.id}`}>
            <Button variant="outline" size="sm">
              جزئیات
            </Button>
          </Link>
          <select
            className="h-8 rounded-lg border border-slate-200 bg-white px-1.5 text-xs text-slate-600"
            value={row.status}
            disabled={busy}
            onChange={(e) => handleStatus(row, e.target.value as LeadStatus)}
          >
            {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
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
      <AdminListShell<ServiceInquiryAdminRow>
        basePath="/admins/leads"
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={20}
        rowKey={(row) => row.id}
        q={q}
        searchPlaceholder="جست‌وجوی نام، تلفن، شرکت…"
        filters={filters}
        emptyText="درخواستی یافت نشد."
        baseQuery={{ tab: "inquiry" }}
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="حذف درخواست"
        description="درخواست استعلام به‌طور کامل حذف خواهد شد."
        confirmLabel="حذف درخواست"
        onConfirm={handleDelete}
      />
    </>
  );
}
