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
import { mockRegister } from "@/lib/repositories/auth";
import { useAuthStore } from "@/store/auth-store";

export function RegisterForm() {
  const auth = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  const schema = z.object({
    name: z.string().trim().min(2, auth("validation.nameRequired")),
    email: z.string().trim().email(auth("validation.emailInvalid")),
    password: z.string().min(4, auth("validation.passwordRequired")),
  });

  type RegisterValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockRegister(data.name, data.email, data.password);
    setIsLoading(false);

    if (!user) {
      toast.error(auth("registerError"));
      return;
    }

    setUser(user);
    toast.success(auth("registerSuccess"));
    router.replace(callbackUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="register-name">{auth("fields.name")}</Label>
        <Input id="register-name" {...register("name")} aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">{auth("fields.email")}</Label>
        <Input id="register-email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} />
        {errors.email && <p className="text-sm text-danger">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">{auth("fields.password")}</Label>
        <Input id="register-password" type="password" autoComplete="new-password" {...register("password")} aria-invalid={Boolean(errors.password)} />
        {errors.password && <p className="text-sm text-danger">{errors.password.message}</p>}
      </div>
      <p className="text-xs leading-6 text-muted">{auth("mockHint")}</p>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? auth("submitting") : auth("registerSubmit")}
      </Button>
      <p className="text-center text-sm text-muted">
        {auth("hasAccount")}{" "}
        <Link href={`/auth/login${callbackUrl !== "/account" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="font-bold text-brand-red hover:underline">
          {auth("loginLink")}
        </Link>
      </p>
    </form>
  );
}
