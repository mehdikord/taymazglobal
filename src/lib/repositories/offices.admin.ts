import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/helpers";

export type OfficeAdminRow = {
  id: string;
  countryId: string | null;
  countryLabel: string;
  phone: string;
  email: string;
  isHeadOffice: boolean;
  isActive: boolean;
  sortOrder: number;
  cityFa: string;
};

export type OfficeAdminDetail = {
  id: string;
  countryId: string | null;
  phone: string;
  email: string;
  isHeadOffice: boolean;
  isActive: boolean;
  sortOrder: number;
  city: Record<Locale, string>;
  address: Record<Locale, string>;
  hours: Record<Locale, string>;
};

type ListParams = {
  q?: string;
  active?: string;
  page?: number;
  pageSize?: number;
};

export async function listOfficesAdmin(params: ListParams = {}): Promise<{
  rows: OfficeAdminRow[];
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
              { phone: { contains: q } },
              { email: { contains: q } },
              { translations: { some: { locale: "fa" as const, city: { contains: q } } } },
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
    prisma.office.count({ where }),
    prisma.office.findMany({
      where,
      include: {
        translations: { where: { locale: "fa" } },
        country: { include: { translations: { where: { locale: "fa" } } } },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: OfficeAdminRow[] = items.map((item) => ({
    id: String(item.id),
    countryId: item.countryId ? String(item.countryId) : null,
    countryLabel: item.country?.translations[0]?.name ?? item.country?.code ?? "—",
    phone: item.phone,
    email: item.email,
    isHeadOffice: item.isHeadOffice,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    cityFa: item.translations[0]?.city ?? "",
  }));

  return { rows, total };
}

export async function getOfficeAdmin(id: string): Promise<OfficeAdminDetail | null> {
  const item = await prisma.office.findUnique({
    where: { id: BigInt(id) },
    include: { translations: true },
  });
  if (!item) return null;

  const empty = (): Record<Locale, string> => ({ fa: "", en: "", tr: "", ru: "" });
  const detail: OfficeAdminDetail = {
    id: String(item.id),
    countryId: item.countryId ? String(item.countryId) : null,
    phone: item.phone,
    email: item.email,
    isHeadOffice: item.isHeadOffice,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    city: empty(),
    address: empty(),
    hours: empty(),
  };
  for (const t of item.translations) {
    detail.city[t.locale] = t.city ?? "";
    detail.address[t.locale] = t.address ?? "";
    detail.hours[t.locale] = t.hours ?? "";
  }
  return detail;
}
