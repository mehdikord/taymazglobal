import type { ReactNode } from "react";

import type { BreadcrumbItem } from "@/types";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";

type PageHeroBaseProps = { eyebrow?: string; title: string; description?: string; children?: ReactNode; className?: string; titleClassName?: string };
type PageHeroProps = PageHeroBaseProps & (
  | { breadcrumbs?: undefined; breadcrumbLabel?: undefined }
  | { breadcrumbs: BreadcrumbItem[]; breadcrumbLabel: string }
);

export function PageHero({ eyebrow, title, description, breadcrumbs, breadcrumbLabel, children, className, titleClassName }: PageHeroProps) {
  return <section className={cn("page-hero relative overflow-hidden border-b border-brand-navy/5 bg-[#f4f8fc] py-7 sm:py-9 lg:py-10", className)}><div aria-hidden="true" className="page-hero-grid absolute inset-0" /><div aria-hidden="true" className="absolute -end-24 -top-32 size-80 rounded-full border-[48px] border-brand-navy/5" /><div aria-hidden="true" className="absolute -bottom-12 start-[12%] size-24 rounded-full bg-brand-red/5" /><div className="container-shell relative">{breadcrumbs && <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} />}<div className="mt-4 grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div className="max-w-3xl">{eyebrow && <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">{eyebrow}</p>}<h1 className={cn("text-balance text-3xl font-extrabold tracking-tight text-brand-navy sm:text-[2.35rem] lg:text-[2.6rem]", titleClassName)}>{title}</h1>{description && <p className="mt-3 max-w-2xl text-base leading-8 text-muted sm:text-lg">{description}</p>}</div>{children && <div>{children}</div>}</div></div></section>;
}
