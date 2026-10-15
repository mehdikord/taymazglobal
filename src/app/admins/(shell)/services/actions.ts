"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend, slugify } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import { isServiceIconKey } from "@/lib/repositories/services.admin";
import type { FaqItem, LocalizedText } from "@/types";

export type ServiceFormValues = {
  slug: string;
  icon: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  countryIds: string[];
  tagIds: string[];
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  benefits: LocalizedText[];
  steps: LocalizedText[];
  faq: FaqItem[];
};

function validateBase(values: ServiceFormValues): string | null {
  const slug = slugify(values.slug);
  if (!slug) return "اسلاگ الزامی است.";
  if (!values.icon || !isServiceIconKey(values.icon)) return "آیکون نامعتبر است.";
  return null;
}

export async function createService(values: ServiceFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  const invalid = validateBase(values);
  if (invalid) return { ok: false as const, error: invalid };

  const slug = slugify(values.slug);
  try {
    const created = await prisma.service.create({
      data: {
        slug,
        icon: values.icon,
        sortOrder: Number(values.sortOrder) || 0,
        isFeatured: values.isFeatured,
        isActive: values.isActive,
        translations: {
          create: buildTranslations({
            title: values.title,
            summary: values.summary,
            description: values.description,
            benefits: values.benefits,
            steps: values.steps,
            faq: values.faq,
          }) as Prisma.ServiceTranslationCreateWithoutServiceInput[],
        },
        countries: {
          create: values.countryIds.map((id) => ({ countryId: BigInt(id) })),
        },
        tags: {
          create: values.tagIds.map((id) => ({ tagId: BigInt(id) })),
        },
      },
    });
    revalidateFrontend(["/services", "/fa/services", "/en/services", "/tr/services", "/ru/services"]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateService(id: string, values: ServiceFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  const invalid = validateBase(values);
  if (invalid) return { ok: false as const, error: invalid };

  const slug = slugify(values.slug);
  const serviceId = BigInt(id);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.service.update({
        where: { id: serviceId },
        data: {
          slug,
          icon: values.icon,
          sortOrder: Number(values.sortOrder) || 0,
          isFeatured: values.isFeatured,
          isActive: values.isActive,
        },
      });
      await tx.serviceTranslation.deleteMany({ where: { serviceId } });
      await tx.serviceTranslation.createMany({
        data: buildTranslations({
          title: values.title,
          summary: values.summary,
          description: values.description,
          benefits: values.benefits,
          steps: values.steps,
          faq: values.faq,
        }).map((row) => ({ ...row, serviceId })) as Prisma.ServiceTranslationCreateManyInput[],
      });
      await tx.serviceCountry.deleteMany({ where: { serviceId } });
      await tx.serviceCountry.createMany({
        data: values.countryIds.map((countryId) => ({ serviceId, countryId: BigInt(countryId) })),
      });
      await tx.serviceTag.deleteMany({ where: { serviceId } });
      await tx.serviceTag.createMany({
        data: values.tagIds.map((tagId) => ({ serviceId, tagId: BigInt(tagId) })),
      });
    });
    revalidateFrontend(["/services", "/fa/services", "/en/services", "/tr/services", "/ru/services"]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteService(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.service.delete({ where: { id: BigInt(id) } });
    revalidateFrontend(["/services", "/fa/services", "/en/services", "/tr/services", "/ru/services"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.service.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend(["/services", "/fa/services", "/en/services", "/tr/services", "/ru/services"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
