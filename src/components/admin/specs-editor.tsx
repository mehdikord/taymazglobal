"use client";

import { Plus, Trash2 } from "lucide-react";

import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import type { LocalizedText } from "@/types";

const EMPTY_LOCALE = { fa: "", en: "", tr: "", ru: "" };

export type SpecRow = {
  label: LocalizedText;
  value: LocalizedText;
};

type SpecsEditorProps = {
  label: string;
  value: SpecRow[];
  onChange: (next: SpecRow[]) => void;
};

export function SpecsEditor({ label, value, onChange }: SpecsEditorProps) {
  function addRow() {
    onChange([...value, { label: { ...EMPTY_LOCALE }, value: { ...EMPTY_LOCALE } }]);
  }

  function removeRow(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<SpecRow>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="size-4" aria-hidden="true" />
          افزودن مشخصات
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
          مشخصاتی ثبت نشده است.
        </p>
      ) : (
        value.map((row, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">مشخصات {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => removeRow(index)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                حذف
              </Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TranslationsEditor label="عنوان" value={row.label} onChange={(label) => updateRow(index, { label })} />
              <TranslationsEditor label="مقدار" value={row.value} onChange={(value) => updateRow(index, { value })} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
