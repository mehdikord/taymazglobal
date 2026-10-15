import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type LeadStatus = "new" | "in_review" | "contacted" | "closed";

export type ContactMessageAdminRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  type: "contact" | "suggestion" | "complaint" | "other";
  status: LeadStatus;
  createdAt: Date | null;
};

export type ServiceInquiryAdminRow = {
  id: string;
  serviceName: string;
  name: string;
  phone: string;
  company: string | null;
  country: string | null;
  status: LeadStatus;
  createdAt: Date | null;
};

type ListParams = {
  q?: string;
  status?: string;
  type?: string;
  service?: string;
  page?: number;
  pageSize?: number;
};

export async function listContactMessagesAdmin(params: ListParams = {}): Promise<{
  rows: ContactMessageAdminRow[];
  total: number;
}> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize ?? 20;
  const q = params.q?.trim();

  const where: Prisma.ContactMessageWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
              { phone: { contains: q } },
              { subject: { contains: q } },
            ],
          }
        : {},
      params.status ? { status: params.status as LeadStatus } : {},
      params.type ? { type: params.type as Prisma.ContactMessageWhereInput["type"] } : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: ContactMessageAdminRow[] = items.map((item) => ({
    id: String(item.id),
    name: item.name,
    email: item.email,
    phone: item.phone,
    subject: item.subject,
    type: item.type,
    status: item.status,
    createdAt: item.createdAt,
  }));

  return { rows, total };
}

export async function listServiceInquiriesAdmin(params: ListParams = {}): Promise<{
  rows: ServiceInquiryAdminRow[];
  total: number;
}> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize ?? 20;
  const q = params.q?.trim();

  const where: Prisma.ServiceInquiryWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q } },
              { phone: { contains: q } },
              { email: { contains: q } },
              { company: { contains: q } },
            ],
          }
        : {},
      params.status ? { status: params.status as LeadStatus } : {},
      params.service ? { serviceId: BigInt(params.service) } : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.serviceInquiry.count({ where }),
    prisma.serviceInquiry.findMany({
      where,
      include: { service: { include: { translations: { where: { locale: "fa" } } } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: ServiceInquiryAdminRow[] = items.map((item) => ({
    id: String(item.id),
    serviceName: item.service?.translations[0]?.title ?? item.service?.slug ?? "—",
    name: item.name,
    phone: item.phone,
    company: item.company,
    country: item.country,
    status: item.status,
    createdAt: item.createdAt,
  }));

  return { rows, total };
}

export async function getContactMessageAdmin(id: string) {
  const item = await prisma.contactMessage.findUnique({
    where: { id: BigInt(id) },
    include: { assignedAdmin: true },
  });
  if (!item) return null;
  return {
    id: String(item.id),
    name: item.name,
    email: item.email,
    phone: item.phone,
    subject: item.subject,
    message: item.message,
    type: item.type,
    status: item.status,
    ipAddress: item.ipAddress,
    userAgent: item.userAgent,
    createdAt: item.createdAt,
    assignedAdminName: item.assignedAdmin?.name ?? null,
  };
}

export async function getServiceInquiryAdmin(id: string) {
  const item = await prisma.serviceInquiry.findUnique({
    where: { id: BigInt(id) },
    include: {
      assignedAdmin: true,
      service: { include: { translations: { where: { locale: "fa" } } } },
    },
  });
  if (!item) return null;
  return {
    id: String(item.id),
    serviceName: item.service?.translations[0]?.title ?? item.service?.slug ?? "—",
    name: item.name,
    phone: item.phone,
    email: item.email,
    company: item.company,
    country: item.country,
    message: item.message,
    status: item.status,
    ipAddress: item.ipAddress,
    userAgent: item.userAgent,
    createdAt: item.createdAt,
    assignedAdminName: item.assignedAdmin?.name ?? null,
  };
}
