"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type AnimateInViewProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article";
};

/**
 * Wrapper component برای fade + translateY animation وقتی element وارد viewport می‌شود
 * بر اساس motion strategy: duration 150-350ms، ease-out، prefers-reduced-motion aware
 */
export function AnimateInView({
  children,
  delay = 0,
  duration = 0.5,
  className,
  as = "div",
}: AnimateInViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const Component = motion[as];

  return (
    <Component
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
