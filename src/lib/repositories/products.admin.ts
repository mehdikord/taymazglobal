import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/helpers";

export type ProductAdminRow = {
  id: string;
  slug: string;
  categoryName: string;
  type: "physical" | "service";
  priceType: "fixed" | "inquiry" | "range";
  priceText: string;
  isFeatured: boolean;
  isActive: boolean;
  titleFa: string;
  coverPath: string | null;
};

export type ProductAdminDetail = {
  id: string;
  slug: string;
  categoryId: string;
  type: "physical" | "service";
  priceType: "fixed" | "inquiry" | "range";
  price: string;
  priceMax: string;
  currency: "USD" | "EUR" | "TRY" | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  tagIds: string[];
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  description: Record<Locale, string>;
  specs: Array<{ label: Record<Locale, string>; value: Record<Locale, string> }>;
  media: Array<{ path: string; type: "image" | "video"; alt: Record<Locale, string> }>;
};

type ListParams = {
  q?: string;
  category?: string;
  type?: string;
  priceType?: string;
  active?: string;
  featured?: string;
  page?: number;
  pageSize?: number;
};

export async function listProductsAdmin(params: ListParams = {}): Promise<{
  rows: ProductAdminRow[];
  total: number;
}> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize ?? 20;
  const q = params.q?.trim();

  const where: Prisma.ProductWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { slug: { contains: q } },
              { translations: { some: { locale: "fa" as const, title: { contains: q } } } },
              { translations: { some: { locale: "en" as const, title: { contains: q } } } },
            ],
          }
        : {},
      params.category ? { categoryId: BigInt(params.category) } : {},
      params.type === "physical" || params.type === "service" ? { type: params.type } : {},
      params.priceType === "fixed" || params.priceType === "inquiry" || params.priceType === "range"
        ? { priceType: params.priceType }
        : {},
      params.active === "active"
        ? { isActive: true }
        : params.active === "inactive"
          ? { isActive: false }
          : {},
      params.featured === "featured"
        ? { isFeatured: true }
        : params.featured === "regular"
          ? { isFeatured: false }
          : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        translations: { where: { locale: "fa" } },
        category: { include: { translations: { where: { locale: "fa" } } } },
        media: { where: { type: "image" }, orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: ProductAdminRow[] = items.map((item) => {
    let priceText = "استعلام";
    if (item.priceType === "fixed" && item.price != null) priceText = `${item.price} ${item.currency ?? ""}`.trim();
    if (item.priceType === "range" && item.price != null && item.priceMax != null)
      priceText = `${item.price}–${item.priceMax} ${item.currency ?? ""}`.trim();

    return {
      id: String(item.id),
      slug: item.slug,
      categoryName: item.category.translations[0]?.title ?? item.category.slug,
      type: item.type,
      priceType: item.priceType,
      priceText,
      isFeatured: item.isFeatured,
      isActive: item.isActive,
      titleFa: item.translations[0]?.title ?? "",
      coverPath: item.media[0]?.path ?? null,
    };
  });

  return { rows, total };
}

export async function getProductAdmin(id: string): Promise<ProductAdminDetail | null> {
  const item = await prisma.product.findUnique({
    where: { id: BigInt(id) },
    include: {
      translations: true,
      specs: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
      media: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
      tags: true,
    },
  });
  if (!item) return null;

  const empty = (): Record<Locale, string> => ({ fa: "", en: "", tr: "", ru: "" });
  const detail: ProductAdminDetail = {
    id: String(item.id),
    slug: item.slug,
    categoryId: String(item.categoryId),
    type: item.type,
    priceType: item.priceType,
    price: item.price?.toString() ?? "",
    priceMax: item.priceMax?.toString() ?? "",
    currency: item.currency,
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    tagIds: item.tags.map((t) => String(t.tagId)),
    title: empty(),
    summary: empty(),
    description: empty(),
    specs: item.specs.map((spec) => {
      const label = empty();
      const value = empty();
      for (const t of spec.translations) {
        label[t.locale] = t.label ?? "";
        value[t.locale] = t.value ?? "";
      }
      return { label, value };
    }),
    media: item.media.map((media) => {
      const alt = empty();
      for (const t of media.translations) alt[t.locale] = t.alt ?? "";
      return { path: media.path ?? "", type: media.type, alt };
    }),
  };

  for (const t of item.translations) {
    detail.title[t.locale] = t.title ?? "";
    detail.summary[t.locale] = t.summary ?? "";
    detail.description[t.locale] = t.description ?? "";
  }

  return detail;
}
