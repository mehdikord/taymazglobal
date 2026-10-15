import { notFound } from "next/navigation";

import { CountryForm } from "@/components/admin/countries/country-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { getCountryAdmin } from "@/lib/repositories/countries.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCountryPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const country = await getCountryAdmin(id);
  if (!country) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش کشور ${country.code}`}
        description={country.name.fa || "به‌روزرسانی اطلاعات کشور"}
        breadcrumb={[{ label: "کشورها", href: "/admins/countries" }, { label: country.code }]}
      />
      <CountryForm defaultValues={country} />
    </div>
  );
}
