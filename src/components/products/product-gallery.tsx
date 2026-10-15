"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { ProductMedia } from "@/types";

type ProductGalleryProps = {
  media: ProductMedia[];
  locale: AppLocale;
  videoLabel: string;
};

export function ProductGallery({ media, locale, videoLabel }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = media[activeIndex] ?? media[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-[var(--shadow-card)]">
        {active.imageUrl ? (
          <Image
            src={active.imageUrl}
            alt={getLocalizedText(active.alt, locale)}
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
        ) : (
          <>
            <div className={cn("absolute inset-0 bg-gradient-to-br", active.gradient)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3),transparent_55%)]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />

        {active.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-xl backdrop-blur-sm">
              <Play aria-hidden="true" className="ms-0.5 size-7 fill-current" />
            </div>
            <span className="sr-only">{videoLabel}</span>
          </div>
        )}

        <div className="absolute bottom-4 start-4 end-4 rounded-xl bg-white/10 p-3 text-sm font-medium text-white backdrop-blur-md">
          {getLocalizedText(active.alt, locale)}
        </div>
      </div>

      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {media.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                index === activeIndex
                  ? "border-brand-red shadow-[0_8px_24px_-8px_rgba(252,20,34,0.5)]"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={getLocalizedText(item.alt, locale)}
              aria-current={index === activeIndex}
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className={cn("absolute inset-0 bg-gradient-to-br", item.gradient)} />
              )}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/20">
                  <Play aria-hidden="true" className="size-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductGalleryPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-dashed bg-surface text-sm text-muted">
      {label}
    </div>
  );
}
