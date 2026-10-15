import Link from "next/link";

import type { ListFilter } from "@/components/admin/admin-list-shell";
import { ContactMessagesTable } from "@/components/admin/leads/contact-messages-table";
import { ServiceInquiriesTable } from "@/components/admin/leads/service-inquiries-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { CONTACT_TYPE_LABELS, LEAD_STATUS_LABELS } from "@/lib/admin/helpers";
import { listContactMessagesAdmin, listServiceInquiriesAdmin } from "@/lib/repositories/leads.admin";
import { listServiceOptions } from "@/lib/repositories/services.admin";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
    type?: string;
    service?: string;
    tab?: string;
  }>;
};

const TABS = [
  { key: "contact", label: "پیام‌های تماس" },
  { key: "inquiry", label: "درخواست‌های استعلام" },
];

export default async function LeadsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const page = Number.parseInt(params.page ?? "", 10) || 1;
  const tab = params.tab === "inquiry" ? "inquiry" : "contact";
  const services = await listServiceOptions();

  const [contacts, inquiries] = await Promise.all([
    listContactMessagesAdmin({ q: params.q, status: params.status, type: params.type, page }),
    listServiceInquiriesAdmin({ q: params.q, status: params.status, service: params.service, page }),
  ]);

  const contactFilters: ListFilter[] = [
    {
      key: "status",
      label: "وضعیت",
      allLabel: "همه وضعیت‌ها",
      options: Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({ value, label })),
      value: params.status ?? "all",
    },
    {
      key: "type",
      label: "نوع",
      allLabel: "همه انواع",
      options: Object.entries(CONTACT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
      value: params.type ?? "all",
    },
  ];

  const inquiryFilters: ListFilter[] = [
    {
      key: "status",
      label: "وضعیت",
      allLabel: "همه وضعیت‌ها",
      options: Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({ value, label })),
      value: params.status ?? "all",
    },
    {
      key: "service",
      label: "خدمت",
      allLabel: "همه خدمات",
      options: services,
      value: params.service ?? "all",
    },
  ];

  return (
    <div>
      <PageHeader
        title="لیدها"
        description="پیام‌های تماس و درخواست‌های استعلام مشتریان."
        breadcrumb={[{ label: "مدیریت فروش", href: "/admins/dashboard" }, { label: "لیدها" }]}
      />

      <div className="mb-6 flex gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
        {TABS.map((item) => (
          <Link
            key={item.key}
            href={item.key === "contact" ? "/admins/leads?tab=contact" : "/admins/leads?tab=inquiry"}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-center text-sm font-bold transition-colors",
              tab === item.key ? "bg-brand-navy text-white" : "text-slate-500 hover:bg-slate-50",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {tab === "contact" ? (
        <ContactMessagesTable
          rows={contacts.rows}
          total={contacts.total}
          page={page}
          q={params.q ?? ""}
          filters={contactFilters}
        />
      ) : (
        <ServiceInquiriesTable
          rows={inquiries.rows}
          total={inquiries.total}
          page={page}
          q={params.q ?? ""}
          filters={inquiryFilters}
        />
      )}
    </div>
  );
}
