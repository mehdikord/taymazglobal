import "server-only";

import { prisma } from "@/lib/db/prisma";
import { fromRows } from "@/lib/frontend/localize";
import type { Office } from "@/types";

type TranslationRow = {
  locale: string;
  city: string;
  address: string | null;
  hours: string | null;
};

function mapOffice(
  office: {
    id: { toString(): string };
    phone: string;
    email: string;
    isHeadOffice: boolean;
    country: { translations: Array<{ locale: string; name: string | null }> } | null;
    translations: TranslationRow[];
  },
): Office {
  return {
    id: office.id.toString(),
    city: fromRows(office.translations, (row) => row.city),
    country: office.country
      ? fromRows(office.country.translations, (row) => row.name ?? "")
      : { fa: "", en: "", tr: "", ru: "" },
    address: fromRows(office.translations, (row) => row.address ?? ""),
    phone: office.phone,
    email: office.email,
    hours: fromRows(office.translations, (row) => row.hours ?? ""),
    isHeadOffice: office.isHeadOffice,
  };
}

export async function getOffices(): Promise<Office[]> {
  const items = await prisma.office.findMany({
    where: { isActive: true },
    include: {
      country: { include: { translations: true } },
      translations: true,
    },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });
  return items.map(mapOffice);
}
