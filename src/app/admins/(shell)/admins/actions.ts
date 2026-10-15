"use server";

import { revalidatePath } from "next/cache";
import { compare, hash } from "bcryptjs";

import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import { normalizePhone } from "@/lib/utils";

export type AdminFormValues = {
  name: string;
  phone: string;
  email: string;
  password: string;
  isActive: boolean;
};

export async function createAdmin(values: AdminFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (values.name.trim().length < 2) return { ok: false as const, error: "نام مدیر را وارد کنید." };
  if (values.password.length < 8) return { ok: false as const, error: "رمز باید حداقل ۸ کاراکتر باشد." };

  const phone = normalizePhone(values.phone);
  if (!phone) return { ok: false as const, error: "شماره موبایل معتبر نیست." };

  try {
    const created = await prisma.admin.create({
      data: {
        name: values.name.trim(),
        phone,
        email: values.email.trim().toLowerCase(),
        password: await hash(values.password, 10),
        isActive: values.isActive,
      },
    });
    revalidatePath("/admins/admins");
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Unique") || message.includes("Duplicate")) {
      return { ok: false as const, error: "موبایل یا ایمیل قبلاً ثبت شده است." };
    }
    return { ok: false as const, error: "خطا در ثبت مدیر." };
  }
}

export async function updateAdmin(id: string, values: AdminFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (values.name.trim().length < 2) return { ok: false as const, error: "نام مدیر را وارد کنید." };

  const phone = normalizePhone(values.phone);
  if (!phone) return { ok: false as const, error: "شماره موبایل معتبر نیست." };

  try {
    await prisma.admin.update({
      where: { id: BigInt(id) },
      data: {
        name: values.name.trim(),
        phone,
        email: values.email.trim().toLowerCase(),
        isActive: values.isActive,
        ...(values.password ? { password: await hash(values.password, 10) } : {}),
      },
    });
    revalidatePath("/admins/admins");
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("Unique") || message.includes("Duplicate")) {
      return { ok: false as const, error: "موبایل یا ایمیل قبلاً ثبت شده است." };
    }
    return { ok: false as const, error: "خطا در ویرایش مدیر." };
  }
}

export async function toggleAdminActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (admin.id === id) return { ok: false as const, error: "نمی‌توانید وضعیت خود را تغییر دهید." };

  try {
    await prisma.admin.update({
      where: { id: BigInt(id) },
      data: { isActive },
    });
    revalidatePath("/admins/admins");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "خطا در تغییر وضعیت." };
  }
}

export async function changeOwnPassword(currentPassword: string, newPassword: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (newPassword.length < 8) return { ok: false as const, error: "رمز جدید باید حداقل ۸ کاراکتر باشد." };

  try {
    const row = await prisma.admin.findUnique({
      where: { id: BigInt(admin.id) },
      select: { password: true },
    });
    if (!row) return { ok: false as const, error: "مدیر یافت نشد." };
    const matches = await compare(currentPassword, row.password);
    if (!matches) return { ok: false as const, error: "رمز فعلی نادرست است." };

    await prisma.admin.update({
      where: { id: BigInt(admin.id) },
      data: { password: await hash(newPassword, 10) },
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "خطا در تغییر رمز." };
  }
}
