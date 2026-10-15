"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("States");
  const common = useTranslations("Common");

  useEffect(() => {
    console.error("Locale error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="size-8 text-danger" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-brand-navy">
          {t("errorTitle")}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {error.message || t("errorDescription")}
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted">Error ID: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>{common("retry")}</Button>
          <Button variant="outline" asChild>
            <Link href="/">{common("backToHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
