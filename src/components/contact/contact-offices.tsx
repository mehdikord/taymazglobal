"use client";

import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { useMemo } from "react";

import type { AppLocale } from "@/i18n/routing";
import { useClockTick } from "@/lib/frontend/use-clock-tick";
import { lookupCity } from "@/lib/geo/cities";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { cn } from "@/lib/utils";
import type { Office } from "@/types";

const INTL_LOCALE: Record<AppLocale, string> = { fa: "fa-IR", en: "en-GB", tr: "tr-TR", ru: "ru-RU" };

type ContactOfficesProps = {
  offices: Office[];
  locale: AppLocale;
  headOfficeLabel: string;
  localTimeLabel: string;
};

function LocalTime({ timeZone, locale }: { timeZone?: string; locale: AppLocale }) {
  const tick = useClockTick();
  const text = useMemo(() => {
    if (tick === null || !timeZone) return "--:--";
    return new Intl.DateTimeFormat(INTL_LOCALE[locale], { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  }, [tick, timeZone, locale]);
  return <span className="tabular-nums" suppressHydrationWarning>{text}</span>;
}

export function ContactOffices({ offices, locale, headOfficeLabel, localTimeLabel }: ContactOfficesProps) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {offices.map((office) => {
        const geo = lookupCity(office.city.en);
        const address = getLocalizedText(office.address, locale);
        const hours = getLocalizedText(office.hours, locale);
        return (
          <li key={office.id} className={cn("contact-office", office.isHeadOffice && "contact-office-hub")}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="contact-office-pin">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-base font-extrabold text-brand-navy">
                    {getLocalizedText(office.city, locale)}
                    {office.isHeadOffice ? <span className="contact-office-hq">{headOfficeLabel}</span> : null}
                  </p>
                  <p className="text-xs font-semibold text-muted">{getLocalizedText(office.country, locale)}</p>
                </div>
              </div>
              <div className="text-end">
                <p className="text-lg font-black text-brand-navy"><LocalTime timeZone={geo?.timeZone} locale={locale} /></p>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{localTimeLabel}</p>
              </div>
            </div>
            <dl className="mt-3 space-y-1.5 text-xs leading-6 text-muted">
              {address ? <div className="flex items-start gap-2"><MapPin className="mt-1 size-3.5 shrink-0 text-brand-red" aria-hidden="true" /><dd>{address}</dd></div> : null}
              {hours ? <div className="flex items-start gap-2"><Clock3 className="mt-1 size-3.5 shrink-0 text-brand-red" aria-hidden="true" /><dd>{hours}</dd></div> : null}
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              {office.phone ? (
                <a href={`tel:${office.phone}`} className="contact-office-action focus-ring" dir="ltr">
                  <Phone className="size-3.5" aria-hidden="true" />
                  <span className="tabular-nums">{office.phone}</span>
                </a>
              ) : null}
              {office.email ? (
                <a href={`mailto:${office.email}`} className="contact-office-action focus-ring" dir="ltr">
                  <Mail className="size-3.5" aria-hidden="true" />
                  {office.email}
                </a>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
