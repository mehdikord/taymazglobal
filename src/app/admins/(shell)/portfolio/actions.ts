"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend, slugify } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LocalizedText } from "@/types";

export type PortfolioFormValues = {
  slug: string;
  serviceId: string;
  countryId: string;
  year: number;
  gradient: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  title: LocalizedText;
  summary: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  outcome: LocalizedText;
  route: LocalizedText;
  metrics: Array<{ value: string; label: LocalizedText }>;
  gallery: string[];
};

export async function createPortfolio(values: PortfolioFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!values.serviceId) return { ok: false as const, error: "خدمت را انتخاب کنید." };

  try {
    const created = await prisma.portfolioItem.create({
      data: {
        slug: slugify(values.slug),
        serviceId: BigInt(values.serviceId),
        countryId: values.countryId ? BigInt(values.countryId) : null,
        year: Number(values.year) || new Date().getFullYear(),
        gradient: values.gradient || null,
        isFeatured: values.isFeatured,
        isActive: values.isActive,
        sortOrder: Number(values.sortOrder) || 0,
        translations: {
          create: buildTranslations({
            title: values.title,
            summary: values.summary,
            challenge: values.challenge,
            solution: values.solution,
            outcome: values.outcome,
            route: values.route,
          }) as Prisma.PortfolioTranslationCreateWithoutPortfolioItemInput[],
        },
        metrics: {
          create: values.metrics.map((metric, index) => ({
            value: metric.value,
            sortOrder: index,
            translations: {
              create: buildTranslations({ label: metric.label }) as Prisma.PortfolioMetricTranslationCreateWithoutMetricInput[],
            },
          })),
        },
        galleryItems: {
          create: values.gallery.map((path, index) => ({ path, sortOrder: index })),
        },
      },
    });
    revalidateFrontend(["/portfolio", "/fa/portfolio", "/en/portfolio", "/tr/portfolio", "/ru/portfolio"]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updatePortfolio(id: string, values: PortfolioFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!values.serviceId) return { ok: false as const, error: "خدمت را انتخاب کنید." };

  const portfolioId = BigInt(id);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.portfolioItem.update({
        where: { id: portfolioId },
        data: {
          slug: slugify(values.slug),
          serviceId: BigInt(values.serviceId),
          countryId: values.countryId ? BigInt(values.countryId) : null,
          year: Number(values.year) || new Date().getFullYear(),
          gradient: values.gradient || null,
          isFeatured: values.isFeatured,
          isActive: values.isActive,
          sortOrder: Number(values.sortOrder) || 0,
        },
      });

      await tx.portfolioTranslation.deleteMany({ where: { portfolioItemId: portfolioId } });
      await tx.portfolioTranslation.createMany({
        data: buildTranslations({
          title: values.title,
          summary: values.summary,
          challenge: values.challenge,
          solution: values.solution,
          outcome: values.outcome,
          route: values.route,
        }).map((row) => ({ ...row, portfolioItemId: portfolioId })) as Prisma.PortfolioTranslationCreateManyInput[],
      });

      await tx.portfolioMetric.deleteMany({ where: { portfolioItemId: portfolioId } });
      for (const [index, metric] of values.metrics.entries()) {
        await tx.portfolioMetric.create({
          data: {
            portfolioItemId: portfolioId,
            value: metric.value,
            sortOrder: index,
            translations: {
              create: buildTranslations({ label: metric.label }) as Prisma.PortfolioMetricTranslationCreateWithoutMetricInput[],
            },
          },
        });
      }

      await tx.portfolioGalleryItem.deleteMany({ where: { portfolioItemId: portfolioId } });
      await tx.portfolioGalleryItem.createMany({
        data: values.gallery.map((path, index) => ({ portfolioItemId: portfolioId, path, sortOrder: index })),
      });
    });
    revalidateFrontend(["/portfolio", "/fa/portfolio", "/en/portfolio", "/tr/portfolio", "/ru/portfolio"]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deletePortfolio(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.portfolioItem.delete({ where: { id: BigInt(id) } });
    revalidateFrontend(["/portfolio", "/fa/portfolio", "/en/portfolio", "/tr/portfolio", "/ru/portfolio"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function togglePortfolioActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.portfolioItem.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend(["/portfolio", "/fa/portfolio", "/en/portfolio", "/tr/portfolio", "/ru/portfolio"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
