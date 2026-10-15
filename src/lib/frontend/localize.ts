import "server-only";

import type { FaqItem, LocalizedText } from "@/types";

const LOCALES = ["fa", "en", "tr", "ru"] as const;

/** نگاشت ردیف‌های ترجمه (یکی برای هر locale) به یک شیء LocalizedText */
export function fromRows<T extends { locale: string }>(
  rows: T[],
  pick: (row: T) => string | null | undefined,
): LocalizedText {
  const result: LocalizedText = { fa: "", en: "", tr: "", ru: "" };
  for (const row of rows) {
    const key = row.locale as keyof LocalizedText;
    if (key in result) {
      result[key] = pick(row) ?? "";
    }
  }
  return result;
}

/** زیپ آرایه‌های JSON ذخیره‌شده در هر ردیف ترجمه به آرایه‌ای از LocalizedText */
export function zipArrays<T extends { locale: string }>(
  rows: T[],
  key: keyof T,
): LocalizedText[] {
  const lists = rows.map((row) => (Array.isArray(row[key]) ? (row[key] as string[]) : []));
  const max = Math.max(0, ...lists.map((list) => list.length));
  return Array.from({ length: max }, (_, index) =>
    fromRows(rows, (row) => {
      const list = Array.isArray(row[key]) ? (row[key] as string[]) : [];
      return list[index] ?? "";
    }),
  );
}

/** زیپ آرایه FAQ ذخیره‌شده در هر ردیف ترجمه به آرایه‌ای از FaqItem */
export function zipFaqs<T extends { locale: string }>(rows: T[]): FaqItem[] {
  const lists = rows.map((row) =>
    Array.isArray((row as { faq?: unknown }).faq)
      ? ((row as { faq?: Array<{ question?: string; answer?: string }> }).faq ?? [])
      : [],
  );
  const max = Math.max(0, ...lists.map((list) => list.length));
  return Array.from({ length: max }, (_, index) => ({
    question: fromRows(rows, (row) => {
      const list = Array.isArray((row as { faq?: unknown }).faq)
        ? ((row as { faq?: Array<{ question?: string }> }).faq ?? [])
        : [];
      return list[index]?.question ?? "";
    }),
    answer: fromRows(rows, (row) => {
      const list = Array.isArray((row as { faq?: unknown }).faq)
        ? ((row as { faq?: Array<{ answer?: string }> }).faq ?? [])
        : [];
      return list[index]?.answer ?? "";
    }),
  }));
}

export { LOCALES };
