import { notFound } from "next/navigation";

import { OfficeForm } from "@/components/admin/offices/office-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { listCountryOptions } from "@/lib/repositories/countries.admin";
import { getOfficeAdmin } from "@/lib/repositories/offices.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditOfficePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const [office, countryOptions] = await Promise.all([getOfficeAdmin(id), listCountryOptions()]);
  if (!office) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش دفتر ${office.city.fa || office.city.en || ""}`.trim()}
        description="به‌روزرسانی اطلاعات دفتر"
        breadcrumb={[{ label: "دفاتر", href: "/admins/offices" }, { label: office.city.fa || "ویرایش" }]}
      />
      <OfficeForm defaultValues={office} countryOptions={countryOptions} />
    </div>
  );
}
