import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/helpers";

export type CategoryAdminRow = {
  id: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  titleFa: string;
  gradient: string | null;
};

export type CategoryAdminDetail = {
  id: string;
  slug: string;
  gradient: string | null;
  accent: string | null;
  isActive: boolean;
  sortOrder: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
};

type ListParams = {
  q?: string;
  active?: string;
  page?: number;
  pageSize?: number;
};

export async function listCategoriesAdmin(params: ListParams = {}): Promise<{
  rows: CategoryAdminRow[];
  total: number;
}> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize ?? 20;
  const q = params.q?.trim();

  const where = {
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
      params.active === "active"
        ? { isActive: true }
        : params.active === "inactive"
          ? { isActive: false }
          : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.productCategory.count({ where }),
    prisma.productCategory.findMany({
      where,
      include: { translations: { where: { locale: "fa" } } },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: CategoryAdminRow[] = items.map((item) => ({
    id: String(item.id),
    slug: item.slug,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    titleFa: item.translations[0]?.title ?? "",
    gradient: item.gradient,
  }));

  return { rows, total };
}

export async function getCategoryAdmin(id: string): Promise<CategoryAdminDetail | null> {
  const item = await prisma.productCategory.findUnique({
    where: { id: BigInt(id) },
    include: { translations: true },
  });
  if (!item) return null;

  const empty = (): Record<Locale, string> => ({ fa: "", en: "", tr: "", ru: "" });
  const detail: CategoryAdminDetail = {
    id: String(item.id),
    slug: item.slug,
    gradient: item.gradient,
    accent: item.accent,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    title: empty(),
    description: empty(),
  };
  for (const t of item.translations) {
    detail.title[t.locale] = t.title ?? "";
    detail.description[t.locale] = t.description ?? "";
  }
  return detail;
}

export async function listCategoryOptions(): Promise<Array<{ value: string; label: string }>> {
  const items = await prisma.productCategory.findMany({
    where: { isActive: true },
    include: { translations: { where: { locale: "fa" } } },
    orderBy: { sortOrder: "asc" },
  });
  return items.map((item) => ({
    value: String(item.id),
    label: item.translations[0]?.title ?? item.slug,
  }));
}
