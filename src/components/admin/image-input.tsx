"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ImageInputProps = {
  label?: string;
  value: string | null;
  onChange: (path: string | null) => void;
  folder?: string;
  aspectClass?: string;
};

export function ImageInput({
  label,
  value,
  onChange,
  aspectClass = "aspect-video",
}: ImageInputProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label ? <Label className="text-sm font-bold text-slate-700">{label}</Label> : null}

      <div
        className={`relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 ${aspectClass}`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label ?? "تصویر"}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="حذف تصویر"
              className="absolute end-2 top-2 grid size-9 place-items-center rounded-xl bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-brand-red"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-label="تغییر تصویر"
              className="absolute bottom-2 start-2 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-brand-navy"
            >
              تغییر
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex size-full flex-col items-center justify-center gap-2 text-slate-400 transition hover:text-brand-navy"
          >
            <ImagePlus className="size-6" aria-hidden="true" />
            <span className="text-xs font-bold">انتخاب تصویر</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
          <ImagePlus className="size-4" aria-hidden="true" />
          انتخاب از رسانه
        </Button>
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        mode="single"
        seedPaths={value ? [value] : []}
        onConfirm={(paths) => {
          const next = paths[0] ?? null;
          onChange(next);
          if (next) toast.success("تصویر انتخاب شد");
        }}
      />
    </div>
  );
}