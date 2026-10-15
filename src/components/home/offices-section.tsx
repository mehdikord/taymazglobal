"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Clock3, Languages, Mail, MapPin, Moon, Phone, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { useClockTick } from "@/lib/frontend/use-clock-tick";
import { lookupCity, type CityGeo } from "@/lib/geo/cities";
import { buildDotsPath, createProjection, fitDotMap } from "@/lib/geo/dot-map";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { cn } from "@/lib/utils";
import type { Office } from "@/types";

type OfficesSectionProps = {
  offices: Office[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
  headOfficeLabel: string;
};

const INTL_LOCALE: Record<AppLocale, string> = { fa: "fa-IR", en: "en-GB", tr: "tr-TR", ru: "ru-RU" };
const AUTO_INTERVAL = 4000;
const MAP_W = 1000;
const MAP_H = 560;
const EASE = [0.22, 1, 0.36, 1] as const;

function useLocalTime(timeZone: string | undefined, locale: AppLocale) {
  const tick = useClockTick();
  return useMemo(() => {
    if (tick === null || !timeZone) return { text: "--:--", hour: 12 };
    const parts = new Intl.DateTimeFormat(INTL_LOCALE[locale], { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const text = parts.map((part) => part.value).join("");
    const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hour12: false }).format(new Date()));
    return { text, hour: Number.isFinite(hour) ? hour % 24 : 12 };
  }, [tick, timeZone, locale]);
}

function OfficeClock({ timeZone, locale }: { timeZone?: string; locale: AppLocale }) {
  const { text } = useLocalTime(timeZone, locale);
  return <span className="offices-card-time" suppressHydrationWarning>{text}</span>;
}

export function OfficesSection({ offices, locale, eyebrow, title, description, headOfficeLabel }: OfficesSectionProps) {
  const t = useTranslations("Home.offices");
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const hubIndex = Math.max(0, offices.findIndex((office) => office.isHeadOffice));
  const [active, setActive] = useState(hubIndex);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  const geos = useMemo(() => offices.map((office) => lookupCity(office.city.en)), [offices]);
  const map = useMemo(() => fitDotMap(geos.filter((geo): geo is CityGeo => Boolean(geo)), MAP_W, MAP_H), [geos]);
  const { px, py } = useMemo(() => createProjection(map), [map]);
  const dots = useMemo(() => buildDotsPath(map), [map]);

  useEffect(() => {
    if (!inView || paused || reduce || offices.length < 2) return;
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % offices.length);
      setCycle((value) => value + 1);
    }, AUTO_INTERVAL);
    return () => window.clearInterval(id);
  }, [inView, paused, reduce, offices.length, cycle]);

  const select = (index: number) => {
    setActive(index);
    setCycle((value) => value + 1);
  };

  const current = offices[active] ?? offices[0];
  const currentGeo = geos[active];
  const { text: currentTime, hour } = useLocalTime(currentGeo?.timeZone, locale);
  const isDay = hour >= 6 && hour < 19;
  const hubGeo = geos[hubIndex];
  const number = (value: number) => new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);

  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.65, delay, ease: EASE },
  });

  if (!current) return null;

  return (
    <section ref={ref} className="offices-section relative isolate overflow-hidden bg-[#f4f7fc] py-20 sm:py-28">
      <div aria-hidden="true" className="offices-grid absolute inset-0" />
      <div aria-hidden="true" className="offices-aura offices-aura-one" />
      <div aria-hidden="true" className="offices-aura offices-aura-two" />

      <div
        className="container-shell relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
          {/* ── Copy + office cards ── */}
          <div>
            <motion.div {...reveal(0)}>
              <p className="mb-4 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red">
                <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
                {eyebrow}
              </p>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">{title}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-muted sm:text-lg">{description}</p>
            </motion.div>

            <div role="tablist" aria-label={t("selectOffice")} className="mt-8 grid gap-3 sm:grid-cols-2">
              {offices.map((office, index) => {
                const isActive = index === active;
                return (
                  <motion.button
                    key={office.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => select(index)}
                    onMouseEnter={() => select(index)}
                    {...reveal(0.1 + index * 0.08)}
                    className={cn("offices-card focus-ring", isActive && "offices-card-active")}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="offices-card-pin">
                        <MapPin className="size-4" aria-hidden="true" />
                      </span>
                      {office.isHeadOffice ? <span className="offices-card-hq">{headOfficeLabel}</span> : <span className="text-[10px] font-extrabold tracking-[0.12em] text-slate-400">{String(index + 1).padStart(2, "0")}</span>}
                    </span>
                    <span className="mt-4 block text-lg font-extrabold text-brand-navy">{getLocalizedText(office.city, locale)}</span>
                    <span className="block text-xs font-semibold text-muted">{getLocalizedText(office.country, locale)}</span>
                    <span className="mt-3 flex items-end justify-between gap-2">
                      <OfficeClock timeZone={geos[index]?.timeZone} locale={locale} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{t("localTime")}</span>
                    </span>
                    <span aria-hidden="true" className="offices-card-track">
                      {isActive && !reduce && offices.length > 1 ? (
                        <span key={`${active}-${cycle}`} className="offices-card-progress" style={{ animationDuration: `${AUTO_INTERVAL}ms`, animationPlayState: paused ? "paused" : "running" }} />
                      ) : null}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <motion.div {...reveal(0.5)} className="mt-6 flex flex-wrap gap-2">
              <span className="offices-summary">
                <MapPin className="size-4 text-brand-red" aria-hidden="true" />
                {t("count", { count: offices.length })}
              </span>
              <span className="offices-summary">
                <Languages className="size-4 text-brand-red" aria-hidden="true" />
                {t("languages")}
              </span>
            </motion.div>
          </div>

          {/* ── Map + detail ── */}
          <motion.div {...reveal(0.15)} className="offices-map-panel relative flex flex-col overflow-hidden rounded-[1.75rem] text-white">
            <div aria-hidden="true" className="offices-map-grid absolute inset-0" />
            <div className="relative px-4 pt-4 sm:px-5 sm:pt-5">
              <span className="markets-pill markets-pill-muted">{t("network")}</span>
            </div>

            <svg className="relative block w-full" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={t("mapLabel")}>
              <defs>
                <filter id="offices-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path className="offices-map-dots" d={dots} />
              {hubGeo
                ? geos.map((geo, index) => {
                    if (!geo || index === hubIndex) return null;
                    const x0 = px(hubGeo.lon);
                    const y0 = py(hubGeo.lat);
                    const x1 = px(geo.lon);
                    const y1 = py(geo.lat);
                    const d = Math.hypot(x1 - x0, y1 - y0);
                    const cx = (x0 + x1) / 2;
                    const cy = (y0 + y1) / 2 - d * 0.25;
                    return <path key={offices[index].id} className={cn("offices-link", index === active && "offices-link-active")} d={`M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`} filter={index === active ? "url(#offices-glow)" : undefined} />;
                  })
                : null}
              {offices.map((office, index) => {
                const geo = geos[index];
                if (!geo) return null;
                const isActive = index === active;
                const crowdedAbove = geos.some((other, otherIndex) => other && otherIndex !== index && other.lat > geo.lat && other.lat - geo.lat < 6 && Math.abs(other.lon - geo.lon) < 7);
                return (
                  <g
                    key={office.id}
                    className={cn("offices-marker", isActive && "offices-marker-active", office.isHeadOffice && "offices-marker-hub")}
                    transform={`translate(${px(geo.lon).toFixed(1)} ${py(geo.lat).toFixed(1)})`}
                    onClick={() => select(index)}
                  >
                    <circle className="offices-marker-ring" r="14" />
                    <circle className="offices-marker-ring offices-marker-ring-two" r="14" />
                    <circle className="offices-marker-halo" r="12" />
                    <circle className="offices-marker-core" r={office.isHeadOffice ? 7 : 5.5} />
                    <circle r="30" fill="transparent" />
                    <text className="offices-marker-label" y={crowdedAbove ? 40 : -24} textAnchor="middle">
                      {getLocalizedText(office.city, locale)}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="offices-detail relative mt-auto border-t border-white/10 p-5 sm:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-xl font-extrabold text-white sm:text-2xl">
                        {getLocalizedText(current.city, locale)}
                        <span className={cn("markets-pill", !current.isHeadOffice && "markets-pill-muted")}>{current.isHeadOffice ? headOfficeLabel : t("regional")}</span>
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{getLocalizedText(current.country, locale)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
                      {isDay ? <Sun className="size-4 text-amber-300" aria-hidden="true" /> : <Moon className="size-4 text-blue-200" aria-hidden="true" />}
                      <span className="text-lg font-black tabular-nums" suppressHydrationWarning>{currentTime}</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{t("localTime")}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {getLocalizedText(current.address, locale) ? (
                      <p className="offices-detail-item">
                        <MapPin className="size-4" aria-hidden="true" />
                        <span><span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{t("address")}</span>{getLocalizedText(current.address, locale)}</span>
                      </p>
                    ) : null}
                    {getLocalizedText(current.hours, locale) ? (
                      <p className="offices-detail-item">
                        <Clock3 className="size-4" aria-hidden="true" />
                        <span><span className="block text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-500">{t("hours")}</span>{getLocalizedText(current.hours, locale)}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {current.phone ? (
                      <a href={`tel:${current.phone}`} className="offices-action offices-action-primary focus-ring">
                        <Phone className="size-3.5" aria-hidden="true" />
                        {t("call")}
                        <span className="tabular-nums" dir="ltr">{current.phone}</span>
                      </a>
                    ) : null}
                    {current.email ? (
                      <a href={`mailto:${current.email}`} className="offices-action focus-ring">
                        <Mail className="size-3.5" aria-hidden="true" />
                        {t("email")}
                      </a>
                    ) : null}
                    <span className="ms-auto self-center font-mono text-[11px] font-bold tracking-widest text-slate-500" dir="ltr">
                      {number(active + 1)}/{number(offices.length)}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
