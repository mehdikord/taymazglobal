import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/products/product-form";
import { requireAdmin } from "@/lib/admin/guard";
import { listCategoryOptions } from "@/lib/repositories/categories.admin";
import { getProductAdmin } from "@/lib/repositories/products.admin";
import { listTagOptions } from "@/lib/repositories/tags.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const [product, categoryOptions, tagOptions] = await Promise.all([
    getProductAdmin(id),
    listCategoryOptions(),
    listTagOptions(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش محصول ${product.slug}`}
        description={product.title.fa || "به‌روزرسانی اطلاعات محصول"}
        breadcrumb={[{ label: "محصولات", href: "/admins/products" }, { label: product.slug }]}
      />
      <ProductForm defaultValues={product} categoryOptions={categoryOptions} tagOptions={tagOptions} />
    </div>
  );
}
