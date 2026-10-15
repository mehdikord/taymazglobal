import "server-only";

import { prisma } from "@/lib/db/prisma";

export type AdminListItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export async function listAdmins(): Promise<AdminListItem[]> {
  const rows = await prisma.admin.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { id: "asc" },
  });
  return rows.map((row) => ({
    id: String(row.id),
    name: row.name,
    phone: row.phone,
    email: row.email,
    isActive: row.isActive,
    createdAt: row.createdAt?.toISOString() ?? "",
  }));
}
