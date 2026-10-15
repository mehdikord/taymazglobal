"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createProduct,
  updateProduct,
  type ProductFormValues,
} from "@/app/admins/(shell)/products/actions";
import { MediaManager } from "@/components/admin/media-manager";
import { MultiCheckbox } from "@/components/admin/multi-checkbox";
import { SpecsEditor, type SpecRow } from "@/components/admin/specs-editor";
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

const specRow = z.object({ label: localized, value: localized });
const mediaRow = z.object({ path: z.string().min(1), type: z.enum(["image", "video"]), alt: localized });

const schema = z.object({
  slug: z.string().min(2, "اسلاگ را وارد کنید"),
  categoryId: z.string().min(1, "دسته‌بندی را انتخاب کنید"),
  type: z.enum(["physical", "service"]),
  priceType: z.enum(["fixed", "inquiry", "range"]),
  price: z.string(),
  priceMax: z.string(),
  currency: z.string(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0),
  tagIds: z.array(z.string()).default([]),
  title: localized,
  summary: localized,
  description: localized,
  specs: z.array(specRow).default([]),
  media: z.array(mediaRow).default([]),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

const EMPTY_LOCALE = { fa: "", en: "", tr: "", ru: "" };
const EMPTY_SPEC: SpecRow = { label: { ...EMPTY_LOCALE }, value: { ...EMPTY_LOCALE } };

export function ProductForm({
  defaultValues,
  categoryOptions,
  tagOptions,
}: Readonly<{
  defaultValues?: ProductFormValues & { id: string };
  categoryOptions: Array<{ value: string; label: string }>;
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
      categoryId: defaultValues?.categoryId ?? "",
      type: defaultValues?.type ?? "physical",
      priceType: defaultValues?.priceType ?? "inquiry",
      price: defaultValues?.price ?? "",
      priceMax: defaultValues?.priceMax ?? "",
      currency: defaultValues?.currency ?? "USD",
      isFeatured: defaultValues?.isFeatured ?? false,
      isActive: defaultValues?.isActive ?? true,
      sortOrder: defaultValues?.sortOrder ?? 0,
      tagIds: defaultValues?.tagIds ?? [],
      title: defaultValues?.title ?? { ...EMPTY_LOCALE },
      summary: defaultValues?.summary ?? { ...EMPTY_LOCALE },
      description: defaultValues?.description ?? { ...EMPTY_LOCALE },
      specs: defaultValues?.specs ?? [],
      media: defaultValues?.media ?? [],
    },
  });

  const priceType = watch("priceType");

  function handleTitleChange(value: LocalizedText) {
    setValue("title", value);
    if (!editing && !watch("slug") && value.en) setValue("slug", slugify(value.en));
  }

  function handleMediaChange(paths: string[]) {
    const next = paths.map((path) => {
      const existing = (watch("media") ?? []).find((m) => m.path === path);
      return existing ?? { path, type: "image" as const, alt: { ...EMPTY_LOCALE } };
    });
    setValue("media", next);
  }

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing ? await updateProduct(defaultValues!.id, data) : await createProduct(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "محصول به‌روزرسانی شد" : "محصول ایجاد شد");
      router.push("/admins/products");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  const media = watch("media") ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">اطلاعات پایه</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">اسلاگ</Label>
            <Input id="slug" dir="ltr" placeholder="cement-clinker" disabled={editing} {...register("slug")} />
            {errors.slug ? <p className="text-xs font-medium text-red-600">{errors.slug.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="categoryId">دسته‌بندی</Label>
            <Select id="categoryId" {...register("categoryId")}>
              <option value="">انتخاب دسته…</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.categoryId ? <p className="text-xs font-medium text-red-600">{errors.categoryId.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">نوع</Label>
            <Select id="type" {...register("type")}>
              <option value="physical">محصول فیزیکی</option>
              <option value="service">محصول خدمتی</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="priceType">نحوه قیمت‌گذاری</Label>
            <Select id="priceType" {...register("priceType")}>
              <option value="fixed">قیمت ثابت</option>
              <option value="range">بازه قیمت</option>
              <option value="inquiry">استعلام</option>
            </Select>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {priceType !== "inquiry" ? (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">قیمت</Label>
                <Input id="price" dir="ltr" type="number" step="0.01" placeholder="1200.00" {...register("price")} />
              </div>
              {priceType === "range" ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="priceMax">حداکثر قیمت</Label>
                  <Input id="priceMax" dir="ltr" type="number" step="0.01" placeholder="2500.00" {...register("priceMax")} />
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <Label htmlFor="currency">ارز</Label>
                <Select id="currency" {...register("currency")}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="TRY">TRY</option>
                </Select>
              </div>
            </>
          ) : (
            <p className="col-span-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              برای این محصول قیمت نمایش داده نمی‌شود و مشتری درخواست استعلام ثبت می‌کند.
            </p>
          )}
        </div>

        <div className="mt-5 flex items-end gap-8">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">محتوا (۴ زبان)</h2>
        <div className="flex flex-col gap-6">
          <TranslationsEditor label="عنوان" value={watch("title")} onChange={handleTitleChange} />
          <TranslationsEditor label="خلاصه" type="textarea" rows={2} value={watch("summary")} onChange={(v) => setValue("summary", v)} />
          <TranslationsEditor label="توضیحات" type="textarea" rows={5} value={watch("description")} onChange={(v) => setValue("description", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SpecsEditor label="مشخصات فنی" value={watch("specs") ?? []} onChange={(v) => setValue("specs", v)} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">گالری تصاویر</h2>
        <MediaManager label="افزودن تصویر" value={media.map((m) => m.path)} onChange={handleMediaChange} folder="products" maxItems={10} />
        {media.length > 0 ? (
          <div className="mt-4 flex flex-col gap-4">
            {media.map((item, index) => (
              <TranslationsEditor
                key={item.path}
                label={`متن جایگزین تصویر ${index + 1}`}
                value={item.alt}
                onChange={(alt) =>
                  setValue(
                    "media",
                    media.map((m, i) => (i === index ? { ...m, alt } : m)),
                  )
                }
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">تگ‌ها</h2>
        <MultiCheckbox label="تگ‌های محصول" options={tagOptions} selected={watch("tagIds") ?? []} onChange={(v) => setValue("tagIds", v)} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد محصول"}
        </Button>
      </div>
    </form>
  );
}
