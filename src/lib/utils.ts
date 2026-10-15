import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * نرمال‌سازی شماره موبایل:
 * ۱. تبدیل ارقام فارسی/عربی به لاتین
 * ۲. حذف فاصله، خط تیره و پرانتز
 * ۳. نرمال‌سازی صفر اول
 */
export function normalizePhone(raw: string): string {
  return raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\s\-()]/g, "");
}
