import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/crud";

export type ServiceAdminRow = {
  id: string;
  slug: string;
  icon: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  titleFa: string;
};

export type ServiceAdminDetail = {
  id: string;
  slug: string;
  icon: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  description: Record<Locale, string>;
  benefits: Array<Record<Locale, string>>;
  steps: Array<Record<Locale, string>>;
  faq: Array<{
    question: Record<Locale, string>;
    answer: Record<Locale, string>;
  }>;
  countryIds: string[];
  tagIds: string[];
};

type ListParams = {
  q?: string;
  active?: string;
  featured?: string;
  page?: number;
  pageSize?: number;
};

export async function listServicesAdmin(params: ListParams = {}): Promise<{
  rows: ServiceAdminRow[];
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
      params.featured === "featured"
        ? { isFeatured: true }
        : params.featured === "regular"
          ? { isFeatured: false }
          : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      include: { translations: { where: { locale: "fa" } } },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: ServiceAdminRow[] = items.map((item) => ({
    id: String(item.id),
    slug: item.slug,
    icon: item.icon,
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    titleFa: item.translations[0]?.title ?? "",
  }));

  return { rows, total };
}

export async function getServiceAdmin(id: string): Promise<ServiceAdminDetail | null> {
  const item = await prisma.service.findUnique({
    where: { id: BigInt(id) },
    include: {
      translations: true,
      countries: true,
      tags: true,
    },
  });
  if (!item) return null;

  const text = (): Record<Locale, string> => ({ fa: "", en: "", tr: "", ru: "" });
  const detail: ServiceAdminDetail = {
    id: String(item.id),
    slug: item.slug,
    icon: item.icon,
    isFeatured: item.isFeatured,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    title: text(),
    summary: text(),
    description: text(),
    benefits: [],
    steps: [],
    faq: [],
    countryIds: item.countries.map((c) => String(c.countryId)),
    tagIds: item.tags.map((t) => String(t.tagId)),
  };

  const fa = item.translations.find((t) => t.locale === "fa");
  if (fa?.benefits) detail.benefits = (fa.benefits as string[]).map((value) => ({ fa: value, en: "", tr: "", ru: "" }));
  if (fa?.steps) detail.steps = (fa.steps as string[]).map((value) => ({ fa: value, en: "", tr: "", ru: "" }));
  if (fa?.faq) detail.faq = (fa.faq as Array<{ question: string; answer: string }>).map((item) => ({
    question: { fa: item.question, en: "", tr: "", ru: "" },
    answer: { fa: item.answer, en: "", tr: "", ru: "" },
  }));

  for (const t of item.translations) {
    detail.title[t.locale] = t.title ?? "";
    detail.summary[t.locale] = t.summary ?? "";
    detail.description[t.locale] = t.description ?? "";
    if (t.benefits && Array.isArray(t.benefits)) {
      (t.benefits as string[]).forEach((value, index) => {
        if (detail.benefits[index]) detail.benefits[index][t.locale] = value;
        else detail.benefits[index] = { fa: "", en: "", tr: "", ru: "", [t.locale]: value } as Record<Locale, string>;
      });
    }
    if (t.steps && Array.isArray(t.steps)) {
      (t.steps as string[]).forEach((value, index) => {
        if (detail.steps[index]) detail.steps[index][t.locale] = value;
        else detail.steps[index] = { fa: "", en: "", tr: "", ru: "", [t.locale]: value } as Record<Locale, string>;
      });
    }
    if (t.faq && Array.isArray(t.faq)) {
      (t.faq as Array<{ question: string; answer: string }>).forEach((entry, index) => {
        if (!detail.faq[index]) detail.faq[index] = { question: text(), answer: text() };
        detail.faq[index].question[t.locale] = entry.question;
        detail.faq[index].answer[t.locale] = entry.answer;
      });
    }
  }

  return detail;
}

export async function listServiceOptions(): Promise<Array<{ value: string; label: string }>> {
  const items = await prisma.service.findMany({
    where: { isActive: true },
    include: { translations: { where: { locale: "fa" } } },
    orderBy: { sortOrder: "asc" },
  });
  return items.map((item) => ({
    value: String(item.id),
    label: item.translations[0]?.title ?? item.slug,
  }));
}

export const SERVICE_ICON_KEYS = ["globe", "ship", "package", "shield", "truck", "map", "search", "briefcase", "coins", "box", "headset"] as const;

export type ServiceIconKey = (typeof SERVICE_ICON_KEYS)[number];

export function isServiceIconKey(value: string): value is ServiceIconKey {
  return (SERVICE_ICON_KEYS as readonly string[]).includes(value);
}
