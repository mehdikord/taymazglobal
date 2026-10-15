import { TagForm } from "@/components/admin/tags/tag-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function NewTagPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="افزودن تگ"
        description="اسلاگ یکتا و نام در هر چهار زبان."
        breadcrumb={[{ label: "تگ‌ها", href: "/admins/tags" }, { label: "افزودن تگ" }]}
      />
      <TagForm />
    </div>
  );
}
