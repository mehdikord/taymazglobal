import "server-only";

import { prisma } from "@/lib/db/prisma";
import { fromRows } from "@/lib/frontend/localize";
import type { TeamDepartment, TeamMember } from "@/types";

type TranslationRow = {
  locale: string;
  name: string;
  role: string | null;
  bio: string | null;
};

function mapTeamMember(
  member: {
    id: { toString(): string };
    department: TeamDepartment;
    accent: string | null;
    linkedinUrl: string | null;
    sortOrder: number;
    translations: TranslationRow[];
  },
): TeamMember {
  return {
    id: member.id.toString(),
    name: fromRows(member.translations, (row) => row.name),
    role: fromRows(member.translations, (row) => row.role ?? ""),
    department: member.department,
    bio: fromRows(member.translations, (row) => row.bio ?? ""),
    linkedIn: member.linkedinUrl ?? undefined,
    order: member.sortOrder,
    accent: member.accent ?? "#123977",
  };
}

export async function getTeamMembers(department?: TeamDepartment): Promise<TeamMember[]> {
  const items = await prisma.teamMember.findMany({
    where: { isActive: true, ...(department ? { department } : {}) },
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  });
  return items.map(mapTeamMember);
}

export async function getTeamDepartments(): Promise<TeamDepartment[]> {
  const items = await prisma.teamMember.findMany({
    where: { isActive: true },
    select: { department: true },
    distinct: ["department"],
    orderBy: { department: "asc" },
  });
  return items.map((item) => item.department);
}
