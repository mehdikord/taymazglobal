import type { Office } from "@/types";

export const OFFICES: Office[] = [
  {
    id: "istanbul-hq",
    city: { fa: "استانبول", en: "Istanbul", tr: "İstanbul", ru: "Стамбул" },
    country: { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" },
    address: {
      fa: "منطقه تجاری لوانتی، خیابان تجاری ۱۲، طبقه ۸",
      en: "Levent Business District, Commerce St. 12, Floor 8",
      tr: "Levent İş Merkezi, Ticaret Cad. 12, Kat 8",
      ru: "Деловой район Левент, ул. Commerce 12, этаж 8",
    },
    phone: "+90 212 555 0100",
    email: "istanbul@taymazglobal.com",
    hours: { fa: "شنبه تا پنج‌شنبه ۹–۱۸", en: "Mon–Fri 9:00–18:00", tr: "Pzt–Cum 09:00–18:00", ru: "Пн–Пт 9:00–18:00" },
    isHeadOffice: true,
  },
  {
    id: "tehran",
    city: { fa: "تهران", en: "Tehran", tr: "Tahran", ru: "Тегеран" },
    country: { fa: "ایران", en: "Iran", tr: "İran", ru: "Иран" },
    address: {
      fa: "خیابان ولیعصر، برج تجاری، واحد ۱۵۰۲",
      en: "Valiasr St., Trade Tower, Unit 1502",
      tr: "Valiasr Cad., Ticaret Kulesi, Daire 1502",
      ru: "ул. Валиаср, торговая башня, офис 1502",
    },
    phone: "+98 21 5555 0200",
    email: "tehran@taymazglobal.com",
    hours: { fa: "شنبه تا چهارشنبه ۹–۱۷", en: "Sat–Wed 9:00–17:00", tr: "Cmt–Çar 09:00–17:00", ru: "Сб–Ср 9:00–17:00" },
    isHeadOffice: false,
  },
  {
    id: "dubai",
    city: { fa: "دبی", en: "Dubai", tr: "Dubai", ru: "Дубай" },
    country: { fa: "امارات", en: "UAE", tr: "BAE", ru: "ОАЭ" },
    address: {
      fa: "منطقه JLT، کلاستر V، طبقه ۲۱",
      en: "JLT, Cluster V, Floor 21",
      tr: "JLT, Cluster V, Kat 21",
      ru: "JLT, Cluster V, этаж 21",
    },
    phone: "+971 4 555 0300",
    email: "dubai@taymazglobal.com",
    hours: { fa: "یکشنبه تا پنج‌شنبه ۹–۱۸", en: "Sun–Thu 9:00–18:00", tr: "Paz–Per 09:00–18:00", ru: "Вс–Чт 9:00–18:00" },
    isHeadOffice: false,
  },
  {
    id: "moscow",
    city: { fa: "مسکو", en: "Moscow", tr: "Moskova", ru: "Москва" },
    country: { fa: "روسیه", en: "Russia", tr: "Rusya", ru: "Россия" },
    address: {
      fa: "خیابان تورسکایا، دفتر تجاری ۴۵",
      en: "Tverskaya St., Business Office 45",
      tr: "Tverskaya Cad., İş Ofisi 45",
      ru: "ул. Тверская, бизнес-офис 45",
    },
    phone: "+7 495 555 0400",
    email: "moscow@taymazglobal.com",
    hours: { fa: "دوشنبه تا جمعه ۱۰–۱۹", en: "Mon–Fri 10:00–19:00", tr: "Pzt–Cum 10:00–19:00", ru: "Пн–Пт 10:00–19:00" },
    isHeadOffice: false,
  },
];
