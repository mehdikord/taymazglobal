"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";
import type { CreateOrderInput, CommerceOrder } from "@/types";

function generateOrderNumber(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = String(Math.floor(Math.random() * 100000000)).padStart(8, "0");
  return `TG-${date}-${random}`;
}

export async function submitOrder(input: CreateOrderInput): Promise<
  { ok: true; order: CommerceOrder } | { ok: false; error: string }
> {
  const product = await prisma.product.findUnique({
    where: { slug: input.productSlug, isActive: true },
    include: { translations: true },
  });
  if (!product) return { ok: false, error: "محصول یافت نشد." };

  const now = new Date().toISOString();
  const orderNumber = generateOrderNumber();

  const productTitle: CommerceOrder["productTitle"] = { fa: "", en: "", tr: "", ru: "" };
  for (const t of product.translations) productTitle[t.locale] = t.title;

  const order: CommerceOrder = {
    id: crypto.randomUUID(),
    orderNumber,
    userId: input.userId,
    productSlug: product.slug,
    productTitle,
    destination: input.destination,
    quantity: input.quantity,
    note: input.note,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    status: "pending_approval",
    trackingCode: null,
    logs: [{ status: "pending_approval", timestamp: now }],
    createdAt: now,
  };

  try {
    const created = await prisma.order.create({
      data: {
        orderNumber,
        productId: product.id,
        status: "pending_approval",
        destination: input.destination,
        quantity: input.quantity,
        customerNote: input.note,
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        userId: input.userId ? BigInt(input.userId) : null,
        termsAccepted: true,
        logs: {
          create: {
            status: "pending_approval",
            translations: { create: [{ locale: "fa", note: "ثبت سفارش توسط مشتری" }] },
          },
        },
      },
    });
    order.id = String(created.id);
    revalidatePath("/admins/orders");
    return { ok: true, order };
  } catch {
    return { ok: false, error: "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید." };
  }
}
