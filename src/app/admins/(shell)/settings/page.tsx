import { SettingsForm } from "@/components/admin/settings/settings-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { getSiteSettings } from "@/lib/repositories/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div>
      <PageHeader
        title="تنظیمات سایت"
        description="اطلاعات تماس، شبکه‌های اجتماعی و معرفی سایت در چهار زبان."
        breadcrumb={[{ label: "تنظیمات" }]}
      />
      <SettingsForm
        defaultValues={{
          name: settings.name,
          tagline: settings.tagline,
          phones: settings.phones.join("\n"),
          emails: settings.emails.join("\n"),
          telegram: settings.social.telegram,
          instagram: settings.social.instagram,
          whatsapp: settings.social.whatsapp,
          linkedin: settings.social.linkedin,
        }}
      />
    </div>
  );
}
