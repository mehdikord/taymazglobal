import { Plus } from "lucide-react";
import Link from "next/link";

import type { ListFilter } from "@/components/admin/admin-list-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ProductsTable } from "@/components/admin/products/products-table";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/guard";
import { listCategoryOptions } from "@/lib/repositories/categories.admin";
import { listProductsAdmin } from "@/lib/repositories/products.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    active?: string;
    featured?: string;
    category?: string;
    type?: string;
    priceType?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;

  const [categories, { rows, total }] = await Promise.all([
    listCategoryOptions(),
    listProductsAdmin({
      q: params.q,
      category: params.category,
      type: params.type,
      priceType: params.priceType,
      active: params.active,
      featured: params.featured,
      page,
    }),
  ]);

  const filters: ListFilter[] = [
    {
      key: "category",
      label: "دسته",
      allLabel: "همه دسته‌ها",
      options: categories,
      value: params.category ?? "all",
    },
    {
      key: "type",
      label: "نوع",
      allLabel: "همه انواع",
      options: [
        { value: "physical", label: "فیزیکی" },
        { value: "service", label: "خدمتی" },
      ],
      value: params.type ?? "all",
    },
    {
      key: "priceType",
      label: "قیمت‌گذاری",
      allLabel: "همه",
      options: [
        { value: "fixed", label: "قیمت ثابت" },
        { value: "range", label: "بازه قیمت" },
        { value: "inquiry", label: "استعلام" },
      ],
      value: params.priceType ?? "all",
    },
    {
      key: "featured",
      label: "ویژه",
      allLabel: "همه",
      options: [
        { value: "featured", label: "فقط ویژه" },
        { value: "regular", label: "عادی" },
      ],
      value: params.featured ?? "all",
    },
    {
      key: "active",
      label: "وضعیت",
      allLabel: "همه وضعیت‌ها",
      options: [
        { value: "active", label: "فعال" },
        { value: "inactive", label: "غیرفعال" },
      ],
      value: params.active ?? "all",
    },
  ];

  return (
    <div>
      <PageHeader
        title="محصولات"
        description="محصولات و خدمات با دسته‌بندی، قیمت‌گذاری، مشخصات و گالری."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "محصولات" }]}
        actions={
          <Link href="/admins/products/new">
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              افزودن محصول
            </Button>
          </Link>
        }
      />
      <ProductsTable rows={rows} total={total} page={page} q={params.q ?? ""} filters={filters} />
    </div>
  );
}
