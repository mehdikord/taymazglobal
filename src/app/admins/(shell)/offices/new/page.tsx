import { OfficeForm } from "@/components/admin/offices/office-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { listCountryOptions } from "@/lib/repositories/countries.admin";

export const dynamic = "force-dynamic";

export default async function NewOfficePage() {
  await requireAdmin();
  const countryOptions = await listCountryOptions();

  return (
    <div>
      <PageHeader
        title="افزودن دفتر"
        description="اطلاعات تماس و آدرس دفتر در چهار زبان."
        breadcrumb={[{ label: "دفاتر", href: "/admins/offices" }, { label: "افزودن دفتر" }]}
      />
      <OfficeForm countryOptions={countryOptions} />
    </div>
  );
}
