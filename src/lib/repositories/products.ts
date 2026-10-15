import "server-only";

import { prisma } from "@/lib/db/prisma";
import { fromRows } from "@/lib/frontend/localize";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import type { Product, ProductFilters } from "@/types";

type TranslationRow = {
  locale: string;
  title: string;
  summary: string | null;
  description: string | null;
};

function mapProduct(
  product: {
    slug: string;
    type: "physical" | "service";
    priceType: "fixed" | "inquiry" | "range";
    price: { toString(): string } | null;
    priceMax: { toString(): string } | null;
    currency: "USD" | "EUR" | "TRY" | null;
    isFeatured: boolean;
    category: { slug: string; translations: Array<{ locale: string; title: string | null }> };
    translations: TranslationRow[];
    tags: Array<{ tag: { translations: Array<{ locale: string; name: string | null }> } }>;
    specs: Array<{ translations: Array<{ locale: string; label: string | null; value: string | null }> }>;
    media: Array<{
      id: { toString(): string };
      type: "image" | "video";
      path: string | null;
      translations: Array<{ locale: string; alt: string | null }>;
    }>;
  },
): Product {
  const rows = product.translations;
  return {
    slug: product.slug,
    title: fromRows(rows, (row) => row.title),
    summary: fromRows(rows, (row) => row.summary ?? ""),
    description: fromRows(rows, (row) => row.description ?? ""),
    type: product.type,
    categorySlug: product.category.slug,
    categoryTitle: fromRows(product.category.translations, (row) => row.title ?? ""),
    price: product.price != null ? Number(product.price.toString()) : undefined,
    priceMax: product.priceMax != null ? Number(product.priceMax.toString()) : undefined,
    priceType: product.priceType,
    currency: product.currency ?? undefined,
    tags: product.tags.map((entry) => fromRows(entry.tag.translations, (row) => row.name ?? "")),
    specs: product.specs.map((spec) => ({
      label: fromRows(spec.translations, (row) => row.label ?? ""),
      value: fromRows(spec.translations, (row) => row.value ?? ""),
    })),
    media: product.media.map((media) => ({
      id: media.id.toString(),
      type: media.type,
      alt: fromRows(media.translations, (row) => row.alt ?? ""),
      gradient: "linear-gradient(135deg,#123977,#0b5e8a)",
      imageUrl: media.path ?? undefined,
    })),
    featured: product.isFeatured,
  };
}

const BASE_INCLUDE = {
  category: { include: { translations: true } },
  translations: true,
  tags: { include: { tag: { include: { translations: true } } } },
  specs: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
  media: { include: { translations: true }, orderBy: { sortOrder: "asc" } },
} as const;

function matchesQuery(product: Product, query: string, locale: AppLocale): boolean {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return true;

  const haystack = [
    getLocalizedText(product.title, locale),
    getLocalizedText(product.summary, locale),
    ...product.tags.map((tag) => getLocalizedText(tag, locale)),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export async function getProducts(filters: ProductFilters = {}, locale: AppLocale = "en"): Promise<Product[]> {
  const items = await prisma.product.findMany({
    where: { isActive: true },
    include: BASE_INCLUDE,
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  });
  const products = items.map(mapProduct);

  return products.filter((product) => {
    if (filters.category && product.categorySlug !== filters.category) return false;
    if (filters.type && product.type !== filters.type) return false;
    if (filters.price === "fixed" && product.priceType === "inquiry") return false;
    if (filters.price === "inquiry" && product.priceType !== "inquiry") return false;
    if (filters.q && !matchesQuery(product, filters.q, locale)) return false;
    return true;
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const items = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: BASE_INCLUDE,
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
    take: 6,
  });
  return items.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const item = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: BASE_INCLUDE,
  });
  return item ? mapProduct(item) : undefined;
}

export async function getProductSlugs(): Promise<string[]> {
  const items = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { sortOrder: "asc" },
  });
  return items.map((item) => item.slug);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const items = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: product.categorySlug },
      NOT: { slug: product.slug },
    },
    include: BASE_INCLUDE,
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
    take: limit,
  });
  return items.map(mapProduct);
}
