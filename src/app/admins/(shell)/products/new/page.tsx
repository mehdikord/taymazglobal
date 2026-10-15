import { ProductForm } from "@/components/admin/products/product-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { listCategoryOptions } from "@/lib/repositories/categories.admin";
import { listTagOptions } from "@/lib/repositories/tags.admin";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  const [categoryOptions, tagOptions] = await Promise.all([listCategoryOptions(), listTagOptions()]);

  return (
    <div>
      <PageHeader
        title="افزودن محصول"
        description="محصول را با دسته‌بندی، قیمت‌گذاری، مشخصات و گالری ثبت کنید."
        breadcrumb={[{ label: "محصولات", href: "/admins/products" }, { label: "افزودن محصول" }]}
      />
      <ProductForm categoryOptions={categoryOptions} tagOptions={tagOptions} />
    </div>
  );
}
