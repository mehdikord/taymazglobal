import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/crud";

export type CountryAdminRow = {
  id: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  nameFa: string;
  nameEn: string;
  regionFa: string;
};

export type CountryAdminDetail = {
  id: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  name: Record<Locale, string>;
  region: Record<Locale, string>;
};

type ListParams = {
  q?: string;
  active?: string;
  page?: number;
  pageSize?: number;
};

export async function listCountriesAdmin(params: ListParams = {}): Promise<{
  rows: CountryAdminRow[];
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
              { code: { contains: q } },
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
    prisma.country.count({ where }),
    prisma.country.findMany({
      where,
      include: { translations: { where: { locale: { in: ["fa", "en"] } } } },
      orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: CountryAdminRow[] = items.map((item) => {
    const fa = item.translations.find((t) => t.locale === "fa");
    const en = item.translations.find((t) => t.locale === "en");
    return {
      id: String(item.id),
      code: item.code,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
      nameFa: fa?.name ?? "",
      nameEn: en?.name ?? "",
      regionFa: fa?.region ?? "",
    };
  });

  return { rows, total };
}

export async function getCountryAdmin(id: string): Promise<CountryAdminDetail | null> {
  const item = await prisma.country.findUnique({
    where: { id: BigInt(id) },
    include: { translations: true },
  });
  if (!item) return null;

  const detail: CountryAdminDetail = {
    id: String(item.id),
    code: item.code,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    name: { fa: "", en: "", tr: "", ru: "" },
    region: { fa: "", en: "", tr: "", ru: "" },
  };
  for (const t of item.translations) {
    detail.name[t.locale] = t.name ?? "";
    detail.region[t.locale] = t.region ?? "";
  }
  return detail;
}

export async function listCountryOptions(): Promise<Array<{ value: string; label: string }>> {
  const items = await prisma.country.findMany({
    where: { isActive: true },
    include: { translations: { where: { locale: "fa" } } },
    orderBy: { sortOrder: "asc" },
  });
  return items.map((item) => ({
    value: String(item.id),
    label: item.translations[0]?.name ?? item.code,
  }));
}
