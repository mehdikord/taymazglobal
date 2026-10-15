"use client";

import Link from "next/link";

import {
  AdminListShell,
  type ListFilter,
} from "@/components/admin/admin-list-shell";
import { Button } from "@/components/ui/button";
import { formatDateFa, ORDER_STATUS_LABELS } from "@/lib/admin/helpers";
import type { OrderAdminRow } from "@/lib/repositories/orders.admin";

type OrdersTableProps = {
  rows: OrderAdminRow[];
  total: number;
  page: number;
  q: string;
  filters: ListFilter[];
};

export function OrdersTable({ rows, total, page, q, filters }: OrdersTableProps) {
  const columns = [
    {
      key: "order",
      header: "سفارش",
      render: (row: OrderAdminRow) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-brand-navy" dir="ltr">
            {row.orderNumber}
          </span>
          <span className="text-xs text-slate-400">{formatDateFa(row.createdAt)}</span>
        </div>
      ),
    },
    {
      key: "product",
      header: "محصول",
      render: (row: OrderAdminRow) => <span className="font-bold text-slate-800">{row.productTitle}</span>,
    },
    {
      key: "customer",
      header: "مشتری",
      render: (row: OrderAdminRow) => (
        <div className="flex flex-col text-slate-600">
          <span className="font-bold text-slate-700">{row.contactName}</span>
          <span className="text-xs" dir="ltr">
            {row.contactPhone}
          </span>
        </div>
      ),
    },
    {
      key: "destination",
      header: "مقصد",
      render: (row: OrderAdminRow) => <span className="text-slate-600">{row.destination}</span>,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (row: OrderAdminRow) => (
        <span className="inline-flex rounded-full bg-brand-navy/10 px-2.5 py-1 text-xs font-bold text-brand-navy">
          {ORDER_STATUS_LABELS[row.status]}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (row: OrderAdminRow) => (
        <Link href={`/admins/orders/${row.id}`}>
          <Button variant="outline" size="sm">
            جزئیات
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <AdminListShell<OrderAdminRow>
      basePath="/admins/orders"
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      pageSize={20}
      rowKey={(row) => row.id}
      q={q}
      searchPlaceholder="جست‌وجوی شماره سفارش، مشتری یا تلفن…"
      filters={filters}
      emptyText="سفارشی یافت نشد."
    />
  );
}
