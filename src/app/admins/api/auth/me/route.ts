import { NextResponse } from "next/server";

import { getCurrentAdminProfile } from "@/lib/admin/session";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getCurrentAdminProfile();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: { message: "Unauthorized" } },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      admin: {
        id: admin.id.toString(),
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
      },
    },
  });
}
