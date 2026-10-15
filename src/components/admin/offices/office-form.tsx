"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createOffice,
  updateOffice,
  type OfficeFormValues,
} from "@/app/admins/(shell)/offices/actions";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const localized = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string(),
  tr: z.string(),
  ru: z.string(),
});

const schema = z.object({
  countryId: z.string(),
  phone: z.string().min(5, "شماره تلفن را وارد کنید"),
  email: z.string().email("ایمیل معتبر نیست"),
  isHeadOffice: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0),
  city: localized,
  address: localized,
  hours: localized,
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export function OfficeForm({
  defaultValues,
  countryOptions,
}: Readonly<{
  defaultValues?: OfficeFormValues & { id: string };
  countryOptions: Array<{ value: string; label: string }>;
}>) {
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
      countryId: defaultValues?.countryId ?? "",
      phone: defaultValues?.phone ?? "",
      email: defaultValues?.email ?? "",
      isHeadOffice: defaultValues?.isHeadOffice ?? false,
      isActive: defaultValues?.isActive ?? true,
      sortOrder: defaultValues?.sortOrder ?? 0,
      city: defaultValues?.city ?? { fa: "", en: "", tr: "", ru: "" },
      address: defaultValues?.address ?? { fa: "", en: "", tr: "", ru: "" },
      hours: defaultValues?.hours ?? { fa: "", en: "", tr: "", ru: "" },
    },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing ? await updateOffice(defaultValues!.id, data) : await createOffice(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "دفتر به‌روزرسانی شد" : "دفتر ایجاد شد");
      router.push("/admins/offices");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">اطلاعات تماس</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="countryId">کشور</Label>
            <Select id="countryId" {...register("countryId")}>
              <option value="">انتخاب کشور…</option>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">تلفن</Label>
            <Input id="phone" dir="ltr" placeholder="+98…" {...register("phone")} />
            {errors.phone ? <p className="text-xs font-medium text-red-600">{errors.phone.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" dir="ltr" type="email" placeholder="office@taymaz.global" {...register("email")} />
            {errors.email ? <p className="text-xs font-medium text-red-600">{errors.email.message}</p> : null}
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
              <Checkbox {...register("isHeadOffice")} />
              دفتر مرکزی
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
              <Checkbox {...register("isActive")} />
              فعال
            </label>
          </div>
        </div>
        <div className="mt-5 max-w-28">
          <Label htmlFor="sortOrder">ترتیب نمایش</Label>
          <Input id="sortOrder" type="number" min={0} className="mt-2" {...register("sortOrder")} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">اطلاعات دفتر (۴ زبان)</h2>
        <div className="flex flex-col gap-6">
          <TranslationsEditor label="شهر" value={watch("city")} onChange={(v) => setValue("city", v)} />
          <TranslationsEditor label="آدرس" type="textarea" rows={3} value={watch("address")} onChange={(v) => setValue("address", v)} />
          <TranslationsEditor label="ساعات کاری" value={watch("hours")} onChange={(v) => setValue("hours", v)} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد دفتر"}
        </Button>
      </div>
    </form>
  );
}
