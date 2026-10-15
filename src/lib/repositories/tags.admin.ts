import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/crud";

export type TagAdminRow = {
  id: string;
  slug: string;
  isActive: boolean;
  nameFa: string;
  nameEn: string;
};

export type TagAdminDetail = {
  id: string;
  slug: string;
  isActive: boolean;
  name: Record<Locale, string>;
};

type ListParams = {
  q?: string;
  active?: string;
  page?: number;
  pageSize?: number;
};

export async function listTagsAdmin(params: ListParams = {}): Promise<{
  rows: TagAdminRow[];
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
              { translations: { some: { locale: "fa" as const, name: { contains: q } } } },
              { translations: { some: { locale: "en" as const, name: { contains: q } } } },
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
    prisma.tag.count({ where }),
    prisma.tag.findMany({
      where,
      include: { translations: { where: { locale: { in: ["fa", "en"] } } } },
      orderBy: { id: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: TagAdminRow[] = items.map((item) => {
    const fa = item.translations.find((t) => t.locale === "fa");
    const en = item.translations.find((t) => t.locale === "en");
    return {
      id: String(item.id),
      slug: item.slug,
      isActive: item.isActive,
      nameFa: fa?.name ?? "",
      nameEn: en?.name ?? "",
    };
  });

  return { rows, total };
}

export async function getTagAdmin(id: string): Promise<TagAdminDetail | null> {
  const item = await prisma.tag.findUnique({
    where: { id: BigInt(id) },
    include: { translations: true },
  });
  if (!item) return null;

  const detail: TagAdminDetail = { id: String(item.id), slug: item.slug, isActive: item.isActive, name: { fa: "", en: "", tr: "", ru: "" } };
  for (const t of item.translations) detail.name[t.locale] = t.name ?? "";
  return detail;
}

export async function listTagOptions(): Promise<Array<{ value: string; label: string }>> {
  const items = await prisma.tag.findMany({
    where: { isActive: true },
    include: { translations: { where: { locale: "fa" } } },
    orderBy: { id: "asc" },
  });
  return items.map((item) => ({
    value: String(item.id),
    label: item.translations[0]?.name ?? item.slug,
  }));
}
