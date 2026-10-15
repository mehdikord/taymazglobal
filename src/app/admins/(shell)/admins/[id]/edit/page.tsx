import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/admins/admin-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const admin = await prisma.admin.findUnique({
    where: { id: BigInt(id) },
    select: { id: true, name: true, phone: true, email: true, isActive: true },
  });
  if (!admin) notFound();

  return (
    <div>
      <PageHeader
        title="ویرایش مدیر"
        description="اطلاعات مدیر را ویرایش کنید."
        breadcrumb={[{ label: "مدیران", href: "/admins/admins" }, { label: "ویرایش مدیر" }]}
      />
      <AdminForm
        editing
        defaultValues={{
          id: String(admin.id),
          name: admin.name,
          phone: admin.phone,
          email: admin.email,
          password: "",
          isActive: admin.isActive,
        }}
      />
    </div>
  );
}
