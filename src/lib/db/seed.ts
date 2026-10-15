import { hashSync } from "bcryptjs";

import { prisma } from "./prisma";

const LOCALES = ["fa", "en", "tr", "ru"] as const;
type Locale = (typeof LOCALES)[number];

type Localized = Record<Locale, string>;

// ============================================================
// Settings
// ============================================================

async function seedSettings() {
  const now = new Date();
  const rows: Array<{ key: string; value: object }> = [
    {
      key: "site.info",
      value: {
        name: {
          fa: "تایماز گلوبال",
          en: "Taymaz Global",
          tr: "Taymaz Global",
          ru: "Taymaz Global",
        },
        tagline: {
          fa: "پل مطمئن تجارت بین‌المللی",
          en: "Your reliable bridge to international trade",
          tr: "Uluslararası ticarette güvenilir köprünüz",
          ru: "Ваш надёжный мост в международную торговлю",
        },
      },
    },
    {
      key: "site.contact",
      value: {
        phones: ["+989120000000", "+902120000000"],
        emails: ["info@taymazglobal.com", "sales@taymazglobal.com"],
      },
    },
    {
      key: "site.social",
      value: {
        telegram: "https://t.me/taymazglobal",
        instagram: "https://instagram.com/taymazglobal",
        whatsapp: "https://wa.me/989120000000",
        linkedin: "https://linkedin.com/company/taymazglobal",
      },
    },
  ];

  for (const row of rows) {
    await prisma.setting.upsert({
      where: { key: row.key },
      update: { value: row.value, updatedAt: now },
      create: { key: row.key, value: row.value, createdAt: now, updatedAt: now },
    });
  }
  console.log("✔ Settings seeded");
}

// ============================================================
// Admins
// ============================================================

async function seedAdmins() {
  const password = hashSync(process.env.ADMIN_SEED_PASSWORD ?? "admin1234", 10);

  await prisma.admin.upsert({
    where: { phone: "09120000000" },
    update: {},
    create: {
      name: "مدیر سیستم",
      phone: "09120000000",
      email: "admin@taymazglobal.com",
      password,
      isActive: true,
    },
  });

  await prisma.admin.upsert({
    where: { phone: "09121112222" },
    update: {},
    create: {
      name: "مدیر غیرفعال (تست)",
      phone: "09121112222",
      email: "inactive@taymazglobal.com",
      password,
      isActive: false,
    },
  });

  console.log("✔ Admins seeded");
}

// ============================================================
// Countries
// ============================================================

const COUNTRIES: Array<{ code: string; name: Localized; region: Localized }> = [
  {
    code: "IR",
    name: { fa: "ایران", en: "Iran", tr: "İran", ru: "Иран" },
    region: { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
  },
  {
    code: "TR",
    name: { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" },
    region: { fa: "اروپا و خاورمیانه", en: "Europe & Middle East", tr: "Avrupa ve Orta Doğu", ru: "Европа и Ближний Восток" },
  },
  {
    code: "TM",
    name: { fa: "ترکمنستان", en: "Turkmenistan", tr: "Türkmenistan", ru: "Туркменистан" },
    region: { fa: "آسیای مرکزی", en: "Central Asia", tr: "Orta Asya", ru: "Центральная Азия" },
  },
  {
    code: "AE",
    name: { fa: "امارات متحده عربی", en: "UAE", tr: "BAE", ru: "ОАЭ" },
    region: { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
  },
  {
    code: "RU",
    name: { fa: "روسیه", en: "Russia", tr: "Rusya", ru: "Россия" },
    region: { fa: "اروپای شرقی", en: "Eastern Europe", tr: "Doğu Avrupa", ru: "Восточная Европа" },
  },
  {
    code: "CN",
    name: { fa: "چین", en: "China", tr: "Çin", ru: "Китай" },
    region: { fa: "آسیای شرقی", en: "East Asia", tr: "Doğu Asya", ru: "Восточная Азия" },
  },
  {
    code: "OM",
    name: { fa: "عمان", en: "Oman", tr: "Umman", ru: "Оман" },
    region: { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
  },
  {
    code: "IQ",
    name: { fa: "عراق", en: "Iraq", tr: "Irak", ru: "Ирак" },
    region: { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
  },
  {
    code: "UZ",
    name: { fa: "ازبکستان", en: "Uzbekistan", tr: "Özbekistan", ru: "Узбекистан" },
    region: { fa: "آسیای مرکزی", en: "Central Asia", tr: "Orta Asya", ru: "Центральная Азия" },
  },
  {
    code: "AF",
    name: { fa: "افغانستان", en: "Afghanistan", tr: "Afganistan", ru: "Афганистан" },
    region: { fa: "آسیای جنوبی", en: "South Asia", tr: "Güney Asya", ru: "Южная Азия" },
  },
];

async function seedCountries() {
  for (let i = 0; i < COUNTRIES.length; i++) {
    const country = COUNTRIES[i];
    const existing = await prisma.country.findUnique({ where: { code: country.code } });

    if (!existing) {
      await prisma.country.create({
        data: {
          code: country.code,
          sortOrder: i,
          translations: {
            create: LOCALES.map((locale) => ({
              locale,
              name: country.name[locale],
              region: country.region[locale],
            })),
          },
        },
      });
    }
  }
  console.log("✔ Countries seeded");
}

// ============================================================
// Tags
// ============================================================

const TAGS: Array<{ slug: string; name: Localized }> = [
  { slug: "export", name: { fa: "صادرات", en: "Export", tr: "İhracat", ru: "Экспорт" } },
  { slug: "import", name: { fa: "واردات", en: "Import", tr: "İthalat", ru: "Импорт" } },
  { slug: "customs", name: { fa: "گمرک", en: "Customs", tr: "Gümrük", ru: "Таможня" } },
  { slug: "logistics", name: { fa: "لجستیک", en: "Logistics", tr: "Lojistik", ru: "Логистика" } },
  { slug: "market", name: { fa: "بازار", en: "Market", tr: "Pazar", ru: "Рынок" } },
  { slug: "quality", name: { fa: "کیفیت", en: "Quality", tr: "Kalite", ru: "Качество" } },
  { slug: "consulting", name: { fa: "مشاوره", en: "Consulting", tr: "Danışmanlık", ru: "Консалтинг" } },
  { slug: "steel", name: { fa: "فولاد", en: "Steel", tr: "Çelik", ru: "Сталь" } },
  { slug: "packaging", name: { fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" } },
  { slug: "sourcing", name: { fa: "تأمین کالا", en: "Sourcing", tr: "Tedarik", ru: "Закупки" } },
  { slug: "freight", name: { fa: "حمل بار", en: "Freight", tr: "Navlun", ru: "Перевозка" } },
  { slug: "supplier", name: { fa: "تأمین‌کننده", en: "Supplier", tr: "Tedarikçi", ru: "Поставщик" } },
];

async function seedTags() {
  for (let i = 0; i < TAGS.length; i++) {
    const tag = TAGS[i];
    const existing = await prisma.tag.findUnique({ where: { slug: tag.slug } });

    if (!existing) {
      await prisma.tag.create({
        data: {
          slug: tag.slug,
          translations: {
            create: LOCALES.map((locale) => ({
              locale,
              name: tag.name[locale],
            })),
          },
        },
      });
    }
  }
  console.log("✔ Tags seeded");
}

// ============================================================
// Product Categories
// ============================================================

const CATEGORIES: Array<{ slug: string; title: Localized; description: Localized; gradient: string; accent: string }> = [
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
      tr: "Kumaş, lif ve tekstil makineleri",
      ru: "Ткани, волокна и текстильное оборудование",
    },
    gradient: "from-violet-600 via-purple-400 to-fuchsia-200",
    accent: "bg-violet-500/20 text-violet-800",
  },
  {
    slug: "chemicals",
    title: { fa: "مواد شیمیایی", en: "Chemicals", tr: "Kimyasallar", ru: "Химикаты" },
    description: {
      fa: "مواد اولیه و محصولات شیمیایی صنعتی",
      en: "Industrial raw materials and chemicals",
      tr: "Endüstriyel hammadde ve kimyasallar",
      ru: "Промышленное сырьё и химикаты",
    },
    gradient: "from-teal-700 via-cyan-500 to-teal-200",
    accent: "bg-teal-500/20 text-teal-800",
  },
  {
    slug: "electronics",
    title: { fa: "الکترونیک", en: "Electronics", tr: "Elektronik", ru: "Электроника" },
    description: {
      fa: "لوازم و قطعات الکترونیکی",
      en: "Electronic devices and components",
      tr: "Elektronik cihazlar ve bileşenler",
      ru: "Электронные устройства и компоненты",
    },
    gradient: "from-indigo-700 via-indigo-500 to-sky-200",
    accent: "bg-indigo-500/20 text-indigo-800",
  },
];

async function seedCategories() {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const category = CATEGORIES[i];
    const existing = await prisma.productCategory.findUnique({ where: { slug: category.slug } });

    if (!existing) {
      await prisma.productCategory.create({
        data: {
          slug: category.slug,
          gradient: category.gradient,
          accent: category.accent,
          sortOrder: i,
          translations: {
            create: LOCALES.map((locale) => ({
              locale,
              title: category.title[locale],
              description: category.description[locale],
            })),
          },
        },
      });
    }
  }
  console.log("✔ Product categories seeded");
}

// ============================================================
// Services
// ============================================================

const SERVICES: Array<{
  slug: string;
  icon: string;
  isFeatured: boolean;
  sortOrder: number;
  countryCodes: string[];
  tagSlugs: string[];
  title: Localized;
  summary: Localized;
  description: Localized;
  benefits: string[];
  steps: string[];
}> = [
  {
    slug: "export-consulting",
    icon: "briefcase",
    isFeatured: true,
    sortOrder: 0,
    countryCodes: ["IR", "TR", "TM", "AZ"],
    tagSlugs: ["export", "consulting", "market"],
    title: { fa: "مشاوره صادرات", en: "Export Consulting", tr: "İhracat Danışmanlığı", ru: "Экспортный консалтинг" },
    summary: { fa: "مشاوره تخصصی برای ورود کالای شما به بازارهای هدف", en: "Expert consulting to enter your goods into target markets", tr: "Ürünlerinizi hedef pazarlara sokmak için uzman danışmanlık", ru: "Экспертные консультации по выходу ваших товаров на целевые рынки" },
    description: { fa: "پتانسیل بازار را می‌سنجیم، راهبرد ورود طراحی می‌کنیم و شما را تا انعقاد اولین قرارداد همراهی می‌کنیم.", en: "We assess market potential, design your entry strategy, and support you until your first contract.", tr: "Pazar potansiyelini değerlendiriyor, giriş stratejinizi tasarlıyor ve ilk sözleşmenize kadar size eşlik ediyoruz.", ru: "Мы оцениваем рыночный потенциал, разрабатываем стратегию входа и сопровождаем вас до первого контракта." },
    benefits: ["تحلیل بازار هدف", "استراتژی ورود", "همراهی تا قرارداد"],
    steps: ["ارزیابی اولیه", "طراحی استراتژی", "انعقاد قرارداد"],
  },
  {
    slug: "customs-clearance",
    icon: "shield",
    isFeatured: true,
    sortOrder: 1,
    countryCodes: ["IR", "TR", "AE"],
    tagSlugs: ["customs", "import", "export"],
    title: { fa: "ترخیص کالا", en: "Customs Clearance", tr: "Gümrük İşlemleri", ru: "Таможенное оформление" },
    summary: { fa: "ترخیص سریع و قانونی محموله‌ها از گمرک", en: "Fast and lawful clearance of shipments", tr: "Gönderilerin hızlı ve yasal gümrük işlemleri", ru: "Быстрое и законное оформление грузов" },
    description: { fa: "کلیه فرآیندهای اسنادی و بازرسی کالا را مدیریت می‌کنیم تا محموله شما بدون معطلی ترخیص شود.", en: "We manage all documentation and inspection processes so your shipment clears without delay.", tr: "Gönderinizin gecikmeden çıkması için tüm belge ve denetim süreçlerini yönetiyoruz.", ru: "Мы управляем всеми документальными и инспекционными процессами, чтобы ваш груз был оформлен без задержек." },
    benefits: ["مدارک کامل", "ترخیص سریع", "مطابقت کامل با قوانین"],
    steps: ["بررسی اسناد", "ثبت اظهارنامه", "ترخیص"],
  },
  {
    slug: "international-logistics",
    icon: "ship",
    isFeatured: false,
    sortOrder: 2,
    countryCodes: ["TR", "RU", "KZ", "TM"],
    tagSlugs: ["logistics", "export"],
    title: { fa: "حمل بین‌المللی", en: "International Logistics", tr: "Uluslararası Lojistik", ru: "Международная логистика" },
    summary: { fa: "حمل دریایی، زمینی و ریلی محموله‌های شما", en: "Sea, land and rail transport of your shipments", tr: "Gönderilerinizin deniz, kara ve demiryolu taşımacılığı", ru: "Морские, наземные и железнодорожные перевозки" },
    description: { fa: "بیش از یک دهه تجربه در ترانزیت و حمل محموله بین ایران، ترکیه و کشورهای CIS.", en: "Over a decade of experience in transit and shipping between Iran, Türkiye and CIS countries.", tr: "İran, Türkiye ve BDT ülkeleri arasında transit ve taşımacılıkta on yılı aşkın deneyim.", ru: "Более десяти лет опыта в транзите и перевозках между Ираном, Турцией и странами СНГ." },
    benefits: ["حمل چندوجهی", "ردیابی محموله", "مشاوره مسیر"],
    steps: ["استعلام قیمت", "رزرو فضا", "تحویل در مقصد"],
  },
  {
    slug: "market-entry",
    icon: "globe",
    isFeatured: false,
    sortOrder: 3,
    countryCodes: ["AE", "TR", "AZ", "GE"],
    tagSlugs: ["market", "consulting"],
    title: { fa: "ورود به بازار", en: "Market Entry", tr: "Pazara Giriş", ru: "Выход на рынок" },
    summary: { fa: "پژوهش بازار و برقراری ارتباط با خریداران خارجی", en: "Market research and connecting with foreign buyers", tr: "Pazar araştırması ve yabancı alıcılarla bağlantı", ru: "Исследование рынка и связь с иностранными покупателями" },
    description: { fa: "با شبکه گسترده خریداران، شما را به شرکای تجاری معتبر در بازارهای هدف متصل می‌کنیم.", en: "With our wide buyer network, we connect you with reliable trade partners in target markets.", tr: "Geniş alıcı ağımızla sizi hedef pazarlardaki güvenilir ticaret ortaklarına bağlıyoruz.", ru: "С нашей обширной сетью покупателей мы связываем вас с надежными торговыми партнерами." },
    benefits: ["پژوهش بازار", "شبکه خریداران", "تطبیق محصول"],
    steps: ["تحلیل تقاضا", "معرفی به خریدار", "مذاکره"],
  },
  {
    slug: "sourcing",
    icon: "search",
    isFeatured: false,
    sortOrder: 4,
    countryCodes: ["IR", "TR", "CN", "AE"],
    tagSlugs: ["sourcing", "export"],
    title: { fa: "تأمین و تهیه کالا", en: "Sourcing & Procurement", tr: "Tedarik ve Satın Alma", ru: "Поиск и закупка товаров" },
    summary: { fa: "تأمین کالای باکیفیت از بهترین تولیدکنندگان", en: "Procuring quality goods from top manufacturers", tr: "En iyi üreticilerden kaliteli mal tedariki", ru: "Закупка качественных товаров у лучших производителей" },
    description: { fa: "با ارزیابی و ممیزی تأمین‌کنندگان، بهترین منبع تأمین را با قیمت رقابتی برای شما فراهم می‌کنیم.", en: "Through supplier assessment and audits, we secure the best sourcing option at a competitive price.", tr: "Tedarikçi değerlendirmesi ve denetimleriyle en uygun fiyatla en iyi tedarik kaynağını sağlıyoruz.", ru: "Благодаря оценке и аудиту поставщиков мы находим лучший источник поставки по конкурентной цене." },
    benefits: ["ممیزی تأمین‌کننده", "قیمت رقابتی", "تضمین کیفیت"],
    steps: ["ارزیابی نیاز", "استعلام و مذاکره", "نهایی‌سازی قرارداد"],
  },
  {
    slug: "trade-finance",
    icon: "coins",
    isFeatured: false,
    sortOrder: 5,
    countryCodes: ["IR", "TR", "AE", "RU"],
    tagSlugs: ["consulting", "import"],
    title: { fa: "تأمین مالی تجارت", en: "Trade Finance", tr: "Ticaret Finansmanı", ru: "Торговое финансирование" },
    summary: { fa: "راه‌کارهای اعتبار اسنادی و پرداخت بین‌المللی", en: "Letters of credit and international payment solutions", tr: "Akreditif ve uluslararası ödeme çözümleri", ru: "Аккредитивы и международные платежные решения" },
    description: { fa: "از LC تا ضمانت‌نامه‌های بانکی، امن‌ترین مسیر پرداخت برای معاملات شما را طراحی می‌کنیم.", en: "From LCs to bank guarantees, we design the safest payment path for your transactions.", tr: "Akreditiflerden banka teminatlarına kadar işlemleriniz için en güvenli ödeme yolunu tasarlıyoruz.", ru: "От аккредитивов до банковских гарантий — мы выстраиваем самый безопасный путь платежа." },
    benefits: ["اعتبار اسنادی", "ضمانت‌نامه بانکی", "کاهش ریسک"],
    steps: ["تحلیل ریسک", "طراحی ساختار پرداخت", "اجرا و پیگیری"],
  },
  {
    slug: "packaging",
    icon: "box",
    isFeatured: false,
    sortOrder: 6,
    countryCodes: ["IR", "TR"],
    tagSlugs: ["packaging", "export"],
    title: { fa: "بسته‌بندی و برندینگ صادراتی", en: "Export Packaging & Branding", tr: "İhracat Ambalaj ve Markalama", ru: "Экспортная упаковка и брендинг" },
    summary: { fa: "بسته‌بندی استاندارد برای بازارهای هدف", en: "Standard packaging for target markets", tr: "Hedef pazarlar için standart ambalaj", ru: "Стандартная упаковка для целевых рынков" },
    description: { fa: "بسته‌بندی و لیبل‌گذاری مطابق با الزامات بازار مقصد، از طراحی تا خط تولید.", en: "Packaging and labelling per destination requirements, from design to production line.", tr: "Tasarımdan üretim hattına kadar hedef pazar gereksinimlerine uygun ambalaj ve etiketleme.", ru: "Упаковка и маркировка по требованиям страны назначения — от дизайна до производственной линии." },
    benefits: ["طراحی اختصاصی", "مطابقت با مقررات", "بهینه‌سازی هزینه"],
    steps: ["طراحی", "نمونه‌سازی", "تولید انبوه"],
  },
  {
    slug: "freight-forwarding",
    icon: "truck",
    isFeatured: false,
    sortOrder: 7,
    countryCodes: ["IR", "TR", "RU", "KZ", "TM"],
    tagSlugs: ["freight", "logistics"],
    title: { fa: "فورواردری", en: "Freight Forwarding", tr: "Nakliye Acenteliği", ru: "Экспедирование грузов" },
    summary: { fa: "مدیریت کامل زنجیره حمل تا مقصد", en: "End-to-end freight management", tr: "Uçtan uca nakliye yönetimi", ru: "Полное управление перевозкой до пункта назначения" },
    description: { fa: "با هماهنگی فورواردرهای مقصد، محموله شما از مبدا تا تحویل کامل رصد و مدیریت می‌شود.", en: "Coordinating destination forwarders, your shipment is tracked and managed from origin to delivery.", tr: "Hedef nakliyecilerle koordinasyon kurarak gönderiniz menşeden teslimata kadar izlenir ve yönetilir.", ru: "Согласуя работу экспедиторов в пункте назначения, мы отслеживаем и управляем вашим грузом от отправки до доставки." },
    benefits: ["هماهنگی کامل", "مستندسازی ترانزیت", "پیگیری لحظه‌ای"],
    steps: ["برنامه‌ریزی مسیر", "رزرو و اسناد", "تحویل در مقصد"],
  },
  {
    slug: "after-sales-support",
    icon: "headset",
    isFeatured: false,
    sortOrder: 8,
    countryCodes: ["IR", "TR", "AE", "RU", "UZ"],
    tagSlugs: ["quality", "export"],
    title: { fa: "پشتیبانی پس از فروش", en: "After-Sales Support", tr: "Satış Sonrası Destek", ru: "Постпродажная поддержка" },
    summary: { fa: "پشتیبانی و پیگیری مستمر پس از تحویل محموله", en: "Ongoing support and follow-up after delivery", tr: "Teslimat sonrası sürekli destek ve takip", ru: "Постоянная поддержка и сопровождение после поставки" },
    description: { fa: "مشکلات احتمالی پس از تحویل را سریع پیگیری و حل می‌کنیم تا رابطه تجاری پایدار بماند.", en: "We promptly resolve any post-delivery issues to keep your business relationship stable.", tr: "Teslimat sonrası olası sorunları hızlıca çözerek iş ilişkinizi sürdürülebilir kılıyoruz.", ru: "Мы оперативно решаем любые вопросы после поставки, сохраняя стабильные деловые отношения." },
    benefits: ["پیگیری رضایت", "حل سریع مشکل", "بازار یابی مجدد"],
    steps: ["بررسی رضایت", "رفع اشکال", "توسعه همکاری"],
  },
];

async function seedServices() {
  for (const svc of SERVICES) {
    const existing = await prisma.service.findUnique({ where: { slug: svc.slug } });
    if (existing) continue;
    const countries = await prisma.country.findMany({ where: { code: { in: svc.countryCodes } } });
    const tags = await prisma.tag.findMany({ where: { slug: { in: svc.tagSlugs } } });
    await prisma.service.create({
      data: {
        slug: svc.slug,
        icon: svc.icon,
        isFeatured: svc.isFeatured,
        sortOrder: svc.sortOrder,
        isActive: true,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            title: svc.title[locale],
            summary: svc.summary[locale],
            description: svc.description[locale],
            benefits: svc.benefits,
            steps: svc.steps,
            faq: [
              { question: `سوال متداول درباره ${svc.title.fa}؟`, answer: "پاسخ تیم کارشناسان تیماز به سوال شما." },
            ],
          })),
        },
        countries: { create: countries.map((c) => ({ countryId: c.id })) },
        tags: { create: tags.map((t) => ({ tagId: t.id })) },
      },
    });
  }
  console.log("✔ Services seeded");
}

// ============================================================
// Team members
// ============================================================

const TEAM_MEMBERS: Array<{
  department: "leadership" | "operations" | "customs" | "sales" | "logistics";
  name: Localized;
  role: Localized;
  bio: Localized;
  sortOrder: number;
}> = [
  {
    department: "leadership",
    name: { fa: "مهدی رضایی", en: "Mehdi Rezaei", tr: "Mehdi Rezaei", ru: "Мехди Резаи" },
    role: { fa: "مدیرعامل", en: "CEO", tr: "Genel Müdür", ru: "Генеральный директор" },
    bio: { fa: "بیش از ۱۵ سال تجربه در تجارت بین‌المللی.", en: "Over 15 years in international trade.", tr: "Uluslararası ticarette 15 yılı aşkın deneyim.", ru: "Более 15 лет в международной торговле." },
    sortOrder: 0,
  },
  {
    department: "sales",
    name: { fa: "سارا کریمی", en: "Sara Karimi", tr: "Sara Karimi", ru: "Сара Карими" },
    role: { fa: "مدیر فروش", en: "Sales Manager", tr: "Satış Müdürü", ru: "Менеджер по продажам" },
    bio: { fa: "مسئول ارتباط با خریداران در ترکیه و کشورهای CIS.", en: "Responsible for buyer relations in Türkiye and CIS.", tr: "Türkiye ve BDT'de alıcı ilişkilerinden sorumlu.", ru: "Ответственна за связи с покупателями в Турции и СНГ." },
    sortOrder: 1,
  },
  {
    department: "customs",
    name: { fa: "علی محمدی", en: "Ali Mohammadi", tr: "Ali Mohammadi", ru: "Али Мохаммади" },
    role: { fa: "کارشناس گمرک", en: "Customs Expert", tr: "Gümrük Uzmanı", ru: "Таможенный эксперт" },
    bio: { fa: "تخصص در اظهارنامه و ترخیص کالا.", en: "Specialist in declarations and clearance.", tr: "Beyanname ve gümrük işlemleri uzmanı.", ru: "Специалист по декларациям и оформлению." },
    sortOrder: 2,
  },
  {
    department: "logistics",
    name: { fa: "نگین موسوی", en: "Negin Mousavi", tr: "Negin Musavi", ru: "Негин Мусави" },
    role: { fa: "کارشناس لجستیک", en: "Logistics Specialist", tr: "Lojistik Uzmanı", ru: "Специалист по логистике" },
    bio: { fa: "هماهنگی حمل دریایی و زمینی محموله‌ها.", en: "Coordinates sea and land shipments.", tr: "Deniz ve kara sevkiyatlarını koordine eder.", ru: "Координирует морские и наземные перевозки." },
    sortOrder: 3,
  },
  {
    department: "sales",
    name: { fa: "رضا توکلی", en: "Reza Tavakoli", tr: "Reza Tavakoli", ru: "Реза Таваколи" },
    role: { fa: "کارشناس فروش خارجی", en: "Export Sales Executive", tr: "İhracat Satış Uzmanı", ru: "Менеджер по экспортным продажам" },
    bio: { fa: "مسئول بازارهای قفقاز و آسیای مرکزی.", en: "Responsible for Caucasus and Central Asia markets.", tr: "Kafkasya ve Orta Asya pazarlarından sorumlu.", ru: "Отвечает за рынки Кавказа и Центральной Азии." },
    sortOrder: 4,
  },
  {
    department: "operations",
    name: { fa: "الهام صادقی", en: "Elham Sadeghi", tr: "Elham Sadeghi", ru: "Эльхам Садеги" },
    role: { fa: "مدیر عملیات", en: "Operations Manager", tr: "Operasyon Müdürü", ru: "Руководитель операций" },
    bio: { fa: "نظارت بر اجرای قراردادها و هماهنگی تیم‌ها.", en: "Oversees contract execution and team coordination.", tr: "Sözleşme uygulamasını ve ekip koordinasyonunu yönetir.", ru: "Контролирует исполнение контрактов и координацию команд." },
    sortOrder: 5,
  },
];

async function seedTeam() {
  for (const member of TEAM_MEMBERS) {
    const nameEn = member.name.en;
    const existing = await prisma.teamMember.findFirst({ where: { translations: { some: { locale: "en", name: nameEn } } } });
    if (existing) continue;
    await prisma.teamMember.create({
      data: {
        department: member.department,
        accent: "#123977",
        isActive: true,
        sortOrder: member.sortOrder,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            name: member.name[locale],
            role: member.role[locale],
            bio: member.bio[locale],
          })),
        },
      },
    });
  }
  console.log("✔ Team members seeded");
}

// ============================================================
// Offices
// ============================================================

async function seedOffices() {
  const iran = await prisma.country.findUnique({ where: { code: "IR" } });
  const turkey = await prisma.country.findUnique({ where: { code: "TR" } });
  const turkmenistan = await prisma.country.findUnique({ where: { code: "TM" } });
  if (!iran || !turkey) return;

  const offices: Array<{
    countryId: bigint;
    city: Localized;
    address: Localized;
    hours: Localized;
    phone: string;
    email: string;
    isHeadOffice: boolean;
    sortOrder: number;
  }> = [
    {
      countryId: iran.id,
      city: { fa: "تهران", en: "Tehran", tr: "Tahran", ru: "Тегеран" },
      address: { fa: "خیابان ولیعصر، برج نگین، طبقه ۷", en: "Valiasr St., Negin Tower, 7th Floor", tr: "Valiasr Cad., Negin Kulesi, 7. Kat", ru: "ул. Валиаср, башня Негин, 7 этаж" },
      hours: { fa: "شنبه تا پنجشنبه، ۹ تا ۱۷", en: "Sat–Thu, 9:00–17:00", tr: "Cmt–Per, 9:00–17:00", ru: "Сб–Чт, 9:00–17:00" },
      phone: "+982188776655",
      email: "tehran@taymaz.global",
      isHeadOffice: true,
      sortOrder: 0,
    },
    {
      countryId: turkey.id,
      city: { fa: "استانبول", en: "Istanbul", tr: "İstanbul", ru: "Стамбул" },
      address: { fa: "مسیر استانبول، منطقه بازرگانی، خیابان تجارت", en: "Istanbul Trade Zone, Trade St.", tr: "İstanbul Ticaret Bölgesi, Ticaret Cad.", ru: "Стамбульская торговая зона, Торговая ул." },
      hours: { fa: "دوشنبه تا جمعه، ۹ تا ۱۸", en: "Mon–Fri, 9:00–18:00", tr: "Pzt–Cum, 9:00–18:00", ru: "Пн–Пт, 9:00–18:00" },
      phone: "+902123456789",
      email: "istanbul@taymaz.global",
      isHeadOffice: false,
      sortOrder: 1,
    },
    {
      countryId: iran.id,
      city: { fa: "اصفهان", en: "Isfahan", tr: "İsfahan", ru: "Исфахан" },
      address: { fa: "خیابان چهارباغ، مجتمع تجاری صدف", en: "Charbagh St., Sadaf Complex", tr: "Çeharbağ Cad., Sadaf Kompleksi", ru: "ул. Чахарбаг, комплекс Садаф" },
      hours: { fa: "شنبه تا چهارشنبه، ۸ تا ۱۶", en: "Sat–Wed, 8:00–16:00", tr: "Cmt–Çar, 8:00–16:00", ru: "Сб–Ср, 8:00–16:00" },
      phone: "+983133445566",
      email: "isfahan@taymaz.global",
      isHeadOffice: false,
      sortOrder: 2,
    },
    {
      countryId: turkmenistan?.id ?? turkey.id,
      city: { fa: "عشق‌آباد", en: "Ashgabat", tr: "Aşkabat", ru: "Ашхабад" },
      address: { fa: "خیابان بیطاراپ، مرکز تجاری کاسپین", en: "Bitarap Ave., Caspian Trade Center", tr: "Bitarap Cad., Hazar Ticaret Merkezi", ru: "пр. Битарап, торговый центр Каспий" },
      hours: { fa: "دوشنبه تا جمعه، ۹ تا ۱۷", en: "Mon–Fri, 9:00–17:00", tr: "Pzt–Cum, 9:00–17:00", ru: "Пн–Пт, 9:00–17:00" },
      phone: "+993122334455",
      email: "ashgabat@taymaz.global",
      isHeadOffice: false,
      sortOrder: 3,
    },
  ];

  for (const office of offices) {
    const existing = await prisma.office.findFirst({ where: { email: office.email } });
    if (existing) continue;
    await prisma.office.create({
      data: {
        countryId: office.countryId,
        phone: office.phone,
        email: office.email,
        isHeadOffice: office.isHeadOffice,
        isActive: true,
        sortOrder: office.sortOrder,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            city: office.city[locale],
            address: office.address[locale],
            hours: office.hours[locale],
          })),
        },
      },
    });
  }
  console.log("✔ Offices seeded");
}

// ============================================================
// Portfolio
// ============================================================

async function seedPortfolio() {
  const exportService = await prisma.service.findUnique({ where: { slug: "export-consulting" } });
  const logisticsService = await prisma.service.findUnique({ where: { slug: "international-logistics" } });
  const sourcingService = await prisma.service.findUnique({ where: { slug: "sourcing" } });
  const iran = await prisma.country.findUnique({ where: { code: "IR" } });
  const turkey = await prisma.country.findUnique({ where: { code: "TR" } });
  const uzbekistan = await prisma.country.findUnique({ where: { code: "UZ" } });
  const uae = await prisma.country.findUnique({ where: { code: "AE" } });
  if (!exportService || !iran) return;

  const items: Array<{
    slug: string;
    serviceId: bigint;
    countryId: bigint | null;
    year: number;
    isFeatured: boolean;
    sortOrder: number;
    title: Localized;
    summary: Localized;
    challenge: Localized;
    solution: Localized;
    outcome: Localized;
    metrics: Array<{ value: string; label: Localized }>;
  }> = [
    {
      slug: "steel-export-azerbaijan",
      serviceId: exportService.id,
      countryId: iran.id,
      year: 2024,
      isFeatured: true,
      sortOrder: 0,
      title: { fa: "صادرات فولاد به باکو", en: "Steel Export to Baku", tr: "Bakü'ye Çelik İhracatı", ru: "Экспорт стали в Баку" },
      summary: { fa: "صادرات ۵۰۰ تن فولاد ساختمانی به آذربایجان", en: "Export of 500 tons of construction steel to Azerbaijan", tr: "Azerbaycan'a 500 ton inşaat çeliği ihracatı", ru: "Экспорт 500 тонн строительной стали в Азербайджан" },
      challenge: { fa: "محدودیت ارزی و الزامات سخت‌گیرانه استاندارد", en: "FX limitations and strict standards requirements", tr: "Döviz kısıtlamaları ve katı standart gereklilikleri", ru: "Валютные ограничения и строгие стандарты" },
      solution: { fa: "طراحی قرارداد تهاتر و تأمین گواهی‌های استاندارد", en: "Barter contract design and standard certificates", tr: "Takas sözleşmesi ve standart sertifikalar", ru: "Бартерный контракт и стандартные сертификаты" },
      outcome: { fa: "تحویل کامل در ۴۵ روز و ۹۸٪ رضایت مشتری", en: "Full delivery in 45 days with 98% satisfaction", tr: "45 günde tam teslimat, %98 memnuniyet", ru: "Полная поставка за 45 дней, 98% удовлетворенности" },
      metrics: [
        { value: "500t", label: { fa: "تن محموله", en: "Tons shipped", tr: "Sevkiyat (ton)", ru: "Тонн груза" } },
        { value: "45d", label: { fa: "روز تحویل", en: "Days to deliver", tr: "Teslimat (gün)", ru: "Дней доставки" } },
      ],
    },
    {
      slug: "medical-transit-istanbul",
      serviceId: logisticsService?.id ?? exportService.id,
      countryId: turkey?.id ?? null,
      year: 2023,
      isFeatured: false,
      sortOrder: 1,
      title: { fa: "ترانزیت تجهیزات پزشکی از استانبول", en: "Medical Equipment Transit from Istanbul", tr: "İstanbul'dan Tıbbi Cihaz Transit", ru: "Транзит медоборудования из Стамбула" },
      summary: { fa: "ترانزیت ۲۴۰ دستگاه تجهیزات پزشکی", en: "Transit of 240 medical devices", tr: "240 tıbbi cihazın transiti", ru: "Транзит 240 медицинских устройств" },
      challenge: { fa: "حساسیت دمایی و زمان‌بندی فشرده", en: "Temperature sensitivity and tight deadlines", tr: "Sıcaklık hassasiyeti ve sıkı takvim", ru: "Температурная чувствительность и сжатые сроки" },
      solution: { fa: "کامیونت‌های مجهز و مسیر تلفیقی ریلی-جاده‌ای", en: "Equipped trucks and combined rail-road route", tr: "Donanımlı kamyonlar ve kombine rota", ru: "Оборудованные фуры и комбинированный маршрут" },
      outcome: { fa: "تحویل بدون آسیب در ۱۲ روز", en: "Damage-free delivery in 12 days", tr: "12 günde hasarsız teslimat", ru: "Поставка без повреждений за 12 дней" },
      metrics: [
        { value: "240", label: { fa: "دستگاه", en: "Devices", tr: "Cihaz", ru: "Устройств" } },
        { value: "12d", label: { fa: "روز تحویل", en: "Days", tr: "Gün", ru: "Дней" } },
      ],
    },
    {
      slug: "textile-sourcing-turkey",
      serviceId: sourcingService?.id ?? exportService.id,
      countryId: turkey?.id ?? null,
      year: 2024,
      isFeatured: false,
      sortOrder: 2,
      title: { fa: "تأمین پارچه از استانبول", en: "Textile Sourcing from Istanbul", tr: "İstanbul'dan Tekstil Tedariki", ru: "Закупка тканей из Стамбула" },
      summary: { fa: "تأمین و بازرسی ۱۲۰۰ قرقره پارچه برای بازار ایران", en: "Sourcing and inspection of 1,200 fabric rolls for the Iranian market", tr: "İran pazarı için 1.200 kumaş topunun tedariki ve denetimi", ru: "Закупка и инспекция 1200 рулонов ткани для иранского рынка" },
      challenge: { fa: "تنوع بالا در جنس و نیاز به تضمین کیفیت", en: "High material variety and quality assurance needs", tr: "Yüksek malzeme çeşitliliği ve kalite güvencesi ihtiyacı", ru: "Большое разнообразие материалов и требования к качеству" },
      solution: { fa: "ممیزی ۶ کارخانه و بازرسی پیش از حمل", en: "Auditing 6 mills and pre-shipment inspection", tr: "6 fabrikanın denetimi ve sevkiyat öncesi kontrol", ru: "Аудит 6 фабрик и инспекция перед отгрузкой" },
      outcome: { fa: "صرفه‌جویی ۱۵٪ در هزینه تأمین", en: "15% savings in sourcing costs", tr: "Tedarik maliyetinde %15 tasarruf", ru: "Экономия 15% на закупке" },
      metrics: [
        { value: "1200", label: { fa: "قرقره", en: "Rolls", tr: "Top", ru: "Рулонов" } },
        { value: "15%", label: { fa: "صرفه‌جویی", en: "Savings", tr: "Tasarruf", ru: "Экономия" } },
      ],
    },
    {
      slug: "urea-supply-turkmenistan",
      serviceId: logisticsService?.id ?? exportService.id,
      countryId: iran.id,
      year: 2023,
      isFeatured: false,
      sortOrder: 3,
      title: { fa: "تأمین کود اوره به ترکمنستان", en: "Urea Fertilizer Supply to Turkmenistan", tr: "Türkmenistan'a Üre Tedariki", ru: "Поставка карбамида в Туркменистан" },
      summary: { fa: "صادرات ۲۰۰۰ تن کود اوره با حمل ریلی", en: "Export of 2,000 tons of urea fertilizer by rail", tr: "Demiryoluyla 2.000 ton üre gübresi ihracatı", ru: "Экспорт 2000 тонн карбамида по железной дороге" },
      challenge: { fa: "ظرفیت محدود ریلی و هماهنگی مرزی", en: "Limited rail capacity and border coordination", tr: "Sınırlı demiryolu kapasitesi ve sınır koordinasyonu", ru: "Ограниченная пропускная способность и координация на границе" },
      solution: { fa: "رزرو پیش‌فرست واگن و هماهنگی سه‌جانبه گمرک", en: "Pre-booking wagons and tripartite customs coordination", tr: "Vagon ön rezervasyonu ve üçlü gümrük koordinasyonu", ru: "Предварительное бронирование вагонов и трехсторонняя координация" },
      outcome: { fa: "تحویل کامل در ۳۰ روز بدون توقف", en: "Full delivery in 30 days without delays", tr: "30 günde gecikmesiz tam teslimat", ru: "Полная поставка за 30 дней без задержек" },
      metrics: [
        { value: "2000", label: { fa: "تن", en: "Tons", tr: "Ton", ru: "Тонн" } },
        { value: "30d", label: { fa: "روز تحویل", en: "Days", tr: "Gün", ru: "Дней" } },
      ],
    },
    {
      slug: "machinery-export-uzbekistan",
      serviceId: exportService.id,
      countryId: uzbekistan?.id ?? iran.id,
      year: 2024,
      isFeatured: false,
      sortOrder: 4,
      title: { fa: "صادرات ماشین‌آلات به ازبکستان", en: "Machinery Export to Uzbekistan", tr: "Özbekistan'a Makine İhracatı", ru: "Экспорт оборудования в Узбекистан" },
      summary: { fa: "تأمین و صادرات خط تولید ۱۵ واحدی به تاشکند", en: "Sourcing and export of a 15-unit production line to Tashkent", tr: "Taşkent'e 15 ünitelik üretim hattı tedariki ve ihracatı", ru: "Закупка и экспорт производственной линии на 15 единиц в Ташкент" },
      challenge: { fa: "تطبیق مشخصات فنی با استاندارد محلی", en: "Aligning technical specs with local standards", tr: "Teknik özelliklerin yerel standartlara uyumu", ru: "Приведение теххарактеристик к местным стандартам" },
      solution: { fa: "ممیزی فنی و مستندسازی کامل دوزبانه", en: "Technical audit and full bilingual documentation", tr: "Teknik denetim ve tam çift dilli dokümantasyon", ru: "Технический аудит и полная двуязычная документация" },
      outcome: { fa: "نصب موفق و رضایت ۹۶٪ مشتری", en: "Successful installation with 96% satisfaction", tr: "Başarılı kurulum, %96 memnuniyet", ru: "Успешный монтаж, 96% удовлетворенности" },
      metrics: [
        { value: "15", label: { fa: "واحد", en: "Units", tr: "Ünite", ru: "Единиц" } },
        { value: "96%", label: { fa: "رضایت", en: "Satisfaction", tr: "Memnuniyet", ru: "Удовлетворенность" } },
      ],
    },
    {
      slug: "saffron-export-dubai",
      serviceId: exportService.id,
      countryId: uae?.id ?? iran.id,
      year: 2023,
      isFeatured: false,
      sortOrder: 5,
      title: { fa: "صادرات زعفران به دبی", en: "Saffron Export to Dubai", tr: "Dubai'ye Safran İhracatı", ru: "Экспорт шафрана в Дубай" },
      summary: { fa: "صادرات ۸۰۰ کیلوگرم زعفران درجه یک به امارات", en: "Export of 800 kg of premium saffron to the UAE", tr: "BAE'ye 800 kg birinci sınıf safran ihracatı", ru: "Экспорт 800 кг премиального шафрана в ОАЭ" },
      challenge: { fa: "کنترل کیفیت و بسته‌بندی صادراتی دقیق", en: "Quality control and precise export packaging", tr: "Kalite kontrolü ve hassas ihracat ambalajı", ru: "Контроль качества и точная экспортная упаковка" },
      solution: { fa: "گواهی سلامت و بسته‌بندی استاندارد بازار امارات", en: "Health certificates and UAE-standard packaging", tr: "Sağlık sertifikaları ve BAE standardı ambalaj", ru: "Санитарные сертификаты и упаковка по стандарту ОАЭ" },
      outcome: { fa: "فروش کامل در ۶۰ روز با حاشیه سود ۲۲٪", en: "Sold out in 60 days with a 22% margin", tr: "60 günde tükenen satış, %22 marj", ru: "Полная продажа за 60 дней, маржа 22%" },
      metrics: [
        { value: "800kg", label: { fa: "کیلوگرم", en: "Kilograms", tr: "Kilogram", ru: "Килограмм" } },
        { value: "22%", label: { fa: "حاشیه سود", en: "Margin", tr: "Marj", ru: "Маржа" } },
      ],
    },
  ];

  for (const item of items) {
    const existing = await prisma.portfolioItem.findUnique({ where: { slug: item.slug } });
    if (existing) continue;
    await prisma.portfolioItem.create({
      data: {
        slug: item.slug,
        serviceId: item.serviceId,
        countryId: item.countryId,
        year: item.year,
        gradient: "linear-gradient(135deg,#123977,#0b5e8a)",
        isFeatured: item.isFeatured,
        isActive: true,
        sortOrder: item.sortOrder,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            title: item.title[locale],
            summary: item.summary[locale],
            challenge: item.challenge[locale],
            solution: item.solution[locale],
            outcome: item.outcome[locale],
          })),
        },
        metrics: {
          create: item.metrics.map((metric, index) => ({
            value: metric.value,
            sortOrder: index,
            translations: { create: LOCALES.map((locale) => ({ locale, label: metric.label[locale] })) },
          })),
        },
      },
    });
  }
  console.log("✔ Portfolio seeded");
}

// ============================================================
// Products
// ============================================================

async function seedProducts() {
  const construction = await prisma.productCategory.findFirst({ where: { slug: "construction" } });
  const chemicals = await prisma.productCategory.findFirst({ where: { slug: "chemicals" } });
  const agriculture = await prisma.productCategory.findFirst({ where: { slug: "agriculture" } });
  const food = await prisma.productCategory.findFirst({ where: { slug: "food" } });
  const machinery = await prisma.productCategory.findFirst({ where: { slug: "machinery" } });
  const textiles = await prisma.productCategory.findFirst({ where: { slug: "textiles" } });
  const exportTag = await prisma.tag.findUnique({ where: { slug: "export" } });
  const qualityTag = await prisma.tag.findUnique({ where: { slug: "quality" } });
  if (!construction || !chemicals || !exportTag) return;

  const products: Array<{
    slug: string;
    categoryId: bigint;
    type: "physical";
    priceType: "fixed" | "inquiry" | "range";
    price: string;
    priceMax: string;
    currency: "USD" | "EUR" | "TRY";
    isFeatured: boolean;
    sortOrder: number;
    tagIds: bigint[];
    title: Localized;
    summary: Localized;
    specs: Array<{ label: Localized; value: Localized }>;
  }> = [
    {
      slug: "steel-rebar-a615",
      categoryId: construction.id,
      type: "physical",
      priceType: "range",
      price: "620",
      priceMax: "680",
      currency: "USD",
      isFeatured: true,
      sortOrder: 0,
      tagIds: [exportTag.id, ...(qualityTag ? [qualityTag.id] : [])],
      title: { fa: "میلگرد A615", en: "Steel Rebar A615", tr: "A615 İnşaat Demiri", ru: "Арматура A615" },
      summary: { fa: "میلگرد ساختمانی استاندارد آمریکا", en: "US-standard construction rebar", tr: "ABD standartlı inşaat demiri", ru: "Строительная арматура по стандарту США" },
      specs: [
        { label: { fa: "قطر", en: "Diameter", tr: "Çap", ru: "Диаметр" }, value: { fa: "۸ تا ۳۲ میلی‌متر", en: "8–32 mm", tr: "8–32 mm", ru: "8–32 мм" } },
        { label: { fa: "استاندارد", en: "Standard", tr: "Standart", ru: "Стандарт" }, value: { fa: "ASTM A615", en: "ASTM A615", tr: "ASTM A615", ru: "ASTM A615" } },
      ],
    },
    {
      slug: "urea-fertilizer",
      categoryId: chemicals.id,
      type: "physical",
      priceType: "fixed",
      price: "340",
      priceMax: "",
      currency: "USD",
      isFeatured: true,
      sortOrder: 1,
      tagIds: [exportTag.id],
      title: { fa: "اوره کشاورزی", en: "Urea Fertilizer", tr: "Üre Gübresi", ru: "Мочевина" },
      summary: { fa: "اوره گرانوله ۴۶٪ نیتروژن", en: "Granular urea, 46% nitrogen", tr: "Granül üre, %46 azot", ru: "Гранулированная мочевина, 46% азота" },
      specs: [
        { label: { fa: "نیتروژن", en: "Nitrogen", tr: "Azot", ru: "Азот" }, value: { fa: "۴۶٪", en: "46%", tr: "%46", ru: "46%" } },
        { label: { fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" }, value: { fa: "کیسه ۵۰ کیلوگرمی", en: "50 kg bags", tr: "50 kg çuval", ru: "Мешки 50 кг" } },
      ],
    },
    {
      slug: "agri-export-inquiry",
      categoryId: agriculture?.id ?? chemicals.id,
      type: "physical",
      priceType: "inquiry",
      price: "",
      priceMax: "",
      currency: "USD",
      isFeatured: false,
      sortOrder: 2,
      tagIds: [exportTag.id],
      title: { fa: "صادرات محصولات کشاورزی", en: "Agricultural Products Export", tr: "Tarım Ürünleri İhracatı", ru: "Экспорт сельхозпродукции" },
      summary: { fa: "درخواست استعلام برای صادرات محصولات کشاورزی", en: "Inquiry request for agricultural exports", tr: "Tarım ihracatı için fiyat teklifi", ru: "Запрос цен на экспорт сельхозпродукции" },
      specs: [{ label: { fa: "نوع قرارداد", en: "Contract", tr: "Sözleşme", ru: "Контракт" }, value: { fa: "FOB / CIF", en: "FOB / CIF", tr: "FOB / CIF", ru: "FOB / CIF" } }],
    },
    {
      slug: "steel-wire-rod",
      categoryId: construction.id,
      type: "physical",
      priceType: "range",
      price: "580",
      priceMax: "640",
      currency: "USD",
      isFeatured: false,
      sortOrder: 3,
      tagIds: [exportTag.id],
      title: { fa: "مفتول فولادی", en: "Steel Wire Rod", tr: "Çelik Tel Çubuk", ru: "Катанка" },
      summary: { fa: "مفتول ساختمانی ۵.۵ تا ۱۲ میلی‌متر", en: "Construction wire rod 5.5–12 mm", tr: "5,5–12 mm inşaat tel çubuğu", ru: "Строительная катанка 5,5–12 мм" },
      specs: [
        { label: { fa: "قطر", en: "Diameter", tr: "Çap", ru: "Диаметр" }, value: { fa: "۵.۵ تا ۱۲ میلی‌متر", en: "5.5–12 mm", tr: "5,5–12 mm", ru: "5,5–12 мм" } },
        { label: { fa: "استاندارد", en: "Standard", tr: "Standart", ru: "Стандарт" }, value: { fa: "ASTM A1064", en: "ASTM A1064", tr: "ASTM A1064", ru: "ASTM A1064" } },
      ],
    },
    {
      slug: "portland-cement",
      categoryId: construction.id,
      type: "physical",
      priceType: "range",
      price: "85",
      priceMax: "95",
      currency: "USD",
      isFeatured: false,
      sortOrder: 4,
      tagIds: [exportTag.id, ...(qualityTag ? [qualityTag.id] : [])],
      title: { fa: "سیمان پرتلند", en: "Portland Cement", tr: "Portland Çimento", ru: "Портландцемент" },
      summary: { fa: "سیمان تیپ ۲ در کیسه ۵۰ کیلوگرمی", en: "Type II cement in 50 kg bags", tr: "50 kg çuvallarda tip II çimento", ru: "Цемент тип II в мешках 50 кг" },
      specs: [
        { label: { fa: "تیپ", en: "Type", tr: "Tip", ru: "Тип" }, value: { fa: "II / 425", en: "II / 425", tr: "II / 425", ru: "II / 425" } },
        { label: { fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" }, value: { fa: "کیسه ۵۰ کیلوگرمی", en: "50 kg bags", tr: "50 kg çuval", ru: "Мешки 50 кг" } },
      ],
    },
    {
      slug: "tomato-paste",
      categoryId: food?.id ?? agriculture?.id ?? chemicals.id,
      type: "physical",
      priceType: "fixed",
      price: "780",
      priceMax: "",
      currency: "USD",
      isFeatured: true,
      sortOrder: 5,
      tagIds: [exportTag.id, ...(qualityTag ? [qualityTag.id] : [])],
      title: { fa: "رب گوجه‌فرنگی", en: "Tomato Paste", tr: "Domates Salçası", ru: "Томатная паста" },
      summary: { fa: "رب گوجه ۲۸–۳۰ درجه بریکس در قوطی آسپتیک", en: "Tomato paste 28–30° Brix in aseptic cans", tr: "Aseptik kutuda 28–30° Brix domates salçası", ru: "Томатная паста 28–30° Brix в асептических банках" },
      specs: [
        { label: { fa: "بریکس", en: "Brix", tr: "Brix", ru: "Брикс" }, value: { fa: "۲۸–۳۰°", en: "28–30°", tr: "28–30°", ru: "28–30°" } },
        { label: { fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" }, value: { fa: "قوطی آسپتیک ۲۰۰ کیلویی", en: "Aseptic can, 200 kg", tr: "Aseptik kutu, 200 kg", ru: "Асептическая банка, 200 кг" } },
      ],
    },
    {
      slug: "saffron-premium",
      categoryId: food?.id ?? agriculture?.id ?? chemicals.id,
      type: "physical",
      priceType: "range",
      price: "1150",
      priceMax: "1450",
      currency: "USD",
      isFeatured: true,
      sortOrder: 6,
      tagIds: [exportTag.id, ...(qualityTag ? [qualityTag.id] : [])],
      title: { fa: "زعفران نگین", en: "Premium Saffron", tr: "Premium Safran", ru: "Шафран премиум" },
      summary: { fa: "زعفران سرگل درجه یک با عیار ۲۵۰", en: "Grade A Sargol saffron, 250 coloring strength", tr: "A kalite Sargol safran, 250 boya gücü", ru: "Шафран Саргол класса А, 250 единиц окраски" },
      specs: [
        { label: { fa: "عیار", en: "Strength", tr: "Güç", ru: "Сила" }, value: { fa: "۲۵۰", en: "250", tr: "250", ru: "250" } },
        { label: { fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" }, value: { fa: "جعبه ۵۰ گرمی", en: "50 g boxes", tr: "50 g kutular", ru: "Коробки 50 г" } },
      ],
    },
    {
      slug: "wheat-flour",
      categoryId: food?.id ?? agriculture?.id ?? chemicals.id,
      type: "physical",
      priceType: "fixed",
      price: "420",
      priceMax: "",
      currency: "USD",
      isFeatured: false,
      sortOrder: 7,
      tagIds: [exportTag.id],
      title: { fa: "آرد گندم", en: "Wheat Flour", tr: "Buğday Unu", ru: "Пшеничная мука" },
      summary: { fa: "آرد ستاره ۹۶‪٪‬ در کیسه ۲۵ کیلوگرمی", en: "Star flour 96% in 25 kg bags", tr: "25 kg çuvallarda yıldız un %96", ru: "Мука высшего сорта, мешки 25 кг" },
      specs: [
        { label: { fa: "استخراج", en: "Extraction", tr: "Ekstraksiyon", ru: "Выход" }, value: { fa: "۹۶٪", en: "96%", tr: "%96", ru: "96%" } },
        { label: { fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" }, value: { fa: "کیسه ۲۵ کیلوگرمی", en: "25 kg bags", tr: "25 kg çuval", ru: "Мешки 25 кг" } },
      ],
    },
    {
      slug: "diesel-generator",
      categoryId: machinery?.id ?? construction.id,
      type: "physical",
      priceType: "range",
      price: "8500",
      priceMax: "24000",
      currency: "USD",
      isFeatured: false,
      sortOrder: 8,
      tagIds: [exportTag.id, ...(qualityTag ? [qualityTag.id] : [])],
      title: { fa: "دیزل ژنراتور", en: "Diesel Generator", tr: "Dizel Jeneratör", ru: "Дизель-генератор" },
      summary: { fa: "ژنراتور ۱۰۰ تا ۵۰۰ کیلوولت‌آمپر", en: "Generators from 100 to 500 kVA", tr: "100–500 kVA jeneratörler", ru: "Генераторы 100–500 кВА" },
      specs: [
        { label: { fa: "توان", en: "Capacity", tr: "Güç", ru: "Мощность" }, value: { fa: "۱۰۰–۵۰۰ کیلوولت‌آمپر", en: "100–500 kVA", tr: "100–500 kVA", ru: "100–500 кВА" } },
        { label: { fa: "برند", en: "Brand", tr: "Marka", ru: "Бренд" }, value: { fa: "Perkins / Cummins", en: "Perkins / Cummins", tr: "Perkins / Cummins", ru: "Perkins / Cummins" } },
      ],
    },
    {
      slug: "polyester-yarn",
      categoryId: textiles?.id ?? chemicals.id,
      type: "physical",
      priceType: "fixed",
      price: "1750",
      priceMax: "",
      currency: "USD",
      isFeatured: false,
      sortOrder: 9,
      tagIds: [exportTag.id],
      title: { fa: "الیاف پلی‌استر", en: "Polyester Yarn", tr: "Polyester İplik", ru: "Полиэфирная пряжа" },
      summary: { fa: "الیاف پلی‌استر درو اسپان ۳۰/۱", en: "Polyester draw-textured yarn 30/1", tr: "Poliester DTY 30/1 iplik", ru: "Полиэфирная текстурированная пряжа 30/1" },
      specs: [
        { label: { fa: "نمره", en: "Count", tr: "Numara", ru: "Номер" }, value: { fa: "۳۰/۱", en: "30/1", tr: "30/1", ru: "30/1" } },
        { label: { fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" }, value: { fa: "بسته‌های ۲ کیلوگرمی", en: "2 kg cones", tr: "2 kg bobinler", ru: "Бобины 2 кг" } },
      ],
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) continue;
    await prisma.product.create({
      data: {
        slug: product.slug,
        categoryId: product.categoryId,
        type: product.type,
        priceType: product.priceType,
        price: product.price ? product.price : null,
        priceMax: product.priceMax ? product.priceMax : null,
        currency: product.currency,
        isFeatured: product.isFeatured,
        isActive: true,
        sortOrder: product.sortOrder,
        translations: {
          create: LOCALES.map((locale) => ({
            locale,
            title: product.title[locale],
            summary: product.summary[locale],
          })),
        },
        specs: {
          create: product.specs.map((spec, index) => ({
            sortOrder: index,
            translations: {
              create: LOCALES.map((locale) => ({
                locale,
                label: spec.label[locale],
                value: spec.value[locale],
              })),
            },
          })),
        },
        tags: { create: product.tagIds.map((tagId) => ({ tagId })) },
      },
    });
  }
  console.log("✔ Products seeded");
}

// ============================================================
// Orders + Leads (سفارش‌ها و لیدها)
// ============================================================

async function seedOrdersAndLeads() {
  const rebar = await prisma.product.findUnique({ where: { slug: "steel-rebar-a615" } });
  const urea = await prisma.product.findUnique({ where: { slug: "urea-fertilizer" } });
  if (rebar) {
    const orderCount = await prisma.order.count();
    if (orderCount === 0) {
      const testOrders = [
        {
          orderNumber: "2026011500000001",
          trackingCode: "2026011500000001",
          productId: rebar.id,
          status: "in_transit",
          destination: "باکو، آذربایجان",
          quantity: 120,
          customerNote: "لطفاً گواهی کیفیت ضمیمه شود.",
          contactName: "حسین رستمی",
          contactPhone: "+994503113355",
          contactEmail: "h.rostami@example.az",
          termsAccepted: true,
          userId: null,
          logs: [
            { status: "pending_approval" as const, note: "ثبت سفارش توسط مشتری" },
            { status: "preparing" as const, note: "تأیید شد و در حال آماده‌سازی است" },
            { status: "in_transit" as const, note: "محموله بارگیری و ارسال شد" },
          ],
        },
        {
          orderNumber: "2026011500000002",
          trackingCode: "2026011500000002",
          productId: urea?.id ?? rebar.id,
          status: "preparing" as const,
          destination: "عشق‌آباد، ترکمنستان",
          quantity: 60,
          customerNote: "ارسال پیش فاکتور به ایمیل.",
          contactName: "مریم احمدی",
          contactPhone: "+989122233445",
          contactEmail: "m.ahmadi@example.com",
          termsAccepted: true,
          userId: null,
          logs: [
            { status: "pending_approval" as const, note: "ثبت سفارش توسط مشتری" },
            { status: "preparing" as const, note: "در حال آماده‌سازی محموله" },
          ],
        },
        {
          orderNumber: "2026011500000003",
          trackingCode: "2026011500000003",
          productId: rebar.id,
          status: "completed" as const,
          destination: "تفلیس، گرجستان",
          quantity: 200,
          customerNote: "تحویل به انبار مشتری در تفلیس.",
          contactName: "شرکت قفقاز فولاد",
          contactPhone: "+995599112233",
          contactEmail: "sales@caucasussteel.ge",
          termsAccepted: true,
          userId: null,
          logs: [
            { status: "pending_approval" as const, note: "ثبت سفارش توسط مشتری" },
            { status: "preparing" as const, note: "تأیید و شروع آماده‌سازی" },
            { status: "in_transit" as const, note: "ارسال از بندر بندرانزلی" },
            { status: "completed" as const, note: "تحویل نهایی به مشتری" },
          ],
        },
      ];

      for (const order of testOrders) {
const createdOrder = await prisma.order.create({
        data: {
          orderNumber: order.orderNumber,
          trackingCode: order.trackingCode,
          productId: order.productId,
          status: order.status as "pending_approval" | "preparing" | "in_transit" | "completed" | "cancelled",
          destination: order.destination,
          quantity: order.quantity,
          customerNote: order.customerNote,
          contactName: order.contactName,
          contactPhone: order.contactPhone,
          contactEmail: order.contactEmail,
            termsAccepted: order.termsAccepted,
            userId: order.userId,
          },
        });
        for (const log of order.logs) {
          await prisma.orderLog.create({
            data: {
              orderId: createdOrder.id,
              status: log.status,
              translations: { create: [{ locale: "fa", note: log.note }] },
            },
          });
        }
      }
      console.log("✔ Test orders seeded");
    }
  }

  const contactCount = await prisma.contactMessage.count();
  if (contactCount === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          name: "امیر نادری",
          email: "amir@example.com",
          phone: "+989123456789",
          subject: "همکاری در ترخیص محموله",
          message: "سلام، قصد داریم یک محموله فولادی را از ترکیه وارد کنیم. لطفاً راهنمایی بفرمایید.",
          type: "contact",
          status: "new",
        },
        {
          name: "شرکت پتروشیمی زاگرس",
          email: "procurement@zagros.example",
          phone: "+982166554433",
          subject: "پیشنهاد همکاری صادراتی",
          message: "درخواست مشاوره برای صادرات محصولات پتروشیمی به کشورهای CIS داریم.",
          type: "suggestion",
          status: "in_review",
        },
      ],
    });
    console.log("✔ Demo contact messages seeded");
  }

  const exportService = await prisma.service.findUnique({ where: { slug: "export-consulting" } });
  const inquiryCount = await prisma.serviceInquiry.count();
  if (inquiryCount === 0) {
    await prisma.serviceInquiry.create({
      data: {
        serviceId: exportService?.id ?? null,
        name: "مریم احمدی",
        phone: "+989353332211",
        email: "m.ahmadi@example.com",
        company: "صنایع غذایی سحر",
        country: "امارات",
        message: "برای ورود به بازار امارات مشاوره می‌خواهیم.",
        status: "new",
      },
    });
    console.log("✔ Demo service inquiries seeded");
  }
}

// ============================================================
// Entry
// ============================================================

export async function seed() {
  console.log("Seeding database…");
  await seedSettings();
  await seedAdmins();
  await seedCountries();
  await seedTags();
  await seedCategories();
  await seedServices();
  await seedTeam();
  await seedOffices();
  await seedPortfolio();
  await seedProducts();
  await seedOrdersAndLeads();
  console.log("Seed complete ✔");
  await prisma.$disconnect();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch((err) => {
    console.error("Seed failed:", err?.message ?? err);
    process.exit(1);
  });
}
