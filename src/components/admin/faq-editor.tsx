"use client";

import { Plus, Trash2 } from "lucide-react";

import { TranslationsEditor } from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/types";

const EMPTY_LOCALE = { fa: "", en: "", tr: "", ru: "" };

type FaqEditorProps = {
  label: string;
  value: FaqItem[];
  onChange: (next: FaqItem[]) => void;
};

export function FaqEditor({ label, value, onChange }: FaqEditorProps) {
  function addItem() {
    onChange([...value, { question: { ...EMPTY_LOCALE }, answer: { ...EMPTY_LOCALE } }]);
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function updateItem(index: number, patch: Partial<FaqItem>) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="size-4" aria-hidden="true" />
          افزودن پرسش
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
          پرسش و پاسخی ثبت نشده است.
        </p>
      ) : (
        value.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">پرسش {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                حذف
              </Button>
            </div>
            <TranslationsEditor
              label="پرسش"
              value={item.question}
              onChange={(question) => updateItem(index, { question })}
            />
            <TranslationsEditor
              label="پاسخ"
              type="textarea"
              rows={3}
              value={item.answer}
              onChange={(answer) => updateItem(index, { answer })}
            />
          </div>
        ))
      )}
    </div>
  );
}
