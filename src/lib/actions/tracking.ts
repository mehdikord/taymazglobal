"use server";

import { prisma } from "@/lib/db/prisma";
import type { CommerceOrder, LocalizedText } from "@/types";

export async function findOrderByTrackingCode(code: string): Promise<CommerceOrder | null> {
  const order = await prisma.order.findUnique({
    where: { trackingCode: code },
    include: {
      product: { include: { translations: true } },
      logs: { include: { translations: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) return null;

  const productTitle: LocalizedText = { fa: "", en: "", tr: "", ru: "" };
  for (const t of order.product.translations) {
    (productTitle as Record<string, string>)[t.locale] = t.title;
  }

  return {
    id: String(order.id),
    orderNumber: order.orderNumber,
    userId: order.userId ? String(order.userId) : undefined,
    productSlug: order.product.slug,
    productTitle,
    destination: order.destination,
    quantity: order.quantity ?? undefined,
    note: order.customerNote ?? undefined,
    contactName: order.contactName,
    contactPhone: order.contactPhone,
    contactEmail: order.contactEmail ?? undefined,
    status: order.status,
    trackingCode: order.trackingCode,
    logs: order.logs.map((log) => {
      const note: LocalizedText = { fa: "", en: "", tr: "", ru: "" };
      for (const t of log.translations) {
        (note as Record<string, string>)[t.locale] = t.note ?? "";
      }
      return {
        status: log.status,
        timestamp: log.createdAt?.toISOString() ?? new Date().toISOString(),
        note,
      };
    }),
    createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}
