import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, align = "start", className, eyebrowClassName }: { eyebrow?: string; title: string; description?: string; align?: "start" | "center"; className?: string; eyebrowClassName?: string }) {
  return <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>{eyebrow && <p className={cn("mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red", eyebrowClassName)}>{eyebrow}</p>}<h2 className="text-balance text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{title}</h2>{description && <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">{description}</p>}</div>;
}
