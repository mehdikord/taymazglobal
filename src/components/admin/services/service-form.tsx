"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createService,
  updateService,
  type ServiceFormValues,
} from "@/app/admins/(shell)/services/actions";
import { FaqEditor } from "@/components/admin/faq-editor";
import { MultiCheckbox } from "@/components/admin/multi-checkbox";
import {
  LocalizedListEditor,
  TranslationsEditor,
} from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { slugify } from "@/lib/admin/helpers";
import type { LocalizedText } from "@/types";

const localized = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string(),
  tr: z.string(),
  ru: z.string(),
});

const faqItem = z.object({
  question: localized,
  answer: localized,
});

const schema = z.object({
  slug: z.string().min(2, "اسلاگ را وارد کنید"),
  icon: z.string().min(1, "آیکون را انتخاب کنید"),
  sortOrder: z.coerce.number().int().min(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  countryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  title: localized,
  summary: localized,
  description: localized,
  benefits: z.array(localized).default([]),
  steps: z.array(localized).default([]),
  faq: z.array(faqItem).default([]),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

const EMPTY_LOCALE = { fa: "", en: "", tr: "", ru: "" };

const ICON_LABELS: Record<string, string> = {
  globe: "کره — بین‌المللی",
  ship: "کشتی — حمل دریایی",
  package: "بسته — محموله",
  shield: "سپر — ایمنی و اعتبار",
  truck: "کامیون — حمل زمینی",
  map: "نقشه — مسیر",
  search: "بازرسی و جست‌وجو",
  briefcase: "کیف کار — تجارت",
};

export function ServiceForm({
  defaultValues,
  countryOptions,
  tagOptions,
}: Readonly<{
  defaultValues?: ServiceFormValues & { id: string };
  countryOptions: Array<{ value: string; label: string }>;
  tagOptions: Array<{ value: string; label: string }>;
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
      slug: defaultValues?.slug ?? "",
      icon: defaultValues?.icon ?? "globe",
      sortOrder: defaultValues?.sortOrder ?? 0,
      isFeatured: defaultValues?.isFeatured ?? false,
      isActive: defaultValues?.isActive ?? true,
      countryIds: defaultValues?.countryIds ?? [],
      tagIds: defaultValues?.tagIds ?? [],
      title: defaultValues?.title ?? { ...EMPTY_LOCALE },
      summary: defaultValues?.summary ?? { ...EMPTY_LOCALE },
      description: defaultValues?.description ?? { ...EMPTY_LOCALE },
      benefits: defaultValues?.benefits ?? [],
      steps: defaultValues?.steps ?? [],
      faq: defaultValues?.faq ?? [],
    },
  });

  function handleTitleChange(value: LocalizedText) {
    setValue("title", value);
    if (!editing && !watch("slug") && value.en) setValue("slug", slugify(value.en));
  }

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing
      ? await updateService(defaultValues!.id, data)
      : await createService(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "خدمت به‌روزرسانی شد" : "خدمت ایجاد شد");
      router.push("/admins/services");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">اطلاعات پایه</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">اسلاگ</Label>
            <Input id="slug" dir="ltr" placeholder="export-consulting" disabled={editing} {...register("slug")} />
            {errors.slug ? <p className="text-xs font-medium text-red-600">{errors.slug.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="icon">آیکون</Label>
            <Select id="icon" {...register("icon")}>
              {Object.entries(ICON_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sortOrder">ترتیب نمایش</Label>
            <Input id="sortOrder" type="number" min={0} {...register("sortOrder")} />
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
              <Checkbox {...register("isFeatured")} />
              ویژه
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
              <Checkbox {...register("isActive")} />
              فعال
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">محتوا (۴ زبان)</h2>
        <div className="flex flex-col gap-6">
          <TranslationsEditor label="عنوان" value={watch("title")} onChange={handleTitleChange} />
          <TranslationsEditor label="خلاصه" type="textarea" rows={2} value={watch("summary")} onChange={(v) => setValue("summary", v)} />
          <TranslationsEditor label="توضیحات" type="textarea" rows={5} value={watch("description")} onChange={(v) => setValue("description", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">مزایا و مراحل</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <LocalizedListEditor label="مزایا" value={watch("benefits") ?? []} onChange={(v) => setValue("benefits", v)} />
          <LocalizedListEditor label="مراحل" value={watch("steps") ?? []} onChange={(v) => setValue("steps", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <FaqEditor label="پرسش‌های متداول" value={watch("faq") ?? []} onChange={(v) => setValue("faq", v)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">ارتباطات</h2>
        <div className="grid gap-8 lg:grid-cols-2">
          <MultiCheckbox label="کشورهای تحت پوشش" options={countryOptions} selected={watch("countryIds") ?? []} onChange={(v) => setValue("countryIds", v)} />
          <MultiCheckbox label="تگ‌ها" options={tagOptions} selected={watch("tagIds") ?? []} onChange={(v) => setValue("tagIds", v)} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد خدمت"}
        </Button>
      </div>
    </form>
  );
}
