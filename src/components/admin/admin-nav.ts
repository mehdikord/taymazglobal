import {
  Boxes,
  Briefcase,
  Building2,
  Component,
  Globe2,
  Images,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  Package,
  Settings,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Tags,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  matchPrefix?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "پیشخوان",
    items: [
      { title: "داشبورد", href: "/admins/dashboard", icon: LayoutDashboard },
      { title: "کامپوننت‌ها", href: "/admins/components", icon: Component, matchPrefix: "/admins/components" },
    ],
  },
  {
    label: "مدیریت محتوا",
    items: [
      { title: "رسانه", href: "/admins/media", icon: Images, matchPrefix: "/admins/media" },
      { title: "خدمات", href: "/admins/services", icon: Ship, matchPrefix: "/admins/services" },
      { title: "محصولات", href: "/admins/products", icon: Package, matchPrefix: "/admins/products" },
      { title: "دسته‌بندی‌ها", href: "/admins/categories", icon: Boxes, matchPrefix: "/admins/categories" },
      { title: "نمونه‌کارها", href: "/admins/portfolio", icon: Briefcase, matchPrefix: "/admins/portfolio" },
      { title: "تیم", href: "/admins/team", icon: Users, matchPrefix: "/admins/team" },
      { title: "دفاتر", href: "/admins/offices", icon: Building2, matchPrefix: "/admins/offices" },
      { title: "کشورها", href: "/admins/countries", icon: Globe2, matchPrefix: "/admins/countries" },
      { title: "تگ‌ها", href: "/admins/tags", icon: Tags, matchPrefix: "/admins/tags" },
    ],
  },
  {
    label: "درخواست‌ها",
    items: [
      { title: "پیام‌های تماس", href: "/admins/leads?tab=contact", icon: MessagesSquare, matchPrefix: "/admins/leads" },
      { title: "درخواست مشاوره", href: "/admins/leads?tab=inquiry", icon: LifeBuoy, matchPrefix: "/admins/leads" },
      { title: "سفارش‌ها", href: "/admins/orders", icon: ShoppingCart, matchPrefix: "/admins/orders" },
    ],
  },
  {
    label: "سیستم",
    items: [
      { title: "مدیران", href: "/admins/admins", icon: ShieldCheck, matchPrefix: "/admins/admins" },
      { title: "تنظیمات", href: "/admins/settings", icon: Settings, matchPrefix: "/admins/settings" },
      { title: "حساب", href: "/admins/account", icon: UserRound, matchPrefix: "/admins/account" },
    ],
  },
];

export function isAdminNavItemActive(item: AdminNavItem, pathname: string): boolean {
  if (item.href === "/admins/dashboard") {
    return pathname === item.href || pathname === "/admins";
  }
  const prefix = item.matchPrefix ?? item.href;
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
