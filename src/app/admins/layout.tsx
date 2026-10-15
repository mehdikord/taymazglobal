import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";

import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "پنل مدیریت | تایماز گلوبال",
    template: "%s | تایماز گلوبال",
  },
  robots: { index: false, follow: false },
};

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export default function AdminsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-100 font-[var(--font-vazirmatn)]">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
