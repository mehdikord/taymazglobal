import "server-only";

import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/admin/helpers";
import type { Prisma } from "@/generated/prisma/client";

export type MediaTypeValue = "image" | "video" | "pdf" | "other";

export type MediaAssetRow = {
  id: string;
  type: MediaTypeValue;
  name: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
  folderId: string | null;
  folderName: string | null;
  createdAt: string;
};

export type MediaFolderRow = {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
};

export type MediaImportResult = {
  imported: number;
  skipped: number;
  existing: number;
};

export const UPLOAD_ROOT = () => path.join(process.cwd(), "uploads");

export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  pdf: "application/pdf",
};

export function typeFromMime(mime: string): MediaTypeValue {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf") return "pdf";
  return "other";
}

function typeFromExt(ext: string): MediaTypeValue {
  if (["jpg", "jpeg", "png", "webp", "avif", "gif"].includes(ext)) return "image";
  if (["mp4", "webm"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  return "other";
}

type ListParams = {
  q?: string;
  type?: string;
  folderId?: string;
  page?: number;
  pageSize?: number;
};

export async function listMediaAdmin(params: ListParams = {}): Promise<{
  rows: MediaAssetRow[];
  total: number;
}> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize ?? 24;
  const q = params.q?.trim();

  const where: Prisma.MediaItemWhereInput = {
    AND: [
      q ? { originalName: { contains: q } } : {},
      params.type === "image" || params.type === "video" || params.type === "pdf" || params.type === "other"
        ? { type: params.type as MediaTypeValue }
        : {},
      params.folderId === "uncategorized"
        ? { folderId: null }
        : params.folderId && params.folderId !== "all"
          ? { folderId: BigInt(params.folderId) }
          : {},
    ],
  };

  const [total, items] = await Promise.all([
    prisma.mediaItem.count({ where }),
    prisma.mediaItem.findMany({
      where,
      include: { folder: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const rows: MediaAssetRow[] = items.map((item) => ({
    id: String(item.id),
    type: item.type,
    name: item.originalName,
    path: item.path,
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    folderId: item.folderId != null ? String(item.folderId) : null,
    folderName: item.folder?.name ?? null,
    createdAt: item.createdAt?.toISOString() ?? new Date().toISOString(),
  }));

  return { rows, total };
}

export async function listMediaFoldersAdmin(): Promise<MediaFolderRow[]> {
  const folders = await prisma.mediaFolder.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { items: true } } },
  });
  return folders.map((folder) => ({
    id: String(folder.id),
    name: folder.name,
    slug: folder.slug,
    itemCount: folder._count.items,
  }));
}

export async function createMediaFolderAdmin(name: string): Promise<MediaFolderRow | null> {
  const clean = name.trim();
  if (!clean) return null;
  const baseSlug = slugify(clean) || "folder";
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.mediaFolder.findUnique({ where: { slug } })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
  const folder = await prisma.mediaFolder.create({
    data: { name: clean.slice(0, 255), slug },
  });
  return { id: String(folder.id), name: folder.name, slug: folder.slug, itemCount: 0 };
}

export async function renameMediaFolderAdmin(id: string, name: string): Promise<boolean> {
  const clean = name.trim();
  if (!clean) return false;
  const existing = await prisma.mediaFolder.findUnique({ where: { id: BigInt(id) } });
  if (!existing) return false;
  const baseSlug = slugify(clean) || "folder";
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.mediaFolder.findFirst({ where: { slug, id: { not: BigInt(id) } } })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
  await prisma.mediaFolder.update({ where: { id: BigInt(id) }, data: { name: clean.slice(0, 255), slug } });
  return true;
}

export async function deleteMediaFolderAdmin(id: string): Promise<boolean> {
  const existing = await prisma.mediaFolder.findUnique({ where: { id: BigInt(id) } });
  if (!existing) return false;
  // Items move to "uncategorized" (SetNull) instead of being deleted.
  await prisma.mediaFolder.delete({ where: { id: BigInt(id) } });
  return true;
}

export async function countMediaUsage(pathValue: string): Promise<{
  total: number;
  usages: Array<{ source: string; count: number }>;
}> {
  const [products, portfolio, team] = await Promise.all([
    prisma.productMedia.count({ where: { path: pathValue } }),
    prisma.portfolioGalleryItem.count({ where: { path: pathValue } }),
    prisma.teamMember.count({ where: { imagePath: pathValue } }),
  ]);
  const usages: Array<{ source: string; count: number }> = [];
  if (products) usages.push({ source: "محصولات", count: products });
  if (portfolio) usages.push({ source: "نمونه‌کارها", count: portfolio });
  if (team) usages.push({ source: "اعضای تیم", count: team });
  return { total: products + portfolio + team, usages };
}

export async function deleteMediaItemAdmin(
  id: string,
  options: { force?: boolean } = {},
): Promise<{ ok: boolean; code?: string; usage?: number; usedIn?: string[] }> {
  const item = await prisma.mediaItem.findUnique({ where: { id: BigInt(id) } });
  if (!item) return { ok: false, code: "not_found" };

  const usage = await countMediaUsage(item.path).then((r) => r.total);
  const usageDetails = await countMediaUsage(item.path);
  if (usage > 0 && !options.force) {
    return {
      ok: false,
      code: "in_use",
      usage,
      usedIn: usageDetails.usages.map((u) => u.source),
    };
  }

  await prisma.mediaItem.delete({ where: { id: BigInt(id) } });

  const relative = item.path.replace(/^\/uploads\//, "");
  const filePath = path.join(UPLOAD_ROOT(), relative);
  try {
    await unlink(filePath);
  } catch {
    // File may already be missing — ignore, DB record is the source of truth.
  }

  return { ok: true };
}

export type StoredMediaInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  fileType: MediaTypeValue;
  folderId?: string | null;
  uploadedById?: string | null;
  altText?: string | null;
};

export async function storeMediaFile(input: StoredMediaInput): Promise<MediaAssetRow> {
  const ext = input.originalName.split(".").pop()?.toLowerCase() ?? "";
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext ? `.${ext}` : ""}`;
  const dir = UPLOAD_ROOT();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), input.buffer);

  const url = `/uploads/${filename}`;
  const item = await prisma.mediaItem.create({
    data: {
      type: input.fileType,
      originalName: input.originalName.slice(0, 255),
      filename,
      path: url,
      mimeType: input.mimeType,
      sizeBytes: input.buffer.byteLength,
      altText: input.altText,
      folderId: input.folderId ? BigInt(input.folderId) : null,
      uploadedById: input.uploadedById ? BigInt(input.uploadedById) : null,
    },
    include: { folder: { select: { id: true, name: true } } },
  });

  return {
    id: String(item.id),
    type: item.type,
    name: item.originalName,
    path: item.path,
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    folderId: item.folderId != null ? String(item.folderId) : null,
    folderName: item.folder?.name ?? null,
    createdAt: item.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

async function walkDir(dir: string): Promise<string[]> {
  let results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(await walkDir(full));
    else results.push(full);
  }
  return results;
}

export async function importUploadedFilesAdmin(): Promise<MediaImportResult> {
  const root = UPLOAD_ROOT();
  const existing = new Set((await prisma.mediaItem.findMany({ select: { path: true } })).map((m) => m.path));
  const allFiles = await walkDir(root);

  let imported = 0;
  let skipped = 0;

  for (const filePath of allFiles) {
    const relative = path.relative(root, filePath).split(path.sep).join("/");
    const url = `/uploads/${relative}`;
    if (existing.has(url)) {
      skipped += 1;
      continue;
    }

    const ext = path.extname(filePath).slice(1).toLowerCase();
    const fileType = typeFromExt(ext);
    if (fileType === "other") {
      skipped += 1;
      continue;
    }

    const fileName = path.basename(filePath);
    try {
      const info = await stat(filePath);
      await prisma.mediaItem.create({
        data: {
          type: fileType,
          originalName: fileName.slice(0, 255),
          filename: fileName,
          path: url,
          mimeType: CONTENT_TYPES[ext] ?? "application/octet-stream",
          sizeBytes: info.size,
          altText: null,
          folderId: null,
          uploadedById: null,
        },
      });
      imported += 1;
    } catch {
      skipped += 1;
    }
  }

  return { imported, skipped, existing: existing.size };
}