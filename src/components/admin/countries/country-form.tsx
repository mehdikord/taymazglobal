"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createCountry,
  updateCountry,
  type CountryFormValues,
} from "@/app/admins/(shell)/countries/actions";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  code: z
    .string()
    .min(2, "کد ISO دوبخشی را وارد کنید (مثلاً IR)")
    .max(2, "کد ISO باید دو حرف باشد")
    .regex(/^[A-Za-z]{2}$/, "کد فقط می‌تواند دو حرف لاتین باشد"),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  name: z.object({
    fa: z.string().min(1, "نام فارسی الزامی است"),
    en: z.string(),
    tr: z.string(),
    ru: z.string(),
  }),
  region: z.object({
    fa: z.string(),
    en: z.string(),
    tr: z.string(),
    ru: z.string(),
  }),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export function CountryForm({
  defaultValues,
}: Readonly<{ defaultValues?: CountryFormValues & { id: string } }>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const editing = Boolean(defaultValues);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: defaultValues?.code ?? "",
      sortOrder: defaultValues?.sortOrder ?? 0,
      isActive: defaultValues?.isActive ?? true,
      name: defaultValues?.name ?? { fa: "", en: "", tr: "", ru: "" },
      region: defaultValues?.region ?? { fa: "", en: "", tr: "", ru: "" },
    },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing
      ? await updateCountry(defaultValues!.id, data)
      : await createCountry(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "کشور به‌روزرسانی شد" : "کشور ایجاد شد");
      router.push("/admins/countries");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code">کد ISO</Label>
            <Input
              id="code"
              placeholder="IR"
              className="max-w-32 font-mono uppercase"
              disabled={editing}
              {...register("code")}
            />
            {errors.code ? (
              <p className="text-xs font-medium text-red-600">{errors.code.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sortOrder">ترتیب نمایش</Label>
            <Input
              id="sortOrder"
              type="number"
              min={0}
              className="max-w-32"
              {...register("sortOrder")}
            />
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TranslationsEditor label="نام کشور" value={watch("name")} onChange={(v) => setValue("name", v)} />
          <TranslationsEditor label="منطقه" value={watch("region")} onChange={(v) => setValue("region", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">کشور فعال</p>
            <p className="mt-0.5 text-xs text-slate-500">کشورهای غیرفعال در فرم‌های عمومی نمایش داده نمی‌شوند.</p>
          </div>
          <Checkbox {...register("isActive")} />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد کشور"}
        </Button>
      </div>
    </form>
  );
}
