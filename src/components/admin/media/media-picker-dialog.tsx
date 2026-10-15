"use client";

import { FolderOpen, ImagePlus, Loader2, SearchX, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  buildMediaQuery,
  fetchMediaLibrary,
  uploadMediaFile,
  type MediaItemClient,
} from "@/components/admin/media/helpers";
import { MediaTile } from "@/components/admin/media/media-tile";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type MediaPickerMode = "single" | "multiple";

type MediaPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: MediaPickerMode;
  seedPaths?: string[];
  maxItems?: number;
  onConfirm: (paths: string[]) => void;
};

const PAGE_SIZE = 24;
const TYPE_OPTIONS = [
  { value: "", label: "همه انواع" },
  { value: "image", label: "تصویر" },
  { value: "video", label: "ویدیو" },
  { value: "pdf", label: "PDF" },
];

export function MediaPickerDialog({
  open,
  onOpenChange,
  mode = "single",
  seedPaths = [],
  maxItems = 1,
  onConfirm,
}: MediaPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <MediaPickerBody
          mode={mode}
          seedPaths={seedPaths}
          maxItems={maxItems}
          onConfirm={onConfirm}
          onOpenChange={onOpenChange}
        />
      ) : null}
    </Dialog>
  );
}

type MediaPickerBodyProps = {
  mode: MediaPickerMode;
  seedPaths: string[];
  maxItems: number;
  onConfirm: (paths: string[]) => void;
  onOpenChange: (open: boolean) => void;
};

function MediaPickerBody({ mode, seedPaths, maxItems, onConfirm, onOpenChange }: MediaPickerBodyProps) {
  const [items, setItems] = useState<MediaItemClient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [folderId, setFolderId] = useState("");
  const [selection, setSelection] = useState<string[]>(() => (mode === "multiple" ? seedPaths : []));
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (next: { page?: number; append?: boolean; each?: { q?: string; type?: string; folderId?: string } } = {}) => {
      const nextPage = next.page ?? 1;
      const query = buildMediaQuery({
        q: next.each?.q ?? q,
        type: next.each?.type ?? type,
        folderId: next.each?.folderId ?? folderId,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });
      const result = await fetchMediaLibrary(query);
      if (!result.ok || !result.data) {
        toast.error(result.error?.message ?? "خطا در دریافت رسانه");
        return;
      }
      setTotal(result.data.total);
      setPage(nextPage);
      setItems((prev) => (next.append ? [...prev, ...result.data!.items] : result.data!.items));
    },
    [q, type, folderId],
  );

  // Initial load — runs once per mount; the body remounts each time the dialog opens,
  // so filters always start fresh.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await fetchMediaLibrary(buildMediaQuery({ page: 1, pageSize: PAGE_SIZE }));
      if (cancelled) return;
      if (!result.ok || !result.data) {
        toast.error(result.error?.message ?? "خطا در دریافت رسانه");
        setLoading(false);
        return;
      }
      setTotal(result.data.total);
      setPage(1);
      setItems(result.data.items);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canAddMore = mode === "multiple" ? selection.length < maxItems : selection.length < 1;

  function toggleSelect(path: string) {
    if (mode === "single") {
      setSelection([path]);
      return;
    }
    setSelection((prev) => {
      if (prev.includes(path)) return prev.filter((p) => p !== path);
      if (prev.length >= maxItems) {
        toast.warning(`حداکثر ${maxItems} فایل می‌توانید انتخاب کنید.`);
        return prev;
      }
      return [...prev, path];
    });
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!canAddMore && mode === "multiple") {
      toast.warning(`حداکثر ${maxItems} فایل می‌توانید انتخاب کنید.`);
      return;
    }

    setUploading(true);
    for (const file of Array.from(files)) {
      if (mode === "multiple" && selection.length >= maxItems) {
        toast.warning(`حداکثر ${maxItems} فایل می‌توانید انتخاب کنید.`);
        break;
      }
      const result = await uploadMediaFile(file, {
        mediaFolderId: folderId === "all" || folderId === "uncategorized" ? null : folderId || null,
      });
      if ("error" in result) {
        toast.error(result.error);
        continue;
      }
      if (mode === "single") {
        setSelection([result.url]);
        toast.success("فایل با موفقیت آپلود شد");
        onConfirm([result.url]);
        onOpenChange(false);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setSelection((prev) =>
        prev.includes(result.url) ? prev : prev.length >= maxItems ? prev : [...prev, result.url],
      );
      toast.success("فایل به رسانه اضافه شد");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    void load({ page: 1, each: { q, type, folderId } });
  }

  function handleConfirm() {
    if (selection.length === 0) return;
    onConfirm(selection);
    onOpenChange(false);
  }

  function handleSearchChange(value: string) {
    setQ(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setLoading(true);
      void load({ page: 1, each: { q: value } }).finally(() => setLoading(false));
    }, 350);
  }

  function changeFilter(patch: { type?: string; folderId?: string }) {
    setLoading(true);
    if (patch.type !== undefined) setType(patch.type);
    if (patch.folderId !== undefined) setFolderId(patch.folderId);
    void load({ page: 1, each: patch }).finally(() => setLoading(false));
  }

  const loadedCount = items.length;
  const hasMore = loadedCount < total;
  const totalLabel = useMemo(() => new Intl.NumberFormat("fa-IR").format(total), [total]);

  return (
    <DialogContent
      closeLabel="بستن"
      className="flex max-h-[min(92vh,58rem)] w-[min(calc(100%_-_1.5rem),68rem)] max-w-none flex-col overflow-hidden p-0"
    >
      <DialogHeader className="border-b border-slate-100 px-5 py-4">
        <DialogTitle>انتخاب از رسانه</DialogTitle>
        <DialogDescription>
          از کتابخانه رسانه انتخاب کنید یا فایل جدیدی آپلود نمایید.
        </DialogDescription>
      </DialogHeader>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1.5">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value || "all"}
                  type="button"
                  onClick={() => changeFilter({ type: option.value })}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-bold transition",
                    type === option.value
                      ? "bg-brand-red text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  value={q}
                  aria-label="جست‌وجو در رسانه"
                  placeholder="جست‌وجو در رسانه…"
                  className="h-10 rounded-xl ps-4"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !canAddMore}
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <UploadCloud className="size-4" aria-hidden="true" />
                )}
                آپلود
              </Button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square animate-pulse rounded-2xl bg-slate-100"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="رسانه‌ای یافت نشد"
              description={
                q || folderId
                  ? "فیلترها یا عبارت جست‌وجو را تغییر دهید."
                  : "هنوز فایلی آپلود نشده است."
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <MediaTile
                  key={item.id}
                  item={item}
                  selectable
                  selected={selection.includes(item.path)}
                  onSelect={() => toggleSelect(item.path)}
                />
              ))}
            </div>
          )}

          {!loading && hasMore ? (
            <div className="mt-5 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loadingMore}
                onClick={() => {
                  setLoadingMore(true);
                  void load({ page: page + 1, append: true }).finally(() => setLoadingMore(false));
                }}
              >
                {loadingMore ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                نمایش بیشتر
              </Button>
            </div>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,application/pdf"
          multiple={mode === "multiple"}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => void handleUpload(e.target.files)}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          {mode === "multiple" ? (
            <span className="truncate text-xs font-bold text-slate-600">
              <span className="tabular-nums">{selection.length}</span> /{" "}
              <span className="tabular-nums">{maxItems}</span> فایل انتخاب شده
            </span>
          ) : (
            <span className="truncate text-xs font-bold text-slate-600">
              {selection.length > 0 ? "یک فایل انتخاب شده است" : "هیچ فایلی انتخاب نشده است"}
            </span>
          )}
          <span className="hidden items-center gap-1 text-xs font-medium text-slate-400 sm:flex">
            <FolderOpen className="size-3.5" aria-hidden="true" />
            {totalLabel} فایل
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={selection.length === 0}
            onClick={handleConfirm}
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            {mode === "multiple"
              ? selection.length > 0
                ? `انتخاب ${selection.length} فایل`
                : "انتخاب"
              : "انتخاب فایل"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}