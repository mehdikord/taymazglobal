"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createPortfolio,
  updatePortfolio,
  type PortfolioFormValues,
} from "@/app/admins/(shell)/portfolio/actions";
import { MediaManager } from "@/components/admin/media-manager";
import { TranslationsEditor } from "@/components/admin/translations-editor";
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

const metricRow = z.object({ value: z.string().min(1, "مقدار را وارد کنید"), label: localized });

const schema = z.object({
  slug: z.string().min(2, "اسلاگ را وارد کنید"),
  serviceId: z.string().min(1, "خدمت را انتخاب کنید"),
  countryId: z.string(),
  year: z.coerce.number().int().min(1990).max(2100),
  gradient: z.string(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0),
  title: localized,
  summary: localized,
  challenge: localized,
  solution: localized,
  outcome: localized,
  route: localized,
  metrics: z.array(metricRow).default([]),
  gallery: z.array(z.string()).default([]),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

const EMPTY_LOCALE = { fa: "", en: "", tr: "", ru: "" };

type PortfolioDefaults = {
  id: string;
  slug: string;
  serviceId: string;
  countryId: string | null;
  year: number;
  gradient: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  title: LocalizedText;
  summary: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  outcome: LocalizedText;
  route: LocalizedText;
  metrics: Array<{ value: string; label: LocalizedText }>;
  gallery: string[];
};

export function PortfolioForm({
  defaultValues,
  serviceOptions,
  countryOptions,
}: Readonly<{
  defaultValues?: PortfolioDefaults;
  serviceOptions: Array<{ value: string; label: string }>;
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
      slug: defaultValues?.slug ?? "",
      serviceId: defaultValues?.serviceId ?? "",
      countryId: defaultValues?.countryId ?? "",
      year: defaultValues?.year ?? new Date().getFullYear(),
      gradient: defaultValues?.gradient ?? "",
      isFeatured: defaultValues?.isFeatured ?? false,
      isActive: defaultValues?.isActive ?? true,
      sortOrder: defaultValues?.sortOrder ?? 0,
      title: defaultValues?.title ?? { ...EMPTY_LOCALE },
      summary: defaultValues?.summary ?? { ...EMPTY_LOCALE },
      challenge: defaultValues?.challenge ?? { ...EMPTY_LOCALE },
      solution: defaultValues?.solution ?? { ...EMPTY_LOCALE },
      outcome: defaultValues?.outcome ?? { ...EMPTY_LOCALE },
      route: defaultValues?.route ?? { ...EMPTY_LOCALE },
      metrics: defaultValues?.metrics ?? [],
      gallery: defaultValues?.gallery ?? [],
    },
  });

  function handleTitleChange(value: LocalizedText) {
    setValue("title", value);
    if (!editing && !watch("slug") && value.en) setValue("slug", slugify(value.en));
  }

  function updateMetric(index: number, patch: Partial<{ value: string; label: LocalizedText }>) {
    setValue(
      "metrics",
      (watch("metrics") ?? []).map((metric, i) => (i === index ? { ...metric, ...patch } : metric)),
    );
  }

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing
      ? await updatePortfolio(defaultValues!.id, data)
      : await createPortfolio(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "نمونه‌کار به‌روزرسانی شد" : "نمونه‌کار ایجاد شد");
      router.push("/admins/portfolio");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const metrics = watch("metrics") ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">اطلاعات پایه</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">اسلاگ</Label>
            <Input id="slug" dir="ltr" placeholder="chemical-export-2024" disabled={editing} {...register("slug")} />
            {errors.slug ? <p className="text-xs font-medium text-red-600">{errors.slug.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="serviceId">خدمت مرتبط</Label>
            <Select id="serviceId" {...register("serviceId")}>
              <option value="">انتخاب خدمت…</option>
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.serviceId ? <p className="text-xs font-medium text-red-600">{errors.serviceId.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="countryId">کشور</Label>
            <Select id="countryId" {...register("countryId")}>
              <option value="">بدون کشور</option>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="year">سال</Label>
            <Input id="year" type="number" min={1990} max={2100} {...register("year")} />
            {errors.year ? <p className="text-xs font-medium text-red-600">{errors.year.message}</p> : null}
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="gradient">گرادیان (اختیاری)</Label>
            <Input id="gradient" dir="ltr" placeholder="linear-gradient(…)" {...register("gradient")} />
          </div>
          <div className="flex items-end gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sortOrder">ترتیب نمایش</Label>
              <Input id="sortOrder" type="number" min={0} className="max-w-28" {...register("sortOrder")} />
            </div>
            <label className="flex cursor-pointer items-center gap-2 pb-1 text-sm font-bold text-slate-700">
              <Checkbox {...register("isFeatured")} />
              ویژه
            </label>
            <label className="flex cursor-pointer items-center gap-2 pb-1 text-sm font-bold text-slate-700">
              <Checkbox {...register("isActive")} />
              فعال
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">محتوا (۴ زبان)</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <TranslationsEditor label="عنوان" value={watch("title")} onChange={handleTitleChange} />
          <TranslationsEditor label="خلاصه" type="textarea" rows={3} value={watch("summary")} onChange={(v) => setValue("summary", v)} />
          <TranslationsEditor label="چالش" type="textarea" rows={3} value={watch("challenge")} onChange={(v) => setValue("challenge", v)} />
          <TranslationsEditor label="راه‌حل" type="textarea" rows={3} value={watch("solution")} onChange={(v) => setValue("solution", v)} />
          <TranslationsEditor label="نتیجه" type="textarea" rows={3} value={watch("outcome")} onChange={(v) => setValue("outcome", v)} />
          <TranslationsEditor label="مسیر ترانزیت" value={watch("route")} onChange={(v) => setValue("route", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">شاخص‌ها</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setValue("metrics", [...metrics, { value: "", label: { ...EMPTY_LOCALE } }])
            }
          >
            <Plus className="size-4" aria-hidden="true" />
            افزودن شاخص
          </Button>
        </div>
        {metrics.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
            شاخصی ثبت نشده است.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">شاخص {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                      setValue(
                        "metrics",
                        metrics.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    حذف
                  </Button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`metric-value-${index}`}>مقدار</Label>
                    <Input
                      id={`metric-value-${index}`}
                      dir="ltr"
                      placeholder="1200+"
                      defaultValue={metric.value}
                      onBlur={(e) => updateMetric(index, { value: e.target.value })}
                    />
                  </div>
                  <TranslationsEditor
                    label="عنوان شاخص"
                    value={metric.label}
                    onChange={(label) => updateMetric(index, { label })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">گالری تصاویر</h2>
        <MediaManager
          label="افزودن تصویر"
          value={watch("gallery") ?? []}
          onChange={(v) => setValue("gallery", v)}
          folder="portfolio"
          maxItems={10}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد نمونه‌کار"}
        </Button>
      </div>
    </form>
  );
}
