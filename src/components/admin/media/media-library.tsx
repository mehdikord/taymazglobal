"use client";

import {
  FolderInput,
  FolderPlus,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  SearchX,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import {
  buildMediaQuery,
  fetchMediaLibrary,
  MEDIA_TYPE_LABELS,
  uploadMediaFile,
  type MediaFolderClient,
  type MediaItemClient,
} from "@/components/admin/media/helpers";
import { MediaTile } from "@/components/admin/media/media-tile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type MediaLibraryProps = {
  initialItems: MediaItemClient[];
  initialFolders: MediaFolderClient[];
  initialTotal: number;
};

const PAGE_SIZE = 24;

export function MediaLibrary({ initialItems, initialFolders, initialTotal }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItemClient[]>(initialItems);
  const [folders, setFolders] = useState<MediaFolderClient[]>(initialFolders);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [folderId, setFolderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [folderDialog, setFolderDialog] = useState<{ open: boolean; id?: string; name: string }>({
    open: false,
    name: "",
  });
  const [deleteFolder, setDeleteFolder] = useState<MediaFolderClient | null>(null);
  const [deleteItem, setDeleteItem] = useState<MediaItemClient | null>(null);
  const [deleteItemUsage, setDeleteItemUsage] = useState<{ usage: number; usedIn: string[] } | null>(null);

  const reload = useCallback(
    async (opts: { page?: number; append?: boolean; patch?: { q?: string; type?: string; folderId?: string } } = {}) => {
      const nextPage = opts.page ?? 1;
      const query = buildMediaQuery({
        q: opts.patch?.q ?? q,
        type: opts.patch?.type ?? type,
        folderId: opts.patch?.folderId ?? folderId,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });
      const result = await fetchMediaLibrary(query);
      if (!result.ok || !result.data) {
        toast.error(result.error?.message ?? "خطا در دریافت رسانه");
        return;
      }
      setFolders(result.data.folders);
      setTotal(result.data.total);
      setPage(nextPage);
      setItems((prev) => (opts.append ? [...prev, ...result.data!.items] : result.data!.items));
    },
    [q, type, folderId],
  );

  function changeFilter(patch: { q?: string; type?: string; folderId?: string }) {
    setLoading(true);
    if (patch.q !== undefined) setQ(patch.q);
    if (patch.type !== undefined) setType(patch.type);
    if (patch.folderId !== undefined) setFolderId(patch.folderId);
    void reload({ page: 1, patch }).finally(() => setLoading(false));
  }

  function handleSearchChange(value: string) {
    setQ(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setLoading(true);
      void reload({ page: 1, patch: { q: value } }).finally(() => setLoading(false));
    }, 350);
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const result = await uploadMediaFile(file, {
        mediaFolderId: folderId === "all" || folderId === "uncategorized" ? null : folderId || null,
      });
      if ("error" in result) {
        toast.error(`${file.name}: ${result.error}`);
      } else {
        ok += 1;
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (ok > 0) {
      toast.success(`${ok} فایل با موفقیت آپلود شد`);
      setLoading(true);
      void reload({ page: 1 }).finally(() => setLoading(false));
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const response = await fetch("/admins/api/media/import", { method: "POST" });
      const result = (await response.json()) as {
        ok: boolean;
        data?: { imported: number; skipped: number; existing: number };
        error?: { message?: string };
      };
      if (!response.ok || !result.ok) {
        toast.error(result.error?.message ?? "همگام‌سازی ناموفق بود.");
        return;
      }
      const persian = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
      toast.success(
        `${persian(result.data!.imported)} فایل جدید وارد کتابخانه شد. ${persian(result.data!.existing)} فایل از قبل موجود بود.`,
      );
      setLoading(true);
      void reload({ page: 1 }).finally(() => setLoading(false));
    } catch {
      toast.error("خطا در همگام‌سازی فایل‌ها");
    } finally {
      setImporting(false);
    }
  }

  async function submitFolder() {
    const name = folderDialog.name.trim();
    if (!name) return;
    const isEdit = Boolean(folderDialog.id);
    try {
      const response = await fetch(
        isEdit ? `/admins/api/media/folders/${folderDialog.id}` : "/admins/api/media/folders",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        },
      );
      const result = (await response.json()) as { ok: boolean; error?: { message?: string } };
      if (!response.ok || !result.ok) {
        toast.error(result.error?.message ?? "عملیات پوشه ناموفق بود.");
        return;
      }
      toast.success(isEdit ? "پوشه به‌روزرسانی شد" : "پوشه ایجاد شد");
      setFolderDialog({ open: false, name: "" });
      const res = await fetchMediaLibrary(buildMediaQuery({ q, type, folderId, page, pageSize: PAGE_SIZE }));
      if (res.data) {
        setFolders(res.data.folders);
      }
    } catch {
      toast.error("خطا در عملیات پوشه");
    }
  }

  function openDeleteItem(item: MediaItemClient) {
    setDeleteItem(item);
    setDeleteItemUsage(null);
  }

  async function confirmDeleteItem(force = false) {
    if (!deleteItem) return;
    try {
      const response = await fetch(
        `/admins/api/media/${deleteItem.id}${force ? "?force=1" : ""}`,
        { method: "DELETE" },
      );
      const result = (await response.json()) as {
        ok: boolean;
        error?: { message?: string; usage?: number; usedIn?: string[] };
      };
      if (!response.ok || !result.ok) {
        if (response.status === 409 && result.error) {
          setDeleteItemUsage({
            usage: result.error.usage ?? 0,
            usedIn: result.error.usedIn ?? [],
          });
          return;
        }
        toast.error(result.error?.message ?? "حذف فایل ناموفق بود.");
        return;
      }
      toast.success("فایل حذف شد");
      setDeleteItem(null);
      setDeleteItemUsage(null);
      setLoading(true);
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      void reload({ page: nextPage }).finally(() => setLoading(false));
    } catch {
      toast.error("خطا در حذف فایل");
    }
  }

  async function confirmDeleteFolder() {
    if (!deleteFolder) return;
    try {
      const response = await fetch(`/admins/api/media/folders/${deleteFolder.id}`, { method: "DELETE" });
      const result = (await response.json()) as { ok: boolean; error?: { message?: string } };
      if (!response.ok || !result.ok) {
        toast.error(result.error?.message ?? "حذف پوشه ناموفق بود.");
        return;
      }
      toast.success("پوشه حذف شد");
      setDeleteFolder(null);
      if (folderId === deleteFolder.id) setFolderId("");
      const res = await fetchMediaLibrary(buildMediaQuery({ q, type, folderId: folderId === deleteFolder.id ? "" : folderId, page: 1, pageSize: PAGE_SIZE }));
      if (res.data) {
        setFolders(res.data.folders);
        setItems(res.data.items);
        setTotal(res.data.total);
        setPage(1);
      }
    } catch {
      toast.error("خطا در حذف پوشه");
    }
  }

  async function copyUrl(path: string) {
    try {
      await navigator.clipboard.writeText(path);
      toast.success("آدرس فایل کپی شد");
    } catch {
      toast.error("کپی آدرس ممکن نشد");
    }
  }

  const hasMore = items.length < total;
  const totalLabel = new Intl.NumberFormat("fa-IR").format(total);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="scrollbar-none -mx-1 flex max-w-full items-center gap-1.5 overflow-x-auto px-1 pb-0.5">
            <FolderChip active={folderId === ""} label="همه" onClick={() => changeFilter({ folderId: "" })} />
            <FolderChip
              active={folderId === "uncategorized"}
              label="بدون پوشه"
              onClick={() => changeFilter({ folderId: "uncategorized" })}
            />
            {folders.map((folder) => {
              const isActive = folderId === folder.id;
              if (isActive) {
                return (
                  <div
                    key={folder.id}
                    className="flex h-9 shrink-0 items-center gap-1 rounded-full border border-brand-red bg-brand-red py-1 pe-1 ps-3 text-xs font-bold text-white shadow-sm"
                  >
                    <FolderInput className="size-3.5" aria-hidden="true" />
                    <span className="max-w-32 truncate">{folder.name}</span>
                    <span className="rounded-full bg-white/20 px-1.5 text-[10px] tabular-nums">
                      {new Intl.NumberFormat("fa-IR").format(folder.itemCount)}
                    </span>
                    <button
                      type="button"
                      aria-label="ویرایش پوشه"
                      className="grid size-6 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
                      onClick={() => setFolderDialog({ open: true, id: folder.id, name: folder.name })}
                    >
                      <Pencil className="size-3" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="حذف پوشه"
                      className="grid size-6 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
                      onClick={() => setDeleteFolder(folder)}
                    >
                      <Trash2 className="size-3" aria-hidden="true" />
                    </button>
                  </div>
                );
              }
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => changeFilter({ folderId: folder.id })}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <FolderInput className="size-3.5" aria-hidden="true" />
                  <span className="max-w-32 truncate">{folder.name}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 text-[10px] tabular-nums">
                    {new Intl.NumberFormat("fa-IR").format(folder.itemCount)}
                  </span>
                </button>
              );
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 shrink-0 rounded-full"
              onClick={() => setFolderDialog({ open: true, name: "" })}
            >
              <FolderPlus className="size-3.5" aria-hidden="true" />
              پوشه جدید
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="search"
            value={q}
            aria-label="جست‌وجو در رسانه"
            placeholder="جست‌وجو در رسانه…"
            className="h-10 w-full rounded-xl sm:max-w-xs"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Select
              aria-label="فیلتر نوع فایل"
              className="h-10 w-auto min-w-36"
              value={type}
              onChange={(e) => changeFilter({ type: e.target.value })}
            >
              <option value="">همه انواع</option>
              {Object.entries(MEDIA_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <UploadCloud className="size-4" aria-hidden="true" />
              )}
              {uploading ? "در حال آپلود…" : "آپلود فایل"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => void handleImport()}
              disabled={importing}
              title="ورود فایل‌های آپلود شده پیش از این و فایل‌های موجود در پوشه uploads"
            >
              {importing ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="size-4" aria-hidden="true" />
              )}
              همگام‌سازی
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        multiple
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => void handleUpload(e.target.files)}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          {totalLabel} فایل در کتابخانه
        </p>
      </div>

      <div className="relative">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100" aria-hidden="true" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <EmptyState
              icon={SearchX}
              title="رسانه‌ای یافت نشد"
              description={
                q || type || folderId
                  ? "فیلترها یا عبارت جست‌وجو را تغییر دهید."
                  : "هنوز فایلی آپلود نشده است. اولین فایل را آپلود کنید."
              }
              action={
                items.length === 0 && !q && !type && !folderId ? (
                  <Button type="button" onClick={() => fileInputRef.current?.click()}>
                    <Plus className="size-4" aria-hidden="true" />
                    آپلود اولین فایل
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => (
              <MediaTile
                key={item.id}
                item={item}
                onCopy={() => void copyUrl(item.path)}
                onDelete={() => openDeleteItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {!loading && hasMore ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loadingMore}
            onClick={() => {
              setLoadingMore(true);
              void reload({ page: page + 1, append: true }).finally(() => setLoadingMore(false));
            }}
          >
            {loadingMore ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            نمایش بیشتر
          </Button>
        </div>
      ) : null}

      <Dialog
        open={folderDialog.open}
        onOpenChange={(open) => setFolderDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent closeLabel="بستن" className="max-w-md">
          <DialogHeader>
            <DialogTitle>{folderDialog.id ? "ویرایش پوشه" : "پوشه جدید"}</DialogTitle>
            <DialogDescription>
              فایل‌های رسانه را می‌توانید در پوشه‌ها سازماندهی کنید.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor="folder-name">نام پوشه</Label>
            <Input
              id="folder-name"
              value={folderDialog.name}
              onChange={(e) => setFolderDialog((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="مثلاً: تصاویر محصولات"
              onKeyDown={(e) => {
                if (e.key === "Enter") void submitFolder();
              }}
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setFolderDialog({ open: false, name: "" })}>
              انصراف
            </Button>
            <Button onClick={() => void submitFolder()}>
              {folderDialog.id ? "ذخیره تغییرات" : "ایجاد پوشه"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteFolder)}
        onOpenChange={(open) => {
          if (!open) setDeleteFolder(null);
        }}
        title="حذف پوشه"
        description={
          deleteFolder && deleteFolder.itemCount > 0
            ? `پوشه «${deleteFolder.name}» شامل ${new Intl.NumberFormat("fa-IR").format(deleteFolder.itemCount)} فایل است. با حذف، فایل‌ها به «بدون پوشه» منتقل می‌شوند و حذف نمی‌شوند.`
            : `پوشه «${deleteFolder?.name ?? ""}» حذف شود؟`
        }
        confirmLabel="حذف پوشه"
        onConfirm={confirmDeleteFolder}
      />

      <ConfirmDialog
        open={Boolean(deleteItem)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItem(null);
            setDeleteItemUsage(null);
          }
        }}
        title="حذف فایل رسانه"
        description={
          deleteItemUsage
            ? `این فایل در ${new Intl.NumberFormat("fa-IR").format(deleteItemUsage.usage)} مورد استفاده شده است (${deleteItemUsage.usedIn.join("، ")}). برای حذف، دوباره تأیید کنید.`
            : `فایل «${deleteItem?.name ?? ""}» برای همیشه حذف شود؟`
        }
        confirmLabel={deleteItemUsage ? "حذف با وجود استفاده" : "حذف فایل"}
        onConfirm={() => confirmDeleteItem(Boolean(deleteItemUsage))}
      />
    </div>
  );
}

function FolderChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9 shrink-0 items-center rounded-full border px-3 text-xs font-bold transition",
        active
          ? "border-brand-red bg-brand-red text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      {label}
    </button>
  );
}