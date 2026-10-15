import type { CommerceOrder, CommerceOrderStatus, OrderLog } from "@/types";

/**
 * نرمال‌سازی کد رهگیری:
 * ۱. تبدیل ارقام فارسی/عربی به لاتین
 * ۲. حذف فاصله و خط تیره
 * ۳. بررسی /^\d{16}$/
 */
export function normalizeTrackingCode(raw: string): string {
  return raw
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\s\-]/g, "");
}

export function isValidTrackingCode(code: string): boolean {
  return /^\d{16}$/.test(code);
}

function makeLog(status: CommerceOrderStatus, timestamp: string, note?: { fa: string; en: string; tr: string; ru: string }): OrderLog {
  return { status, timestamp, note };
}

const TEST_ORDERS: CommerceOrder[] = [
  {
    id: "test-001",
    orderNumber: "TG-20260115-00000001",
    productSlug: "industrial-steel-pipes",
    productTitle: {
      fa: "لوله فولادی صنعتی",
      en: "Industrial Steel Pipes",
      tr: "Endüstriyel Çelik Boru",
      ru: "Промышленные стальные трубы",
    },
    destination: "Tehran, Iran",
    quantity: 20,
    contactName: "Ali Karimi",
    contactPhone: "+98 21 1234 5678",
    contactEmail: "ali@example.com",
    status: "in_transit",
    trackingCode: "2026011500000001",
    logs: [
      makeLog("pending_approval", "2026-01-15T08:00:00.000Z"),
      makeLog("preparing", "2026-01-17T10:30:00.000Z"),
      makeLog("in_transit", "2026-01-20T14:00:00.000Z", {
        fa: "محموله از استانبول ارسال شد",
        en: "Shipment dispatched from Istanbul",
        tr: "Sevkiyat İstanbul'dan gönderildi",
        ru: "Груз отправлен из Стамбула",
      }),
    ],
    createdAt: "2026-01-15T08:00:00.000Z",
  },
  {
    id: "test-002",
    orderNumber: "TG-20260115-00000002",
    productSlug: "cement-clinker",
    productTitle: {
      fa: "کلینکر سیمان",
      en: "Cement Clinker",
      tr: "Çimento Klinkeri",
      ru: "Цементный клинкер",
    },
    destination: "Baghdad, Iraq",
    quantity: 100,
    contactName: "Omar Hassan",
    contactPhone: "+964 771 234 5678",
    status: "preparing",
    trackingCode: "2026011500000002",
    logs: [
      makeLog("pending_approval", "2026-01-15T09:00:00.000Z"),
      makeLog("preparing", "2026-01-18T11:00:00.000Z", {
        fa: "محموله در حال آماده‌سازی است",
        en: "Shipment is being prepared",
        tr: "Sevkiyat hazırlanıyor",
        ru: "Груз готовится к отправке",
      }),
    ],
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "test-003",
    orderNumber: "TG-20260115-00000003",
    productSlug: "food-grade-packaging",
    productTitle: {
      fa: "بسته‌بندی مواد غذایی",
      en: "Food-Grade Packaging",
      tr: "Gıda Ambalajı",
      ru: "Пищевая упаковка",
    },
    destination: "Moscow, Russia",
    contactName: "Ivan Petrov",
    contactPhone: "+7 495 123 4567",
    status: "completed",
    trackingCode: "2026011500000003",
    logs: [
      makeLog("pending_approval", "2026-01-10T08:00:00.000Z"),
      makeLog("preparing", "2026-01-12T09:00:00.000Z"),
      makeLog("in_transit", "2026-01-14T12:00:00.000Z"),
      makeLog("completed", "2026-01-22T16:00:00.000Z", {
        fa: "محموله تحویل داده شد",
        en: "Shipment delivered successfully",
        tr: "Sevkiyat başarıyla teslim edildi",
        ru: "Груз успешно доставлен",
      }),
    ],
    createdAt: "2026-01-10T08:00:00.000Z",
  },
  {
    id: "test-004",
    orderNumber: "TG-20260118-00000004",
    productSlug: "textile-machinery",
    productTitle: {
      fa: "ماشین‌آلات نساجی",
      en: "Textile Machinery",
      tr: "Tekstil Makineleri",
      ru: "Текстильное оборудование",
    },
    destination: "Tabriz, Iran",
    quantity: 2,
    contactName: "Mehdi Rezaei",
    contactPhone: "+98 41 9876 5432",
    contactEmail: "mehdi.r@example.com",
    status: "in_transit",
    trackingCode: "2026011800000004",
    logs: [
      makeLog("pending_approval", "2026-01-18T07:00:00.000Z"),
      makeLog("preparing", "2026-01-20T10:00:00.000Z"),
      makeLog("in_transit", "2026-01-23T13:00:00.000Z", {
        fa: "محموله در مسیر ارسال است",
        en: "Shipment is in transit",
        tr: "Sevkiyat yolda",
        ru: "Груз в пути",
      }),
    ],
    createdAt: "2026-01-18T07:00:00.000Z",
  },
  {
    id: "test-005",
    orderNumber: "TG-20260120-00000005",
    productSlug: "epoxy-resin",
    productTitle: {
      fa: "رزین اپوکسی",
      en: "Epoxy Resin",
      tr: "Epoksi Reçine",
      ru: "Эпоксидная смола",
    },
    destination: "Ankara, Turkey",
    quantity: 50,
    contactName: "Ayşe Yılmaz",
    contactPhone: "+90 312 555 7890",
    status: "pending_approval",
    trackingCode: "2026012000000005",
    logs: [makeLog("pending_approval", "2026-01-20T09:30:00.000Z")],
    createdAt: "2026-01-20T09:30:00.000Z",
  },
  {
    id: "test-006",
    orderNumber: "TG-20260122-00000006",
    productSlug: "dried-fruits-export",
    productTitle: {
      fa: "میوه خشک صادراتی",
      en: "Export Dried Fruits",
      tr: "İhracat Kuru Meyve",
      ru: "Экспорт сухофруктов",
    },
    destination: "Almaty, Kazakhstan",
    quantity: 500,
    contactName: "Damir Nurlan",
    contactPhone: "+7 727 123 4567",
    contactEmail: "damir@example.kz",
    status: "cancelled",
    trackingCode: "2026012200000006",
    logs: [
      makeLog("pending_approval", "2026-01-22T08:00:00.000Z"),
      makeLog("cancelled", "2026-01-23T10:00:00.000Z", {
        fa: "سفارش به درخواست مشتری لغو شد",
        en: "Order cancelled by customer request",
        tr: "Sipariş müşteri talebiyle iptal edildi",
        ru: "Заказ отменён по просьбе клиента",
      }),
    ],
    createdAt: "2026-01-22T08:00:00.000Z",
  },
];

/**
 * جست‌وجو در داده‌های تست + سفارش‌های store-based
 * سفارش‌های store از طریق پارامتر storeOrders پاس می‌شوند (client-side)
 */
export function findOrderByTrackingCode(
  code: string,
  storeOrders: CommerceOrder[] = [],
): CommerceOrder | null {
  const normalized = normalizeTrackingCode(code);
  if (!isValidTrackingCode(normalized)) return null;

  const fromStore = storeOrders.find((o) => o.trackingCode === normalized);
  if (fromStore) return fromStore;

  const fromTest = TEST_ORDERS.find((o) => o.trackingCode === normalized);
  return fromTest ?? null;
}

export { TEST_ORDERS };
