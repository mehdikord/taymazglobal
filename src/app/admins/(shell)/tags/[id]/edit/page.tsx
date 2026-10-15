import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { TagForm } from "@/components/admin/tags/tag-form";
import { requireAdmin } from "@/lib/admin/guard";
import { getTagAdmin } from "@/lib/repositories/tags.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTagPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const tag = await getTagAdmin(id);
  if (!tag) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش تگ ${tag.slug}`}
        description={tag.name.fa || "به‌روزرسانی اطلاعات تگ"}
        breadcrumb={[{ label: "تگ‌ها", href: "/admins/tags" }, { label: tag.slug }]}
      />
      <TagForm defaultValues={tag} />
    </div>
  );
}
