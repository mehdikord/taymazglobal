import { NextResponse, type NextRequest } from "next/server";

import { getCurrentAdminProfile } from "@/lib/admin/session";
import { storeMediaFile, type MediaTypeValue } from "@/lib/repositories/media.admin";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 150 * 1024 * 1024; // 150MB

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

function fileTypeFor(mime: string): MediaTypeValue | null {
  if (IMAGE_TYPES.has(mime)) return "image";
  if (VIDEO_TYPES.has(mime)) return "video";
  if (mime === "application/pdf") return "pdf";
  return null;
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: { message: "درخواست نامعتبر است." } }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: { message: "فایلی انتخاب نشده است." } }, { status: 422 });
  }

  const fileType = fileTypeFor(file.type);
  if (!fileType) {
    return NextResponse.json(
      { ok: false, error: { message: "فرمت فایل پشتیبانی نمی‌شود. فقط تصویر، ویدیو و PDF مجاز است." } },
      { status: 415 },
    );
  }

  const maxSize = fileType === "video" ? MAX_VIDEO_SIZE : fileType === "pdf" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
  const sizeLabel = fileType === "video" ? "۱۵۰ مگابایت" : fileType === "pdf" ? "۲۰ مگابایت" : "۵ مگابایت";
  if (file.size > maxSize) {
    return NextResponse.json(
      { ok: false, error: { message: `حجم فایل نباید بیشتر از ${sizeLabel} باشد.` } },
      { status: 413 },
    );
  }

  const folderId = String(formData.get("mediaFolderId") ?? "").trim() || null;
  const altText = String(formData.get("alt") ?? "").trim() || null;

  const record = await storeMediaFile({
    buffer: Buffer.from(await file.arrayBuffer()),
    originalName: file.name,
    mimeType: file.type,
    fileType,
    folderId,
    uploadedById: String(admin.id),
    altText,
  });

  return NextResponse.json({ ok: true, data: { url: record.path, media: record } });
}