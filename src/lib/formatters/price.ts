import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { Product } from "@/types";

export function formatProductPrice(
  product: Product,
  locale: AppLocale,
  labels: { inquiry: string; from: string; perUnit: string },
): string {
  if (product.priceType === "inquiry") return labels.inquiry;

  const formatter = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : locale, {
    style: "currency",
    currency: product.currency ?? "USD",
    maximumFractionDigits: product.priceType === "fixed" ? 2 : 0,
  });

  if (product.priceType === "fixed" && product.price) {
    return `${formatter.format(product.price)} ${labels.perUnit}`;
  }

  if (product.priceType === "range" && product.price && product.priceMax) {
    return `${labels.from} ${formatter.format(product.price)} – ${formatter.format(product.priceMax)}`;
  }

  return labels.inquiry;
}
