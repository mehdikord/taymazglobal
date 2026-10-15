"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { DataTableColumn } from "@/components/admin/data-table";
import { DataTable } from "@/components/admin/data-table";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ListFilter = {
  key: string;
  label: string;
  allLabel: string;
  options: Array<{ value: string; label: string }>;
  value: string;
};

type AdminListShellProps<T> = {
  basePath: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  rowKey: (row: T) => string;
  q: string;
  searchPlaceholder?: string;
  filters?: ListFilter[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  emptyText?: string;
  baseQuery?: Record<string, string>;
};

export function AdminListShell<T>({
  basePath,
  columns,
  rows,
  total,
  page,
  pageSize,
  rowKey,
  q,
  searchPlaceholder,
  filters = [],
  loading = false,
  emptyState,
  emptyText,
  baseQuery,
}: AdminListShellProps<T>) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function buildQuery(next: { q?: string; page?: number; filters?: Record<string, string> }) {
    const params = new URLSearchParams();
    if (baseQuery) {
      for (const [key, value] of Object.entries(baseQuery)) params.set(key, value);
    }
    if (next.q) params.set("q", next.q);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    for (const filter of filters) {
      const value = next.filters?.[filter.key] ?? filter.value;
      if (value && value !== "all") params.set(filter.key, value);
    }
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${basePath}?${query}` : basePath);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={cn("flex items-center gap-2", isPending && "opacity-60")}>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            aria-label={filter.label}
            value={filter.value}
            onChange={(event) =>
              buildQuery({ page: 1, filters: { [filter.key]: event.target.value } })
            }
            className="w-auto min-w-36"
          >
            <option value="all">{filter.allLabel}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ))}
      </div>

      <DataTable<T>
        columns={columns}
        rows={rows}
        rowKey={rowKey}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(nextPage) => buildQuery({ page: nextPage })}
        searchValue={q}
        onSearch={(value) => buildQuery({ q: value, page: 1 })}
        loading={loading || isPending}
        emptyState={emptyState ?? (emptyText ? <p className="p-6 text-center text-sm text-slate-400">{emptyText}</p> : undefined)}
      />
    </div>
  );
}
