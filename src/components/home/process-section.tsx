"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, ClipboardCheck, Handshake, MessageCircle, PackageCheck, Timer, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { cn } from "@/lib/utils";
import type { ProcessStep } from "@/types";

type ProcessSectionProps = {
  steps: ProcessStep[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
};

const STEP_ICONS = [MessageCircle, ClipboardCheck, Truck, Handshake];
const STAGE_MS = 3400;
const RING_R = 26;
const RING_C = 2 * Math.PI * RING_R;

export function ProcessSection({ steps, locale, eyebrow, title, description }: ProcessSectionProps) {
  const t = useTranslations("Home.process");
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-20% 0px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const isRtl = locale === "fa";
  const total = steps.length;

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % total), STAGE_MS);
    return () => window.clearInterval(id);
  }, [inView, paused, reduce, total]);

  const progress = (active + 1) / total;
  const nodePct = (index: number) => ((index + 0.5) / total) * 100;
  const vehicleLeft = isRtl ? 100 - nodePct(active) : nodePct(active);
  const fillPct = nodePct(active);
  const spring = { type: "spring" as const, stiffness: 60, damping: 16, mass: 0.9 };
  const number = (value: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);

  return (
    <section ref={sectionRef} className="process-section relative isolate overflow-hidden bg-[#071b38] py-20 text-white sm:py-28">
      <div aria-hidden="true" className="process-grid absolute inset-0" />
      <div aria-hidden="true" className="process-aura process-aura-one" />
      <div aria-hidden="true" className="process-aura process-aura-two" />

      <div className="container-shell relative">
        {/* ── Header ── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ff747b]">
              <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
              {eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
          </div>

          <div className="process-stamp flex w-fit items-center gap-4 rounded-2xl border border-white/10 px-4 py-3">
            <span className="relative grid size-16 place-items-center">
              <svg viewBox="0 0 64 64" className="absolute inset-0 size-full -rotate-90">
                <circle cx="32" cy="32" r={RING_R} className="fill-none stroke-white/10" strokeWidth="4" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r={RING_R}
                  className="fill-none stroke-brand-red"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  initial={false}
                  animate={{ strokeDashoffset: RING_C * (1 - progress) }}
                  transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <span className="text-sm font-black tabular-nums text-white">{number(Math.round(progress * 100))}%</span>
            </span>
            <span className="text-xs font-bold leading-5 text-slate-300">
              <span className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffb4b9]">
                <span className="process-live-dot" />
                {t("sample")}
              </span>
              <span className="mt-1 block text-white">{t("progress")}</span>
              <span className="block text-slate-400">{t("stepOf", { current: active + 1, total })}</span>
            </span>
          </div>
        </div>

        {/* ── Journey ── */}
        <div
          className="process-journey relative mt-14 sm:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Horizontal track (desktop) */}
          <div aria-hidden="true" className="process-track hidden lg:block">
            <div className="process-track-base" />
            <motion.div
              className="process-track-fill"
              initial={false}
              animate={{ width: `${fillPct}%` }}
              transition={reduce ? { duration: 0 } : spring}
            />
            {steps.map((step, index) => (
              <span
                key={step.step}
                className={cn("process-node", index < active && "process-node-done", index === active && "process-node-active")}
                style={{ left: `${isRtl ? 100 - nodePct(index) : nodePct(index)}%` }}
              >
                <span className="process-node-ring" />
                <span className="process-node-core" />
              </span>
            ))}
            <motion.div
              className="process-vehicle"
              initial={false}
              animate={{ left: `${vehicleLeft}%` }}
              transition={reduce ? { duration: 0 } : spring}
            >
              <span className="process-vehicle-chip">
                {active === total - 1 ? <PackageCheck className="size-4" aria-hidden="true" /> : <Truck className={cn("size-4", isRtl && "-scale-x-100")} aria-hidden="true" />}
              </span>
              <span className="process-vehicle-trail" />
            </motion.div>
          </div>

          {/* Vertical track (mobile) */}
          <div aria-hidden="true" className="process-track-v lg:hidden">
            <div className="process-track-v-base" />
            <motion.div
              className="process-track-v-fill"
              initial={false}
              animate={{ height: `${fillPct}%` }}
              transition={reduce ? { duration: 0 } : spring}
            />
            <motion.div
              className="process-vehicle-v"
              initial={false}
              animate={{ top: `${nodePct(active)}%` }}
              transition={reduce ? { duration: 0 } : spring}
            >
              <span className="process-vehicle-chip">
                {active === total - 1 ? <PackageCheck className="size-4" aria-hidden="true" /> : <Truck className="size-4 rotate-90" aria-hidden="true" />}
              </span>
            </motion.div>
          </div>

          {/* Cards */}
          <ol className="process-steps grid gap-4 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? ClipboardCheck;
              const state = index < active ? "done" : index === active ? "active" : "upcoming";
              return (
                <li key={step.step} className="process-step relative">
                  <span aria-hidden="true" className={cn("process-node-v lg:hidden", state === "done" && "process-node-done", state === "active" && "process-node-active")}>
                    <span className="process-node-ring" />
                    <span className="process-node-core" />
                  </span>
                  <span aria-hidden="true" className={cn("process-connector hidden lg:block", state !== "upcoming" && "process-connector-lit")} />
                  <motion.article
                    initial={reduce ? false : { opacity: 0, y: 26 }}
                    animate={inView ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.6, delay: 0.15 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    tabIndex={0}
                    className={cn("process-card group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border p-5 sm:p-6 focus-ring", `process-card-${state}`)}
                  >
                    <span aria-hidden="true" className="process-card-number">{String(index + 1).padStart(2, "0")}</span>
                    <div className="relative flex items-start justify-between gap-3">
                      <span className="process-card-icon">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <span className={cn("process-status", `process-status-${state}`)}>
                        {state === "done" ? <Check className="size-3" aria-hidden="true" /> : state === "active" ? <span className="process-status-dot" /> : null}
                        {t(state)}
                      </span>
                    </div>
                    <p className="relative mt-5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      {t("step")} {number(index + 1)}
                    </p>
                    <h3 className="relative mt-1.5 text-xl font-extrabold text-white">{getLocalizedText(step.title, locale)}</h3>
                    <p className="relative mt-2.5 text-sm leading-7 text-slate-300">{getLocalizedText(step.description, locale)}</p>

                    <ul className="relative mt-4 space-y-1.5">
                      {step.details.map((detail, detailIndex) => (
                        <motion.li
                          key={detail.en}
                          initial={false}
                          animate={{ opacity: state === "upcoming" ? 0.55 : 1, x: 0 }}
                          transition={{ delay: state === "active" ? detailIndex * 0.08 : 0 }}
                          className="flex items-start gap-2 text-xs font-semibold leading-5 text-slate-200"
                        >
                          <span className={cn("process-detail-dot", state === "done" && "process-detail-dot-done", state === "active" && "process-detail-dot-active")} />
                          {getLocalizedText(detail, locale)}
                        </motion.li>
                      ))}
                    </ul>

                    <div className="relative mt-auto flex items-center gap-2 pt-5 text-[11px] font-bold text-slate-400">
                      <Timer className="size-3.5 text-[#9ec9ff]" aria-hidden="true" />
                      {t("duration")}: <span className="text-white">{getLocalizedText(step.duration, locale)}</span>
                    </div>

                    <AnimatePresence>
                      {state === "active" && !reduce ? (
                        <motion.span
                          key="bar"
                          aria-hidden="true"
                          className="process-card-timer"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: paused ? 0 : STAGE_MS / 1000, ease: "linear" }}
                        />
                      ) : null}
                    </AnimatePresence>
                  </motion.article>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── Footer CTAs ── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 sm:flex-row">
          <p className="text-sm font-semibold text-slate-300">
            <span className="text-white">{t("sample")}</span> · {t("stepOf", { current: active + 1, total })}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/track" className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm font-bold text-white transition hover:border-white/35 hover:bg-white/[0.12] focus-ring">
              {t("trackCta")}
              <ArrowUpRight className="size-4 text-[#9ec9ff] transition-transform group-hover:rotate-45" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-red px-4 text-sm font-extrabold text-white shadow-[0_14px_28px_-14px_rgb(252_20_34_/_0.9)] transition hover:bg-brand-red-dark focus-ring">
              {t("contactCta")}
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
