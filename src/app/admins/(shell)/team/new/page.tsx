import { TeamMemberForm } from "@/components/admin/team/team-member-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function NewTeamMemberPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="افزودن عضو تیم"
        description="اطلاعات پایه، تصویر و محتوای چهار زبانه."
        breadcrumb={[{ label: "تیم", href: "/admins/team" }, { label: "افزودن عضو" }]}
      />
      <TeamMemberForm />
    </div>
  );
}
