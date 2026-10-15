"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LocalizedText } from "@/types";

export type CountryFormValues = {
  code: string;
  sortOrder: number;
  isActive: boolean;
  name: LocalizedText;
  region: LocalizedText;
};

export async function createCountry(values: CountryFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const code = values.code.trim().toUpperCase();
  if (!code) return { ok: false as const, error: "کد کشور الزامی است." };

  try {
    const created = await prisma.country.create({
      data: {
        code,
        sortOrder: Number(values.sortOrder) || 0,
        isActive: values.isActive,
        translations: {
          create: buildTranslations({
            name: values.name,
            region: values.region,
          }) as Prisma.CountryTranslationCreateWithoutCountryInput[],
        },
      },
    });
    revalidateFrontend([]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCountry(id: string, values: CountryFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const code = values.code.trim().toUpperCase();
  if (!code) return { ok: false as const, error: "کد کشور الزامی است." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.country.update({ where: { id: BigInt(id) }, data: { code, sortOrder: Number(values.sortOrder) || 0, isActive: values.isActive } });
      await tx.countryTranslation.deleteMany({ where: { countryId: BigInt(id) } });
      await tx.countryTranslation.createMany({
        data: buildTranslations({ name: values.name, region: values.region }).map((row) => ({
          ...row,
          countryId: BigInt(id),
        })) as Prisma.CountryTranslationCreateManyInput[],
      });
    });
    revalidateFrontend([]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCountry(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.country.delete({ where: { id: BigInt(id) } });
    revalidateFrontend([]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleCountryActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.country.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend([]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
