"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  createAdmin,
  updateAdmin,
  type AdminFormValues,
} from "@/app/admins/(shell)/admins/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminForm({
  defaultValues,
  editing,
}: Readonly<{
  defaultValues?: AdminFormValues & { id: string };
  editing?: boolean;
}>) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState<AdminFormValues>(
    defaultValues ?? { name: "", phone: "", email: "", password: "", isActive: true },
  );

  const set = (patch: Partial<AdminFormValues>) => setForm((prev) => ({ ...prev, ...patch }));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    const result = editing
      ? await updateAdmin(defaultValues!.id, form)
      : await createAdmin(form);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "مدیر ویرایش شد" : "مدیر افزوده شد");
    router.push("/admins/admins");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "ویرایش مدیر" : "افزودن مدیر"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input id="name" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="نام مدیر" />
            </div>
            <div>
              <Label htmlFor="phone">موبایل</Label>
              <Input id="phone" dir="ltr" value={form.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="+98912xxxxxxx" />
            </div>
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" dir="ltr" type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="admin@taymazglobal.com" />
            </div>
            <div>
              <Label htmlFor="password">{editing ? "رمز جدید (اختیاری)" : "رمز عبور"}</Label>
              <Input id="password" dir="ltr" type="password" value={form.password} onChange={(e) => set({ password: e.target.value })} placeholder="حداقل ۸ کاراکتر" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <Checkbox checked={form.isActive} onChange={(event) => set({ isActive: event.target.checked })} />
            <span className="text-sm font-bold">فعال</span>
          </label>
        </CardContent>
      </Card>
      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {editing ? "ذخیره تغییرات" : "افزودن مدیر"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admins/admins")}>
          انصراف
        </Button>
      </div>
    </form>
  );
}
