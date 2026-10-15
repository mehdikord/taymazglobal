import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/categories/category-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { getCategoryAdmin } from "@/lib/repositories/categories.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const category = await getCategoryAdmin(id);
  if (!category) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش دسته ${category.slug}`}
        description={category.title.fa || "به‌روزرسانی اطلاعات دسته"}
        breadcrumb={[{ label: "دسته‌بندی‌ها", href: "/admins/categories" }, { label: category.slug }]}
      />
      <CategoryForm defaultValues={category} />
    </div>
  );
}
