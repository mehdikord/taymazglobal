"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend, slugify } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LocalizedText } from "@/types";

export type ProductFormValues = {
  slug: string;
  categoryId: string;
  type: "physical" | "service";
  priceType: "fixed" | "inquiry" | "range";
  price: string;
  priceMax: string;
  currency: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  tagIds: string[];
  title: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  specs: Array<{ label: LocalizedText; value: LocalizedText }>;
  media: Array<{ path: string; type: "image" | "video"; alt: LocalizedText }>;
};

const PRICE_TYPES = ["fixed", "inquiry", "range"] as const;
const PRODUCT_TYPES = ["physical", "service"] as const;
const CURRENCIES = ["USD", "EUR", "TRY"] as const;

function productData(values: ProductFormValues) {
  const price = values.priceType === "inquiry" ? null : values.price.trim() ? values.price.trim() : null;
  const priceMax = values.priceType === "range" && values.priceMax.trim() ? values.priceMax.trim() : null;
  const currency = values.priceType === "inquiry" ? null : (values.currency as "USD" | "EUR" | "TRY" | undefined) ?? null;

  return {
    slug: slugify(values.slug),
    categoryId: BigInt(values.categoryId),
    type: values.type,
    priceType: values.priceType,
    price,
    priceMax,
    currency,
    isFeatured: values.isFeatured,
    isActive: values.isActive,
    sortOrder: Number(values.sortOrder) || 0,
  };
}

export async function createProduct(values: ProductFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!values.categoryId) return { ok: false as const, error: "دسته‌بندی را انتخاب کنید." };
  if (!PRICE_TYPES.includes(values.priceType) || !PRODUCT_TYPES.includes(values.type))
    return { ok: false as const, error: "مقادیر نامعتبر است." };

  try {
    const created = await prisma.product.create({
      data: {
        ...productData(values),
        translations: {
          create: buildTranslations({
            title: values.title,
            summary: values.summary,
            description: values.description,
          }) as Prisma.ProductTranslationCreateWithoutProductInput[],
        },
        specs: {
          create: values.specs.map((spec, index) => ({
            sortOrder: index,
            translations: {
              create: buildTranslations({
                label: spec.label,
                value: spec.value,
              }) as Prisma.ProductSpecTranslationCreateWithoutSpecInput[],
            },
          })),
        },
        media: {
          create: values.media.map((media, index) => ({
            type: media.type,
            path: media.path || null,
            sortOrder: index,
            translations: {
              create: buildTranslations({ alt: media.alt }) as Prisma.ProductMediaTranslationCreateWithoutMediaInput[],
            },
          })),
        },
        tags: {
          create: values.tagIds.map((tagId) => ({ tagId: BigInt(tagId) })),
        },
      },
    });
    revalidateFrontend(["/products", "/fa/products", "/en/products", "/tr/products", "/ru/products"]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!values.categoryId) return { ok: false as const, error: "دسته‌بندی را انتخاب کنید." };
  if (!PRICE_TYPES.includes(values.priceType) || !PRODUCT_TYPES.includes(values.type))
    return { ok: false as const, error: "مقادیر نامعتبر است." };

  const productId = BigInt(id);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id: productId }, data: productData(values) });

      await tx.productTranslation.deleteMany({ where: { productId } });
      await tx.productTranslation.createMany({
        data: buildTranslations({
          title: values.title,
          summary: values.summary,
          description: values.description,
        }).map((row) => ({ ...row, productId })) as Prisma.ProductTranslationCreateManyInput[],
      });

      await tx.productSpec.deleteMany({ where: { productId } });
      for (const [index, spec] of values.specs.entries()) {
        await tx.productSpec.create({
          data: {
            productId,
            sortOrder: index,
            translations: {
              create: buildTranslations({ label: spec.label, value: spec.value }) as Prisma.ProductSpecTranslationCreateWithoutSpecInput[],
            },
          },
        });
      }

      await tx.productMedia.deleteMany({ where: { productId } });
      for (const [index, media] of values.media.entries()) {
        await tx.productMedia.create({
          data: {
            productId,
            type: media.type,
            path: media.path || null,
            sortOrder: index,
            translations: {
              create: buildTranslations({ alt: media.alt }) as Prisma.ProductMediaTranslationCreateWithoutMediaInput[],
            },
          },
        });
      }

      await tx.productTag.deleteMany({ where: { productId } });
      await tx.productTag.createMany({
        data: values.tagIds.map((tagId) => ({ productId, tagId: BigInt(tagId) })),
      });
    });
    revalidateFrontend(["/products", "/fa/products", "/en/products", "/tr/products", "/ru/products"]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteProduct(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.product.delete({ where: { id: BigInt(id) } });
    revalidateFrontend(["/products", "/fa/products", "/en/products", "/tr/products", "/ru/products"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.product.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend(["/products", "/fa/products", "/en/products", "/tr/products", "/ru/products"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
