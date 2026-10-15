"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { EmptyState } from "./empty-state";
import { SearchInput } from "./search-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchValue?: string;
  onSearch?: (value: string) => void;
  toolbar?: React.ReactNode;
  loading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  total,
  page,
  pageSize,
  onPageChange,
  searchValue = "",
  onSearch,
  toolbar,
  loading = false,
  emptyState,
  className,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {(onSearch || toolbar) ? (
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          {onSearch ? (
            <SearchInput value={searchValue} onChange={onSearch} className="w-full sm:max-w-xs" />
          ) : (
            <div />
          )}
          {toolbar}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-start">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-start text-xs font-extrabold uppercase tracking-wide text-slate-500",
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    در حال بارگذاری…
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  {emptyState ?? (
                    <EmptyState
                      title="موردی یافت نشد"
                      description="برای مشاهده نتیجه، عبارت جست‌وجو یا فیلترها را تغییر دهید."
                    />
                  )}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="transition-colors hover:bg-slate-50/60">
                  {columns.map((column) => (
                    <td key={column.key} className={cn("px-4 py-3.5 text-sm", column.className)}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row">
        <p className="text-xs font-medium text-slate-500">
          نمایش {from} تا {to} از {total} مورد
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            قبلی
          </Button>
          <span className="min-w-20 px-2 text-center text-sm font-bold tabular-nums text-slate-700">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            بعدی
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
