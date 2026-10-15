"use server";

import { actionError, revalidateFrontend } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { LeadStatus } from "@/lib/repositories/leads.admin";

const STATUSES: LeadStatus[] = ["new", "in_review", "contacted", "closed"];

export async function updateContactMessageStatus(id: string, status: LeadStatus) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!STATUSES.includes(status)) return { ok: false as const, error: "وضعیت نامعتبر است." };

  try {
    await prisma.contactMessage.update({ where: { id: BigInt(id) }, data: { status } });
    revalidateFrontend(["/admins/leads"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateServiceInquiryStatus(id: string, status: LeadStatus) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!STATUSES.includes(status)) return { ok: false as const, error: "وضعیت نامعتبر است." };

  try {
    await prisma.serviceInquiry.update({ where: { id: BigInt(id) }, data: { status } });
    revalidateFrontend(["/admins/leads"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteContactMessage(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.contactMessage.delete({ where: { id: BigInt(id) } });
    revalidateFrontend(["/admins/leads"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteServiceInquiry(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  try {
    await prisma.serviceInquiry.delete({ where: { id: BigInt(id) } });
    revalidateFrontend(["/admins/leads"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
