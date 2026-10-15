"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { ErrorState } from "@/components/shared/error-state";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Marketing route error:", error);
  }, [error]);

  const t = useTranslations("States");

  return (
    <div className="container-shell py-16">
      <ErrorState
        title={t("errorTitle")}
        description={error.message || t("errorDescription")}
        onRetry={reset}
      />
    </div>
  );
}
