import Link from "next/link";

import { AdminList } from "@/components/admin/admins/admin-list";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listAdmins } from "@/lib/repositories/admins.admin";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const admin = await requireAdmin();
  const admins = await listAdmins();

  return (
    <div>
      <PageHeader
        title="مدیران سیستم"
        description="مدیران دسترسی به پنل را مدیریت کنید."
        breadcrumb={[{ label: "مدیران" }]}
        actions={<Button asChild><Link href="/admins/admins/new">افزودن مدیر</Link></Button>}
      />
      <AdminList admins={admins} currentAdminId={String(admin.id)} />
    </div>
  );
}
