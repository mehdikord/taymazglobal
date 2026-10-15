import { compare } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";

import { createAdminSession } from "@/lib/admin/session";
import { prisma } from "@/lib/db/prisma";
import { normalizePhone } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { phone?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { message: "درخواست نامعتبر است." } },
      { status: 400 },
    );
  }

  const phone = normalizePhone(String(body.phone ?? "")).trim();
  const password = String(body.password ?? "");

  if (!/^\d{6,}$/.test(phone) || password.length < 4) {
    return NextResponse.json(
      { ok: false, error: { message: "شماره موبایل یا رمز ورود معتبر نیست." } },
      { status: 422 },
    );
  }

  const admin = await prisma.admin.findUnique({ where: { phone } });
  if (!admin || !admin.isActive) {
    return NextResponse.json(
      { ok: false, error: { message: "اطلاعات ورود صحیح نیست." } },
      { status: 401 },
    );
  }

  const passwordValid = await compare(password, admin.password);
  if (!passwordValid) {
    return NextResponse.json(
      { ok: false, error: { message: "اطلاعات ورود صحیح نیست." } },
      { status: 401 },
    );
  }

  await createAdminSession(admin.id);

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
