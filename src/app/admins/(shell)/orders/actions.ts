"use server";

import { actionError, revalidateFrontend } from "@/lib/admin/crud";
import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import type { OrderStatus } from "@/lib/repositories/orders.admin";

const STATUSES: OrderStatus[] = ["pending_approval", "preparing", "in_transit", "completed", "cancelled"];

export async function updateOrderStatus(orderId: string, status: OrderStatus, note: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };
  if (!STATUSES.includes(status)) return { ok: false as const, error: "وضعیت نامعتبر است." };

  const id = BigInt(orderId);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id }, data: { status } });
      await tx.orderLog.create({
        data: {
          orderId: id,
          status,
          adminId: admin.id ? BigInt(admin.id) : null,
          translations: note.trim()
            ? { create: [{ locale: "fa", note: note.trim() }] }
            : undefined,
        },
      });
    });
    revalidateFrontend(["/admins/orders"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateTrackingCode(orderId: string, trackingCode: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const id = BigInt(orderId);
  try {
    await prisma.order.update({
      where: { id },
      data: { trackingCode: trackingCode.trim() ? trackingCode.trim() : null },
    });
    revalidateFrontend(["/admins/orders"]);
    return { ok: true as const };
  } catch (error) {
    return actionError(error);
  }
}
