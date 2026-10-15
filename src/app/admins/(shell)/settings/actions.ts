"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdmin } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import { revalidateFrontend } from "@/lib/admin/crud";
import type { LocalizedText } from "@/types";

export type SiteSettingsFormValues = {
  name: LocalizedText;
  tagline: LocalizedText;
  phones: string;
  emails: string;
  telegram: string;
  instagram: string;
  whatsapp: string;
  linkedin: string;
};

function splitLines(value: string): string[] {
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveSettings(values: SiteSettingsFormValues) {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false as const, error: "ابتدا وارد شوید." };

  const now = new Date();
  const rows = [
    {
      key: "site.info",
      value: {
        name: values.name,
        tagline: values.tagline,
      },
    },
    {
      key: "site.contact",
      value: {
        phones: splitLines(values.phones),
        emails: splitLines(values.emails),
      },
    },
    {
      key: "site.social",
      value: {
        telegram: values.telegram.trim(),
        instagram: values.instagram.trim(),
        whatsapp: values.whatsapp.trim(),
        linkedin: values.linkedin.trim(),
      },
    },
  ];

  try {
    for (const row of rows) {
      await prisma.setting.upsert({
        where: { key: row.key },
        update: { value: row.value, updatedAt: now },
        create: { key: row.key, value: row.value, createdAt: now, updatedAt: now },
      });
    }
    revalidatePath("/");
    revalidatePath("/fa");
    revalidatePath("/en");
    revalidatePath("/tr");
    revalidatePath("/ru");
    revalidateFrontend(["/", "/contact", "/fa/contact", "/en/contact", "/tr/contact", "/ru/contact"]);
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: "خطا در ذخیره تنظیمات." };
  }
}
