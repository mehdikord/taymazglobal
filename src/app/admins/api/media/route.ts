import { NextResponse, type NextRequest } from "next/server";

import { getCurrentAdminProfile } from "@/lib/admin/session";
import { listMediaAdmin, listMediaFoldersAdmin } from "@/lib/repositories/media.admin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const { rows, total } = await listMediaAdmin({
    q: searchParams.get("q") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    folderId: searchParams.get("folderId") ?? undefined,
    page: Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
    pageSize: Number.parseInt(searchParams.get("pageSize") ?? "24", 10) || 24,
  });
  const folders = await listMediaFoldersAdmin();

  return NextResponse.json({ ok: true, data: { items: rows, total, folders } });
}