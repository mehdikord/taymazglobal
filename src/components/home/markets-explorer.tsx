"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3, Plane, Route, Ship, TrainFront, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useClockTick } from "@/lib/frontend/use-clock-tick";
import { buildDotsPath, createProjection, type DotMapConfig } from "@/lib/geo/dot-map";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { cn } from "@/lib/utils";
import type { CountryMarket, TransportMode } from "@/types";

/* ── Map projection (equirectangular, Europe → East Asia) ────────────────── */
const MAP: DotMapConfig = { lon0: -12, lon1: 142, lat0: 8, lat1: 72, width: 1540, height: 640, step: 1.55, radius: 3.1 };
const MAP_W = MAP.width;
const MAP_H = MAP.height;
const { px, py } = createProjection(MAP);
const DOTS_PATH = buildDotsPath(MAP);

function routePath(from: CountryMarket, to: CountryMarket) {
  const x0 = px(from.lon);
  const y0 = py(from.lat);
  const x1 = px(to.lon);
  const y1 = py(to.lat);
  const d = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2 - d * 0.3;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

const MODE_ICONS: Record<TransportMode, typeof Ship> = { sea: Ship, air: Plane, road: Truck, rail: TrainFront };
const INTL_LOCALE: Record<AppLocale, string> = { fa: "fa-IR", en: "en-GB", tr: "tr-TR", ru: "ru-RU" };
const AUTO_INTERVAL = 4200;

type MarketsExplorerProps = { countries: CountryMarket[]; locale: AppLocale };

export function MarketsExplorer({ countries, locale }: MarketsExplorerProps) {
  const t = useTranslations("Home.markets");
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const tick = useClockTick();

  const hubIndex = Math.max(0, countries.findIndex((c) => c.transitDays === 0));
  const hub = countries[hubIndex];
  const current = countries[active] ?? countries[0];
  const isHub = current === hub;

  const routes = useMemo(
    () => countries.map((country, index) => (index === hubIndex ? null : routePath(hub, country))),
    [countries, hub, hubIndex],
  );

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % countries.length);
      setCycle((value) => value + 1);
    }, AUTO_INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, reduce, countries.length, cycle]);

  const select = (index: number) => {
    setActive(index);
    setCycle((value) => value + 1);
  };

  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(INTL_LOCALE[locale], { timeZone: current.timeZone, hour: "2-digit", minute: "2-digit", hour12: false }),
    [locale, current.timeZone],
  );
  const localTime = tick === null ? "--:--" : timeFormatter.format(new Date());
  const number = (value: number) => new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);

  return (
    <div
      className="markets-explorer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-6">
        {/* ── Map ── */}
        <div className="markets-map-panel relative overflow-hidden rounded-[1.75rem] border border-white/10">
          <div aria-hidden="true" className="markets-map-grid absolute inset-0" />
          <div aria-hidden="true" className="markets-map-glow absolute inset-0" />

          <div className="absolute start-4 top-4 z-10 flex flex-wrap items-center gap-2 sm:start-5 sm:top-5">
            <span className="markets-pill">
              <span className="markets-ping" />
              {t("live")}
            </span>
            <span className="markets-pill markets-pill-muted">{t("counter", { count: countries.length })}</span>
          </div>
          <span className="absolute end-4 top-4 z-10 hidden text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 sm:block sm:end-5 sm:top-5">
            {t("plus")}
          </span>

          <svg
            className="markets-map relative block h-full w-full"
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={t("mapLabel")}
          >
            <defs>
              <filter id="markets-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="markets-route-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ff5a66" />
                <stop offset="1" stopColor="#9ec9ff" />
              </linearGradient>
              <radialGradient id="markets-vignette" cx="50%" cy="50%" r="60%">
                <stop offset="0.7" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.4" />
              </radialGradient>
            </defs>

            <path className="markets-dots" d={DOTS_PATH} />

            {/* faint routes */}
            {routes.map((d, index) =>
              d ? <path key={`r-${index}`} className={cn("markets-route", index === active && "markets-route-hidden")} d={d} /> : null,
            )}

            {/* active route */}
            {!isHub && routes[active] ? (
              <g key={`active-${active}-${cycle}`}>
                <path id="markets-active-route" className="markets-route-active" d={routes[active]!} pathLength={1} filter="url(#markets-glow)" />
                <circle className="markets-packet" r="7" filter="url(#markets-glow)">
                  <animateMotion dur={reduce ? "0.01s" : "2.4s"} begin="0.35s" repeatCount="indefinite" fill="freeze">
                    <mpath href="#markets-active-route" />
                  </animateMotion>
                </circle>
              </g>
            ) : null}

            {/* markers */}
            {countries.map((country, index) => {
              const x = px(country.lon);
              const y = py(country.lat);
              const isActive = index === active;
              const isHubMarker = index === hubIndex;
              return (
                <g
                  key={country.code}
                  className={cn("markets-marker", isActive && "markets-marker-active", isHubMarker && "markets-marker-hub")}
                  transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                  onClick={() => select(index)}
                >
                  <circle className="markets-ring markets-ring-one" r="14" />
                  <circle className="markets-ring markets-ring-two" r="14" />
                  <circle className="markets-core-halo" r="11" />
                  <circle className="markets-core" r={isHubMarker ? 6.5 : 5} />
                  <circle className="markets-hit" r="30" />
                  <text className="markets-label" y={isHubMarker ? 40 : -22} textAnchor="middle">
                    {getLocalizedText(country.city, locale)}
                  </text>
                </g>
              );
            })}

            <rect width={MAP_W} height={MAP_H} fill="url(#markets-vignette)" pointerEvents="none" />
          </svg>
        </div>

        {/* ── Detail panel ── */}
        <aside className="markets-panel relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 p-5 sm:p-6">
          <div aria-hidden="true" className="markets-panel-glow absolute -end-20 -top-24 size-64 rounded-full bg-brand-red/25 blur-3xl" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.code}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-1 flex-col"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="markets-code">{current.code.toUpperCase()}</span>
                  <div>
                    <p className="text-xl font-extrabold text-white sm:text-2xl">{getLocalizedText(current.name, locale)}</p>
                    <p className="text-xs font-semibold text-slate-400">
                      {getLocalizedText(current.city, locale)} · {getLocalizedText(current.region, locale)}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold tracking-widest text-slate-500" dir="ltr">
                  {String(active + 1).padStart(2, "0")}/{String(countries.length).padStart(2, "0")}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3">
                <div className="markets-stat">
                  <dt>
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {t("localTime")}
                  </dt>
                  <dd className="tabular-nums" suppressHydrationWarning>{localTime}</dd>
                </div>
                <div className="markets-stat">
                  <dt>
                    <Route className="size-3.5" aria-hidden="true" />
                    {t("transit")}
                  </dt>
                  <dd>{isHub ? t("origin") : t("days", { count: current.transitDays })}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <p className="markets-caption">{t("modesLabel")}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {current.modes.map((mode) => {
                    const Icon = MODE_ICONS[mode];
                    return (
                      <li key={mode} className="markets-tag">
                        <Icon className="size-3.5 text-[#9ec9ff]" aria-hidden="true" />
                        {t(`modes.${mode}`)}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-4">
                <p className="markets-caption">{t("sectors")}</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {current.sectors.map((sector) => (
                    <li key={sector.en} className="markets-tag markets-tag-soft">
                      {getLocalizedText(sector, locale)}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/contact" className="markets-cta group mt-auto pt-6 focus-ring">
                <span className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-brand-red px-4 text-sm font-extrabold text-white shadow-[0_16px_28px_-16px_rgb(252_20_34_/_0.9)] transition group-hover:bg-brand-red-dark">
                  {t("cta")}
                  <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      {/* ── Market tabs ── */}
      <div role="tablist" aria-label={t("selectMarket")} className="markets-tabs mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {countries.map((country, index) => {
          const isActive = index === active;
          return (
            <button
              key={country.code}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(index)}
              className={cn("markets-tab focus-ring", isActive && "markets-tab-active")}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-extrabold text-white">{getLocalizedText(country.name, locale)}</span>
                <span className="markets-tab-code">{country.code.toUpperCase()}</span>
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-medium text-slate-400">
                {index === hubIndex ? t("hub") : t("days", { count: country.transitDays })}
              </span>
              <span aria-hidden="true" className="markets-tab-track">
                {isActive && !reduce ? (
                  <span
                    key={`${active}-${cycle}`}
                    className="markets-tab-progress"
                    style={{ animationDuration: `${AUTO_INTERVAL}ms`, animationPlayState: paused ? "paused" : "running" }}
                  />
                ) : null}
              </span>
              <span className="sr-only">{number(index + 1)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
