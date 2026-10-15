"use client";

import { Check, Copy, FileText, Play, Trash2 } from "lucide-react";
import Image from "next/image";

import { MEDIA_TYPE_LABELS, formatBytes, type MediaItemClient } from "@/components/admin/media/helpers";
import { cn } from "@/lib/utils";

type MediaTileProps = {
  item: MediaItemClient;
  selected?: boolean;
  onSelect?: () => void;
  selectable?: boolean;
  onCopy?: () => void;
  onDelete?: () => void;
  className?: string;
};

export function MediaTile({
  item,
  selected = false,
  onSelect,
  selectable = false,
  onCopy,
  onDelete,
  className,
}: MediaTileProps) {
  const isImage = item.type === "image";
  const isVideo = item.type === "video";

  const content = (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {isImage ? (
          <Image
            src={item.path}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 220px"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : isVideo ? (
          <>
            <video
              src={item.path}
              preload="metadata"
              muted
              playsInline
              className="size-full object-cover"
              aria-label={item.name}
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                <Play className="ms-0.5 size-4 fill-current" aria-hidden="true" />
              </span>
            </span>
          </>
        ) : (
          <span className="grid size-full place-items-center bg-slate-50 text-slate-300">
            <FileText className="size-12" aria-hidden="true" />
          </span>
        )}

        <span className="absolute start-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          {MEDIA_TYPE_LABELS[item.type] ?? item.type}
        </span>

        {selectable && selected ? (
          <span className="absolute end-2 top-2 grid size-7 place-items-center rounded-full bg-brand-red text-white shadow-sm">
            <Check className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 px-3 py-2.5">
        <span className="truncate text-xs font-bold text-slate-700" dir="auto">
          {item.name}
        </span>
        <span className="text-[10px] font-medium text-slate-400">{formatBytes(item.sizeBytes)}</span>
      </div>
    </>
  );

  const actions = (
    <span className="absolute end-2 top-2 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
      {onCopy ? (
        <button
          type="button"
          onClick={onCopy}
          aria-label="کپی آدرس فایل"
          className="grid size-8 place-items-center rounded-lg bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-brand-navy"
        >
          <Copy className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          aria-label="حذف فایل"
          className="grid size-8 place-items-center rounded-lg bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-red-50 hover:text-brand-red"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );

  if (selectable) {
    return (
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={item.name}
        className={cn(
          "group relative flex w-full flex-col overflow-hidden rounded-2xl border text-start transition",
          selected
            ? "border-brand-red bg-brand-red/[0.04] shadow-sm"
            : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 transition hover:shadow-sm",
        className,
      )}
    >
      {content}
      {actions}
    </div>
  );
}