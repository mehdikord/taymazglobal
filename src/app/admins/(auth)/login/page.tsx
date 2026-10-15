import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-4 py-10">
      {/* الگوهای تزئینی پس‌زمینه */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-32 -top-32 size-96 rounded-full bg-brand-red/30 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -end-32 size-96 rounded-full bg-blue-500/25 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-3xl font-black text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
            T
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">تایماز گلوبال</h1>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-white/70">
              <ShieldCheck className="size-4" aria-hidden="true" />
              پنل مدیریت
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-2xl shadow-brand-navy-dark/40 ring-1 ring-black/5 sm:p-9">
          <div className="mb-7">
            <h2 className="text-xl font-extrabold text-slate-900">ورود به حساب</h2>
            <p className="mt-1 text-sm text-slate-500">
              با شماره موبایل و رمز عبور خود وارد شوید.
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-6 text-slate-400">
            دسترسی فقط برای مدیران سیستم تایماز گلوبال
            <br />
            در صورت بروز مشکل با پشتیبانی فنی تماس بگیرید.
          </p>
        </div>
      </div>
    </div>
  );
}
