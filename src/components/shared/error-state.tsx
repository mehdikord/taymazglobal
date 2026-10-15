"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function ErrorState({ title, description, onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  const translations = useTranslations("States");
  const common = useTranslations("Common");
  return <div role="alert" className="rounded-2xl border border-danger/20 bg-danger/5 px-6 py-10 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-danger shadow-[var(--shadow-soft)]"><AlertTriangle aria-hidden="true" /></span><h2 className="mt-5 text-xl font-extrabold text-brand-navy">{title ?? translations("errorTitle")}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">{description ?? translations("errorDescription")}</p>{onRetry && <Button variant="outline" className="mt-6" onClick={onRetry}>{common("retry")}</Button>}</div>;
}
