"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { saveSettings, type SiteSettingsFormValues } from "@/app/admins/(shell)/settings/actions";
import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const localized = z.object({
  fa: z.string().min(1, "متن فارسی الزامی است"),
  en: z.string(),
  tr: z.string(),
  ru: z.string(),
});

const schema = z.object({
  name: localized,
  tagline: localized,
  phones: z.string(),
  emails: z.string(),
  telegram: z.string(),
  instagram: z.string(),
  whatsapp: z.string(),
  linkedin: z.string(),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

export function SettingsForm({ defaultValues }: Readonly<{ defaultValues: SiteSettingsFormValues }>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const name = watch("name") ?? { fa: "", en: "", tr: "", ru: "" };
  const tagline = watch("tagline") ?? { fa: "", en: "", tr: "", ru: "" };

  const onSubmit = async (data: FormData) => {
    setPending(true);
    const result = await saveSettings(data);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("تنظیمات ذخیره شد", { description: "تغییرات در فرانت اعمال شد." });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات عمومی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <TranslationsEditor
            label="نام سایت"
            value={name}
            onChange={(value) => setValue("name", value)}
          />
          <TranslationsEditor
            label="شعار / معرفی کوتاه"
            type="textarea"
            rows={2}
            value={tagline}
            onChange={(value) => setValue("tagline", value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات تماس</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="phones">تلفن‌ها (هر مورد در یک خط)</Label>
            <Textarea id="phones" rows={3} placeholder="+98912xxx" {...register("phones")} />
          </div>
          <div>
            <Label htmlFor="emails">ایمیل‌ها (هر مورد در یک خط)</Label>
            <Textarea id="emails" rows={3} placeholder="info@taymazglobal.com" {...register("emails")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>شبکه‌های اجتماعی</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="telegram">تلگرام</Label>
            <Input id="telegram" dir="ltr" placeholder="https://t.me/..." {...register("telegram")} />
          </div>
          <div>
            <Label htmlFor="instagram">اینستاگرام</Label>
            <Input id="instagram" dir="ltr" placeholder="https://instagram.com/..." {...register("instagram")} />
          </div>
          <div>
            <Label htmlFor="whatsapp">واتساپ</Label>
            <Input id="whatsapp" dir="ltr" placeholder="https://wa.me/..." {...register("whatsapp")} />
          </div>
          <div>
            <Label htmlFor="linkedin">لینکدین</Label>
            <Input id="linkedin" dir="ltr" placeholder="https://linkedin.com/in/..." {...register("linkedin")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          ذخیره تنظیمات
        </Button>
        <Button type="button" variant="outline" onClick={() => router.refresh()}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
