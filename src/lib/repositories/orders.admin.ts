import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type OrderStatus = "pending_approval" | "preparing" | "in_transit" | "completed" | "cancelled";

export type OrderAdminRow = {
  id: string;
  orderNumber: string;
  productTitle: string;
  contactName: string;
  contactPhone: string;
  destination: string;
  status: OrderStatus;
  createdAt: Date | null;
};

export type OrderLogEntry = {
  id: string;
  status: OrderStatus;
  adminName: string;
  note: string;
  createdAt: Date | null;
};

export type OrderAdminDetail = OrderAdminRow & {
  trackingCode: string | null;
  quantity: number | null;
  customerNote: string | null;
  contactEmail: string | null;
  termsAccepted: boolean;
  logs: OrderLogEntry[];
};

type ListParams = {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export async function listOrdersAdmin(params: ListParams = {}): Promise<{
  rows: OrderAdminRow[];
  total: number;
}> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize ?? 20;
  const q = params.q?.trim();

  const where: Prisma.OrderWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { orderNumber: { contains: q } },
              { contactName: { contains: q } },
              { contactPhone: { contains: q } },
              { product: { translations: { some: { locale: "fa" as const, title: { contains: q } } } } },
            ],
          }
        : {},
      params.status ? { status: params.status as OrderStatus } : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { product: { include: { translations: { where: { locale: "fa" } } } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: OrderAdminRow[] = items.map((item) => ({
    id: String(item.id),
    orderNumber: item.orderNumber,
    productTitle: item.product.translations[0]?.title ?? item.product.slug,
    contactName: item.contactName,
    contactPhone: item.contactPhone,
    destination: item.destination,
    status: item.status,
    createdAt: item.createdAt,
  }));

  return { rows, total };
}

export async function getOrderAdmin(id: string): Promise<OrderAdminDetail | null> {
  const item = await prisma.order.findUnique({
    where: { id: BigInt(id) },
    include: {
      product: { include: { translations: { where: { locale: "fa" } } } },
      logs: { include: { admin: true, translations: { where: { locale: "fa" } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!item) return null;

  return {
    id: String(item.id),
    orderNumber: item.orderNumber,
    productTitle: item.product.translations[0]?.title ?? item.product.slug,
    contactName: item.contactName,
    contactPhone: item.contactPhone,
    destination: item.destination,
    status: item.status,
    createdAt: item.createdAt,
    trackingCode: item.trackingCode,
    quantity: item.quantity,
    customerNote: item.customerNote,
    contactEmail: item.contactEmail,
    termsAccepted: item.termsAccepted,
    logs: item.logs.map((log) => ({
      id: String(log.id),
      status: log.status,
      adminName: log.admin?.name ?? "سیستم",
      note: log.translations[0]?.note ?? "",
      createdAt: log.createdAt,
    })),
  };
}
