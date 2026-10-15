"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

type ContactMessageInput = {
  name: string;
  subject: string;
  messageType: string;
  message: string;
  phone?: string;
  email?: string;
  privacyAccepted: boolean;
};

const CONTACT_TYPE_MAP: Record<string, "contact" | "suggestion" | "complaint" | "other"> = {
  consultation: "contact",
  partnership: "suggestion",
  support: "other",
  other: "other",
};

export async function submitContactMessage(input: ContactMessageInput) {
  try {
    await prisma.contactMessage.create({
      data: {
        name: input.name,
        subject: input.subject,
        message: input.message,
        type: CONTACT_TYPE_MAP[input.messageType] ?? "other",
        phone: input.phone || null,
        email: input.email || null,
        privacyAccepted: Boolean(input.privacyAccepted),
        status: "new",
      },
    });
    revalidatePath("/admins/leads");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "خطا در ثبت پیام. لطفاً دوباره تلاش کنید." };
  }
}

type ServiceInquiryInput = {
  serviceSlug: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  country?: string;
  message?: string;
  privacyAccepted: boolean;
};

export async function submitServiceInquiry(input: ServiceInquiryInput) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: input.serviceSlug, isActive: true },
      select: { id: true },
    });
    await prisma.serviceInquiry.create({
      data: {
        serviceId: service?.id ?? null,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        company: input.company || null,
        country: input.country || null,
        message: input.message || null,
        privacyAccepted: Boolean(input.privacyAccepted),
        status: "new",
      },
    });
    revalidatePath("/admins/leads");
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید." };
  }
}
