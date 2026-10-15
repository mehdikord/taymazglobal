import "server-only";

import { prisma } from "@/lib/db/prisma";
import { fromRows } from "@/lib/frontend/localize";
import type { PortfolioFilters, PortfolioItem } from "@/types";

type TranslationRow = {
  locale: string;
  title: string;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  outcome: string | null;
  route: string | null;
};

function mapPortfolio(
  item: {
    slug: string;
    year: number;
    gradient: string | null;
    isFeatured: boolean;
    service: { slug: string; translations: Array<{ locale: string; title: string | null }> };
    country: { translations: Array<{ locale: string; name: string | null }> } | null;
    translations: TranslationRow[];
    metrics: Array<{
      value: string;
      translations: Array<{ locale: string; label: string | null }>;
    }>;
    galleryItems: Array<{
      id: { toString(): string };
      path: string | null;
      translations: Array<{ locale: string; alt: string | null }>;
    }>;
  },
): PortfolioItem {
  const rows = item.translations;
  return {
    slug: item.slug,
    title: fromRows(rows, (row) => row.title),
    summary: fromRows(rows, (row) => row.summary ?? ""),
    serviceSlug: item.service.slug,
    serviceName: fromRows(item.service.translations, (row) => row.title ?? ""),
    country: item.country
      ? fromRows(item.country.translations, (row) => row.name ?? "")
      : { fa: "", en: "", tr: "", ru: "" },
    year: item.year,
    route: fromRows(rows, (row) => row.route ?? ""),
    challenge: fromRows(rows, (row) => row.challenge ?? ""),
    solution: fromRows(rows, (row) => row.solution ?? ""),
    outcome: fromRows(rows, (row) => row.outcome ?? ""),
    metrics: item.metrics.map((metric) => ({
      value: metric.value,
      label: fromRows(metric.translations, (row) => row.label ?? ""),
    })),
    gallery: item.galleryItems.map((gallery) => ({
      id: gallery.id.toString(),
      alt: fromRows(gallery.translations, (row) => row.alt ?? ""),
      gradient: item.gradient ?? "linear-gradient(135deg,#123977,#0b5e8a)",
      imageUrl: gallery.path ?? undefined,
    })),
    featured: item.isFeatured,
    gradient: item.gradient ?? "linear-gradient(135deg,#123977,#0b5e8a)",
  };
}

const BASE_INCLUDE = {
  service: { include: { translations: true } },
  country: { include: { translations: true } },
  translations: true,
  metrics: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
  galleryItems: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
} as const;

function matchesCountry(item: PortfolioItem, country: string): boolean {
  const normalized = country.toLowerCase();
  return Object.values(item.country).some(
    (value) => value.toLowerCase().includes(normalized) || normalized.includes(value.toLowerCase()),
  );
}

export async function getPortfolio(filters: PortfolioFilters = {}): Promise<PortfolioItem[]> {
  const items = await prisma.portfolioItem.findMany({
    where: { isActive: true },
    include: BASE_INCLUDE,
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  });
  const portfolio = items.map(mapPortfolio);

  return portfolio.filter((item) => {
    if (filters.service && item.serviceSlug !== filters.service) return false;
    if (filters.country && !matchesCountry(item, filters.country)) return false;
    if (filters.year && item.year !== filters.year) return false;
    return true;
  });
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioItem | undefined> {
  const item = await prisma.portfolioItem.findUnique({
    where: { slug, isActive: true },
    include: BASE_INCLUDE,
  });
  return item ? mapPortfolio(item) : undefined;
}

export async function getPortfolioSlugs(): Promise<string[]> {
  const items = await prisma.portfolioItem.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { sortOrder: "asc" },
  });
  return items.map((item) => item.slug);
}

export async function getRelatedPortfolio(item: PortfolioItem, limit = 3): Promise<PortfolioItem[]> {
  const items = await prisma.portfolioItem.findMany({
    where: {
      isActive: true,
      service: { slug: item.serviceSlug },
      NOT: { slug: item.slug },
    },
    include: BASE_INCLUDE,
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
    take: limit,
  });
  return items.map(mapPortfolio);
}

export async function getPortfolioYears(): Promise<number[]> {
  const items = await prisma.portfolioItem.findMany({
    where: { isActive: true },
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });
  return items.map((item) => item.year);
}

export async function getPortfolioCountries(): Promise<string[]> {
  const items = await prisma.portfolioItem.findMany({
    where: { isActive: true, country: { isNot: null } },
    select: { country: { include: { translations: { where: { locale: "fa" } } } } },
    distinct: ["countryId"],
  });
  return items
    .map((item) => item.country?.translations[0]?.name ?? "")
    .filter((name) => name.length > 0);
}

export async function getPortfolioServices(): Promise<string[]> {
  const items = await prisma.portfolioItem.findMany({
    where: { isActive: true },
    select: { service: { select: { slug: true } } },
    distinct: ["serviceId"],
  });
  return items.map((item) => item.service.slug);
}
