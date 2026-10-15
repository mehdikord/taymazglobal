import { NextResponse, type NextRequest } from "next/server";

import { getCurrentAdminProfile } from "@/lib/admin/session";
import { createMediaFolderAdmin } from "@/lib/repositories/media.admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  let body: { name?: unknown };
  try {
    body = (await req.json()) as { name?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: { message: "درخواست نامعتبر است." } }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ ok: false, error: { message: "نام پوشه الزامی است." } }, { status: 422 });
  }

  const folder = await createMediaFolderAdmin(name);
  if (!folder) {
    return NextResponse.json({ ok: false, error: { message: "ایجاد پوشه ناموفق بود." } }, { status: 422 });
  }
  return NextResponse.json({ ok: true, data: { folder } });
}