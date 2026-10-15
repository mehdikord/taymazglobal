import { CategoryForm } from "@/components/admin/categories/category-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="افزودن دسته‌بندی"
        description="دسته را با ترجمه، گرادیان و رنگ تم ثبت کنید."
        breadcrumb={[{ label: "دسته‌بندی‌ها", href: "/admins/categories" }, { label: "افزودن دسته" }]}
      />
      <CategoryForm />
    </div>
  );
}
