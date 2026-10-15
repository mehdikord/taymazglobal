"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Clock3, PackageCheck, Truck, XCircle, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { cn } from "@/lib/utils";
import type { CommerceOrder, CommerceOrderStatus, OrderLog } from "@/types";

const STATUS_ICONS: Record<CommerceOrderStatus, LucideIcon> = {
  pending_approval: Clock3,
  preparing: PackageCheck,
  in_transit: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const ORDERED_STEPS: CommerceOrderStatus[] = ["pending_approval", "preparing", "in_transit", "completed"];

function formatTimestamp(iso: string, locale: AppLocale): string {
  try {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type TrackingTimelineProps = { order: CommerceOrder; locale: AppLocale };

export function TrackingTimeline({ order, locale }: TrackingTimelineProps) {
  const t = useTranslations("Track");
  const reduce = useReducedMotion() ?? false;
  const isCancelled = order.status === "cancelled";

  const logMap = new Map<CommerceOrderStatus, OrderLog>();
  for (const log of order.logs) logMap.set(log.status, log);

  const steps = isCancelled ? [...ORDERED_STEPS.filter((status) => logMap.has(status)), "cancelled" as CommerceOrderStatus] : ORDERED_STEPS;
  const activeIndex = steps.indexOf(order.status);

  return (
    <div className="track-timeline">
      <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("timelineTitle")}</h2>
      <ol className="relative mt-5">
        {steps.map((status, index) => {
          const Icon = STATUS_ICONS[status];
          const log = logMap.get(status);
          const isDone = index < activeIndex || (index === activeIndex && (status === "completed" || status === "cancelled"));
          const isActive = index === activeIndex;
          const isPending = index > activeIndex;
          return (
            <motion.li
              key={status}
              initial={reduce ? false : { opacity: 0, x: locale === "fa" ? 14 : -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className={cn("track-tl-item", isDone && "track-tl-done", isActive && "track-tl-active", isPending && "track-tl-pending")}
              data-status={status}
            >
              {index < steps.length - 1 ? <span aria-hidden="true" className="track-tl-line" /> : null}
              <span className="track-tl-node">
                <Icon className="size-4" aria-hidden="true" />
                {isActive && !isDone ? <span aria-hidden="true" className="track-tl-pulse" /> : null}
              </span>
              <div className="track-tl-body">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="track-tl-title">{t(`statuses.${status}`)}</span>
                  {isActive ? <span className="track-tl-chip">{isDone ? "✓" : "●"}</span> : null}
                </div>
                {log?.timestamp ? <time dateTime={log.timestamp} className="track-tl-time">{formatTimestamp(log.timestamp, locale)}</time> : null}
                {log?.note && getLocalizedText(log.note, locale) ? <p className="track-tl-note">{getLocalizedText(log.note, locale)}</p> : null}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
