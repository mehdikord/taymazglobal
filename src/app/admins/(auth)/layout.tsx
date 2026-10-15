import { redirect } from "next/navigation";

import { ADMIN_ROUTES } from "@/lib/admin/constants";
import { getCurrentAdmin } from "@/lib/admin/session";

export default async function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await getCurrentAdmin();
  if (admin) redirect(ADMIN_ROUTES.dashboard);

  return children;
}
