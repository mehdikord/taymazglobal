"use client";

import { LogOut, ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebarContent } from "./admin-sidebar";

export type AdminShellAdmin = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export function AdminShell({ admin, children }: Readonly<{ admin: AdminShellAdmin; children: React.ReactNode }>) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* سایدبار دسکتاپ (در RTL سمت راست) */}
      <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col overflow-y-auto border-e border-slate-200 bg-white lg:flex">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy text-xl font-black text-white shadow-sm">
            T
          </div>
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-slate-900">تایماز گلوبال</p>
            <p className="text-[11px] font-medium text-slate-400">پنل مدیریت</p>
          </div>
        </div>
        <div className="flex-1 px-3 py-5">
          <AdminSidebarContent />
        </div>
        <div className="border-t border-slate-100 px-4 py-4">
          <p className="text-[11px] leading-5 text-slate-400">
            نسخه ۰.۱.۰
            <br />
            © {new Date().getFullYear()} تایماز گلوبال
          </p>
        </div>
      </aside>

      {/* نوار بالایی + محتوا */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            {/* دکمه منو موبایل */}
            <Sheet open={navOpen} onOpenChange={setNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="باز کردن منو">
                  {navOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="start" closeLabel="بستن منو" className="w-[300px] p-0">
                <SheetTitle className="sr-only">منوی پنل مدیریت</SheetTitle>
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-brand-navy text-xl font-black text-white">
                    T
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-extrabold text-slate-900">تایماز گلوبال</p>
                    <p className="text-[11px] font-medium text-slate-400">پنل مدیریت</p>
                  </div>
                </div>
                <div className="px-3 py-5">
                  <AdminSidebarContent onNavigate={() => setNavOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
              <p className="truncate text-sm font-bold text-slate-500">
                پنل مدیریت محتوا
              </p>
            </div>

            <div className="ms-auto flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hidden text-slate-600 sm:inline-flex">
                <Link href="/fa" target="_blank">
                  <ExternalLink className="size-4" aria-hidden="true" />
                  مشاهده سایت
                </Link>
              </Button>
              <span className="hidden h-6 w-px bg-slate-200 sm:block" />
              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="flex size-9 items-center justify-center rounded-full bg-brand-red/10 text-sm font-extrabold text-brand-red">
                  {admin.name.trim().charAt(0) || "م"}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-slate-800">{admin.name}</p>
                  <p className="text-[11px] text-slate-400" dir="ltr">
                    {admin.phone}
                  </p>
                </div>
              </div>
              <form action="/admins/api/auth/logout" method="post">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">خروج</span>
                </Button>
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
