"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LockKeyhole, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizePhone } from "@/lib/utils";

const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(6, "شماره موبایل معتبر نیست")
    .transform(normalizePhone),
  password: z.string().min(4, "رمز ورود حداقل ۴ کاراکتر است"),
});

type LoginValues = z.input<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: "", password: "" },
  });

  async function onSubmit(data: LoginValues) {
    setServerError(null);

    const response = await fetch("/admins/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: data.phone,
        password: data.password,
      }),
    });

    const result = (await response.json()) as {
      ok: boolean;
      error?: { message?: string };
    };

    if (!response.ok || !result.ok) {
      setServerError(result.error?.message ?? "ورود ناموفق بود. دوباره تلاش کنید.");
      return;
    }

    toast.success("خوش آمدید، به پنل مدیریت وارد شدید");
    router.push("/admins/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {serverError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {serverError}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone" className="text-sm font-bold text-slate-700">
          شماره موبایل
        </Label>
        <div className="relative">
          <Phone
            aria-hidden="true"
            className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            dir="ltr"
            placeholder="09xxxxxxxxx"
            className="h-12 rounded-xl ps-10 text-center font-medium tracking-wide"
            {...register("phone")}
          />
        </div>
        {errors.phone ? <p className="text-xs font-medium text-red-600">{errors.phone.message}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-sm font-bold text-slate-700">
          رمز ورود
        </Label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            placeholder="••••••••"
            className="h-12 rounded-xl ps-10 pe-11 text-center font-medium tracking-wide"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
            className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password ? <p className="text-xs font-medium text-red-600">{errors.password.message}</p> : null}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-1 w-full rounded-xl bg-brand-red text-base shadow-[0_10px_30px_-12px_rgba(252,20,34,0.8)] hover:bg-brand-red-dark disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            در حال ورود…
          </>
        ) : (
          "ورود به پنل مدیریت"
        )}
      </Button>
    </form>
  );
}
