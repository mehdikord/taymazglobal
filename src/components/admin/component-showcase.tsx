"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { DataTableColumn } from "@/components/admin/data-table";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { FilterBar } from "@/components/admin/filter-bar";
import { ImageInput } from "@/components/admin/image-input";
import { MediaManager } from "@/components/admin/media-manager";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  LocalizedListEditor,
  TranslationsEditor,
} from "@/components/admin/translations-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { LocalizedText } from "@/types";

type DemoRow = {
  id: string;
  title: string;
  category: string;
  status: string;
  price: string;
};

const CATEGORIES = ["مصالح ساختمانی", "مواد غذایی", "ماشین‌آلات"];

const SAMPLE_ROWS: DemoRow[] = Array.from({ length: 42 }, (_, index) => ({
  id: `demo-${index + 1}`,
  title: ["لوله فولادی صنعتی", "سیمان پرتلند", "آرد گندم", "دستگاه بسته‌بندی"][index % 4],
  category: CATEGORIES[index % CATEGORIES.length],
  status: ["active", "inactive", "new", "in_transit", "completed"][index % 5],
  price: `${(index % 90) + 10}.۰`,
}));

const STATUS_TONES: Array<{ status: string; label: string }> = [
  { status: "completed", label: "تکمیل‌شده" },
  { status: "in_transit", label: "در حال ارسال" },
  { status: "pending_approval", label: "در انتظار تأیید" },
  { status: "cancelled", label: "لغوشده" },
  { status: "active", label: "فعال" },
  { status: "inactive", label: "غیرفعال" },
  { status: "new", label: "جدید" },
  { status: "closed", label: "بسته‌شده" },
];

const EMPTY_TEXT: LocalizedText = { fa: "", en: "", tr: "", ru: "" };

export function ComponentShowcase() {
  const [rows] = useState<DemoRow[]>(SAMPLE_ROWS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DemoRow | null>(null);

  const [singleText, setSingleText] = useState<LocalizedText>({
    fa: "مشاوره صادرات",
    en: "Export consulting",
    tr: "İhracat danışmanlığı",
    ru: "Экспортный консалтинг",
  });
  const [longText, setLongText] = useState<LocalizedText>({ ...EMPTY_TEXT });
  const [benefits, setBenefits] = useState<LocalizedText[]>([
    { fa: "بازرسی پیش از حمل", en: "Pre-shipment inspection", tr: "Sevkiyat öncesi denetim", ru: "Предотгрузочная инспекция" },
  ]);
  const [singleImage, setSingleImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.trim();
    return rows.filter((row) => {
      const matchesSearch =
        !q || row.title.includes(q) || row.id.includes(q) || row.price.includes(q);
      const matchesCategory = category === "all" || row.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [rows, search, category]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page],
  );

  function toggleLoading() {
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  }

  const columns: DataTableColumn<DemoRow>[] = [
    {
      key: "id",
      header: "شناسه",
      render: (row) => <span className="font-mono text-xs text-slate-400">{row.id}</span>,
    },
    { key: "title", header: "عنوان", render: (row) => <span className="font-bold text-slate-800">{row.title}</span> },
    { key: "category", header: "دسته", render: (row) => <span className="text-slate-600">{row.category}</span> },
    {
      key: "price",
      header: "قیمت",
      render: (row) => <span className="tabular-nums text-slate-600">{row.price}</span>,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "اکشن‌ها",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => toast.success(`ویرایش «${row.title}»`)}>
            ویرایش
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteTarget(row)}
          >
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* DataTable */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">DataTable</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            جست‌وجو، فیلتر، صفحه‌بندی، حالت خالی و لودینگ — با پارامترها از سمت والد کنترل می‌شود.
          </p>
        </div>
        <FilterBar>
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="w-44">
            <option value="all">همه دسته‌ها</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
          <Button variant="outline" size="sm" onClick={toggleLoading}>
            شبیه‌سازی بارگذاری
          </Button>
        </FilterBar>
        <DataTable<DemoRow>
          columns={columns}
          rows={paged}
          rowKey={(row) => row.id}
          total={filtered.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          searchValue={search}
          onSearch={(q) => { setSearch(q); setPage(1); }}
          loading={loading}
          emptyState={
            <EmptyState
              title="موردی مطابق فیلتر یافت نشد"
              description="جست‌وجو یا فیلتر را تغییر دهید."
              action={
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCategory("all"); }}>
                  پاک کردن فیلترها
                </Button>
              }
            />
          }
        />
      </section>

      {/* StatusBadge */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">StatusBadge</h2>
          <p className="mt-0.5 text-xs text-slate-500">نگاشت خودکار وضعیت‌ها به رنگ مناسب.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-5">
          {STATUS_TONES.map((item) => (
            <StatusBadge key={item.status} status={item.status} label={item.label} />
          ))}
        </div>
      </section>

      {/* TranslationsEditor */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">TranslationsEditor</h2>
          <p className="mt-0.5 text-xs text-slate-500">فیلد ۴ زبانه با تب، ذخیره و بازخوانی.</p>
        </div>
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <TranslationsEditor label="عنوان خدمت" value={singleText} onChange={setSingleText} />
            <TranslationsEditor label="توضیحات بلند" value={longText} onChange={setLongText} type="textarea" rows={4} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-bold text-slate-700">خروجی ذخیره‌شده (JSON)</Label>
              <pre className="max-h-60 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-6 text-emerald-300">
                {JSON.stringify({ singleText, longText }, null, 2)}
              </pre>
            </div>
            <Button
              size="sm"
              onClick={() => toast.success("ترجمه‌ها ذخیره و بازخوانی شدند")}
            >
              ذخیره نمونه
            </Button>
          </div>
        </div>
      </section>

      {/* LocalizedListEditor */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">LocalizedListEditor</h2>
          <p className="mt-0.5 text-xs text-slate-500">لیست موارد ترجمه‌شده با افزودن و حذف.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <LocalizedListEditor label="مزایا" value={benefits} onChange={setBenefits} />
        </div>
      </section>

      {/* ImageInput + MediaManager */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">ImageInput و MediaManager</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            آپلود تصویر به <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/admins/api/uploads</code> با پیش‌نمایش.
          </p>
        </div>
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 lg:grid-cols-2">
          <ImageInput
            label="تصویر شاخص"
            value={singleImage}
            onChange={setSingleImage}
            folder="demo"
            aspectClass="aspect-[16/9]"
          />
          <MediaManager label="گالری تصاویر" value={gallery} onChange={setGallery} folder="demo" />
        </div>
      </section>

      {/* ConfirmDialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`حذف «${deleteTarget?.title ?? ""}»`}
        description="این عملیات قابل بازگشت نیست. مطمئن هستید که می‌خواهید این مورد را حذف کنید؟"
        confirmLabel="حذف نهایی"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
          toast.success(`«${deleteTarget?.title}» حذف شد`);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
