import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, breadcrumb, actions }: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {breadcrumb && breadcrumb.length > 0 ? (
          <nav
            aria-label="مسیر صفحه"
            className="mb-2 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-400"
          >
            {breadcrumb.map((item, index) => (
              <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-brand-red">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-500">{item.label}</span>
                )}
                {index < breadcrumb.length - 1 ? (
                  <ChevronLeft aria-hidden="true" className="size-3.5 rtl:rotate-180" />
                ) : null}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
