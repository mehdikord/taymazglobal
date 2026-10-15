import type { AppLocale } from "@/i18n/routing";
import type { LocalizedText } from "@/types";

export function getLocalizedText(text: LocalizedText, locale: AppLocale): string {
  return text[locale];
}
