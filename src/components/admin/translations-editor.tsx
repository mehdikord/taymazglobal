"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { LocalizedText } from "@/types";

export const LOCALE_META = {
  fa: { label: "فارسی", dir: "rtl" as const },
  en: { label: "English", dir: "ltr" as const },
  tr: { label: "Türkçe", dir: "ltr" as const },
  ru: { label: "Русский", dir: "ltr" as const },
} as const;

export type LocaleKey = keyof typeof LOCALE_META;
export const LOCALE_KEYS = Object.keys(LOCALE_META) as LocaleKey[];

const EMPTY: LocalizedText = { fa: "", en: "", tr: "", ru: "" };

type TranslationsEditorProps = {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  type?: "text" | "textarea";
  rows?: number;
};

export function TranslationsEditor({
  label,
  value,
  onChange,
  type = "text",
  rows = 4,
}: TranslationsEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-bold text-slate-700">{label}</Label>
      <Tabs defaultValue="fa" className="w-full">
        <TabsList className="w-full sm:w-auto">
          {LOCALE_KEYS.map((locale) => (
            <TabsTrigger key={locale} value={locale} className="flex-1 sm:flex-none">
              <span className="ms-0.5 me-1.5 inline-block size-2 rounded-full bg-brand-red/70" aria-hidden="true" />
              {LOCALE_META[locale].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {LOCALE_KEYS.map((locale) => (
          <TabsContent key={locale} value={locale}>
            <div className="flex flex-col gap-1.5">
              {type === "textarea" ? (
                <Textarea
                  dir={LOCALE_META[locale].dir}
                  rows={rows}
                  value={value[locale]}
                  onChange={(e) => onChange({ ...value, [locale]: e.target.value })}
                  aria-label={`${label} — ${LOCALE_META[locale].label}`}
                  className="rounded-xl"
                />
              ) : (
                <Input
                  dir={LOCALE_META[locale].dir}
                  value={value[locale]}
                  onChange={(e) => onChange({ ...value, [locale]: e.target.value })}
                  aria-label={`${label} — ${LOCALE_META[locale].label}`}
                  className="h-11 rounded-xl"
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

type LocalizedListEditorProps = {
  label: string;
  value: LocalizedText[];
  onChange: (value: LocalizedText[]) => void;
  addLabel?: string;
  maxItems?: number;
};

export function LocalizedListEditor({
  label,
  value,
  onChange,
  addLabel = "افزودن مورد",
  maxItems = 12,
}: LocalizedListEditorProps) {
  const canAdd = value.length < maxItems;

  function updateItem(index: number, locale: LocaleKey, text: string) {
    onChange(
      value.map((item, i) => (i === index ? { ...item, [locale]: text } : item)),
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-bold text-slate-700">{label}</Label>
        <span className="text-xs font-medium text-slate-400">{value.length} مورد</span>
      </div>

      <div className="flex flex-col gap-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-2.5"
          >
            <GripVertical aria-hidden="true" className="size-4 shrink-0 text-slate-300" />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {LOCALE_KEYS.map((locale) => (
                <div key={locale} className="relative">
                  <span className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold uppercase text-slate-400">
                    {locale}
                  </span>
                  <Input
                    dir={LOCALE_META[locale].dir}
                    value={item[locale]}
                    onChange={(e) => updateItem(index, locale, e.target.value)}
                    aria-label={`${label} ${index + 1} — ${LOCALE_META[locale].label}`}
                    className="h-10 rounded-lg ps-8"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`حذف مورد ${index + 1}`}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-brand-red"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canAdd}
        onClick={() => onChange([...value, { ...EMPTY }])}
        className="self-start border-dashed"
      >
        <Plus className="size-4" aria-hidden="true" />
        {addLabel}
      </Button>
    </div>
  );
}
