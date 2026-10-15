import { NextResponse, type NextRequest } from "next/server";

import { getCurrentAdminProfile } from "@/lib/admin/session";
import { deleteMediaItemAdmin } from "@/lib/repositories/media.admin";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, context: Context) {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { id } = await context.params;
  const force = req.nextUrl.searchParams.get("force") === "1";
  const result = await deleteMediaItemAdmin(id, { force });

  if (!result.ok) {
    if (result.code === "not_found") {
      return NextResponse.json({ ok: false, error: { message: "فایل رسانه پیدا نشد." } }, { status: 404 });
    }
    if (result.code === "in_use") {
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: `این فایل در ${result.usage ?? 0} مورد استفاده شده است و حذف آن باعث شکستن آن بخش‌ها می‌شود.`,
            usage: result.usage,
            usedIn: result.usedIn,
          },
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, error: { message: "حذف ناموفق بود." } }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}