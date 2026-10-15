"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LocalizedText } from "@/types";

export type OfficeFormValues = {
  countryId: string | null;
  phone: string;
  email: string;
  isHeadOffice: boolean;
  isActive: boolean;
  sortOrder: number;
  city: LocalizedText;
  address: LocalizedText;
  hours: LocalizedText;
};

export async function createOffice(values: OfficeFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!values.phone.trim()) return { ok: false as const, error: "شماره تلفن الزامی است." };
  if (!values.email.trim()) return { ok: false as const, error: "ایمیل الزامی است." };

  try {
    const created = await prisma.office.create({
      data: {
        countryId: values.countryId ? BigInt(values.countryId) : null,
        phone: values.phone.trim(),
        email: values.email.trim(),
        isHeadOffice: values.isHeadOffice,
        isActive: values.isActive,
        sortOrder: Number(values.sortOrder) || 0,
        translations: {
          create: buildTranslations({
            city: values.city,
            address: values.address,
            hours: values.hours,
          }) as Prisma.OfficeTranslationCreateWithoutOfficeInput[],
        },
      },
    });
    revalidateFrontend(["/contact", "/fa/contact", "/en/contact", "/tr/contact", "/ru/contact"]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateOffice(id: string, values: OfficeFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!values.phone.trim()) return { ok: false as const, error: "شماره تلفن الزامی است." };
  if (!values.email.trim()) return { ok: false as const, error: "ایمیل الزامی است." };

  const officeId = BigInt(id);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.office.update({
        where: { id: officeId },
        data: {
          countryId: values.countryId ? BigInt(values.countryId) : null,
          phone: values.phone.trim(),
          email: values.email.trim(),
          isHeadOffice: values.isHeadOffice,
          isActive: values.isActive,
          sortOrder: Number(values.sortOrder) || 0,
        },
      });
      await tx.officeTranslation.deleteMany({ where: { officeId } });
      await tx.officeTranslation.createMany({
        data: buildTranslations({
          city: values.city,
          address: values.address,
          hours: values.hours,
        }).map((row) => ({ ...row, officeId })) as Prisma.OfficeTranslationCreateManyInput[],
      });
    });
    revalidateFrontend(["/contact", "/fa/contact", "/en/contact", "/tr/contact", "/ru/contact"]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteOffice(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.office.delete({ where: { id: BigInt(id) } });
    revalidateFrontend(["/contact", "/fa/contact", "/en/contact", "/tr/contact", "/ru/contact"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleOfficeActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.office.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend(["/contact", "/fa/contact", "/en/contact", "/tr/contact", "/ru/contact"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
