import { NextResponse } from "next/server";

import { getCurrentAdminProfile } from "@/lib/admin/session";
import { importUploadedFilesAdmin } from "@/lib/repositories/media.admin";

export const runtime = "nodejs";

export async function POST() {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const result = await importUploadedFilesAdmin();
  return NextResponse.json({ ok: true, data: result });
}