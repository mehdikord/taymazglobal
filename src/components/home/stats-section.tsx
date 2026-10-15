"use client";

import { motion, useInView } from "framer-motion";
import * as React from "react";
import { useRef } from "react";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import type { StatItem } from "@/types";

type StatsSectionProps = {
  stats: StatItem[];
  locale: AppLocale;
};

/* ── Counter animation ───────────────────────────────────────────── */
function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract number and suffix (e.g., "2,500+" → 2500 and "+")
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) {
    return <p ref={ref} className="text-4xl font-extrabold text-brand-navy lg:text-5xl">{value}</p>;
  }

  const numStr = match[1].replace(/,/g, "");
  const suffix = match[2];
  const targetNum = parseInt(numStr, 10);

  return (
    <p ref={ref} className="text-4xl font-extrabold tabular-nums text-brand-navy lg:text-5xl">
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountUp from={0} to={targetNum} duration={duration} />
          <span className="text-brand-red">{suffix}</span>
        </motion.span>
      ) : (
        <span>0{suffix}</span>
      )}
    </p>
  );
}

/* ── Simple counter component ─────────────────────────────────────── */
function CountUp({ from, to, duration }: { from: number; to: number; duration: number }) {
  const [count, setCount] = React.useState(from);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(from + (to - from) * easeOut);
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  return <>{count.toLocaleString("en-US")}</>;
}

/* ── Main ────────────────────────────────────────────────────────── */
export function StatsSection({ stats, locale }: StatsSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      aria-label="Statistics"
      className="border-b bg-white py-12 sm:py-16"
    >
      <div className="container-shell">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group text-center"
            >
              {/* Counter */}
              <AnimatedCounter value={stat.value} duration={1.8 + i * 0.2} />

              {/* Label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.3 }}
                className="mt-2 text-sm font-semibold text-muted"
              >
                {getLocalizedText(stat.label, locale)}
              </motion.p>

              {/* Accent line */}
              <motion.div
                className="mx-auto mt-3 h-0.5 w-12 bg-gradient-to-r from-brand-navy to-brand-red opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 + 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
