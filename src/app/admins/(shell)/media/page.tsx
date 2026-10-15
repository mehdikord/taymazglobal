import { MediaLibrary } from "@/components/admin/media/media-library";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/admin/guard";
import { listMediaAdmin, listMediaFoldersAdmin } from "@/lib/repositories/media.admin";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdmin();

  const [{ rows, total }, folders] = await Promise.all([
    listMediaAdmin({ page: 1, pageSize: 24 }),
    listMediaFoldersAdmin(),
  ]);

  return (
    <div>
      <PageHeader
        title="رسانه"
        description="مدیریت تصاویر، ویدیوها و فایل‌های PDF — کتابخانه مرکزی رسانه برای کل پنل مدیریت."
        breadcrumb={[{ label: "مدیریت محتوا", href: "/admins/dashboard" }, { label: "رسانه" }]}
      />
      <MediaLibrary initialItems={rows} initialFolders={folders} initialTotal={total} />
    </div>
  );
}