"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { mockLogin } from "@/lib/repositories/auth";
import { useAuthStore } from "@/store/auth-store";

export function LoginForm() {
  const auth = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  const schema = z.object({
    email: z.string().trim().email(auth("validation.emailInvalid")),
    password: z.string().min(4, auth("validation.passwordRequired")),
  });

  type LoginValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockLogin(data.email, data.password);
    setIsLoading(false);

    if (!user) {
      toast.error(auth("loginError"));
      return;
    }

    setUser(user);
    toast.success(auth("loginSuccess"));
    router.replace(callbackUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="login-email">{auth("fields.email")}</Label>
        <Input id="login-email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">{auth("fields.password")}</Label>
        <Input id="login-password" type="password" autoComplete="current-password" {...register("password")} aria-invalid={Boolean(errors.password)} />
        {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
      </div>
      <p className="text-xs leading-6 text-muted">{auth("mockHint")}</p>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? auth("submitting") : auth("loginSubmit")}
      </Button>
      <p className="text-center text-sm text-muted">
        {auth("noAccount")}{" "}
        <Link href={`/auth/register${callbackUrl !== "/account" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="font-bold text-brand-red hover:underline">
          {auth("registerLink")}
        </Link>
      </p>
    </form>
  );
}
