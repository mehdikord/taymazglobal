import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/guard";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  return (
    <AdminShell
      admin={{
        id: admin.id.toString(),
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
      }}
    >
      {children}
    </AdminShell>
  );
}
