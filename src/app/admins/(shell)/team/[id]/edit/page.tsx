import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { TeamMemberForm } from "@/components/admin/team/team-member-form";
import { requireAdmin } from "@/lib/admin/guard";
import { getTeamMemberAdmin } from "@/lib/repositories/team.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTeamMemberPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const member = await getTeamMemberAdmin(id);
  if (!member) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش ${member.name.fa || member.name.en || "عضو تیم"}`}
        description={member.role.fa || "به‌روزرسانی اطلاعات عضو"}
        breadcrumb={[{ label: "تیم", href: "/admins/team" }, { label: member.name.fa || "ویرایش" }]}
      />
      <TeamMemberForm defaultValues={member} />
    </div>
  );
}
