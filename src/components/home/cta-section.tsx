"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, CheckCircle2, Clock3, Languages, PhoneCall, Send, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Link } from "@/i18n/navigation";
import { submitContactMessage } from "@/lib/actions/leads";
import { cn } from "@/lib/utils";

type CtaSectionProps = {
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
};

type QuickValues = { name: string; phone: string; privacyAccepted: boolean };

const EASE = [0.22, 1, 0.36, 1] as const;

export function CtaSection({ title, description, primaryLabel, secondaryLabel }: CtaSectionProps) {
  const t = useTranslations("Home.cta");
  const locale = useLocale();
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [submitted, setSubmitted] = useState(false);

  const schema = z.object({
    name: z.string().trim().min(2, t("quick.nameRequired")),
    phone: z.string().trim().min(6, t("quick.phoneRequired")),
    privacyAccepted: z.boolean().refine((value) => value === true, { message: t("quick.privacyRequired") }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuickValues>({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", privacyAccepted: false } });

  const onSubmit = async (values: QuickValues) => {
    const result = await submitContactMessage({
      name: values.name,
      phone: values.phone,
      subject: t("quick.subject"),
      messageType: "consultation",
      message: `${t("quick.message")} (${locale})`,
      privacyAccepted: values.privacyAccepted,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSubmitted(true);
    reset();
    toast.success(t("quick.successTitle"), { description: t("quick.successDescription") });
  };

  const reveal = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.65, delay, ease: EASE },
  });

  const steps = ["one", "two", "three"] as const;
  const trust = [
    { key: "offices", icon: Building2 },
    { key: "languages", icon: Languages },
    { key: "experience", icon: ShieldCheck },
  ] as const;

  return (
    <section ref={ref} className="cta-section relative bg-white py-16 sm:py-24">
      <div className="container-shell">
        <motion.div {...reveal(0)} className="cta-panel relative isolate overflow-hidden rounded-[2rem] text-white">
          <div aria-hidden="true" className="cta-grid absolute inset-0" />
          <div aria-hidden="true" className="cta-aura cta-aura-one" />
          <div aria-hidden="true" className="cta-aura cta-aura-two" />
          <svg aria-hidden="true" className="cta-lanes absolute inset-0 size-full" viewBox="0 0 1200 520" preserveAspectRatio="none" fill="none">
            <path className="cta-lane" d="M-20 420C260 300 520 470 1220 140" />
            <path className="cta-lane cta-lane-delay" d="M-20 500C380 400 760 520 1220 260" />
            <path className="cta-lane cta-lane-slow" d="M-20 120C300 40 640 230 1220 20" />
          </svg>
          <div aria-hidden="true" className="cta-floor" />

          <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:py-16">
            {/* Copy */}
            <div className="lg:col-span-7">
              <span className="cta-live">
                <span className="cta-live-dot" />
                {t("quick.title")}
              </span>
              <h2 className="mt-5 max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-blue-100/80 sm:text-lg">{description}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-brand-red px-5 text-sm font-extrabold text-white shadow-[0_16px_28px_-15px_rgb(252_20_34_/_0.9)] transition hover:-translate-y-0.5 hover:bg-brand-red-dark focus-ring">
                  {primaryLabel}
                  <span className="flex size-7 items-center justify-center rounded-lg bg-white/15 transition-transform group-hover:rotate-45"><ArrowUpRight aria-hidden="true" className="size-4" /></span>
                </Link>
                <Link href="/services" className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] px-5 text-sm font-bold text-white transition hover:border-white/35 hover:bg-white/10 focus-ring">
                  {secondaryLabel}
                  <ArrowUpRight aria-hidden="true" className="size-4 text-[#9ec9ff] transition-transform group-hover:rotate-45" />
                </Link>
              </div>

              <div className="mt-10">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{t("nextTitle")}</p>
                <ol className="cta-steps mt-4 grid gap-3 sm:grid-cols-3">
                  {steps.map((step, index) => (
                    <motion.li key={step} {...reveal(0.25 + index * 0.1)} className="cta-step">
                      <span className="cta-step-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-sm font-semibold leading-6 text-slate-200">{t(`steps.${step}`)}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {trust.map(({ key, icon: Icon }) => (
                  <li key={key} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Icon className="size-4 text-[#9ec9ff]" aria-hidden="true" />
                    {t(`trust.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick callback form */}
            <motion.div {...reveal(0.2)} className="cta-form-card relative rounded-[1.5rem] border border-white/12 p-5 sm:p-6 lg:col-span-5">
              <AnimatePresence mode="wait" initial={false}>
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    className="flex min-h-72 flex-col items-center justify-center text-center"
                  >
                    <span className="cta-success-icon">
                      <CheckCircle2 className="size-8" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-xl font-extrabold text-white">{t("quick.successTitle")}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-7 text-slate-300">{t("quick.successDescription")}</p>
                    <button type="button" onClick={() => setSubmitted(false)} className="mt-6 inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 text-sm font-bold text-white transition hover:bg-white/10 focus-ring">
                      {t("quick.another")}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={false}
                    exit={reduce ? undefined : { opacity: 0 }}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="cta-form-icon">
                        <PhoneCall className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-lg font-extrabold text-white">{t("quick.title")}</h3>
                        <p className="text-xs font-semibold text-slate-400">{t("quick.description")}</p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cta-name" className="cta-label">{t("quick.name")}</label>
                      <input id="cta-name" type="text" autoComplete="name" {...register("name")} className={cn("cta-input", errors.name && "cta-input-error")} aria-invalid={Boolean(errors.name)} />
                      {errors.name ? <p className="cta-error">{errors.name.message}</p> : null}
                    </div>
                    <div>
                      <label htmlFor="cta-phone" className="cta-label">{t("quick.phone")}</label>
                      <input id="cta-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" {...register("phone")} className={cn("cta-input text-start", errors.phone && "cta-input-error")} aria-invalid={Boolean(errors.phone)} />
                      {errors.phone ? <p className="cta-error">{errors.phone.message}</p> : null}
                    </div>

                    <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-slate-300">
                      <input type="checkbox" {...register("privacyAccepted")} className="cta-checkbox mt-1" />
                      <span>
                        {t("quick.privacyPrefix")}
                        <Link href="/privacy" className="font-bold text-white underline decoration-white/30 underline-offset-4 hover:decoration-brand-red">{t("quick.privacyLink")}</Link>
                        {t("quick.privacySuffix")}
                      </span>
                    </label>
                    {errors.privacyAccepted ? <p className="cta-error">{errors.privacyAccepted.message}</p> : null}

                    <button type="submit" disabled={isSubmitting} className="cta-submit group focus-ring">
                      {isSubmitting ? t("quick.submitting") : t("quick.submit")}
                      <Send className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                    </button>
                    <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {t("steps.one")}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
