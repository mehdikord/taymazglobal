import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { LocalizedText } from "@/types";

export type SiteSettings = {
  name: LocalizedText;
  tagline: LocalizedText;
  phones: string[];
  emails: string[];
  social: {
    telegram: string;
    instagram: string;
    whatsapp: string;
    linkedin: string;
  };
};

const EMPTY_LOCALIZED: LocalizedText = { fa: "", en: "", tr: "", ru: "" };

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();

  const info = rows.find((row) => row.key === "site.info")?.value as
    | { name?: LocalizedText; tagline?: LocalizedText }
    | null
    | undefined;
  const contact = rows.find((row) => row.key === "site.contact")?.value as
    | { phones?: string[]; emails?: string[] }
    | null
    | undefined;
  const social = rows.find((row) => row.key === "site.social")?.value as
    | { telegram?: string; instagram?: string; whatsapp?: string; linkedin?: string }
    | null
    | undefined;

  const mergeLocalized = (value: LocalizedText | undefined): LocalizedText => ({
    fa: value?.fa ?? "",
    en: value?.en ?? "",
    tr: value?.tr ?? "",
    ru: value?.ru ?? "",
  });

  return {
    name: mergeLocalized(info?.name),
    tagline: mergeLocalized(info?.tagline),
    phones: contact?.phones ?? [],
    emails: contact?.emails ?? [],
    social: {
      telegram: social?.telegram ?? "",
      instagram: social?.instagram ?? "",
      whatsapp: social?.whatsapp ?? "",
      linkedin: social?.linkedin ?? "",
    },
  };
}

export { EMPTY_LOCALIZED };
