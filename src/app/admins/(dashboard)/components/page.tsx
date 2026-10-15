import { ComponentShowcase } from "@/components/admin/component-showcase";
import { PageHeader } from "@/components/admin/page-header";

export default function AdminComponentsPage() {
  return (
    <div>
      <PageHeader
        title="کامپوننت‌های مشترک"
        description="نمونه زنده کامپوننت‌های فاز ۳ — جدول، بج وضعیت، ویرایشگر ترجمه، آپلود تصویر و دیالوگ تأیید"
        breadcrumb={[{ label: "پیشخوان", href: "/admins/dashboard" }, { label: "کامپوننت‌ها" }]}
      />
      <ComponentShowcase />
    </div>
  );
}
