"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { PortfolioGalleryItem } from "@/types";

type PortfolioGalleryProps = {
  gallery: PortfolioGalleryItem[];
  locale: AppLocale;
  closeLabel: string;
  openLabel: string;
};

export function PortfolioGallery({ gallery, locale, closeLabel, openLabel }: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const active = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  const goPrev = () =>
    setLightboxIndex((index) => (index === null ? null : (index - 1 + gallery.length) % gallery.length));
  const goNext = () =>
    setLightboxIndex((index) => (index === null ? null : (index + 1) % gallery.length));

  if (gallery.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {gallery.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/80 bg-[#f1f3f5] shadow-[var(--shadow-soft)] focus-visible:outline-3 focus-visible:outline-brand-red"
            aria-label={`${openLabel}: ${getLocalizedText(item.alt, locale)}`}
          >
            <GalleryVisual
              item={item}
              locale={locale}
              sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 100vw"
              className="transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-brand-navy/0 transition-colors group-hover:bg-brand-navy/30">
              <span className="grid size-11 scale-75 place-items-center rounded-full bg-white/90 text-brand-navy opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100">
                <ZoomIn aria-hidden="true" className="size-5" />
              </span>
            </div>

            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy-dark/90 to-transparent p-3.5 pt-6 text-start text-sm font-medium text-white">
              {getLocalizedText(item.alt, locale)}
            </p>
          </button>
        ))}
      </div>

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent
          closeLabel={closeLabel}
          className="!w-[min(calc(100vw_-_2rem),60rem)] !max-w-none !max-h-[calc(100vh_-_2rem)] overflow-hidden !rounded-3xl border-0 bg-brand-navy-dark/95 p-0"
        >
          <DialogTitle className="sr-only">{active ? getLocalizedText(active.alt, locale) : openLabel}</DialogTitle>
          {active && (
            <div className="flex max-h-[calc(100vh_-_2rem)] flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 pe-16">
                <p className="truncate text-sm font-medium text-white">{getLocalizedText(active.alt, locale)}</p>
                <span className="shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-black tracking-widest text-white">
                  {(lightboxIndex ?? 0) + 1} / {gallery.length}
                </span>
              </div>

              <div className="relative min-h-[40vh] w-full flex-1">
                {active.imageUrl ? (
                  <Image
                    src={active.imageUrl}
                    alt={getLocalizedText(active.alt, locale)}
                    fill
                    sizes="(min-width: 960px) 960px, 100vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="absolute inset-0">
                    <div className={cn("absolute inset-0 bg-gradient-to-br", active.gradient)} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.25),transparent_55%)]" />
                    <div className="portfolio-card-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
                  </div>
                )}

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute start-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-xl bg-white/90 text-brand-navy shadow-lg hover:bg-white"
                      aria-label="Previous"
                    >
                      <ChevronLeft aria-hidden="true" className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute end-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-xl bg-white/90 text-brand-navy shadow-lg hover:bg-white"
                      aria-label="Next"
                    >
                      <ChevronRight aria-hidden="true" className="size-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryVisual({
  item,
  locale,
  sizes,
  className,
}: {
  item: PortfolioGalleryItem;
  locale: AppLocale;
  sizes: string;
  className?: string;
}) {
  if (item.imageUrl) {
    return (
      <Image
        src={item.imageUrl}
        alt={getLocalizedText(item.alt, locale)}
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <>
      <div className={cn("absolute inset-0 bg-gradient-to-br", item.gradient, className)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.25),transparent_55%)]" />
      <div className="portfolio-card-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
    </>
  );
}
