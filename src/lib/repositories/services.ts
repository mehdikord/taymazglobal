import "server-only";

import { prisma } from "@/lib/db/prisma";
import { fromRows, zipArrays, zipFaqs } from "@/lib/frontend/localize";
import type { Service } from "@/types";

const SERVICE_ICONS = ["globe", "ship", "package", "shield", "truck", "map", "search", "briefcase"] as const;

type ServiceTranslationRow = {
  locale: string;
  title: string;
  summary: string | null;
  description: string | null;
  benefits: unknown;
  steps: unknown;
  faq: unknown;
};

async function mapService(
  service: {
    slug: string;
    icon: string | null;
    isFeatured: boolean;
    translations: ServiceTranslationRow[];
    countries: Array<{ country: { translations: Array<{ locale: string; name: string | null }> } }>;
    tags: Array<{ tag: { translations: Array<{ locale: string; name: string | null }> } }>;
  },
): Promise<Service> {
  const rows = service.translations;
  const icon = SERVICE_ICONS.includes(service.icon as (typeof SERVICE_ICONS)[number])
    ? (service.icon as Service["icon"])
    : "globe";

  const countries = service.countries.map((entry) =>
    fromRows(entry.country.translations, (row) => row.name ?? ""),
  );
  const tags = service.tags.map((entry) =>
    fromRows(entry.tag.translations, (row) => row.name ?? ""),
  );

  return {
    slug: service.slug,
    title: fromRows(rows, (row) => row.title),
    summary: fromRows(rows, (row) => row.summary ?? ""),
    description: fromRows(rows, (row) => row.description ?? ""),
    icon,
    benefits: zipArrays(rows, "benefits"),
    steps: zipArrays(rows, "steps"),
    countries,
    tags,
    featured: service.isFeatured,
    faq: zipFaqs(rows),
  };
}

export async function getServices(): Promise<Service[]> {
  const items = await prisma.service.findMany({
    where: { isActive: true },
    include: {
      translations: true,
      countries: { include: { country: { include: { translations: true } } }, orderBy: { countryId: "asc" } },
      tags: { include: { tag: { include: { translations: true } } }, orderBy: { tagId: "asc" } },
    },
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  });
  return Promise.all(items.map(mapService));
}

export async function getFeaturedServices(): Promise<Service[]> {
  const items = await prisma.service.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      translations: true,
      countries: { include: { country: { include: { translations: true } } } },
      tags: { include: { tag: { include: { translations: true } } } },
    },
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
    take: 6,
  });
  return Promise.all(items.map(mapService));
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const item = await prisma.service.findUnique({
    where: { slug, isActive: true },
    include: {
      translations: true,
      countries: { include: { country: { include: { translations: true } } } },
      tags: { include: { tag: { include: { translations: true } } } },
    },
  });
  return item ? mapService(item) : undefined;
}

export async function getServiceSlugs(): Promise<string[]> {
  const items = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { sortOrder: "asc" },
  });
  return items.map((item) => item.slug);
}
