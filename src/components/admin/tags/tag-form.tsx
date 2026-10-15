"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createTag, updateTag, type TagFormValues } from "@/app/admins/(shell)/tags/actions";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  slug: z.string().min(2, "اسلاگ را وارد کنید"),
  isActive: z.boolean().default(true),
  name: z.object({
    fa: z.string().min(1, "نام فارسی الزامی است"),
    en: z.string(),
    tr: z.string(),
    ru: z.string(),
  }),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export function TagForm({ defaultValues }: Readonly<{ defaultValues?: TagFormValues & { id: string } }>) {
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
      isActive: defaultValues?.isActive ?? true,
      name: defaultValues?.name ?? { fa: "", en: "", tr: "", ru: "" },
    },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing ? await updateTag(defaultValues!.id, data) : await createTag(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "تگ به‌روزرسانی شد" : "تگ ایجاد شد");
      router.push("/admins/tags");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:max-w-sm">
          <Label htmlFor="slug">اسلاگ</Label>
          <Input
            id="slug"
            dir="ltr"
            placeholder="export-consulting"
            disabled={editing}
            {...register("slug")}
          />
          <p className="text-xs text-slate-400">
            یکتا؛ برای جست‌وجوی محصولات و خدمات استفاده می‌شود.
          </p>
          {errors.slug ? <p className="text-xs font-medium text-red-600">{errors.slug.message}</p> : null}
        </div>
        <div className="mt-6">
          <TranslationsEditor label="نام تگ" value={watch("name")} onChange={(v) => setValue("name", v)} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">تگ فعال</p>
            <p className="mt-0.5 text-xs text-slate-500">تگ‌های غیرفعال در فرم‌های عمومی نمایش داده نمی‌شوند.</p>
          </div>
          <Checkbox {...register("isActive")} />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد تگ"}
        </Button>
      </div>
    </form>
  );
}
