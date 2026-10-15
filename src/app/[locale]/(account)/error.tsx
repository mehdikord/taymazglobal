"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Account route error:", error);
  }, [error]);

  const t = useTranslations("States");
  const common = useTranslations("Common");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="size-7 text-danger" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-brand-navy">
          {t("errorTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {error.message || t("errorDescription")}
        </p>
        <Button onClick={reset} className="mt-6">
          {common("retry")}
        </Button>
      </div>
    </div>
  );
}
