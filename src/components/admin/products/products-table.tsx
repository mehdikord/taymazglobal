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
import { deleteProduct, toggleProductActive } from "@/app/admins/(shell)/products/actions";
import type { ProductAdminRow } from "@/lib/repositories/products.admin";

const TYPE_LABELS: Record<string, string> = { physical: "فیزیکی", service: "خدمتی" };

type ProductsTableProps = {
  rows: ProductAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function ProductsTable({ rows, total, page, q, filters }: ProductsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleToggle(row: ProductAdminRow) {
    const result = await toggleProductActive(row.id, !row.isActive);
    if (result.ok) {
      toast.success(row.isActive ? "محصول غیرفعال شد" : "محصول فعال شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setBusy(true);
    const result = await deleteProduct(deleteId);
    setBusy(false);
    setDeleteId(null);
    if (result.ok) {
      toast.success("محصول حذف شد");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const columns = [
    {
      key: "cover",
      header: "",
      className: "w-16",
      render: (row: ProductAdminRow) =>
        row.coverPath ? (
          <Image
            src={row.coverPath}
            alt={row.titleFa}
            width={44}
            height={44}
            className="size-11 rounded-lg object-cover ring-1 ring-slate-200"
          />
        ) : (
          <span className="inline-flex size-11 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
            —
          </span>
        ),
    },
    {
      key: "title",
      header: "عنوان",
      render: (row: ProductAdminRow) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.titleFa || "—"}</span>
          <span className="font-mono text-xs text-slate-400" dir="ltr">
            {row.slug}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      header: "دسته",
      render: (row: ProductAdminRow) => <span className="text-slate-600">{row.categoryName}</span>,
    },
    {
      key: "type",
      header: "نوع",
      render: (row: ProductAdminRow) => (
        <span className="text-xs text-slate-600">{TYPE_LABELS[row.type] ?? row.type}</span>
      ),
    },
    {
      key: "price",
      header: "قیمت",
      render: (row: ProductAdminRow) => (
        <span className="text-xs font-bold text-slate-700" dir="ltr">
          {row.priceText}
        </span>
      ),
    },
    {
      key: "featured",
      header: "ویژه",
      className: "w-20",
      render: (row: ProductAdminRow) =>
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
      render: (row: ProductAdminRow) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      className: "w-48",
      render: (row: ProductAdminRow) => (
        <div className="flex items-center gap-1.5">
          <Link href={`/admins/products/${row.id}/edit`}>
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
      <AdminListShell<ProductAdminRow>
        basePath="/admins/products"
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
        title="حذف محصول"
        description="اگر سفارشی به این محصول متصل باشد، حذف مسدود می‌شود."
        confirmLabel="حذف محصول"
        onConfirm={handleDelete}
      />
    </>
  );
}
