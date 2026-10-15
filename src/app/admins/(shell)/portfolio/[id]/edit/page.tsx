import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { PortfolioForm } from "@/components/admin/portfolio/portfolio-form";
import { requireAdmin } from "@/lib/admin/guard";
import { listCountryOptions } from "@/lib/repositories/countries.admin";
import { getPortfolioAdmin } from "@/lib/repositories/portfolio.admin";
import { listServiceOptions } from "@/lib/repositories/services.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPortfolioPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const [portfolio, serviceOptions, countryOptions] = await Promise.all([
    getPortfolioAdmin(id),
    listServiceOptions(),
    listCountryOptions(),
  ]);
  if (!portfolio) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش نمونه‌کار ${portfolio.slug}`}
        description={portfolio.title.fa || "به‌روزرسانی اطلاعات نمونه‌کار"}
        breadcrumb={[{ label: "نمونه‌کارها", href: "/admins/portfolio" }, { label: portfolio.slug }]}
      />
      <PortfolioForm defaultValues={portfolio} serviceOptions={serviceOptions} countryOptions={countryOptions} />
    </div>
  );
}
