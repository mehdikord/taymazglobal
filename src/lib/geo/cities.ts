export type CityGeo = { lat: number; lon: number; timeZone: string };

/** Approximate coordinates + IANA time zone for cities an office may be registered in (keyed by English name, lower-case). */
export const CITY_GEO: Record<string, CityGeo> = {
  istanbul: { lat: 41.01, lon: 28.98, timeZone: "Europe/Istanbul" },
  ankara: { lat: 39.93, lon: 32.86, timeZone: "Europe/Istanbul" },
  izmir: { lat: 38.42, lon: 27.13, timeZone: "Europe/Istanbul" },
  mersin: { lat: 36.8, lon: 34.63, timeZone: "Europe/Istanbul" },
  tehran: { lat: 35.69, lon: 51.39, timeZone: "Asia/Tehran" },
  isfahan: { lat: 32.65, lon: 51.67, timeZone: "Asia/Tehran" },
  mashhad: { lat: 36.3, lon: 59.6, timeZone: "Asia/Tehran" },
  tabriz: { lat: 38.08, lon: 46.29, timeZone: "Asia/Tehran" },
  shiraz: { lat: 29.59, lon: 52.58, timeZone: "Asia/Tehran" },
  "bandar abbas": { lat: 27.18, lon: 56.27, timeZone: "Asia/Tehran" },
  dubai: { lat: 25.2, lon: 55.27, timeZone: "Asia/Dubai" },
  "abu dhabi": { lat: 24.45, lon: 54.38, timeZone: "Asia/Dubai" },
  doha: { lat: 25.29, lon: 51.53, timeZone: "Asia/Qatar" },
  muscat: { lat: 23.59, lon: 58.41, timeZone: "Asia/Muscat" },
  riyadh: { lat: 24.71, lon: 46.68, timeZone: "Asia/Riyadh" },
  kuwait: { lat: 29.38, lon: 47.99, timeZone: "Asia/Kuwait" },
  moscow: { lat: 55.75, lon: 37.62, timeZone: "Europe/Moscow" },
  "st. petersburg": { lat: 59.93, lon: 30.32, timeZone: "Europe/Moscow" },
  kazan: { lat: 55.8, lon: 49.1, timeZone: "Europe/Moscow" },
  baghdad: { lat: 33.31, lon: 44.37, timeZone: "Asia/Baghdad" },
  erbil: { lat: 36.19, lon: 44.01, timeZone: "Asia/Baghdad" },
  basra: { lat: 30.51, lon: 47.81, timeZone: "Asia/Baghdad" },
  ashgabat: { lat: 37.96, lon: 58.33, timeZone: "Asia/Ashgabat" },
  tashkent: { lat: 41.3, lon: 69.24, timeZone: "Asia/Tashkent" },
  almaty: { lat: 43.24, lon: 76.93, timeZone: "Asia/Almaty" },
  astana: { lat: 51.17, lon: 71.43, timeZone: "Asia/Almaty" },
  bishkek: { lat: 42.87, lon: 74.59, timeZone: "Asia/Bishkek" },
  dushanbe: { lat: 38.56, lon: 68.79, timeZone: "Asia/Dushanbe" },
  kabul: { lat: 34.53, lon: 69.17, timeZone: "Asia/Kabul" },
  baku: { lat: 40.41, lon: 49.87, timeZone: "Asia/Baku" },
  tbilisi: { lat: 41.72, lon: 44.83, timeZone: "Asia/Tbilisi" },
  yerevan: { lat: 40.18, lon: 44.51, timeZone: "Asia/Yerevan" },
  berlin: { lat: 52.52, lon: 13.4, timeZone: "Europe/Berlin" },
  hamburg: { lat: 53.55, lon: 9.99, timeZone: "Europe/Berlin" },
  frankfurt: { lat: 50.11, lon: 8.68, timeZone: "Europe/Berlin" },
  london: { lat: 51.51, lon: -0.13, timeZone: "Europe/London" },
  paris: { lat: 48.86, lon: 2.35, timeZone: "Europe/Paris" },
  rotterdam: { lat: 51.92, lon: 4.48, timeZone: "Europe/Amsterdam" },
  beijing: { lat: 39.9, lon: 116.4, timeZone: "Asia/Shanghai" },
  shanghai: { lat: 31.23, lon: 121.47, timeZone: "Asia/Shanghai" },
  guangzhou: { lat: 23.13, lon: 113.26, timeZone: "Asia/Shanghai" },
  shenzhen: { lat: 22.54, lon: 114.06, timeZone: "Asia/Shanghai" },
  cairo: { lat: 30.04, lon: 31.24, timeZone: "Africa/Cairo" },
  karachi: { lat: 24.86, lon: 67.0, timeZone: "Asia/Karachi" },
  mumbai: { lat: 19.08, lon: 72.88, timeZone: "Asia/Kolkata" },
  delhi: { lat: 28.61, lon: 77.21, timeZone: "Asia/Kolkata" },
};

/** Localized spellings (fa / tr / ru) mapped to the English key above. */
const CITY_ALIASES: Record<string, string> = {
  "استانبول": "istanbul", "آنکارا": "ankara", "ازمیر": "izmir", "مرسین": "mersin",
  "تهران": "tehran", "اصفهان": "isfahan", "مشهد": "mashhad", "تبریز": "tabriz", "شیراز": "shiraz", "بندرعباس": "bandar abbas", "بندر عباس": "bandar abbas",
  "دبی": "dubai", "ابوظبی": "abu dhabi", "دوحه": "doha", "مسقط": "muscat", "ریاض": "riyadh", "کویت": "kuwait",
  "مسکو": "moscow", "سن پترزبورگ": "st. petersburg", "سن‌پترزبورگ": "st. petersburg", "کازان": "kazan",
  "بغداد": "baghdad", "اربیل": "erbil", "بصره": "basra",
  "عشق آباد": "ashgabat", "عشق‌آباد": "ashgabat", "تاشکند": "tashkent", "آلماتی": "almaty", "آستانه": "astana", "بیشکک": "bishkek", "دوشنبه": "dushanbe", "کابل": "kabul",
  "باکو": "baku", "تفلیس": "tbilisi", "ایروان": "yerevan",
  "برلین": "berlin", "هامبورگ": "hamburg", "فرانکفورت": "frankfurt", "لندن": "london", "پاریس": "paris", "روتردام": "rotterdam",
  "پکن": "beijing", "شانگهای": "shanghai", "گوانگژو": "guangzhou", "شنزن": "shenzhen",
  "قاهره": "cairo", "کراچی": "karachi", "بمبئی": "mumbai", "دهلی": "delhi",
  "i̇stanbul": "istanbul", "tahran": "tehran", "isfahan": "isfahan", "bağdat": "baghdad", "aşkabat": "ashgabat", "taşkent": "tashkent", "bakü": "baku", "tiflis": "tbilisi", "moskova": "moscow", "pekin": "beijing", "şanghay": "shanghai", "kahire": "cairo",
  "стамбул": "istanbul", "анкара": "ankara", "тегеран": "tehran", "исфахан": "isfahan", "дубай": "dubai", "москва": "moscow", "багдад": "baghdad", "эрбиль": "erbil", "ашхабад": "ashgabat", "ташкент": "tashkent", "алматы": "almaty", "астана": "astana", "баку": "baku", "тбилиси": "tbilisi", "ереван": "yerevan", "берлин": "berlin", "гамбург": "hamburg", "лондон": "london", "пекин": "beijing", "шанхай": "shanghai", "каир": "cairo",
};

function normalizeCityName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\u200c/g, "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ");
}

export function lookupCity(name: string): CityGeo | undefined {
  const normalized = normalizeCityName(name);
  const direct = CITY_GEO[normalized] ?? CITY_GEO[name.trim().toLowerCase()];
  if (direct) return direct;
  const alias = CITY_ALIASES[normalized] ?? CITY_ALIASES[normalized.replace(/ /g, "")];
  return alias ? CITY_GEO[alias] : undefined;
}
