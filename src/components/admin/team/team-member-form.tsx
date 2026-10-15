"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createTeamMember,
  updateTeamMember,
  type TeamMemberFormValues,
} from "@/app/admins/(shell)/team/actions";
import { ImageInput } from "@/components/admin/image-input";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DEPARTMENT_LABELS } from "@/lib/admin/helpers";
import type { LocalizedText } from "@/types";

const localized = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string(),
  tr: z.string(),
  ru: z.string(),
});

const schema = z.object({
  department: z.enum(["leadership", "operations", "customs", "sales", "logistics"]),
  imagePath: z.string(),
  linkedinUrl: z.string().url("لینک LinkedIn معتبر نیست").or(z.literal("")),
  accent: z.string(),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean().default(true),
  name: localized,
  role: localized,
  bio: localized,
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

type TeamMemberDefaults = {
  id: string;
  department: TeamMemberFormValues["department"];
  imagePath: string | null;
  linkedinUrl: string | null;
  accent: string | null;
  sortOrder: number;
  isActive: boolean;
  name: LocalizedText;
  role: LocalizedText;
  bio: LocalizedText;
};

export function TeamMemberForm({
  defaultValues,
}: Readonly<{ defaultValues?: TeamMemberDefaults }>) {
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
      department: defaultValues?.department ?? "leadership",
      imagePath: defaultValues?.imagePath ?? "",
      linkedinUrl: defaultValues?.linkedinUrl ?? "",
      accent: defaultValues?.accent ?? "#123977",
      sortOrder: defaultValues?.sortOrder ?? 0,
      isActive: defaultValues?.isActive ?? true,
      name: defaultValues?.name ?? { fa: "", en: "", tr: "", ru: "" },
      role: defaultValues?.role ?? { fa: "", en: "", tr: "", ru: "" },
      bio: defaultValues?.bio ?? { fa: "", en: "", tr: "", ru: "" },
    },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = editing
      ? await updateTeamMember(defaultValues!.id, data)
      : await createTeamMember(data);
    setPending(false);

    if (result.ok) {
      toast.success(editing ? "عضو به‌روزرسانی شد" : "عضو تیم ایجاد شد");
      router.push("/admins/team");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">اطلاعات پایه</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="department">بخش</Label>
              <Select id="department" {...register("department")}>
                {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="linkedinUrl">لینک LinkedIn</Label>
              <Input id="linkedinUrl" dir="ltr" placeholder="https://linkedin.com/in/…" {...register("linkedinUrl")} />
              {errors.linkedinUrl ? <p className="text-xs font-medium text-red-600">{errors.linkedinUrl.message}</p> : null}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="sortOrder">ترتیب نمایش</Label>
                <Input id="sortOrder" type="number" min={0} className="max-w-28" {...register("sortOrder")} />
              </div>
              <label className="flex cursor-pointer items-center gap-2 pb-1 text-sm font-bold text-slate-700">
                <Checkbox {...register("isActive")} />
                فعال
              </label>
            </div>
          </div>
          <ImageInput
            label="تصویر عضو تیم"
            value={watch("imagePath")}
            onChange={(v) => setValue("imagePath", v ?? "")}
            folder="team"
            aspectClass="aspect-square"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-slate-900">محتوا (۴ زبان)</h2>
        <div className="flex flex-col gap-6">
          <TranslationsEditor label="نام و نام خانوادگی" value={watch("name")} onChange={(v) => setValue("name", v)} />
          <TranslationsEditor label="سمت" value={watch("role")} onChange={(v) => setValue("role", v)} />
          <TranslationsEditor label="بیوگرافی" type="textarea" rows={4} value={watch("bio")} onChange={(v) => setValue("bio", v)} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
          انصراف
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "در حال ذخیره…" : editing ? "ذخیره تغییرات" : "ایجاد عضو"}
        </Button>
      </div>
    </form>
  );
}
