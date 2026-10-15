"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend, slugify } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LocalizedText } from "@/types";

export type CategoryFormValues = {
  slug: string;
  gradient: string;
  accent: string;
  sortOrder: number;
  isActive: boolean;
  title: LocalizedText;
  description: LocalizedText;
};

export async function createCategory(values: CategoryFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const slug = slugify(values.slug);
  if (!slug) return { ok: false as const, error: "اسلاگ الزامی است." };

  try {
    const created = await prisma.productCategory.create({
      data: {
        slug,
        gradient: values.gradient || null,
        accent: values.accent || null,
        sortOrder: Number(values.sortOrder) || 0,
        isActive: values.isActive,
        translations: {
          create: buildTranslations({
            title: values.title,
            description: values.description,
          }) as Prisma.ProductCategoryTranslationCreateWithoutCategoryInput[],
        },
      },
    });
    revalidateFrontend([]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCategory(id: string, values: CategoryFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const slug = slugify(values.slug);
  if (!slug) return { ok: false as const, error: "اسلاگ الزامی است." };

  const categoryId = BigInt(id);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.productCategory.update({
        where: { id: categoryId },
        data: {
          slug,
          gradient: values.gradient || null,
          accent: values.accent || null,
          sortOrder: Number(values.sortOrder) || 0,
          isActive: values.isActive,
        },
      });
      await tx.productCategoryTranslation.deleteMany({ where: { categoryId } });
      await tx.productCategoryTranslation.createMany({
        data: buildTranslations({
          title: values.title,
          description: values.description,
        }).map((row) => ({ ...row, categoryId })) as Prisma.ProductCategoryTranslationCreateManyInput[],
      });
    });
    revalidateFrontend([]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCategory(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.productCategory.delete({ where: { id: BigInt(id) } });
    revalidateFrontend([]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.productCategory.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend([]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
