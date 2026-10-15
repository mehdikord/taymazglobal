export type MediaItemClient = {
  id: string;
  type: "image" | "video" | "pdf" | "other";
  name: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
  folderId: string | null;
  folderName: string | null;
  createdAt: string;
};

export type MediaFolderClient = {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
};

export type MediaLibraryResponse = {
  ok: boolean;
  data?: {
    items: MediaItemClient[];
    total: number;
    folders: MediaFolderClient[];
  };
  error?: { message?: string };
};

export const MEDIA_TYPE_LABELS: Record<string, string> = {
  image: "تصویر",
  video: "ویدیو",
  pdf: "PDF",
  other: "سایر",
};

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value >= 100 || unit === 0 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[unit]}`;
}

export function fileAcceptFor(type: string): string {
  if (type === "image") return "image/*";
  if (type === "video") return "video/*";
  if (type === "pdf") return "application/pdf";
  return "image/*,video/*,application/pdf";
}

export function buildMediaQuery(params: {
  q?: string;
  type?: string;
  folderId?: string;
  page?: number;
  pageSize?: number;
}): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.type) search.set("type", params.type);
  if (params.folderId) search.set("folderId", params.folderId);
  search.set("page", String(params.page ?? 1));
  search.set("pageSize", String(params.pageSize ?? 24));
  return search.toString();
}

export async function fetchMediaLibrary(query: string): Promise<MediaLibraryResponse> {
  const response = await fetch(`/admins/api/media?${query}`, { cache: "no-store" });
  return (await response.json()) as MediaLibraryResponse;
}

export async function uploadMediaFile(
  file: File,
  options: { mediaFolderId?: string | null; folder?: string } = {},
): Promise<{ url: string; media: MediaItemClient } | { error: string }> {
  const form = new FormData();
  form.append("file", file);
  if (options.folder) form.append("folder", options.folder);
  if (options.mediaFolderId) form.append("mediaFolderId", options.mediaFolderId);

  const response = await fetch("/admins/api/uploads", { method: "POST", body: form });
  const result = (await response.json()) as {
    ok: boolean;
    data?: { url: string; media: MediaItemClient };
    error?: { message?: string };
  };

  if (!response.ok || !result.ok || !result.data) {
    return { error: result.error?.message ?? "آپلود ناموفق بود." };
  }
  return { url: result.data.url, media: result.data.media };
}