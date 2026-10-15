"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createCategory,
  updateCategory,
  type CategoryFormValues,
} from "@/app/admins/(shell)/categories/actions";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/admin/helpers";
import type { LocalizedText } from "@/types";

const localized = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string(),
  tr: z.string(),
  ru: z.string(),
});

const schema = z.object({
  slug: z.string().min(2, "اسلاگ را وارد کنید"),
  gradient: z.string(),
  accent: z.string(),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  title: localized,
  description: localized,
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

type CategoryDefaults = {
  id: string;
  slug: string;
  gradient: string | null;
  accent: string | null;
  sortOrder: number;
  isActive: boolean;
  title: LocalizedText;
  description: LocalizedText;
};

export function CategoryForm({
  defaultValues,
}: Readonly<{ defaultValues?: CategoryDefaults }>) {
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
      gradient: defaultValues?.gradient ?? "linear-gradient(135deg,#123977,#1c55c0)",
      accent: defaultValues?.accent ?? "#123977",
      sortOrder: defaultValues?.sortOrder ?? 0,
      isActive: defaultValues?.isActive ?? true,
      title: defaultValues?.title ?? { fa: "", en: "", tr: "", ru: "" },
      description: defaultValues?.description ?? { fa: "", en: "", tr: "", ru: "" },
    },
  });

  function handleTitleChange(value: { fa: string; en: string; tr: string; ru: string }) {
    setValue("title", value);
    if (!editing && !watch("slug") && value.en) setValue("slug", slugify(value.en));
  }

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing
      ? await updateCategory(defaultValues!.id, data)
      : await createCategory(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "دسته به‌روزرسانی شد" : "دسته ایجاد شد");
      router.push("/admins/categories");
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
            <Input id="slug" dir="ltr" placeholder="construction-materials" disabled={editing} {...register("slug")} />
            {errors.slug ? <p className="text-xs font-medium text-red-600">{errors.slug.message}</p> : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sortOrder">ترتیب نمایش</Label>
            <Input id="sortOrder" type="number" min={0} {...register("sortOrder")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gradient">گرادیان نمایش (CSS)</Label>
            <Input id="gradient" dir="ltr" placeholder="linear-gradient(…)" {...register("gradient")} />
          </div>
          <div className="flex items-end gap-4 pb-1">
            <div className="flex flex-col gap-1.5">
              <Label>رنگ تم</Label>
              <Input type="color" className="h-11 w-14 p-1" {...register("accent")} />
            </div>
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
          <TranslationsEditor label="توضیحات" type="textarea" rows={3} value={watch("description")} onChange={(v) => setValue("description", v)} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد دسته"}
        </Button>
      </div>
    </form>
  );
}
