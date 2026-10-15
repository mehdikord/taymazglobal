import type { ProductCategory } from "@/types";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: "construction",
    title: { fa: "مصالح ساختمانی", en: "Construction", tr: "İnşaat", ru: "Строительство" },
    description: {
      fa: "فولاد، سیمان، عایق و مصالح پروژه‌ای",
      en: "Steel, cement, insulation and project materials",
      tr: "Çelik, çimento, yalıtım ve proje malzemeleri",
      ru: "Сталь, цемент, изоляция и проектные материалы",
    },
    gradient: "from-slate-700 via-slate-500 to-slate-300",
    accent: "bg-slate-500/20 text-slate-700",
  },
  {
    slug: "food",
    title: { fa: "مواد غذایی", en: "Food", tr: "Gıda", ru: "Продукты питания" },
    description: {
      fa: "بسته‌بندی، مواد اولیه و محصولات صادراتی",
      en: "Packaging, raw materials and export goods",
      tr: "Ambalaj, hammadde ve ihracat ürünleri",
      ru: "Упаковка, сырьё и экспортные товары",
    },
    gradient: "from-amber-600 via-orange-400 to-amber-200",
    accent: "bg-amber-500/20 text-amber-800",
  },
  {
    slug: "machinery",
    title: { fa: "ماشین‌آلات", en: "Machinery", tr: "Makine", ru: "Оборудование" },
    description: {
      fa: "تجهیزات صنعتی و خطوط تولید",
      en: "Industrial equipment and production lines",
      tr: "Endüstriyel ekipman ve üretim hatları",
      ru: "Промышленное оборудование и производственные линии",
    },
    gradient: "from-brand-navy via-blue-600 to-brand-navy-soft",
    accent: "bg-brand-navy/10 text-brand-navy",
  },
  {
    slug: "textiles",
    title: { fa: "نساجی", en: "Textiles", tr: "Tekstil", ru: "Текстиль" },
    description: {
      fa: "پارچه، الیاف و ماشین‌آلات نساجی",
      en: "Fabrics, fibers and textile machinery",
      tr: "Kumaş, elyaf ve tekstil makineleri",
      ru: "Ткани, волокна и текстильное оборудование",
    },
    gradient: "from-violet-600 via-purple-400 to-fuchsia-200",
    accent: "bg-violet-500/20 text-violet-800",
  },
  {
    slug: "chemicals",
    title: { fa: "شیمیایی", en: "Chemicals", tr: "Kimya", ru: "Химия" },
    description: {
      fa: "مواد شیمیایی صنعتی و تخصصی",
      en: "Industrial and specialty chemicals",
      tr: "Endüstriyel ve özel kimyasallar",
      ru: "Промышленная и специальная химия",
    },
    gradient: "from-teal-700 via-cyan-500 to-teal-200",
    accent: "bg-teal-500/20 text-teal-800",
  },
  {
    slug: "electronics",
    title: { fa: "الکترونیک", en: "Electronics", tr: "Elektronik", ru: "Электроника" },
    description: {
      fa: "قطعات و تجهیزات الکترونیکی",
      en: "Electronic components and equipment",
      tr: "Elektronik bileşenler ve ekipmanlar",
      ru: "Электронные компоненты и оборудование",
    },
    gradient: "from-indigo-700 via-indigo-500 to-sky-200",
    accent: "bg-indigo-500/20 text-indigo-800",
  },
];

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((category) => category.slug === slug);
}
