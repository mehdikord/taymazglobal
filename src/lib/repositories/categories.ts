import "server-only";

import { prisma } from "@/lib/db/prisma";
import { fromRows } from "@/lib/frontend/localize";
import type { ProductCategory } from "@/types";

type TranslationRow = {
  locale: string;
  title: string;
  description: string | null;
};

function mapCategory(
  category: {
    slug: string;
    gradient: string | null;
    accent: string | null;
    translations: TranslationRow[];
  },
): ProductCategory {
  return {
    slug: category.slug,
    title: fromRows(category.translations, (row) => row.title),
    description: fromRows(category.translations, (row) => row.description ?? ""),
    gradient: category.gradient ?? "from-brand-navy to-brand-navy-soft",
    accent: category.accent ?? "bg-brand-navy/10 text-brand-navy",
  };
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const items = await prisma.productCategory.findMany({
    where: { isActive: true },
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return items.map(mapCategory);
}
