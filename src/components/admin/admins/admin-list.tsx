"use client";

import { Pencil, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { toggleAdminActive } from "@/app/admins/(shell)/admins/actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import type { AdminListItem } from "@/lib/repositories/admins.admin";

export function AdminList({
  admins,
  currentAdminId,
}: Readonly<{ admins: AdminListItem[]; currentAdminId: string }>) {
  const [items, setItems] = useState(admins);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const onToggle = async (admin: AdminListItem) => {
    if (admin.id === currentAdminId) return;
    setPendingId(admin.id);
    const result = await toggleAdminActive(admin.id, !admin.isActive);
    setPendingId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === admin.id ? { ...item, isActive: !admin.isActive } : item)));
    toast.success(admin.isActive ? "مدیر غیرفعال شد" : "مدیر فعال شد");
  };

  if (items.length === 0) {
    return <EmptyState title="مدیری ثبت نشده است" description="از دکمه «افزودن مدیر» استفاده کنید." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_14px_40px_-30px_rgba(15,23,42,0.4)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-start text-xs font-extrabold text-muted">
              <th className="px-5 py-4 text-start">نام</th>
              <th className="px-5 py-4 text-start">موبایل</th>
              <th className="px-5 py-4 text-start">ایمیل</th>
              <th className="px-5 py-4 text-start">وضعیت</th>
              <th className="px-5 py-4 text-end">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((admin) => (
              <tr key={admin.id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-4 font-bold text-slate-900">
                  {admin.name}
                  {admin.id === currentAdminId ? (
                    <span className="ms-2 inline-flex items-center gap-1 rounded-md bg-brand-navy-soft px-2 py-0.5 text-[0.65rem] font-extrabold text-brand-navy">
                      <ShieldCheck className="size-3" /> شما
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-muted" dir="ltr">{admin.phone}</td>
                <td className="px-5 py-4 text-muted">{admin.email}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={admin.isActive ? "active" : "inactive"} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admins/admins/${admin.id}/edit`}>
                        <Pencil className="size-3.5" /> ویرایش
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={admin.id === currentAdminId || pendingId === admin.id}
                      onClick={() => onToggle(admin)}
                    >
                      {admin.isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
