import { ServiceForm } from "@/components/admin/services/service-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { listCountryOptions } from "@/lib/repositories/countries.admin";
import { listTagOptions } from "@/lib/repositories/tags.admin";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  await requireAdmin();
  const [countryOptions, tagOptions] = await Promise.all([listCountryOptions(), listTagOptions()]);

  return (
    <div>
      <PageHeader
        title="افزودن خدمت"
        description="خدمت را با ترجمه چهار زبانه، کشورها و تگ‌ها ثبت کنید."
        breadcrumb={[{ label: "خدمات", href: "/admins/services" }, { label: "افزودن خدمت" }]}
      />
      <ServiceForm countryOptions={countryOptions} tagOptions={tagOptions} />
    </div>
  );
}
