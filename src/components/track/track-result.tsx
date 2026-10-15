"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Hash,
  Headset,
  Link2,
  MapPin,
  Package,
  PackageCheck,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { findOrderByTrackingCode } from "@/lib/actions/tracking";
import { lookupCity } from "@/lib/geo/cities";
import { buildDotsPath, createProjection, fitDotMap } from "@/lib/geo/dot-map";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { findOrderByTrackingCode as findLocalOrder } from "@/lib/repositories/tracking";
import { useOrderStore } from "@/store/order-store";
import { cn } from "@/lib/utils";
import type { CommerceOrder, CommerceOrderStatus } from "@/types";

const STAGES: CommerceOrderStatus[] = ["pending_approval", "preparing", "in_transit", "completed"];
const STAGE_ICONS: Record<CommerceOrderStatus, LucideIcon> = {
  pending_approval: Clock3,
  preparing: PackageCheck,
  in_transit: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
};
const ORIGIN = { lat: 41.01, lon: 28.98, name: { fa: "استانبول", en: "Istanbul", tr: "İstanbul", ru: "Стамбул" } };
const MAP_W = 640;
const MAP_H = 360;
const EASE = [0.22, 1, 0.36, 1] as const;

function groupDigits(digits: string) {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  return { copied, copy };
}

/* ── Route map ───────────────────────────────────────────────────────────── */
function RouteMap({ destination, status, locale, label, originLabel }: { destination: { lat: number; lon: number; name: string }; status: CommerceOrderStatus; locale: AppLocale; label: string; originLabel: string }) {
  const reduce = useReducedMotion() ?? false;
  const map = useMemo(() => fitDotMap([ORIGIN, destination], MAP_W, MAP_H, { minLonSpan: 30, minLatSpan: 16, radius: 2.6 }), [destination]);
  const { px, py } = useMemo(() => createProjection(map), [map]);
  const dots = useMemo(() => buildDotsPath(map), [map]);
  const x0 = px(ORIGIN.lon);
  const y0 = py(ORIGIN.lat);
  const x1 = px(destination.lon);
  const y1 = py(destination.lat);
  const d = Math.hypot(x1 - x0, y1 - y0);
  const path = `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2 - d * 0.3).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  const progress = status === "completed" ? 1 : status === "in_transit" ? 0.62 : status === "preparing" ? 0.08 : 0;
  const moving = status === "in_transit" && !reduce;

  return (
    <div className="track-map relative overflow-hidden rounded-[1.5rem] text-white">
      <div aria-hidden="true" className="track-map-grid absolute inset-0" />
      <div className="relative flex items-center justify-between gap-3 px-4 pt-4">
        <span className="markets-pill markets-pill-muted">{label}</span>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{Math.round(progress * 100)}%</span>
      </div>
      <svg className="relative block w-full" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
        <defs>
          <filter id="track-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="track-map-dots" d={dots} />
        <path id="track-route" className="track-route-base" d={path} />
        <path className="track-route-done" d={path} pathLength={1} style={{ strokeDasharray: `${progress} 1` }} filter="url(#track-glow)" />
        {progress > 0 && progress < 1 ? (
          <circle className="track-packet" r="6" filter="url(#track-glow)">
            {moving ? (
              <animateMotion dur="5s" repeatCount="indefinite" keyPoints={`0;${progress}`} keyTimes="0;1" calcMode="linear">
                <mpath href="#track-route" />
              </animateMotion>
            ) : (
              <animateMotion dur="0.01s" fill="freeze" keyPoints={`${progress};${progress}`} keyTimes="0;1">
                <mpath href="#track-route" />
              </animateMotion>
            )}
          </circle>
        ) : null}
        <g transform={`translate(${x0.toFixed(1)} ${y0.toFixed(1)})`} className="track-node track-node-origin">
          <circle className="track-node-halo" r="11" />
          <circle className="track-node-core" r="5" />
          <text className="track-node-label" y="-18" textAnchor="middle">{originLabel}</text>
        </g>
        <g transform={`translate(${x1.toFixed(1)} ${y1.toFixed(1)})`} className={cn("track-node track-node-dest", status === "completed" && "track-node-done")}>
          <circle className="track-node-ring" r="11" />
          <circle className="track-node-halo" r="11" />
          <circle className="track-node-core" r="5" />
          <text className="track-node-label" y="-18" textAnchor="middle">{destination.name}</text>
        </g>
      </svg>
      <p className="relative px-4 pb-4 text-[11px] font-semibold text-slate-400">
        {ORIGIN.name[locale]} <span aria-hidden="true" className="mx-1 text-brand-red">→</span> {destination.name}
      </p>
    </div>
  );
}

/* ── Status stepper ──────────────────────────────────────────────────────── */
function StatusStepper({ order, locale }: { order: CommerceOrder; locale: AppLocale }) {
  const t = useTranslations("Track");
  const reduce = useReducedMotion() ?? false;
  const cancelled = order.status === "cancelled";
  const reachedStatuses = new Set(order.logs.map((log) => log.status));
  const activeIndex = cancelled ? Math.max(0, STAGES.findIndex((stage, index) => !reachedStatuses.has(stage) && index > 0) - 1) : STAGES.indexOf(order.status);
  const fill = cancelled ? ((activeIndex + 0.5) / STAGES.length) * 100 : ((activeIndex + 0.5) / STAGES.length) * 100;
  const number = (value: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
  const isRtl = locale === "fa";

  return (
    <div className="track-stepper" data-status={order.status}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("progress")}</p>
        <p className="text-[11px] font-bold text-slate-500">{cancelled ? t("cancelledNote") : t("stepOf", { current: number(activeIndex + 1), total: number(STAGES.length) })}</p>
      </div>
      <div className="track-stepper-track">
        <motion.span className="track-stepper-fill" initial={reduce ? false : { width: 0 }} animate={{ width: `${cancelled ? fill : order.status === "completed" ? 100 : fill}%` }} transition={{ duration: 1, ease: EASE, delay: 0.2 }} />
        {STAGES.map((stage, index) => {
          const Icon = STAGE_ICONS[stage];
          const done = cancelled ? reachedStatuses.has(stage) : index < activeIndex;
          const active = !cancelled && index === activeIndex;
          return (
            <span key={stage} className={cn("track-step", done && "track-step-done", active && "track-step-active", cancelled && !done && "track-step-muted")} style={{ left: `${isRtl ? 100 - ((index + 0.5) / STAGES.length) * 100 : ((index + 0.5) / STAGES.length) * 100}%` }}>
              <span className="track-step-dot">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="track-step-label">{t(`statuses.${stage}`)}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
type TrackResultProps = { code: string; locale: AppLocale };

export function TrackResult({ code, locale }: TrackResultProps) {
  const t = useTranslations("Track");
  const tStatus = useTranslations("Track.statuses");
  const reduce = useReducedMotion() ?? false;
  const { copied, copy } = useCopy();
  const [serverState, setServerState] = useState<{ code: string; order: CommerceOrder | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    findOrderByTrackingCode(code).then((order) => {
      if (!cancelled) setServerState({ code, order });
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const storeOrder = useSyncExternalStore(
    (onStoreChange) => useOrderStore.subscribe(onStoreChange),
    () => findLocalOrder(code, useOrderStore.getState().orders),
    () => null,
  );

  const loading = serverState?.code !== code;
  const order = (serverState?.code === code ? serverState.order : null) ?? storeOrder;

  const destinationGeo = useMemo(() => {
    if (!order) return null;
    const city = order.destination.split(/[,،]/)[0]?.trim() ?? "";
    const geo = lookupCity(city);
    return geo ? { lat: geo.lat, lon: geo.lon, name: city } : null;
  }, [order]);

  if (loading && !order) {
    return (
      <div className="track-card track-skeleton" aria-busy="true" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="size-6 animate-spin rounded-full border-[3px] border-brand-navy border-t-transparent" />
          <span className="text-sm font-bold text-brand-navy">{t("loading")}</span>
        </div>
        <div className="mt-6 space-y-3">
          <span className="track-skeleton-bar w-2/3" />
          <span className="track-skeleton-bar w-full" />
          <span className="track-skeleton-bar w-5/6" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="track-card track-card-error">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-danger/10 text-danger">
            <AlertCircle aria-hidden="true" className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-extrabold text-brand-navy">{t("notFound")}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{t("notFoundDescription")}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-navy-soft px-3 py-2 font-mono text-xs font-bold tracking-[0.14em] text-brand-navy" dir="ltr">
              <Hash className="size-3.5" aria-hidden="true" />
              {groupDigits(code)}
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted">
              {(["one", "two", "three"] as const).map((key) => (
                <li key={key} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-red" />
                  {t(`notFoundTips.${key}`)}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white transition hover:bg-brand-navy-dark focus-ring">
              <Headset className="size-4" aria-hidden="true" />
              {t("support")}
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const StatusIcon = STAGE_ICONS[order.status];
  const productTitle = getLocalizedText(order.productTitle, locale);
  const lastLog = order.logs[order.logs.length - 1];
  const dateFormat = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" });
  const dateTimeFormat = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const number = (value: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
  const trackingUrl = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?code=${code}` : `?code=${code}`;

  const details: { icon: LucideIcon; label: string; value: string; mono?: boolean }[] = [
    { icon: Hash, label: t("orderNumber"), value: order.orderNumber, mono: true },
    { icon: Package, label: t("product"), value: productTitle },
    { icon: MapPin, label: t("destination"), value: order.destination },
    ...(order.quantity ? [{ icon: Boxes, label: t("quantity"), value: number(order.quantity) }] : []),
    { icon: CalendarDays, label: t("createdAt"), value: dateFormat.format(new Date(order.createdAt)) },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div key={order.id} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }} className="space-y-5">
        {/* Status banner */}
        <div className="track-card track-banner" data-status={order.status}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="track-status-icon">
                <StatusIcon className="size-6" aria-hidden="true" />
                {order.status === "in_transit" ? <span className="track-status-ping" aria-hidden="true" /> : null}
              </span>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("resultTitle")}</p>
                <p className="mt-1 text-2xl font-black tracking-tight text-brand-navy sm:text-3xl">{tStatus(order.status)}</p>
                {lastLog ? (
                  <p className="mt-1 text-xs font-semibold text-muted">
                    {t("lastUpdate")}: <time dateTime={lastLog.timestamp}>{dateTimeFormat.format(new Date(lastLog.timestamp))}</time>
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => copy("code", code)} className="track-action focus-ring" dir="ltr">
                {copied === "code" ? <Check className="size-4 text-emerald-500" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
                <span className="font-mono tracking-[0.12em]">{groupDigits(code)}</span>
              </button>
              <button type="button" onClick={() => copy("link", trackingUrl)} className="track-action focus-ring">
                {copied === "link" ? <Check className="size-4 text-emerald-500" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
                {copied === "link" ? t("copied") : t("copyLink")}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <StatusStepper order={order} locale={locale} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Details + route */}
          <div className="space-y-5">
            <div className="track-card">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("detailsTitle")}</h2>
              <dl className="mt-4 divide-y divide-slate-100">
                {details.map((item) => (
                  <div key={item.label} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-navy-soft text-brand-navy">
                      <item.icon aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-bold text-muted">{item.label}</dt>
                      <dd className={cn("mt-0.5 truncate text-sm font-extrabold text-brand-navy", item.mono && "font-mono tracking-[0.08em]")} dir={item.mono ? "ltr" : undefined}>{item.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {destinationGeo ? <RouteMap destination={destinationGeo} status={order.status} locale={locale} label={t("routeTitle")} originLabel={ORIGIN.name[locale]} /> : null}

            <div className="track-card">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("statusHelpTitle")}</h2>
              <ul className="mt-3 space-y-2">
                {STAGES.map((stage) => {
                  const Icon = STAGE_ICONS[stage];
                  return (
                    <li key={stage} className={cn("track-help", stage === order.status && "track-help-active")} data-status={stage}>
                      <span className="track-help-icon"><Icon className="size-3.5" aria-hidden="true" /></span>
                      <span>
                        <span className="block text-xs font-extrabold text-brand-navy">{tStatus(stage)}</span>
                        <span className="block text-[11px] leading-5 text-muted">{t(`statusHelp.${stage}`)}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="track-card">
            <TrackingTimeline order={order} locale={locale} />
            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
              <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy px-4 text-sm font-bold text-white transition hover:bg-brand-navy-dark focus-ring">
                <Headset className="size-4" aria-hidden="true" />
                {t("support")}
              </Link>
              <Link href="/track" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-navy/15 px-4 text-sm font-bold text-brand-navy transition hover:bg-brand-navy-soft focus-ring">
                {t("newSearch")}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
