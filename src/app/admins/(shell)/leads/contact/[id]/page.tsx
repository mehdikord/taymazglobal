import { notFound } from "next/navigation";

import { LeadStatusChanger } from "@/components/admin/leads/lead-status-changer";
import { PageHeader } from "@/components/admin/page-header";
import { updateContactMessageStatus } from "@/app/admins/(shell)/leads/actions";
import { requireAdmin } from "@/lib/admin/guard";
import { CONTACT_TYPE_LABELS, formatDateFa, LEAD_STATUS_LABELS } from "@/lib/admin/helpers";
import { getContactMessageAdmin } from "@/lib/repositories/leads.admin";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-800" dir="auto">
        {value}
      </span>
    </div>
  );
}

export default async function ContactMessageDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const lead = await getContactMessageAdmin(id);
  if (!lead) notFound();

  return (
    <div>
      <PageHeader
        title={lead.subject}
        description={lead.name}
        breadcrumb={[{ label: "لیدها", href: "/admins/leads" }, { label: "پیام تماس" }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-extrabold text-slate-900">متن پیام</h2>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {lead.message}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-extrabold text-slate-900">تغییر وضعیت</h2>
            <LeadStatusChanger leadId={lead.id} currentStatus={lead.status} action={updateContactMessageStatus} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-base font-extrabold text-slate-900">اطلاعات فرستنده</h2>
          <div className="divide-y divide-slate-100">
            <InfoRow label="نام" value={lead.name} />
            <InfoRow label="ایمیل" value={lead.email ?? "—"} />
            <InfoRow label="تلفن" value={lead.phone ?? "—"} />
            <InfoRow label="نوع پیام" value={CONTACT_TYPE_LABELS[lead.type]} />
            <InfoRow label="وضعیت" value={LEAD_STATUS_LABELS[lead.status]} />
            <InfoRow label="تاریخ" value={formatDateFa(lead.createdAt)} />
            <InfoRow label="موظف" value={lead.assignedAdminName ?? "—"} />
          </div>
        </div>
      </div>
    </div>
  );
}
