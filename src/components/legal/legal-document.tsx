import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import type { LegalSection } from "@/types";

type LegalDocumentProps = {
  sections: LegalSection[];
  locale: AppLocale;
  updatedLabel: string;
  updatedDate: string;
};

export function LegalDocument({ sections, locale, updatedLabel, updatedDate }: LegalDocumentProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Table of contents" className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl border bg-surface p-5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted">{updatedLabel}</p>
          <p className="mt-1 text-sm font-bold text-brand-navy">{updatedDate}</p>
          <ul className="mt-6 space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-sm font-bold text-muted transition-colors hover:text-brand-red">
                  {getLocalizedText(section.title, locale)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28 rounded-2xl border bg-white p-6 sm:p-8 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-extrabold text-brand-navy">{getLocalizedText(section.title, locale)}</h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={getLocalizedText(paragraph, locale)} className="text-sm leading-8 text-muted">
                  {getLocalizedText(paragraph, locale)}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
