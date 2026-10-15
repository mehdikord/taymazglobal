import { PageHeader } from "@/components/admin/page-header";
import { PortfolioForm } from "@/components/admin/portfolio/portfolio-form";
import { requireAdmin } from "@/lib/admin/guard";
import { listCountryOptions } from "@/lib/repositories/countries.admin";
import { listServiceOptions } from "@/lib/repositories/services.admin";

export const dynamic = "force-dynamic";

export default async function NewPortfolioPage() {
  await requireAdmin();
  const [serviceOptions, countryOptions] = await Promise.all([listServiceOptions(), listCountryOptions()]);

  return (
    <div>
      <PageHeader
        title="افزودن نمونه‌کار"
        description="نمونه‌کار را با خدمت، کشور، شاخص‌ها و گالری ثبت کنید."
        breadcrumb={[{ label: "نمونه‌کارها", href: "/admins/portfolio" }, { label: "افزودن نمونه‌کار" }]}
      />
      <PortfolioForm serviceOptions={serviceOptions} countryOptions={countryOptions} />
    </div>
  );
}
