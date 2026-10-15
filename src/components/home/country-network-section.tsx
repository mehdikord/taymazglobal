import { MarketsExplorer } from "@/components/home/markets-explorer";
import type { AppLocale } from "@/i18n/routing";
import type { CountryMarket } from "@/types";

type CountryNetworkSectionProps = {
  countries: CountryMarket[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
};

export function CountryNetworkSection({ countries, locale, eyebrow, title, description }: CountryNetworkSectionProps) {
  return (
    <section className="markets-section relative isolate overflow-hidden bg-[#061427] py-20 text-white sm:py-28">
      <div aria-hidden="true" className="markets-grid absolute inset-0" />
      <div aria-hidden="true" className="markets-aura markets-aura-one" />
      <div aria-hidden="true" className="markets-aura markets-aura-two" />

      <div className="container-shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ff747b]">
            <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
            {eyebrow}
            <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
          </p>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
        </div>

        <div className="mt-12 sm:mt-14">
          <MarketsExplorer countries={countries} locale={locale} />
        </div>
      </div>
    </section>
  );
}
