"use client";

import { AlertCircle, Loader2, ScanSearch, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { isValidTrackingCode, normalizeTrackingCode } from "@/lib/repositories/tracking";
import { cn } from "@/lib/utils";

type TrackFormProps = {
  testCodes?: string[];
};

function groupDigits(digits: string) {
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function TrackForm({ testCodes = [] }: TrackFormProps) {
  const t = useTranslations("Track");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [digits, setDigits] = useState(() => normalizeTrackingCode(searchParams.get("code") ?? "").replace(/\D/g, "").slice(0, 16));
  const [error, setError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const currentCode = searchParams.get("code");
  const isSearching = submittedCode !== null && currentCode !== submittedCode;
  const complete = digits.length === 16;

  function submitCode(code: string) {
    setError(null);
    if (!code) {
      setError(t("validation.required"));
      return;
    }
    if (!isValidTrackingCode(code)) {
      setError(t("validation.invalid"));
      return;
    }
    setSubmittedCode(code);
    router.push(`?code=${code}`);
  }

  function handleChange(raw: string) {
    const next = normalizeTrackingCode(raw).replace(/\D/g, "").slice(0, 16);
    setDigits(next);
    setError(null);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submitCode(digits);
      }}
      className="track-form relative overflow-hidden rounded-[1.75rem] border border-white/12 p-5 sm:p-7"
      noValidate
    >
      <div className="flex items-center gap-3.5">
        <span className="track-form-icon">
          <ScanSearch aria-hidden="true" className="size-5" />
        </span>
        <div>
          <label htmlFor="tracking-code" className="block text-base font-extrabold text-white sm:text-lg">{t("inputLabel")}</label>
          <p className="mt-0.5 text-xs leading-5 text-slate-400 sm:text-sm">{t("heroHint")}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className={cn("track-input-wrap", error && "track-input-wrap-error", complete && !error && "track-input-wrap-complete")} dir="ltr">
          <Search aria-hidden="true" className="track-input-icon size-5" />
          <input
            id="tracking-code"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={groupDigits(digits)}
            onChange={(event) => handleChange(event.target.value)}
            placeholder="0000 0000 0000 0000"
            className="track-input"
            aria-describedby={error ? "track-error" : "track-digits"}
            aria-invalid={Boolean(error)}
            disabled={isSearching}
          />
          {digits.length ? (
            <button type="button" onClick={() => handleChange("")} aria-label={t("clear")} className="track-input-clear">
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
          <span aria-hidden="true" className="track-input-scan" />
        </div>
        <button type="submit" disabled={isSearching} className="track-submit group focus-ring">
          {isSearching ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Search aria-hidden="true" className="size-4 transition-transform group-hover:scale-110" />}
          {isSearching ? t("submitting") : t("submit")}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-400">
        {error ? (
          <p id="track-error" role="alert" className="flex items-center gap-1.5 text-[#ffb4b9]">
            <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
            {error}
          </p>
        ) : (
          <p id="track-digits" className="flex items-center gap-2">
            <span className="track-digit-track" aria-hidden="true">
              <span style={{ width: `${(digits.length / 16) * 100}%` }} />
            </span>
            {t("digits", { count: digits.length })}
          </p>
        )}
        <p className="flex items-center gap-1.5">
          <span className="track-secure-dot" aria-hidden="true" />
          {t("secure")}
        </p>
      </div>

      {testCodes.length ? (
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("testCodesHint")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {testCodes.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  onClick={() => {
                    setDigits(code);
                    submitCode(code);
                  }}
                  disabled={isSearching}
                  className="track-test-code focus-ring"
                  dir="ltr"
                >
                  <span className="font-mono tracking-[0.14em]">{groupDigits(code)}</span>
                  <span className="track-test-code-action">{t("testCodesAction")}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
