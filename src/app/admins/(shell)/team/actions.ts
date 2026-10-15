"use server";

import type { Prisma } from "@/generated/prisma/client";
import { actionError, buildTranslations, revalidateFrontend } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LocalizedText, TeamDepartment } from "@/types";

export type TeamMemberFormValues = {
  department: TeamDepartment;
  imagePath: string;
  linkedinUrl: string;
  accent: string;
  sortOrder: number;
  isActive: boolean;
  name: LocalizedText;
  role: LocalizedText;
  bio: LocalizedText;
};

const DEPARTMENTS: TeamDepartment[] = ["leadership", "operations", "customs", "sales", "logistics"];

export async function createTeamMember(values: TeamMemberFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!DEPARTMENTS.includes(values.department)) return { ok: false as const, error: "بخش نامعتبر است." };

  try {
    const created = await prisma.teamMember.create({
      data: {
        department: values.department,
        imagePath: values.imagePath || null,
        linkedinUrl: values.linkedinUrl || null,
        accent: values.accent || null,
        sortOrder: Number(values.sortOrder) || 0,
        isActive: values.isActive,
        translations: {
          create: buildTranslations({
            name: values.name,
            role: values.role,
            bio: values.bio,
          }) as Prisma.TeamMemberTranslationCreateWithoutTeamMemberInput[],
        },
      },
    });
    revalidateFrontend(["/team", "/fa/team", "/en/team", "/tr/team", "/ru/team"]);
    return { ok: true as const, id: String(created.id) };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateTeamMember(id: string, values: TeamMemberFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!DEPARTMENTS.includes(values.department)) return { ok: false as const, error: "بخش نامعتبر است." };

  const memberId = BigInt(id);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.teamMember.update({
        where: { id: memberId },
        data: {
          department: values.department,
          imagePath: values.imagePath || null,
          linkedinUrl: values.linkedinUrl || null,
          accent: values.accent || null,
          sortOrder: Number(values.sortOrder) || 0,
          isActive: values.isActive,
        },
      });
      await tx.teamMemberTranslation.deleteMany({ where: { teamMemberId: memberId } });
      await tx.teamMemberTranslation.createMany({
        data: buildTranslations({ name: values.name, role: values.role, bio: values.bio }).map(
          (row) => ({ ...row, teamMemberId: memberId }),
        ) as Prisma.TeamMemberTranslationCreateManyInput[],
      });
    });
    revalidateFrontend(["/team", "/fa/team", "/en/team", "/tr/team", "/ru/team"]);
    return { ok: true as const, id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteTeamMember(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.teamMember.delete({ where: { id: BigInt(id) } });
    revalidateFrontend(["/team", "/fa/team", "/en/team", "/tr/team", "/ru/team"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function toggleTeamMemberActive(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.teamMember.update({ where: { id: BigInt(id) }, data: { isActive } });
    revalidateFrontend(["/team", "/fa/team", "/en/team", "/tr/team", "/ru/team"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
