import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import type { ProductSpec } from "@/types";

type ProductSpecsProps = {
  specs: ProductSpec[];
  locale: AppLocale;
  title: string;
};

export function ProductSpecs({ specs, locale, title }: ProductSpecsProps) {
  if (specs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-soft)]">
      <div className="border-b bg-surface px-6 py-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-brand-navy">{title}</h3>
      </div>
      <dl className="divide-y">
        {specs.map((spec) => (
          <div key={getLocalizedText(spec.label, locale)} className="grid gap-2 px-6 py-4 sm:grid-cols-[1fr_1.2fr]">
            <dt className="text-sm font-bold text-muted">{getLocalizedText(spec.label, locale)}</dt>
            <dd className="text-sm font-extrabold text-brand-navy">{getLocalizedText(spec.value, locale)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
