import "server-only";

import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "./constants";
import { getCurrentAdminProfile } from "./session";

export type GuardedAdmin = NonNullable<Awaited<ReturnType<typeof getCurrentAdminProfile>>>;

export async function requireAdmin(): Promise<GuardedAdmin> {
  const admin = await getCurrentAdminProfile();
  if (!admin) redirect(ADMIN_ROUTES.login);
  return admin;
}

export async function requireAdminProfile(): Promise<GuardedAdmin | null> {
  return getCurrentAdminProfile();
}
