"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type MediaManagerProps = {
  label?: string;
  value: string[];
  onChange: (paths: string[]) => void;
  folder?: string;
  maxItems?: number;
};

export function MediaManager({
  label,
  value,
  onChange,
  maxItems = 10,
}: MediaManagerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const canAdd = value.length < maxItems;

  function handlePicked(paths: string[]) {
    const merged = [...value];
    for (const path of paths) {
      if (merged.includes(path)) continue;
      if (merged.length >= maxItems) {
        toast.warning(`حداکثر ${maxItems} فایل می‌توانید انتخاب کنید.`);
        break;
      }
      merged.push(path);
    }
    if (merged.length !== value.length) onChange(merged);
  }

  function remove(path: string) {
    onChange(value.filter((item) => item !== path));
  }

  return (
    <div className="flex flex-col gap-3">
      {label ? (
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-slate-700">{label}</Label>
          <span className="text-xs font-medium text-slate-400">
            {value.length}/{maxItems}
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((path) => (
          <div
            key={path}
            className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          >
            <Image
              src={path}
              alt="گالری"
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => remove(path)}
              aria-label="حذف تصویر"
              className="absolute end-1.5 top-1.5 grid size-8 place-items-center rounded-lg bg-white/90 text-slate-600 opacity-100 shadow-sm transition hover:bg-red-50 hover:text-brand-red sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}

        {canAdd ? (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-brand-red/40 hover:text-brand-red"
          >
            <div className="flex flex-col items-center gap-1">
              <ImagePlus className="size-5" aria-hidden="true" />
              <span className="text-[11px] font-bold">انتخاب از رسانه</span>
            </div>
          </button>
        ) : null}
      </div>

      {value.length > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onChange([])}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          حذف همه تصاویر
        </Button>
      ) : null}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        mode="multiple"
        seedPaths={value}
        maxItems={maxItems}
        onConfirm={handlePicked}
      />
    </div>
  );
}