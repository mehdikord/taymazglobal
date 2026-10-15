import type { Advantage, CountryMarket, HomeTeaser, ProcessStep, StatItem } from "@/types";

export const STATS: StatItem[] = [
  { value: "15+", label: { fa: "سال تجربه", en: "Years of experience", tr: "Yıllık deneyim", ru: "Лет опыта" } },
  { value: "40+", label: { fa: "کشور فعال", en: "Active countries", tr: "Aktif ülke", ru: "Стран присутствия" } },
  { value: "2,500+", label: { fa: "پروژه انجام‌شده", en: "Completed projects", tr: "Tamamlanan proje", ru: "Завершённых проектов" } },
  { value: "98%", label: { fa: "رضایت مشتری", en: "Client satisfaction", tr: "Müşteri memnuniyeti", ru: "Удовлетворённость клиентов" } },
];

const SECTOR = {
  textiles: { fa: "نساجی و پوشاک", en: "Textiles & apparel", tr: "Tekstil ve hazır giyim", ru: "Текстиль и одежда" },
  construction: { fa: "مصالح ساختمانی", en: "Construction materials", tr: "İnşaat malzemeleri", ru: "Стройматериалы" },
  food: { fa: "مواد غذایی", en: "Food & agri", tr: "Gıda ve tarım", ru: "Продукты и агро" },
  machinery: { fa: "ماشین‌آلات صنعتی", en: "Industrial machinery", tr: "Endüstriyel makine", ru: "Промышленное оборудование" },
  petrochem: { fa: "پتروشیمی", en: "Petrochemicals", tr: "Petrokimya", ru: "Нефтехимия" },
  electrical: { fa: "تجهیزات برق", en: "Electrical equipment", tr: "Elektrik ekipmanları", ru: "Электрооборудование" },
  reexport: { fa: "تجارت مجدد (Re-export)", en: "Re-export trade", tr: "Re-export ticareti", ru: "Реэкспорт" },
  tech: { fa: "فناوری و الکترونیک", en: "Tech & electronics", tr: "Teknoloji ve elektronik", ru: "Технологии и электроника" },
  auto: { fa: "قطعات خودرو", en: "Automotive parts", tr: "Otomotiv parçaları", ru: "Автозапчасти" },
  chemicals: { fa: "مواد شیمیایی", en: "Chemicals", tr: "Kimyasallar", ru: "Химическая продукция" },
  agrimachinery: { fa: "ماشین‌آلات کشاورزی", en: "Agricultural machinery", tr: "Tarım makineleri", ru: "Сельхозтехника" },
  rawmaterials: { fa: "مواد اولیه", en: "Raw materials", tr: "Hammadde", ru: "Сырьё" },
} as const;

export const COUNTRY_MARKETS: CountryMarket[] = [
  {
    code: "tr",
    name: { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" },
    region: { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
    city: { fa: "استانبول", en: "Istanbul", tr: "İstanbul", ru: "Стамбул" },
    lat: 41.01, lon: 28.98, timeZone: "Europe/Istanbul", transitDays: 0,
    modes: ["sea", "air", "road", "rail"],
    sectors: [SECTOR.textiles, SECTOR.construction, SECTOR.food],
  },
  {
    code: "ir",
    name: { fa: "ایران", en: "Iran", tr: "İran", ru: "Иран" },
    region: { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
    city: { fa: "تهران", en: "Tehran", tr: "Tahran", ru: "Тегеран" },
    lat: 35.69, lon: 51.39, timeZone: "Asia/Tehran", transitDays: 5,
    modes: ["road", "air"],
    sectors: [SECTOR.machinery, SECTOR.petrochem, SECTOR.food],
  },
  {
    code: "iq",
    name: { fa: "عراق", en: "Iraq", tr: "Irak", ru: "Ирак" },
    region: { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
    city: { fa: "بغداد", en: "Baghdad", tr: "Bağdat", ru: "Багдад" },
    lat: 33.31, lon: 44.37, timeZone: "Asia/Baghdad", transitDays: 6,
    modes: ["road", "air"],
    sectors: [SECTOR.construction, SECTOR.electrical, SECTOR.food],
  },
  {
    code: "ae",
    name: { fa: "امارات", en: "UAE", tr: "BAE", ru: "ОАЭ" },
    region: { fa: "خلیج فارس", en: "Gulf", tr: "Körfez", ru: "Залив" },
    city: { fa: "دبی", en: "Dubai", tr: "Dubai", ru: "Дубай" },
    lat: 25.2, lon: 55.27, timeZone: "Asia/Dubai", transitDays: 3,
    modes: ["sea", "air"],
    sectors: [SECTOR.reexport, SECTOR.food, SECTOR.tech],
  },
  {
    code: "de",
    name: { fa: "آلمان", en: "Germany", tr: "Almanya", ru: "Германия" },
    region: { fa: "اروپا", en: "Europe", tr: "Avrupa", ru: "Европа" },
    city: { fa: "برلین", en: "Berlin", tr: "Berlin", ru: "Берлин" },
    lat: 52.52, lon: 13.4, timeZone: "Europe/Berlin", transitDays: 4,
    modes: ["road", "rail", "air"],
    sectors: [SECTOR.machinery, SECTOR.auto, SECTOR.chemicals],
  },
  {
    code: "ru",
    name: { fa: "روسیه", en: "Russia", tr: "Rusya", ru: "Россия" },
    region: { fa: "اروپا/آسیا", en: "Europe/Asia", tr: "Avrupa/Asya", ru: "Европа/Азия" },
    city: { fa: "مسکو", en: "Moscow", tr: "Moskova", ru: "Москва" },
    lat: 55.75, lon: 37.62, timeZone: "Europe/Moscow", transitDays: 6,
    modes: ["road", "sea", "air"],
    sectors: [SECTOR.food, SECTOR.textiles, SECTOR.construction],
  },
  {
    code: "uz",
    name: { fa: "ازبکستان", en: "Uzbekistan", tr: "Özbekistan", ru: "Узбекистан" },
    region: { fa: "آسیای میانه", en: "Central Asia", tr: "Orta Asya", ru: "Центральная Азия" },
    city: { fa: "تاشکند", en: "Tashkent", tr: "Taşkent", ru: "Ташкент" },
    lat: 41.3, lon: 69.24, timeZone: "Asia/Tashkent", transitDays: 9,
    modes: ["road", "rail", "air"],
    sectors: [SECTOR.textiles, SECTOR.agrimachinery, SECTOR.construction],
  },
  {
    code: "cn",
    name: { fa: "چین", en: "China", tr: "Çin", ru: "Китай" },
    region: { fa: "آسیا", en: "Asia", tr: "Asya", ru: "Азия" },
    city: { fa: "شانگهای", en: "Shanghai", tr: "Şanghay", ru: "Шанхай" },
    lat: 31.23, lon: 121.47, timeZone: "Asia/Shanghai", transitDays: 21,
    modes: ["sea", "rail", "air"],
    sectors: [SECTOR.tech, SECTOR.machinery, SECTOR.rawmaterials],
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: { fa: "مشاوره اولیه", en: "Initial consultation", tr: "İlk danışmanlık", ru: "Первичная консультация" },
    description: { fa: "نیاز شما را می‌شنویم و مسیر مناسب را پیشنهاد می‌دهیم.", en: "We listen to your needs and propose the right path.", tr: "İhtiyacınızı dinler ve uygun yolu öneririz.", ru: "Выслушиваем ваши потребности и предлагаем путь." },
    duration: { fa: "۲۴ ساعت", en: "24 hours", tr: "24 saat", ru: "24 часа" },
    details: [
      { fa: "تحلیل نیاز و بازار هدف", en: "Needs & target-market analysis", tr: "İhtiyaç ve hedef pazar analizi", ru: "Анализ потребностей и рынка" },
      { fa: "بررسی مقررات و مجوزها", en: "Regulation & licence check", tr: "Mevzuat ve izin kontrolü", ru: "Проверка норм и лицензий" },
      { fa: "برآورد اولیه هزینه", en: "Preliminary cost estimate", tr: "Ön maliyet tahmini", ru: "Предварительная оценка затрат" },
    ],
  },
  {
    step: 2,
    title: { fa: "طراحی راهکار", en: "Solution design", tr: "Çözüm tasarımı", ru: "Проектирование решения" },
    description: { fa: "برنامه اجرایی، زمان‌بندی و هزینه شفاف ارائه می‌شود.", en: "A clear execution plan, timeline and cost are provided.", tr: "Şeffaf uygulama planı, zaman çizelgesi ve maliyet sunulur.", ru: "Предоставляем прозрачный план, сроки и стоимость." },
    duration: { fa: "۳ تا ۵ روز", en: "3–5 days", tr: "3–5 gün", ru: "3–5 дней" },
    details: [
      { fa: "انتخاب تأمین‌کننده و مسیر حمل", en: "Supplier & route selection", tr: "Tedarikçi ve rota seçimi", ru: "Выбор поставщика и маршрута" },
      { fa: "زمان‌بندی و شرایط اینکوترمز", en: "Timeline & Incoterms", tr: "Zaman planı ve Incoterms", ru: "Сроки и Инкотермс" },
      { fa: "پیشنهاد قیمت شفاف", en: "Transparent quotation", tr: "Şeffaf fiyat teklifi", ru: "Прозрачное предложение" },
    ],
  },
  {
    step: 3,
    title: { fa: "اجرا و پیگیری", en: "Execution & tracking", tr: "Uygulama ve takip", ru: "Реализация и отслеживание" },
    description: { fa: "تیم عملیاتی مسیر را اجرا و وضعیت را به‌روز نگه می‌دارد.", en: "Our operations team executes and keeps status updated.", tr: "Operasyon ekibimiz yürütür ve durumu güncel tutar.", ru: "Операционная команда выполняет и обновляет статус." },
    duration: { fa: "بسته به مسیر", en: "Route-dependent", tr: "Rotaya bağlı", ru: "Зависит от маршрута" },
    details: [
      { fa: "قرارداد و پرداخت امن", en: "Contract & secure payment", tr: "Sözleşme ve güvenli ödeme", ru: "Контракт и безопасная оплата" },
      { fa: "بازرسی، بسته‌بندی و حمل", en: "Inspection, packing & freight", tr: "Kontrol, paketleme ve sevkiyat", ru: "Инспекция, упаковка и перевозка" },
      { fa: "ترخیص گمرکی و رهگیری زنده", en: "Customs clearance & live tracking", tr: "Gümrük işlemleri ve canlı takip", ru: "Таможня и онлайн-отслеживание" },
    ],
  },
  {
    step: 4,
    title: { fa: "تحویل و پشتیبانی", en: "Delivery & support", tr: "Teslimat ve destek", ru: "Доставка и поддержка" },
    description: { fa: "پس از تحویل، پشتیبانی و بهبود مستمر ارائه می‌شود.", en: "Post-delivery support and continuous improvement.", tr: "Teslimat sonrası destek ve sürekli iyileştirme.", ru: "Поддержка после доставки и постоянное улучшение." },
    duration: { fa: "پس از تحویل", en: "After delivery", tr: "Teslimat sonrası", ru: "После доставки" },
    details: [
      { fa: "تحویل در مقصد و اسناد نهایی", en: "Delivery at destination & final docs", tr: "Varışta teslim ve nihai belgeler", ru: "Доставка и итоговые документы" },
      { fa: "گزارش هزینه و عملکرد", en: "Cost & performance report", tr: "Maliyet ve performans raporu", ru: "Отчёт по затратам и результатам" },
      { fa: "پشتیبانی و سفارش‌های بعدی", en: "Support & repeat orders", tr: "Destek ve tekrar siparişler", ru: "Поддержка и повторные заказы" },
    ],
  },
];

export const ADVANTAGES: Advantage[] = [
  {
    title: { fa: "شبکه جهانی", en: "Global network", tr: "Küresel ağ", ru: "Глобальная сеть" },
    description: { fa: "دفاتر و شرکای فعال در بازارهای کلیدی.", en: "Offices and partners in key markets.", tr: "Ana pazarlarda ofisler ve ortaklar.", ru: "Офисы и партнёры на ключевых рынках." },
    badge: { fa: "۴۰+ کشور", en: "40+ countries", tr: "40+ ülke", ru: "40+ стран" },
  },
  {
    title: { fa: "شفافیت عملیاتی", en: "Operational transparency", tr: "Operasyonel şeffaflık", ru: "Операционная прозрачность" },
    description: { fa: "رهگیری و گزارش‌دهی در هر مرحله.", en: "Tracking and reporting at every stage.", tr: "Her aşamada takip ve raporlama.", ru: "Отслеживание и отчётность на каждом этапе." },
    badge: { fa: "رهگیری زنده", en: "Live tracking", tr: "Canlı takip", ru: "Онлайн-трекинг" },
  },
  {
    title: { fa: "تیم چندزبانه", en: "Multilingual team", tr: "Çok dilli ekip", ru: "Многоязычная команда" },
    description: { fa: "پشتیبانی به فارسی، انگلیسی، ترکی و روسی.", en: "Support in Persian, English, Turkish and Russian.", tr: "Farsça, İngilizce, Türkçe ve Rusça destek.", ru: "Поддержка на фарси, английском, турецком и русском." },
    badge: { fa: "۴ زبان", en: "4 languages", tr: "4 dil", ru: "4 языка" },
  },
  {
    title: { fa: "تمرکز B2B", en: "B2B focus", tr: "B2B odak", ru: "Фокус на B2B" },
    description: { fa: "راهکارهای سازمانی، نه فروش خرده.", en: "Enterprise solutions, not retail sales.", tr: "Kurumsal çözümler, perakende değil.", ru: "Корпоративные решения, не розница." },
    badge: { fa: "قرارداد شفاف", en: "Clear contracts", tr: "Şeffaf sözleşme", ru: "Прозрачные контракты" },
  },
];

export const FEATURED_PRODUCT_TEASERS: HomeTeaser[] = [
  {
    slug: "industrial-steel-pipes",
    title: { fa: "لوله فولادی صنعتی", en: "Industrial Steel Pipes", tr: "Endüstriyel Çelik Boru", ru: "Промышленные стальные трубы" },
    summary: { fa: "لوله‌های فولادی برای پروژه‌های ساختمانی و صنعتی.", en: "Steel pipes for construction and industrial projects.", tr: "İnşaat ve endüstriyel projeler için çelik borular.", ru: "Стальные трубы для строительных и промышленных проектов." },
    href: "/products/industrial-steel-pipes",
    category: { fa: "مصالح ساختمانی", en: "Construction", tr: "İnşaat", ru: "Строительство" },
  },
  {
    slug: "food-grade-packaging",
    title: { fa: "بسته‌بندی مواد غذایی", en: "Food-Grade Packaging", tr: "Gıda Ambalajı", ru: "Пищевая упаковка" },
    summary: { fa: "راهکار بسته‌بندی استاندارد برای صادرات مواد غذایی.", en: "Standard packaging solutions for food exports.", tr: "Gıda ihracatı için standart ambalaj çözümleri.", ru: "Стандартная упаковка для экспорта продуктов питания." },
    href: "/products/food-grade-packaging",
    category: { fa: "مواد غذایی", en: "Food", tr: "Gıda", ru: "Продукты питания" },
  },
  {
    slug: "textile-machinery",
    title: { fa: "ماشین‌آلات نساجی", en: "Textile Machinery", tr: "Tekstil Makineleri", ru: "Текстильное оборудование" },
    summary: { fa: "تجهیزات نساجی با پشتیبانی نصب و راه‌اندازی.", en: "Textile equipment with installation support.", tr: "Kurulum desteğiyle tekstil ekipmanları.", ru: "Текстильное оборудование с поддержкой установки." },
    href: "/products/textile-machinery",
    category: { fa: "ماشین‌آلات", en: "Machinery", tr: "Makine", ru: "Оборудование" },
  },
  {
    slug: "industrial-pumps",
    title: { fa: "پمپ صنعتی", en: "Industrial Pumps", tr: "Endüstriyel Pompa", ru: "Промышленные насосы" },
    summary: { fa: "پمپ‌های صنعتی با تست عملکرد و حمل بیمه‌شده.", en: "Industrial pumps with performance testing and insured shipping.", tr: "Performans testi ve sigortalı sevkiyatlı endüstriyel pompalar.", ru: "Промышленные насосы с испытаниями и страхованной доставкой." },
    href: "/products/industrial-pumps",
    category: { fa: "تجهیزات صنعتی", en: "Industrial equipment", tr: "Endüstriyel ekipman", ru: "Промышленное оборудование" },
  },
];

export const FEATURED_PORTFOLIO_TEASERS: HomeTeaser[] = [
  {
    slug: "iraq-construction-supply",
    title: { fa: "تأمین مصالح ساختمانی عراق", en: "Iraq Construction Supply", tr: "Irak İnşaat Tedariki", ru: "Поставка стройматериалов в Ирак" },
    summary: { fa: "تأمین و حمل ۵۰۰ تن مصالح ساختمانی به بغداد.", en: "Sourcing and shipping 500 tons of construction materials to Baghdad.", tr: "Bağdat'a 500 ton inşaat malzemesi tedarik ve sevkiyat.", ru: "Закупка и доставка 500 тонн стройматериалов в Багдад." },
    href: "/portfolio/iraq-construction-supply",
    category: { fa: "تأمین", en: "Sourcing", tr: "Tedarik", ru: "Закупки" },
    imageUrl: "https://images.unsplash.com/photo-1678182451047-196f22a4143e?auto=format&fit=crop&w=1600&q=82",
  },
  {
    slug: "central-asia-export",
    title: { fa: "صادرات به آسیای میانه", en: "Central Asia Export", tr: "Orta Asya İhracatı", ru: "Экспорт в Центральную Азию" },
    summary: { fa: "مسیر صادرات کالاهای صنعتی به ازبکستان و قزاقستان.", en: "Export route for industrial goods to Uzbekistan and Kazakhstan.", tr: "Özbekistan ve Kazakistan'a endüstriyel ürün ihracat rotası.", ru: "Маршрут экспорта промтоваров в Узбекистан и Казахстан." },
    href: "/portfolio/central-asia-export",
    category: { fa: "صادرات", en: "Export", tr: "İhracat", ru: "Экспорт" },
    imageUrl: "https://images.unsplash.com/photo-1699549196388-75f189c4bdbf?auto=format&fit=crop&w=1600&q=82",
  },
];

export const ABOUT_TIMELINE = [
  {
    year: "2010",
    title: { fa: "تأسیس در استانبول", en: "Founded in Istanbul", tr: "İstanbul'da kuruluş", ru: "Основание в Стамбуле" },
    description: { fa: "شروع فعالیت با تمرکز بر تجارت منطقه‌ای.", en: "Started with a focus on regional trade.", tr: "Bölgesel ticarete odaklanarak başladı.", ru: "Начало с фокусом на региональную торговлю." },
  },
  {
    year: "2016",
    title: { fa: "گسترش به خاورمیانه", en: "Middle East expansion", tr: "Orta Doğu genişlemesi", ru: "Расширение на Ближний Восток" },
    description: { fa: "افتتاح دفاتر در تهران و دبی.", en: "Opened offices in Tehran and Dubai.", tr: "Tahran ve Dubai'de ofis açılışı.", ru: "Открытие офисов в Тегеране и Дубае." },
  },
  {
    year: "2022",
    title: { fa: "پلتفرم دیجیتال", en: "Digital platform", tr: "Dijital platform", ru: "Цифровая платформа" },
    description: { fa: "راه‌اندازی سامانه پیگیری و حساب مشتری.", en: "Launched tracking and client account system.", tr: "Takip ve müşteri hesap sistemi devreye alındı.", ru: "Запуск системы отслеживания и личного кабинета." },
  },
];

export const ABOUT_VALUES = [
  {
    title: { fa: "دقت", en: "Precision", tr: "Hassasiyet", ru: "Точность" },
    description: { fa: "هر جزئیات در فرآیند تجاری اهمیت دارد.", en: "Every detail matters in trade operations.", tr: "Ticari süreçte her detay önemlidir.", ru: "Каждая деталь важна в торговых операциях." },
  },
  {
    title: { fa: "شفافیت", en: "Transparency", tr: "Şeffaflık", ru: "Прозрачность" },
    description: { fa: "هزینه‌ها و وضعیت‌ها بدون ابهام گزارش می‌شوند.", en: "Costs and statuses reported without ambiguity.", tr: "Maliyetler ve durumlar belirsizlik olmadan raporlanır.", ru: "Затраты и статусы без неясностей." },
  },
  {
    title: { fa: "اعتماد", en: "Trust", tr: "Güven", ru: "Доверие" },
    description: { fa: "روابط بلندمدت بر پایه عملکرد پایدار.", en: "Long-term relationships built on consistent delivery.", tr: "Tutarlı performansa dayalı uzun vadeli ilişkiler.", ru: "Долгосрочные отношения на основе стабильных результатов." },
  },
];
