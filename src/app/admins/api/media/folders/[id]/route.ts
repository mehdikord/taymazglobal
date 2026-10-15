import { NextResponse, type NextRequest } from "next/server";

import { getCurrentAdminProfile } from "@/lib/admin/session";
import { deleteMediaFolderAdmin, renameMediaFolderAdmin } from "@/lib/repositories/media.admin";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: Context) {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { id } = await context.params;
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

  const ok = await renameMediaFolderAdmin(id, name);
  if (!ok) {
    return NextResponse.json({ ok: false, error: { message: "پوشه مورد نظر پیدا نشد." } }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, context: Context) {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deleteMediaFolderAdmin(id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: { message: "پوشه مورد نظر پیدا نشد." } }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}