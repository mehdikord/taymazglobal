"use client";

import { Anchor, ArrowLeft, ArrowRight, Globe2, Radio, Ship } from "lucide-react";
import { motion } from "framer-motion";
import NextLink from "next/link";

import { Button } from "@/components/ui/button";
import { TradeLostScene } from "./trade-lost-scene";

type NotFoundContentProps = {
  title: string;
  subtitle: string;
  description: string;
  backToHome: string;
  goToServices: string;
  goToContact: string;
  lostRoute: string;
  activeNetwork: string;
  globalCoverage: string;
  locale?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function NotFoundContent({
  title,
  subtitle,
  description,
  backToHome,
  goToServices,
  goToContact,
  lostRoute,
  activeNetwork,
  globalCoverage,
  locale = "en",
}: NotFoundContentProps) {
  const isRtl = locale === "fa";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative isolate overflow-hidden bg-[#061326] text-white">
      <div aria-hidden="true" className="not-found-grid absolute inset-0" />
      <div aria-hidden="true" className="not-found-ambient not-found-ambient-one" />
      <div aria-hidden="true" className="not-found-ambient not-found-ambient-two" />

      <div className="container-shell relative z-10 flex min-h-[74vh] flex-col items-center justify-center py-16 text-center sm:min-h-[80vh]">

        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg"
        >
          <TradeLostScene />
        </motion.div>

        <div className="relative mt-6 sm:mt-8">
          <div aria-hidden="true" className="not-found-404-glow" />
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="pointer-events-none relative bg-gradient-to-b from-white via-white to-slate-400/60 bg-clip-text text-[6rem] font-black leading-none tracking-tighter text-transparent sm:text-[8rem] lg:text-[9rem]"
            aria-hidden="true"
          >
            404
          </motion.h1>
        </div>

        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 sm:mt-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/15 bg-blue-300/[0.07] px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-blue-200 backdrop-blur-md">
            <Anchor aria-hidden="true" className="size-3.5 text-brand-red" />
            {lostRoute}
          </span>
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl sm:mt-6"
        >
          <h2 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base sm:leading-7">
            {subtitle}
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400/80">
            {description}
          </p>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-xl bg-brand-red px-7 text-sm font-bold shadow-[0_16px_34px_-12px_rgb(252_20_34_/_0.65)] transition hover:-translate-y-0.5 hover:bg-brand-red-dark hover:shadow-[0_20px_42px_-12px_rgb(252_20_34_/_0.8)]"
          >
            <NextLink href="/">
              <Ship aria-hidden="true" className="ms-1.5 size-4" />
              {backToHome}
              <Arrow
                className="ms-2 size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                aria-hidden="true"
              />
            </NextLink>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-white/15 bg-white/[0.055] px-7 text-sm font-bold text-white backdrop-blur-md hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
          >
            <NextLink href="/services">{goToServices}</NextLink>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 rounded-xl px-6 text-sm font-bold text-slate-300 hover:bg-white/[0.08] hover:text-white"
          >
            <NextLink href="/contact">{goToContact}</NextLink>
          </Button>
        </motion.div>

        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="not-found-status mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[11px] font-bold text-slate-400 sm:mt-12"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex size-5 items-center justify-center">
              <span className="absolute size-2 rounded-full bg-emerald-400" />
              <span className="not-found-radar-ping absolute size-2 rounded-full bg-emerald-400" />
            </span>
            {activeNetwork}
          </span>
          <span className="flex items-center gap-2">
            <Globe2 aria-hidden="true" className="size-3.5 text-blue-300/70" />
            {globalCoverage}
          </span>
          <span className="flex items-center gap-2">
            <Radio aria-hidden="true" className="size-3.5 text-brand-red/80" />
            <span className="text-slate-500">Taymaz Global</span>
          </span>
        </motion.div>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#061326] to-transparent" />
    </section>
  );
}