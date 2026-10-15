"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getServiceIcon } from "@/lib/service-icons";
import type { Service } from "@/types";

type ServicesIndexProps = {
  services: Service[];
  locale: AppLocale;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ServicesIndex({ services, locale }: ServicesIndexProps) {
  const t = useTranslations("Services");
  const reduce = useReducedMotion() ?? false;
  const Arrow = locale === "fa" ? ArrowLeft : ArrowRight;
  const number = (value: number) => new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);

  return (
    <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {services.map((service, index) => {
        const Icon = getServiceIcon(service.icon);
        const tags = service.tags.slice(0, 3);
        return (
          <motion.li
            key={service.slug}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: EASE }}
            className="flex"
          >
            <Link href={`/services/${service.slug}`} className="services-card group focus-ring">
              <span aria-hidden="true" className="services-card-glow" />
              <span className="relative flex items-start justify-between gap-3">
                <span className="services-card-icon">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="services-card-number">{String(index + 1).padStart(2, "0")}</span>
              </span>

              <span className="relative mt-6 block text-xl font-extrabold tracking-tight text-brand-navy transition-colors group-hover:text-brand-red">
                {getLocalizedText(service.title, locale)}
              </span>
              <span className="relative mt-2.5 block text-sm leading-7 text-muted">{getLocalizedText(service.summary, locale)}</span>

              {tags.length ? (
                <span className="relative mt-5 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag.en} className="services-card-tag">{getLocalizedText(tag, locale)}</span>
                  ))}
                </span>
              ) : null}

              <span className="relative mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500">
                  {service.countries.length ? <span className="services-card-stat">{t("marketsCount", { count: number(service.countries.length) })}</span> : null}
                  {service.steps.length ? <span className="services-card-stat">{t("stepsCount", { count: number(service.steps.length) })}</span> : null}
                </span>
                <span className="services-card-arrow" aria-hidden="true">
                  <Arrow className="size-4" />
                </span>
              </span>
              <span aria-hidden="true" className="services-card-line" />
            </Link>
          </motion.li>
        );
      })}
    </ol>
  );
}
