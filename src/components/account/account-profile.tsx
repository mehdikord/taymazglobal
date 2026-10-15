"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
};

export function AccountProfile() {
  const t = useTranslations("Account");
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const schema = z.object({
    name: z.string().trim().min(1, t("profile.validation.nameRequired")),
    email: z.string().trim().email(t("profile.validation.emailInvalid")),
    phone: z.string().optional().default(""),
    company: z.string().optional().default(""),
    country: z.string().optional().default(""),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      company: "",
      country: "",
    },
  });

  // sync مقادیر با store وقتی user تغییر کرد
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: "",
        company: "",
        country: "",
      });
    }
  }, [user, reset]);

  async function onSubmit(data: ProfileValues) {
    await new Promise((r) => setTimeout(r, 600));

    try {
      if (!user) throw new Error("No user");
      setUser({ ...user, name: data.name, email: data.email });
      toast.success(t("profile.successTitle"), {
        description: t("profile.successDescription"),
      });
      // reset dirty state با مقادیر جدید
      reset(data);
    } catch {
      toast.error(t("profile.errorTitle"), {
        description: t("profile.errorDescription"),
      });
    }
  }

  function handleCancel() {
    reset();
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">
          {t("profile.title")}
        </h1>
        <p className="mt-1 text-sm text-muted">{t("profile.description")}</p>
      </div>

      {/* فرم */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("profile.title")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* نام */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">
                {t("profile.fields.name")}
              </Label>
              <Input
                id="profile-name"
                type="text"
                autoComplete="name"
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "profile-name-err" : undefined}
              />
              {errors.name && (
                <p id="profile-name-err" className="text-xs text-danger">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* ایمیل */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-email">
                {t("profile.fields.email")}
              </Label>
              <Input
                id="profile-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "profile-email-err" : undefined
                }
              />
              {errors.email && (
                <p id="profile-email-err" className="text-xs text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* تلفن */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-phone">
                {t("profile.fields.phone")}
              </Label>
              <Input
                id="profile-phone"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
              />
            </div>

            {/* شرکت */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-company">
                {t("profile.fields.company")}
              </Label>
              <Input
                id="profile-company"
                type="text"
                autoComplete="organization"
                {...register("company")}
              />
            </div>

            {/* کشور */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-country">
                {t("profile.fields.country")}
              </Label>
              <Input
                id="profile-country"
                type="text"
                autoComplete="country-name"
                {...register("country")}
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting
                  ? t("profile.saving")
                  : t("profile.saveChanges")}
              </Button>
              {isDirty && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {t("profile.cancel")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
