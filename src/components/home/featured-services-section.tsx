"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Globe2, ListChecks, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { createElement, useEffect, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getServiceIcon } from "@/lib/service-icons";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

type FeaturedServicesSectionProps = {
  services: Service[];
  locale: AppLocale;
  eyebrow: string;
  title: string;
  description: string;
  viewAllLabel: string;
};

const AUTO_INTERVAL = 5000;
const EASE = [0.22, 1, 0.36, 1] as const;

export function FeaturedServicesSection({ services, locale, eyebrow, title, description, viewAllLabel }: FeaturedServicesSectionProps) {
  const t = useTranslations("Home.services");
  const reduce = useReducedMotion() ?? false;
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView || paused || reduce || services.length < 2) return;
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % services.length);
      setCycle((value) => value + 1);
    }, AUTO_INTERVAL);
    return () => window.clearInterval(id);
  }, [inView, paused, reduce, services.length, cycle]);

  const select = (index: number) => {
    setActive(index);
    setCycle((value) => value + 1);
  };

  const current = services[active] ?? services[0];
  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.65, delay, ease: EASE },
  });

  if (!current) return null;
  const benefits = current.benefits.slice(0, 4);
  const countries = current.countries.slice(0, 5);
  const extraCountries = current.countries.length - countries.length;

  return (
    <section ref={ref} className="services-section relative isolate overflow-hidden bg-[#071427] py-20 text-white sm:py-28">
      <div aria-hidden="true" className="services-grid absolute inset-0" />
      <div aria-hidden="true" className="services-aura services-aura-one" />
      <div aria-hidden="true" className="services-aura services-aura-two" />

      <div className="container-shell relative">
        <motion.div {...reveal(0)} className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ff747b]">
              <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
              {eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
          </div>
          <Link href="/services" className="group inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-bold text-white transition hover:border-brand-red/60 hover:bg-brand-red hover:shadow-[0_12px_32px_-12px_rgb(252_20_34_/_0.75)] focus-ring">
            {viewAllLabel}
            <span className="flex size-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-white/20 rtl:group-hover:-translate-x-0.5">
              <Arrow aria-hidden="true" className="size-4" />
            </span>
          </Link>
        </motion.div>

        <div
          className="mt-12 grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* ── Service list ── */}
          <motion.div {...reveal(0.1)} role="tablist" aria-label={t("selectService")} className="services-list">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.icon);
              const isActive = index === active;
              return (
                <button
                  key={service.slug}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => select(index)}
                  onMouseEnter={() => select(index)}
                  className={cn("services-item focus-ring", isActive && "services-item-active")}
                >
                  <span className="services-item-icon">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-white">{getLocalizedText(service.title, locale)}</span>
                    <span className="block truncate text-[11px] font-medium text-slate-400">{getLocalizedText(service.summary, locale)}</span>
                  </span>
                  <span className="services-item-index">{String(index + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="services-item-track">
                    {isActive && !reduce && services.length > 1 ? (
                      <span key={`${active}-${cycle}`} className="services-item-progress" style={{ animationDuration: `${AUTO_INTERVAL}ms`, animationPlayState: paused ? "paused" : "running" }} />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* ── Showcase ── */}
          <motion.div {...reveal(0.2)} className="services-showcase relative overflow-hidden rounded-[1.75rem] border border-white/10 p-6 sm:p-8">
            <div aria-hidden="true" className="services-showcase-grid absolute inset-0" />
            <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 800 420" preserveAspectRatio="none" fill="none">
              <path className="services-lane" d="M-20 360C200 250 420 400 820 120" />
              <path className="services-lane services-lane-delay" d="M-20 90C260 20 520 200 820 60" />
            </svg>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.slug}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative flex h-full flex-col"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="services-showcase-icon">
                      {createElement(getServiceIcon(current.icon), { className: "size-8", "aria-hidden": true })}
                    </span>
                    <div>
                      <span className="markets-pill">
                        <Sparkles className="size-3" aria-hidden="true" />
                        {t("featured")}
                      </span>
                      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{getLocalizedText(current.title, locale)}</h3>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-slate-500" dir="ltr">
                    {String(active + 1).padStart(2, "0")}/{String(services.length).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{getLocalizedText(current.description, locale) || getLocalizedText(current.summary, locale)}</p>

                {current.tags.length ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {current.tags.slice(0, 4).map((tag) => (
                      <li key={tag.en} className="services-tag services-tag-soft">{getLocalizedText(tag, locale)}</li>
                    ))}
                  </ul>
                ) : null}

                {benefits.length ? (
                  <div className="mt-6">
                    <p className="services-caption">{t("benefits")}</p>
                    <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {benefits.map((benefit, index) => (
                        <motion.li
                          key={benefit.en}
                          initial={reduce ? false : { opacity: 0, x: isRtl ? 10 : -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + index * 0.07, duration: 0.4, ease: EASE }}
                          className="services-benefit"
                        >
                          <span className="services-benefit-check"><Check className="size-3" aria-hidden="true" /></span>
                          {getLocalizedText(benefit, locale)}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  {countries.length ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="me-1 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                        <Globe2 className="size-3.5 text-[#9ec9ff]" aria-hidden="true" />
                        {t("countries")}
                      </span>
                      {countries.map((country) => (
                        <span key={country.en} className="services-tag">{getLocalizedText(country, locale)}</span>
                      ))}
                      {extraCountries > 0 ? <span className="services-tag services-tag-soft">{t("more", { count: extraCountries })}</span> : null}
                    </div>
                  ) : null}
                  {current.steps.length ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <ListChecks className="size-4 text-[#9ec9ff]" aria-hidden="true" />
                      {t("steps", { count: current.steps.length })}
                    </span>
                  ) : null}
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
                  <Link href={`/services/${current.slug}`} className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-brand-red px-5 text-sm font-extrabold text-white shadow-[0_16px_28px_-15px_rgb(252_20_34_/_0.9)] transition hover:-translate-y-0.5 hover:bg-brand-red-dark focus-ring">
                    {t("details")}
                    <Arrow className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link href="/contact" className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] px-5 text-sm font-bold text-white transition hover:border-white/35 hover:bg-white/10 focus-ring">
                    {t("consult")}
                    <ArrowUpRight className="size-4 text-[#9ec9ff] transition-transform group-hover:rotate-45" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
