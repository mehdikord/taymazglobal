"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Barcode,
  Boxes,
  Compass,
  Container,
  FileCheck,
  FileText,
  Landmark,
  PackageSearch,
  Plane,
  Radar,
  Ship,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import { HeroGlobe, type GlobeCity, type GlobeRoute } from "@/components/home/hero-globe";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { useClockTick } from "@/lib/frontend/use-clock-tick";

type HomeHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

type CityKey = "istanbul" | "tehran" | "dubai" | "moscow" | "shanghai" | "berlin" | "baghdad" | "tashkent";

const CITY_GEO: Record<CityKey, { lat: number; lon: number; kind: GlobeCity["kind"] }> = {
  istanbul: { lat: 41.01, lon: 28.98, kind: "hub" },
  tehran: { lat: 35.69, lon: 51.39, kind: "office" },
  dubai: { lat: 25.2, lon: 55.27, kind: "office" },
  moscow: { lat: 55.75, lon: 37.62, kind: "office" },
  shanghai: { lat: 31.23, lon: 121.47, kind: "market" },
  berlin: { lat: 52.52, lon: 13.4, kind: "market" },
  baghdad: { lat: 33.31, lon: 44.37, kind: "market" },
  tashkent: { lat: 41.3, lon: 69.24, kind: "market" },
};

const ROUTES: GlobeRoute[] = [
  { from: "istanbul", to: "dubai", tone: "red", speed: 0.16, offset: 0.1 },
  { from: "istanbul", to: "moscow", tone: "red", speed: 0.14, offset: 0.55 },
  { from: "istanbul", to: "berlin", tone: "red", speed: 0.15, offset: 0.3 },
  { from: "istanbul", to: "baghdad", tone: "red", speed: 0.18, offset: 0.8 },
  { from: "istanbul", to: "tashkent", tone: "red", speed: 0.12, offset: 0.45 },
  { from: "shanghai", to: "istanbul", tone: "blue", speed: 0.09, offset: 0.2 },
  { from: "tehran", to: "istanbul", tone: "blue", speed: 0.17, offset: 0.65 },
  { from: "dubai", to: "shanghai", tone: "blue", speed: 0.1, offset: 0.9 },
];

const OFFICE_CLOCKS: { key: CityKey; timeZone: string }[] = [
  { key: "istanbul", timeZone: "Europe/Istanbul" },
  { key: "tehran", timeZone: "Asia/Tehran" },
  { key: "dubai", timeZone: "Asia/Dubai" },
  { key: "moscow", timeZone: "Europe/Moscow" },
];

const INTL_LOCALE: Record<AppLocale, string> = { fa: "fa-IR", en: "en-GB", tr: "tr-TR", ru: "ru-RU" };

const CAPABILITIES = [
  { key: "sourcing", icon: PackageSearch },
  { key: "export", icon: Ship },
  { key: "import", icon: Warehouse },
  { key: "customs", icon: ShieldCheck },
  { key: "logistics", icon: Truck },
] as const;

const TICKER = [
  { key: "customs", icon: Landmark },
  { key: "freight", icon: Ship },
  { key: "docs", icon: FileText },
  { key: "lc", icon: FileCheck },
  { key: "market", icon: Compass },
  { key: "inspection", icon: ShieldCheck },
  { key: "hs", icon: Barcode },
  { key: "sourcing", icon: Boxes },
] as const;

const LIVE_ROUTES = [
  { from: "istanbul", to: "dubai", mode: "air", days: 2, icon: Plane, duration: "4.2s" },
  { from: "shanghai", to: "istanbul", mode: "sea", days: 21, icon: Ship, duration: "7.5s" },
  { from: "istanbul", to: "moscow", mode: "road", days: 6, icon: Truck, duration: "5.6s" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;


/* ── Title with word-by-word reveal + highlighted phrase ─────────────────── */
type TitleRun = { accent: boolean; words: string[] };

function RevealTitle({ title, highlight, reduce }: { title: string; highlight: string; reduce: boolean }) {
  const runs = useMemo<TitleRun[]>(() => {
    const idx = highlight ? title.indexOf(highlight) : -1;
    const parts = idx === -1 ? [{ text: title, accent: false }] : [
      { text: title.slice(0, idx), accent: false },
      { text: highlight, accent: true },
      { text: title.slice(idx + highlight.length), accent: false },
    ];
    return parts
      .map((part) => ({ accent: part.accent, words: part.text.split(/\s+/).filter(Boolean) }))
      .filter((run) => run.words.length > 0);
  }, [title, highlight]);

  let wordIndex = 0;

  return (
    <h1 className="text-balance mt-6 max-w-3xl text-[2.1rem] font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.4rem] xl:text-[3.9rem]">
      {runs.map((run, runIdx) => {
        const isLast = runIdx === runs.length - 1;
        const content = run.words.map((word, i) => {
          const index = wordIndex++;
          const trailing = i < run.words.length - 1 || !isLast ? "\u00A0" : "";
          return (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.25 + index * 0.05, ease: EASE }}
            >
              {word}
              {trailing}
            </motion.span>
          );
        });
        return run.accent ? (
          <span key={runIdx} className="hero-title-accent">{content}</span>
        ) : (
          <span key={runIdx}>{content}</span>
        );
      })}
    </h1>
  );
}

/* ── Live office clocks (client-only, hydration safe) ────────────────────── */
function OfficeClocks({ locale, label, cityName }: { locale: AppLocale; label: string; cityName: (key: CityKey) => string }) {
  const tick = useClockTick();
  const now = tick === null ? null : new Date();

  const formatters = useMemo(
    () =>
      OFFICE_CLOCKS.map((office) =>
        new Intl.DateTimeFormat(INTL_LOCALE[locale], { timeZone: office.timeZone, hour: "2-digit", minute: "2-digit", hour12: false }),
      ),
    [locale],
  );

  return (
    <div className="hero-clocks">
      <span className="hero-clocks-label">
        <Radar className="size-3.5 text-brand-red" aria-hidden="true" />
        {label}
      </span>
      <ul className="hero-clocks-list">
        {OFFICE_CLOCKS.map((office, index) => (
          <li key={office.key} className="hero-clock">
            <span className="hero-clock-city">{cityName(office.key)}</span>
            <span className="hero-clock-time" suppressHydrationWarning>
              {now ? formatters[index].format(now) : "--:--"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main hero ───────────────────────────────────────────────────────────── */
export function HomeHero({ eyebrow, title, description, primaryCta, secondaryCta }: HomeHeroProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Home.hero");
  const reduce = useReducedMotion() ?? false;
  const isRtl = locale === "fa";
  const dir = isRtl ? "rtl" : "ltr";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const RouteArrow = isRtl ? ArrowLeft : ArrowRight;

  const cityName = (key: CityKey) => t(`cities.${key}`);

  const cities = useMemo<GlobeCity[]>(
    () => (Object.keys(CITY_GEO) as CityKey[]).map((key) => ({ id: key, label: t(`cities.${key}`), ...CITY_GEO[key] })),
    [t],
  );

  /* pointer parallax */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.6 });
  const globeX = useTransform(sx, [-1, 1], [-8, 8]);
  const globeY = useTransform(sy, [-1, 1], [-6, 6]);
  const cardAX = useTransform(sx, [-1, 1], [-18, 18]);
  const cardAY = useTransform(sy, [-1, 1], [-14, 14]);
  const cardBX = useTransform(sx, [-1, 1], [14, -14]);
  const cardBY = useTransform(sy, [-1, 1], [12, -12]);
  const chipX = useTransform(sx, [-1, 1], [10, -10]);
  const chipY = useTransform(sy, [-1, 1], [-10, 10]);

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: EASE },
  });

  return (
    <section
      className="hero-section relative isolate overflow-hidden bg-[#050e20] text-white"
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        mx.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
        my.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* ── Atmosphere ── */}
      <div aria-hidden="true" className="hero-noise absolute inset-0 opacity-[0.28]" />
      <div aria-hidden="true" className="hero-grid absolute inset-0" />
      <div aria-hidden="true" className="hero-aurora hero-aurora-one" />
      <div aria-hidden="true" className="hero-aurora hero-aurora-two" />
      <div aria-hidden="true" className="hero-aurora hero-aurora-three" />
      <svg aria-hidden="true" className="hero-lanes absolute inset-0 size-full" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none">
        <path className="hero-lane" d="M-40 560C320 420 760 660 1480 300" />
        <path className="hero-lane hero-lane-delay" d="M-40 700C420 580 920 780 1480 440" />
        <path className="hero-lane hero-lane-slow" d="M-40 150C520 40 820 330 1480 110" />
      </svg>
      <div aria-hidden="true" className="hero-floor" />

      <div className="container-shell relative z-10 grid items-center gap-14 pb-16 pt-14 sm:pt-18 lg:min-h-[44rem] lg:grid-cols-[1.05fr_.95fr] lg:gap-6 lg:pb-20 lg:pt-14 xl:min-h-[47rem]">
        {/* ── Copy ── */}
        <div className="relative z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-start">
          <motion.div {...enter(0.05)} className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              {t("badge")}
            </span>
            <span className="hero-badge hero-badge-muted">{eyebrow}</span>
            <span className="hidden text-[11px] font-bold tracking-[0.12em] text-slate-400 sm:inline">{t("badgeMeta")}</span>
          </motion.div>

          <RevealTitle title={title} highlight={t("titleHighlight")} reduce={reduce} />

          <motion.p {...enter(0.55)} className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
            {description}
          </motion.p>

          <motion.div {...enter(0.68)} className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="hero-cta-primary group h-14 rounded-2xl bg-brand-red px-7 text-base font-extrabold shadow-[0_18px_40px_-14px_rgb(252_20_34_/_0.75)] transition hover:-translate-y-0.5 hover:bg-brand-red-dark"
            >
              <Link href="/contact">
                {primaryCta}
                <Arrow className="ms-1 size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-2xl border-white/15 bg-white/[0.05] px-7 text-base font-bold text-white backdrop-blur-md hover:border-white/35 hover:bg-white/[0.11] hover:text-white"
            >
              <Link href="/services">{secondaryCta}</Link>
            </Button>
          </motion.div>

          <motion.ul {...enter(0.8)} className="mt-9 flex flex-wrap justify-center gap-2 lg:justify-start" aria-label={t("badge")}>
            {CAPABILITIES.map(({ key, icon: Icon }) => (
              <li key={key} className="hero-chip">
                <Icon className="size-3.5 text-[#9ec9ff]" aria-hidden="true" />
                {t(`capabilities.${key}`)}
              </li>
            ))}
          </motion.ul>

          <motion.div {...enter(0.92)} className="mt-9">
            <OfficeClocks locale={locale} label={t("clocks")} cityName={cityName} />
          </motion.div>
        </div>

        {/* ── Visual ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
          className="relative mx-auto w-full max-w-[23rem] sm:max-w-[27rem] lg:max-w-none lg:ps-6"
        >
          <div className="hero-visual relative mx-auto aspect-square w-full lg:max-w-[36rem] xl:max-w-[40rem]">
            <div aria-hidden="true" className="hero-globe-halo" />
            <div aria-hidden="true" className="hero-globe-ring hero-globe-ring-one" />
            <div aria-hidden="true" className="hero-globe-ring hero-globe-ring-two" />
            <motion.div style={{ x: globeX, y: globeY }} className="absolute inset-0">
              <HeroGlobe cities={cities} routes={ROUTES} dir={dir} className="hero-globe-canvas" />
            </motion.div>

            {/* Shipment card */}
            <motion.div style={{ x: cardAX, y: cardAY }} className="absolute bottom-[3%] start-0 z-10 sm:bottom-auto sm:top-[4%] sm:-start-6 lg:-start-5 xl:-start-10">
              <motion.div {...enter(1.05)}>
                <div className="hero-float hero-card w-[14.5rem] sm:w-[16.5rem]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="hero-card-label">{t("shipment.label")}</span>
                      <span className="mt-1 block font-mono text-sm font-extrabold tracking-wide text-white" dir="ltr">TG-24091</span>
                    </div>
                    <span className="hero-card-icon">
                      <Container className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <span className="hero-ping" />
                    {t("shipment.status")}
                  </div>
                  <div className="hero-progress mt-3">
                    <div className="hero-progress-fill" style={{ width: "76%" }} />
                  </div>
                  <ol className="mt-2.5 grid grid-cols-4 gap-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-400">
                    <li className="text-slate-200">{t("shipment.steps.origin")}</li>
                    <li className="text-center text-slate-200">{t("shipment.steps.transit")}</li>
                    <li className="text-center text-brand-red">{t("shipment.steps.customs")}</li>
                    <li className="text-end">{t("shipment.steps.delivered")}</li>
                  </ol>
                  <p className="mt-2.5 text-[11px] font-semibold text-slate-400">{t("shipment.eta")}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Incoterms chip */}
            <motion.div style={{ x: chipX, y: chipY }} className="absolute top-[13%] z-10 hidden sm:block sm:-end-4 lg:-end-3 xl:-end-8">
              <motion.div {...enter(1.25)}>
                <div className="hero-float hero-float-delay hero-card hero-card-compact">
                  <span className="hero-card-label">{t("incoterms")}</span>
                  <span className="mt-0.5 block text-xs font-extrabold tracking-[0.14em] text-white" dir="ltr">FOB · CIF · DAP</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Live routes card */}
            <motion.div style={{ x: cardBX, y: cardBY }} className="absolute bottom-[2%] z-10 hidden sm:block sm:-end-6 lg:-end-5 xl:-end-10">
              <motion.div {...enter(1.15)}>
                <div className="hero-float hero-float-slow hero-card w-[15rem] sm:w-[17.5rem]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="hero-card-label">{t("routes.title")}</span>
                    <span className="hero-live">
                      <span className="hero-ping hero-ping-red" />
                      {t("routes.live")}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {LIVE_ROUTES.map((route) => (
                      <li key={`${route.from}-${route.to}`}>
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <route.icon className="size-3.5 shrink-0 text-[#9ec9ff]" aria-hidden="true" />
                          <span className="flex min-w-0 items-center gap-1 truncate">
                            {cityName(route.from)}
                            <RouteArrow className="size-3 shrink-0 text-slate-500" aria-hidden="true" />
                            {cityName(route.to)}
                          </span>
                          <span className="ms-auto shrink-0 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-400">
                            {t(`routes.${route.mode}`)} · {t("routes.days", { count: route.days })}
                          </span>
                        </div>
                        <div className="hero-route-track mt-1.5">
                          <span className="hero-route-dot" style={{ animationDuration: route.duration }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Ticker ── */}
      <div className="relative z-10 border-t border-white/[0.08] bg-white/[0.025]">
        <div className="hero-ticker py-3.5">
          <div className="hero-ticker-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {TICKER.map(({ key, icon: Icon }) => (
                  <li key={key} className="hero-ticker-item">
                    <Icon className="size-3.5 text-[#9ec9ff]" aria-hidden="true" />
                    {t(`ticker.${key}`)}
                    <span className="hero-ticker-sep" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
