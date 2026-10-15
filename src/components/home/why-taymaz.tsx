"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, FileSignature, Globe2, Languages, Lock, MessageSquareReply, Radar, ScanLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { cn } from "@/lib/utils";
import type { Advantage, StatItem } from "@/types";

type WhyTaymazProps = {
  advantages: Advantage[];
  stats: StatItem[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
};

const ICONS = [Globe2, ScanLine, Languages, BriefcaseBusiness];
const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Animated counter (locale-aware digits) ──────────────────────────────── */
function Counter({ value, locale, start }: { value: string; locale: AppLocale; start: boolean }) {
  const match = value.match(/^([\d,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : 0;
  const suffix = match ? match[2] : "";
  const [current, setCurrent] = useState(0);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (!start || reduce) return;
    let frame = 0;
    const began = performance.now();
    const duration = 1600;
    const step = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      setCurrent(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [start, target, reduce]);

  if (!match) return <>{value}</>;
  const formatted = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(reduce ? target : current);
  return (
    <>
      {formatted}
      <span className="text-brand-red">{suffix}</span>
    </>
  );
}

/* ── Mini visuals per advantage ──────────────────────────────────────────── */
function NetworkVisual({ hub }: { hub: string }) {
  return (
    <div className="why-visual why-visual-network" aria-hidden="true">
      <span className="why-orbit why-orbit-one"><i /></span>
      <span className="why-orbit why-orbit-two"><i /></span>
      <span className="why-orbit why-orbit-three"><i /></span>
      <span className="why-hub">
        <Globe2 className="size-4" />
      </span>
      <span className="why-hub-label">{hub}</span>
    </div>
  );
}

function TrackingVisual({ done }: { done: string }) {
  return (
    <div className="why-visual why-visual-tracking" aria-hidden="true">
      <span className="why-track">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className="why-track-seg" style={{ animationDelay: `${index * 0.9}s` }} />
        ))}
      </span>
      <span className="why-track-chip">
        <Radar className="size-3" />
        {done}
      </span>
    </div>
  );
}

function LanguagesVisual() {
  return (
    <div className="why-visual why-visual-languages" aria-hidden="true">
      {["FA", "EN", "TR", "RU"].map((code, index) => (
        <span key={code} className="why-lang" style={{ animationDelay: `${index * 1.1}s` }}>
          {code}
        </span>
      ))}
    </div>
  );
}

function ContractVisual({ label, approved }: { label: string; approved: string }) {
  return (
    <div className="why-visual why-visual-contract" aria-hidden="true">
      <span className="why-doc why-doc-back" />
      <span className="why-doc why-doc-front">
        <FileSignature className="size-4 text-brand-navy" />
        <span className="why-doc-lines"><i /><i /><i /></span>
        <span className="why-doc-label">{label}</span>
      </span>
      <span className="why-stamp">
        <Check className="size-3" />
        {approved}
      </span>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */
export function WhyTaymaz({ advantages, stats, locale, eyebrow, title, description }: WhyTaymazProps) {
  const t = useTranslations("Home.advantages");
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const Arrow = locale === "fa" ? ArrowLeft : ArrowRight;

  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.65, delay, ease: EASE },
  });

  const visuals = [
    <NetworkVisual key="network" hub={t("visual.hub")} />,
    <TrackingVisual key="tracking" done={t("visual.stageDone")} />,
    <LanguagesVisual key="languages" />,
    <ContractVisual key="contract" label={t("visual.contract")} approved={t("visual.approved")} />,
  ];

  const guarantees = [
    { key: "response", icon: MessageSquareReply },
    { key: "contract", icon: FileSignature },
    { key: "payment", icon: Lock },
    { key: "tracking", icon: Radar },
  ] as const;

  return (
    <section ref={ref} className="why-section relative isolate overflow-hidden bg-[#f4f7fc] py-20 sm:py-28">
      <div aria-hidden="true" className="why-grid absolute inset-0" />
      <div aria-hidden="true" className="why-aura why-aura-one" />
      <div aria-hidden="true" className="why-aura why-aura-two" />

      <div className="container-shell relative">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Intro + stats tile */}
          <motion.div {...reveal(0)} className="why-intro relative overflow-hidden rounded-[1.75rem] p-7 text-white sm:p-9 lg:col-span-5 lg:row-span-2">
            <div aria-hidden="true" className="why-intro-grid absolute inset-0" />
            <div aria-hidden="true" className="why-intro-orb absolute -end-24 -top-24 size-72 rounded-full" />
            <div className="relative">
              <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ffb4b9]">
                <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
                {eyebrow}
              </p>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
              <p className="mt-5 max-w-md text-base leading-8 text-blue-100/80 sm:text-lg">{description}</p>

              <p className="mt-9 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{t("proof")}</p>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div key={stat.value} className="why-stat">
                    <dd className="text-2xl font-black tabular-nums text-white sm:text-3xl">
                      <Counter value={stat.value} locale={locale} start={inView} />
                    </dd>
                    <dt className="mt-1 text-xs font-semibold text-slate-300">{getLocalizedText(stat.label, locale)}</dt>
                  </div>
                ))}
              </dl>

              <Link href="/services" className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-white focus-ring">
                <span className="border-b border-white/30 pb-0.5 transition group-hover:border-brand-red">{t("cta")}</span>
                <Arrow className="size-4 text-brand-red transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Advantage tiles */}
          {advantages.map((advantage, index) => {
            const Icon = ICONS[index] ?? BriefcaseBusiness;
            return (
              <motion.article
                key={advantage.title.en}
                {...reveal(0.12 + index * 0.1)}
                className={cn("why-card group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-brand-navy/10 bg-white p-6 lg:col-span-7", index % 2 === 0 ? "xl:col-span-4" : "xl:col-span-3")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="why-card-icon">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="why-badge">{getLocalizedText(advantage.badge, locale)}</span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-brand-navy">{getLocalizedText(advantage.title, locale)}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{getLocalizedText(advantage.description, locale)}</p>
                <div className="mt-5 flex-1">{visuals[index]}</div>
                <span aria-hidden="true" className="why-card-line" />
              </motion.article>
            );
          })}
        </div>

        {/* Guarantees strip */}
        <motion.div {...reveal(0.5)} className="why-guarantees mt-5 grid gap-3 rounded-[1.5rem] border border-brand-navy/10 bg-white p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:p-5">
          <p className="text-sm font-extrabold text-brand-navy sm:pe-6 sm:border-e sm:border-brand-navy/10">{t("guaranteesTitle")}</p>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {guarantees.map(({ key, icon: Icon }) => (
              <li key={key} className="why-guarantee">
                <Icon className="size-4 text-brand-red" aria-hidden="true" />
                {t(`guarantees.${key}`)}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
