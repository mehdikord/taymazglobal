import { AccountForm } from "@/components/admin/account/account-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const admin = await requireAdmin();

  return (
    <div>
      <PageHeader
        title="تنظیمات حساب"
        description={`ورود به عنوان ${admin.name}`}
        breadcrumb={[{ label: "حساب" }]}
      />
      <AccountForm />
    </div>
  );
}
