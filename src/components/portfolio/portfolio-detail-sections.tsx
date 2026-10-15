import { ArrowLeft, ArrowRight, Lightbulb, Route, Target, Trophy } from "lucide-react";

import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import type { PortfolioItem } from "@/types";

type PortfolioStoryProps = {
  item: PortfolioItem;
  locale: AppLocale;
  challengeLabel: string;
  solutionLabel: string;
  outcomeLabel: string;
};

export function PortfolioStory({ item, locale, challengeLabel, solutionLabel, outcomeLabel }: PortfolioStoryProps) {
  const blocks = [
    {
      icon: Target,
      label: challengeLabel,
      text: getLocalizedText(item.challenge, locale),
      step: "01",
      accent: "border-brand-red/15 bg-brand-red/5 text-brand-red",
    },
    {
      icon: Lightbulb,
      label: solutionLabel,
      text: getLocalizedText(item.solution, locale),
      step: "02",
      accent: "border-brand-navy/15 bg-brand-navy-soft text-brand-navy",
    },
    {
      icon: Trophy,
      label: outcomeLabel,
      text: getLocalizedText(item.outcome, locale),
      step: "03",
      accent: "border-success/20 bg-success/5 text-success",
    },
  ];

  return (
    <div className="relative grid gap-5 lg:grid-cols-3">
      <div
        aria-hidden="true"
        className="absolute start-[16%] end-[16%] top-12 hidden border-t-2 border-dashed border-brand-navy/15 lg:block"
      />
      {blocks.map(({ icon: Icon, label, text, step, accent }) => (
        <article
          key={step}
          className="group relative flex flex-col rounded-[1.6rem] border border-slate-200/80 bg-white p-7 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.38)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-navy/15 hover:shadow-[0_26px_54px_-30px_rgba(18,57,119,0.42)]"
        >
          <div className="flex items-center justify-between">
            <span className={`inline-flex size-12 items-center justify-center rounded-2xl border ${accent}`}>
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="font-mono text-xs font-black tracking-widest text-slate-300">{step}</span>
          </div>
          <h3 className="mt-5 text-lg font-extrabold text-brand-navy">{label}</h3>
          <p className="mt-3 text-sm leading-8 text-muted">{text}</p>
        </article>
      ))}
    </div>
  );
}

type PortfolioMetricsProps = {
  metrics: PortfolioItem["metrics"];
  locale: AppLocale;
};

export function PortfolioMetrics({ metrics, locale }: PortfolioMetricsProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-0 sm:divide-x sm:divide-white/10">
      {metrics.map((metric, index) => (
        <div
          key={getLocalizedText(metric.label, locale)}
          className={`sm:px-8 ${index === 0 ? "sm:ps-0" : ""} ${index === metrics.length - 1 ? "sm:pe-0" : ""}`}
        >
          <p className="text-2xl font-black tracking-tight text-white sm:text-3xl">{metric.value}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/60">
            {getLocalizedText(metric.label, locale)}
          </p>
        </div>
      ))}
    </div>
  );
}

type PortfolioRouteProps = {
  route: string;
  label: string;
};

function parseRoute(route: string) {
  const match = route.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (match) {
    return {
      stops: match[1].split(/\s*[←→]\s*/).map((stop) => stop.trim()).filter(Boolean),
      mode: match[2],
    };
  }
  return {
    stops: route.split(/\s*[←→]\s*/).map((stop) => stop.trim()).filter(Boolean),
    mode: undefined,
  };
}

export function PortfolioRoute({ route, label }: PortfolioRouteProps) {
  const { stops, mode } = parseRoute(route);
  const isRtl = route.includes("←");
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-gradient-to-r from-brand-navy-soft/80 via-white to-white p-6 sm:p-7">
      <div aria-hidden="true" className="absolute -end-16 -top-16 size-44 rounded-full bg-brand-red/5 blur-2xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-navy text-white shadow-[0_14px_28px_-16px_rgba(18,57,119,0.85)]">
            <Route aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">{label}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {stops[0]} {isRtl ? "←" : "→"} {stops[stops.length - 1]}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {stops.map((stop, index) => (
            <span key={`${stop}-${index}`} className="flex items-center gap-2">
              <span className="rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm font-extrabold text-brand-navy shadow-sm">
                {stop}
              </span>
              {index < stops.length - 1 && (
                <span className="inline-flex items-center gap-1.5 text-brand-navy/40">
                  <span aria-hidden="true" className="hidden h-px w-6 border-t-2 border-dashed border-brand-navy/25 sm:block" />
                  <Arrow aria-hidden="true" className="size-4 text-brand-red" />
                </span>
              )}
            </span>
          ))}
          {mode && (
            <span className="inline-flex items-center rounded-full bg-brand-red px-3.5 py-2 text-xs font-extrabold text-white shadow-[0_10px_22px_-12px_rgba(252,20,34,0.8)]">
              {mode}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
