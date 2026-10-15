import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { Locale } from "@/lib/admin/helpers";
import type { TeamDepartment } from "@/types";

export type TeamAdminRow = {
  id: string;
  department: TeamDepartment;
  imagePath: string | null;
  sortOrder: number;
  isActive: boolean;
  nameFa: string;
  roleFa: string;
};

export type TeamAdminDetail = {
  id: string;
  department: TeamDepartment;
  imagePath: string | null;
  linkedinUrl: string | null;
  accent: string | null;
  sortOrder: number;
  isActive: boolean;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  bio: Record<Locale, string>;
};

type ListParams = {
  q?: string;
  department?: string;
  active?: string;
  page?: number;
  pageSize?: number;
};

export async function listTeamAdmin(params: ListParams = {}): Promise<{
  rows: TeamAdminRow[];
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
              { translations: { some: { locale: "fa" as const, name: { contains: q } } } },
              { translations: { some: { locale: "en" as const, name: { contains: q } } } },
            ],
          }
        : {},
      params.department ? { department: params.department as TeamDepartment } : {},
      params.active === "active"
        ? { isActive: true }
        : params.active === "inactive"
          ? { isActive: false }
          : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.teamMember.count({ where }),
    prisma.teamMember.findMany({
      where,
      include: { translations: { where: { locale: "fa" } } },
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: TeamAdminRow[] = items.map((item) => ({
    id: String(item.id),
    department: item.department,
    imagePath: item.imagePath,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    nameFa: item.translations[0]?.name ?? "",
    roleFa: item.translations[0]?.role ?? "",
  }));

  return { rows, total };
}

export async function getTeamMemberAdmin(id: string): Promise<TeamAdminDetail | null> {
  const item = await prisma.teamMember.findUnique({
    where: { id: BigInt(id) },
    include: { translations: true },
  });
  if (!item) return null;

  const empty = (): Record<Locale, string> => ({ fa: "", en: "", tr: "", ru: "" });
  const detail: TeamAdminDetail = {
    id: String(item.id),
    department: item.department,
    imagePath: item.imagePath,
    linkedinUrl: item.linkedinUrl,
    accent: item.accent,
    sortOrder: item.sortOrder,
    isActive: item.isActive,
    name: empty(),
    role: empty(),
    bio: empty(),
  };
  for (const t of item.translations) {
    detail.name[t.locale] = t.name ?? "";
    detail.role[t.locale] = t.role ?? "";
    detail.bio[t.locale] = t.bio ?? "";
  }
  return detail;
}
