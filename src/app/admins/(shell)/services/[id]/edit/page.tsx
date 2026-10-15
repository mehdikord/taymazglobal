import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/services/service-form";
import { requireAdmin } from "@/lib/admin/guard";
import { listCountryOptions } from "@/lib/repositories/countries.admin";
import { getServiceAdmin } from "@/lib/repositories/services.admin";
import { listTagOptions } from "@/lib/repositories/tags.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const [service, countryOptions, tagOptions] = await Promise.all([
    getServiceAdmin(id),
    listCountryOptions(),
    listTagOptions(),
  ]);
  if (!service) notFound();

  return (
    <div>
      <PageHeader
        title={`ویرایش خدمت ${service.slug}`}
        description={service.title.fa || "به‌روزرسانی اطلاعات خدمت"}
        breadcrumb={[{ label: "خدمات", href: "/admins/services" }, { label: service.slug }]}
      />
      <ServiceForm defaultValues={service} countryOptions={countryOptions} tagOptions={tagOptions} />
    </div>
  );
}
