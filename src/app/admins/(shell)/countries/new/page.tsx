import { CountryForm } from "@/components/admin/countries/country-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";

export const dynamic = "force-dynamic";

export default async function NewCountryPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="افزودن کشور"
        description="کد ISO دوبخشی و نام/منطقه در هر چهار زبان."
        breadcrumb={[{ label: "کشورها", href: "/admins/countries" }, { label: "افزودن کشور" }]}
      />
      <CountryForm />
    </div>
  );
}
