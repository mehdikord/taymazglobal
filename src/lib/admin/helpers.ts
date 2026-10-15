export const LOCALES = ["fa", "en", "tr", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 120);
}

function localizedValue(value: unknown, locale: Locale): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => localizedValue(item, locale));
  if (typeof value === "object") {
    const source = value as Record<string, unknown>;
    if (locale in source) return localizedValue(source[locale], locale);
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(source)) {
      out[key] = localizedValue(child, locale);
    }
    return out;
  }
  return value;
}

export function buildTranslations(fields: Record<string, unknown>): Array<Record<string, unknown>> {
  return LOCALES.map((locale) => {
    const row: Record<string, unknown> = { locale };
    for (const [key, value] of Object.entries(fields)) {
      row[key] = localizedValue(value, locale);
    }
    return row;
  });
}

export function actionError(error: unknown): { ok: false; error: string } {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code)
      : "";
  switch (code) {
    case "P2002":
      return { ok: false, error: "این مقدار یکتا تکراری است." };
    case "P2003":
      return { ok: false, error: "این رکورد در حال استفاده است و قابل حذف نیست. به‌جای حذف، آن را غیرفعال کنید." };
    case "P2025":
      return { ok: false, error: "رکورد مورد نظر پیدا نشد." };
    default:
      return { ok: false, error: "خطایی رخ داد. دوباره تلاش کنید." };
  }
}

export function formatDateFa(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(date));
}

export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export const DEPARTMENT_LABELS: Record<string, string> = {
  leadership: "مدیریت ارشد",
  operations: "عملیات",
  customs: "گمرک",
  sales: "فروش",
  logistics: "لجستیک",
};

export const TEAM_DEPARTMENTS = ["leadership", "operations", "customs", "sales", "logistics"] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_approval: "در انتظار تأیید",
  preparing: "در حال آماده‌سازی",
  in_transit: "در حال حمل",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "جدید",
  in_review: "در بررسی",
  contacted: "در ارتباط",
  closed: "بسته شده",
};

export const CONTACT_TYPE_LABELS: Record<string, string> = {
  contact: "تماس",
  suggestion: "پیشنهاد",
  complaint: "شکایت",
  other: "سایر",
};
