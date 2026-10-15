import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { prisma } from "@/lib/db/prisma";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
} from "./constants";

const secret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? "dev-only-insecure-secret",
  );

export type AdminClaims = { id: string };

export async function createAdminSession(adminId: bigint): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(adminId))
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admins",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admins",
    maxAge: 0,
  });
}

export async function verifyAdminToken(): Promise<AdminClaims | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub) return null;
    return { id: payload.sub };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminClaims | null> {
  return verifyAdminToken();
}

export async function getCurrentAdminProfile() {
  const claims = await verifyAdminToken();
  if (!claims) return null;

  return prisma.admin.findUnique({
    where: { id: BigInt(claims.id) },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      isActive: true,
    },
  });
}
