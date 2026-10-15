import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/helpers";

export type PortfolioAdminRow = {
  id: string;
  slug: string;
  serviceName: string;
  countryName: string;
  year: number;
  isFeatured: boolean;
  isActive: boolean;
  titleFa: string;
};

export type PortfolioAdminDetail = {
  id: string;
  slug: string;
  serviceId: string;
  countryId: string | null;
  year: number;
  gradient: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  challenge: Record<Locale, string>;
  solution: Record<Locale, string>;
  outcome: Record<Locale, string>;
  route: Record<Locale, string>;
  metrics: Array<{ value: string; label: Record<Locale, string> }>;
  gallery: string[];
};

type ListParams = {
  q?: string;
  service?: string;
  active?: string;
  featured?: string;
  page?: number;
  pageSize?: number;
};

export async function listPortfolioAdmin(params: ListParams = {}): Promise<{
  rows: PortfolioAdminRow[];
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
      params.service ? { serviceId: BigInt(params.service) } : {},
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
    prisma.portfolioItem.count({ where }),
    prisma.portfolioItem.findMany({
      where,
      include: {
        translations: { where: { locale: "fa" } },
        service: { include: { translations: { where: { locale: "fa" } } } },
        country: { include: { translations: { where: { locale: "fa" } } } },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: PortfolioAdminRow[] = items.map((item) => ({
    id: String(item.id),
    slug: item.slug,
    serviceName: item.service.translations[0]?.title ?? item.service.slug,
    countryName: item.country?.translations[0]?.name ?? item.country?.code ?? "—",
    year: item.year,
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    titleFa: item.translations[0]?.title ?? "",
  }));

  return { rows, total };
}

export async function getPortfolioAdmin(id: string): Promise<PortfolioAdminDetail | null> {
  const item = await prisma.portfolioItem.findUnique({
    where: { id: BigInt(id) },
    include: {
      translations: true,
      metrics: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
      galleryItems: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!item) return null;

  const empty = (): Record<Locale, string> => ({ fa: "", en: "", tr: "", ru: "" });
  const detail: PortfolioAdminDetail = {
    id: String(item.id),
    slug: item.slug,
    serviceId: String(item.serviceId),
    countryId: item.countryId ? String(item.countryId) : null,
    year: item.year,
    gradient: item.gradient ?? "",
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    title: empty(),
    summary: empty(),
    challenge: empty(),
    solution: empty(),
    outcome: empty(),
    route: empty(),
    metrics: item.metrics.map((metric) => {
      const label = empty();
      for (const t of metric.translations) label[t.locale] = t.label ?? "";
      return { value: metric.value, label };
    }),
    gallery: item.galleryItems.map((g) => g.path ?? "").filter(Boolean),
  };

  for (const t of item.translations) {
    detail.title[t.locale] = t.title ?? "";
    detail.summary[t.locale] = t.summary ?? "";
    detail.challenge[t.locale] = t.challenge ?? "";
    detail.solution[t.locale] = t.solution ?? "";
    detail.outcome[t.locale] = t.outcome ?? "";
    detail.route[t.locale] = t.route ?? "";
  }

  return detail;
}
