"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error به console یا error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
          <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-danger/10">
              <AlertTriangle className="size-8 text-danger" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-brand-navy">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              {error.message || "An unexpected error occurred. Please try again."}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-muted">Error ID: {error.digest}</p>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset}>Try again</Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
