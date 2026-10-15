"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend, slugify } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LocalizedText } from "@/types";

export type TagFormValues = {
  slug: string;
  isActive: boolean;
  name: LocalizedText;
};

export async function createTag(values: TagFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const slug = slugify(values.slug);
  if (!slug) return { ok: false as const, error: "اسلاگ الزامی است." };

  try {
    const created = await prisma.tag.create({
      data: {
        slug,
        isActive: values.isActive,
        translations: {
          create: buildTranslations({ name: values.name }) as Prisma.TagTranslationCreateWithoutTagInput[],
        },
      },
    });
    revalidateFrontend([]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateTag(id: string, values: TagFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const slug = slugify(values.slug);
  if (!slug) return { ok: false as const, error: "اسلاگ الزامی است." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.tag.update({ where: { id: BigInt(id) }, data: { slug, isActive: values.isActive } });
      await tx.tagTranslation.deleteMany({ where: { tagId: BigInt(id) } });
      await tx.tagTranslation.createMany({
        data: buildTranslations({ name: values.name }).map((row) => ({
          ...row,
          tagId: BigInt(id),
        })) as Prisma.TagTranslationCreateManyInput[],
      });
    });
    revalidateFrontend([]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteTag(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.tag.delete({ where: { id: BigInt(id) } });
    revalidateFrontend([]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleTagActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.tag.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend([]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
