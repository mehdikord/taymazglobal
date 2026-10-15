import { ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { BreadcrumbItem } from "@/types";

export function Breadcrumbs({ items, label }: { items: BreadcrumbItem[]; label: string }) {
  return <nav aria-label={label}><ol className="flex flex-wrap items-center gap-2 text-sm text-muted">{items.map((item, index) => <li key={item.label} className="flex items-center gap-2">{index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 rtl:rotate-180" />}{item.href ? <Link href={item.href} className="min-h-11 items-center py-3 font-semibold hover:text-brand-navy">{item.label}</Link> : <span aria-current="page" className="font-semibold text-brand-navy">{item.label}</span>}</li>)}</ol></nav>;
}
