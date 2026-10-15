import { AdminForm } from "@/components/admin/admins/admin-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function NewAdminPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="افزودن مدیر"
        description="دسترسی جدید به پنل مدیریت ایجاد کنید."
        breadcrumb={[{ label: "مدیران", href: "/admins/admins" }, { label: "افزودن مدیر" }]}
      />
      <AdminForm />
    </div>
  );
}
