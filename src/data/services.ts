import type { Service } from "@/types";

export const SERVICES: Service[] = [
  {
    slug: "international-sourcing",
    title: {
      fa: "تأمین بین‌المللی",
      en: "International Sourcing",
      tr: "Uluslararası Tedarik",
      ru: "Международные закупки",
    },
    summary: {
      fa: "یافتن تأمین‌کنندگان معتبر و مذاکره برای خرید کالا از بازارهای جهانی.",
      en: "Find verified suppliers and negotiate procurement across global markets.",
      tr: "Küresel pazarlarda doğrulanmış tedarikçiler bulun ve tedarik müzakereleri yapın.",
      ru: "Поиск проверенных поставщиков и ведение закупок на мировых рынках.",
    },
    description: {
      fa: "تیم تایماز با شبکه تأمین‌کنندگان در ترکیه، اروپا و آسیا، فرآیند سورسینگ را از شناسایی تا قرارداد و بازرسی پیش از حمل مدیریت می‌کند.",
      en: "Taymaz connects you with supplier networks across Türkiye, Europe and Asia, managing sourcing from identification through contract and pre-shipment inspection.",
      tr: "Taymaz, Türkiye, Avrupa ve Asya'daki tedarikçi ağlarıyla tanımlamadan sözleşmeye ve sevkiyat öncesi denetime kadar tedarik sürecini yönetir.",
      ru: "Taymaz связывает вас с сетью поставщиков в Турции, Европе и Азии, управляя закупками от поиска до контракта и предотгрузочной инспекции.",
    },
    icon: "search",
    featured: true,
    tags: [
      { fa: "سورسینگ", en: "Sourcing", tr: "Tedarik", ru: "Закупки" },
      { fa: "تأمین‌کننده", en: "Supplier", tr: "Tedarikçi", ru: "Поставщик" },
    ],
    benefits: [
      { fa: "دسترسی به تأمین‌کنندگان پیش‌غربال‌شده", en: "Access to pre-vetted suppliers", tr: "Ön elemeden geçmiş tedarikçilere erişim", ru: "Доступ к предварительно проверенным поставщикам" },
      { fa: "مذاکره و قرارداد شفاف", en: "Transparent negotiation and contracts", tr: "Şeffaf müzakere ve sözleşme", ru: "Прозрачные переговоры и контракты" },
      { fa: "بازرسی کیفیت پیش از حمل", en: "Pre-shipment quality inspection", tr: "Sevkiyat öncesi kalite denetimi", ru: "Предотгрузочная инспекция качества" },
    ],
    steps: [
      { fa: "تعریف نیاز و مشخصات کالا", en: "Define requirements and product specs", tr: "İhtiyaç ve ürün özelliklerini tanımlayın", ru: "Определение требований и спецификаций" },
      { fa: "شناسایی و ارزیابی تأمین‌کنندگان", en: "Identify and evaluate suppliers", tr: "Tedarikçileri belirleyin ve değerlendirin", ru: "Поиск и оценка поставщиков" },
      { fa: "مذاکره، قرارداد و بازرسی", en: "Negotiate, contract and inspect", tr: "Müzakere, sözleşme ve denetim", ru: "Переговоры, контракт и инспекция" },
    ],
    countries: [
      { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" },
      { fa: "چین", en: "China", tr: "Çin", ru: "Китай" },
      { fa: "امارات", en: "UAE", tr: "BAE", ru: "ОАЭ" },
    ],
    faq: [
      {
        question: { fa: "چه صنایعی را پوشش می‌دهید؟", en: "Which industries do you cover?", tr: "Hangi sektörleri kapsıyorsunuz?", ru: "Какие отрасли вы охватываете?" },
        answer: { fa: "مصالح ساختمانی، ماشین‌آلات، مواد غذایی، پوشاک و کالاهای صنعتی.", en: "Construction materials, machinery, food products, apparel and industrial goods.", tr: "İnşaat malzemeleri, makine, gıda, tekstil ve endüstriyel ürünler.", ru: "Стройматериалы, оборудование, продукты питания, одежда и промышленные товары." },
      },
      {
        question: { fa: "زمان شروع همکاری چقدر است؟", en: "How long until we can start?", tr: "Ne kadar sürede başlayabiliriz?", ru: "Как быстро можно начать?" },
        answer: { fa: "پس از دریافت مشخصات، معمولاً ظرف ۳ تا ۵ روز کاری پیشنهاد اولیه ارائه می‌شود.", en: "After receiving specs, an initial proposal is usually delivered within 3–5 business days.", tr: "Özellikler alındıktan sonra genellikle 3–5 iş günü içinde ilk teklif sunulur.", ru: "После получения спецификаций первичное предложение обычно готовится за 3–5 рабочих дней." },
      },
    ],
  },
  {
    slug: "export-management",
    title: { fa: "مدیریت صادرات", en: "Export Management", tr: "İhracat Yönetimi", ru: "Управление экспортом" },
    summary: { fa: "برنامه‌ریزی و اجرای صادرات کالا به بازارهای هدف.", en: "Plan and execute exports to target markets.", tr: "Hedef pazarlara ihracat planlayın ve yürütün.", ru: "Планирование и организация экспорта на целевые рынки." },
    description: { fa: "از آماده‌سازی اسناد گمرکی تا هماهنگی حمل و رهگیری، مسیر صادرات شما را یکپارچه مدیریت می‌کنیم.", en: "From customs documentation to freight coordination and tracking, we manage your export journey end to end.", tr: "Gümrük belgelerinden nakliye koordinasyonuna kadar ihracat sürecinizi uçtan uca yönetiyoruz.", ru: "От таможенных документов до координации перевозки — управляем экспортом под ключ." },
    icon: "globe",
    featured: true,
    tags: [{ fa: "صادرات", en: "Export", tr: "İhracat", ru: "Экспорт" }],
    benefits: [
      { fa: "مستندسازی کامل صادراتی", en: "Complete export documentation", tr: "Eksiksiz ihracat dokümantasyonu", ru: "Полный пакет экспортных документов" },
      { fa: "هماهنگی با خطوط حمل", en: "Freight line coordination", tr: "Taşıma hatlarıyla koordinasyon", ru: "Координация с перевозчиками" },
      { fa: "پشتیبانی مقصد", en: "Destination support", tr: "Varış noktası desteği", ru: "Поддержка в стране назначения" },
    ],
    steps: [
      { fa: "ارزیابی بازار و مقررات", en: "Market and regulation assessment", tr: "Pazar ve mevzuat değerlendirmesi", ru: "Оценка рынка и регуляций" },
      { fa: "آماده‌سازی اسناد و بسته‌بندی", en: "Document and packaging preparation", tr: "Belge ve paketleme hazırlığı", ru: "Подготовка документов и упаковки" },
      { fa: "حمل، ترخیص و تحویل", en: "Shipping, clearance and delivery", tr: "Sevkiyat, gümrük ve teslimat", ru: "Отгрузка, таможня и доставка" },
    ],
    countries: [
      { fa: "عراق", en: "Iraq", tr: "Irak", ru: "Ирак" },
      { fa: "افغانستان", en: "Afghanistan", tr: "Afganistan", ru: "Афганистан" },
      { fa: "آسیای میانه", en: "Central Asia", tr: "Orta Asya", ru: "Центральная Азия" },
    ],
    faq: [
      {
        question: { fa: "آیا صادرات به اروپا هم پوشش داده می‌شود؟", en: "Do you handle exports to Europe?", tr: "Avrupa'ya ihracat da kapsanıyor mu?", ru: "Работаете ли вы с экспортом в Европу?" },
        answer: { fa: "بله، مسیرهای اروپا و خاورمیانه هر دو پشتیبانی می‌شوند.", en: "Yes, both European and Middle Eastern routes are supported.", tr: "Evet, hem Avrupa hem Orta Doğu rotaları desteklenir.", ru: "Да, поддерживаются маршруты в Европу и на Ближний Восток." },
      },
    ],
  },
  {
    slug: "import-clearance",
    title: { fa: "واردات و ترخیص", en: "Import & Clearance", tr: "İthalat ve Gümrük", ru: "Импорт и таможня" },
    summary: { fa: "واردات قانونی کالا و ترخیص سریع از گمرک.", en: "Legal import and fast customs clearance.", tr: "Yasal ithalat ve hızlı gümrük işlemleri.", ru: "Легальный импорт и быстрое таможенное оформление." },
    description: { fa: "تیم گمرکی ما فرآیند واردات را از ثبت سفارش تا تحویل در انبار شما مدیریت می‌کند.", en: "Our customs team manages imports from order registration to warehouse delivery.", tr: "Gümrük ekibimiz sipariş kaydından depo teslimatına kadar ithalatı yönetir.", ru: "Наша таможенная команда ведёт импорт от регистрации заказа до доставки на склад." },
    icon: "package",
    featured: true,
    tags: [{ fa: "واردات", en: "Import", tr: "İthalat", ru: "Импорт" }],
    benefits: [
      { fa: "کاهش زمان توقف در گمرک", en: "Reduced customs dwell time", tr: "Gümrükte bekleme süresinin azaltılması", ru: "Сокращение времени на таможне" },
      { fa: "محاسبه دقیق هزینه‌ها", en: "Accurate cost calculation", tr: "Doğru maliyet hesaplama", ru: "Точный расчёт затрат" },
      { fa: "پایش وضعیت لحظه‌ای", en: "Real-time status monitoring", tr: "Anlık durum takibi", ru: "Мониторинг статуса в реальном времени" },
    ],
    steps: [
      { fa: "بررسی تعرفه و مجوزها", en: "Tariff and permit review", tr: "Tarife ve izin incelemesi", ru: "Проверка тарифов и разрешений" },
      { fa: "ثبت اظهارنامه و پرداخت", en: "Declaration and payment", tr: "Beyanname ve ödeme", ru: "Декларирование и оплата" },
      { fa: "ترخیص و تحویل", en: "Clearance and delivery", tr: "Gümrük ve teslimat", ru: "Оформление и доставка" },
    ],
    countries: [
      { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" },
      { fa: "ایران", en: "Iran", tr: "İran", ru: "Иран" },
    ],
    faq: [
      {
        question: { fa: "چه مدارکی لازم است؟", en: "What documents are required?", tr: "Hangi belgeler gerekli?", ru: "Какие документы нужны?" },
        answer: { fa: "پروفرما، بارنامه، گواهی مبدأ و در صورت نیاز مجوزهای خاص.", en: "Proforma, bill of lading, certificate of origin and special permits when required.", tr: "Proforma, konşimento, menşe belgesi ve gerektiğinde özel izinler.", ru: "Проформа, коносамент, сертификат происхождения и спецразрешения при необходимости." },
      },
    ],
  },
  {
    slug: "customs-brokerage",
    title: { fa: "کارگزاری گمرکی", en: "Customs Brokerage", tr: "Gümrük Müşavirliği", ru: "Таможенное брокерство" },
    summary: { fa: "نمایندگی رسمی در امور گمرکی و رفع مشکلات ترخیص.", en: "Official representation for customs matters and clearance issues.", tr: "Gümrük işlemlerinde resmi temsil ve sorun çözümü.", ru: "Официальное представительство по таможенным вопросам." },
    description: { fa: "کارشناسان گمرکی ما با آشنایی عمیق مقررات، ریسک تأخیر و جریمه را به حداقل می‌رسانند.", en: "Our customs specialists minimize delay and penalty risks with deep regulatory knowledge.", tr: "Gümrük uzmanlarımız derin mevzuat bilgisiyle gecikme ve ceza riskini azaltır.", ru: "Наши специалисты минимизируют риски задержек и штрафов благодаря знанию регламентов." },
    icon: "shield",
    featured: false,
    tags: [{ fa: "گمرک", en: "Customs", tr: "Gümrük", ru: "Таможня" }],
    benefits: [
      { fa: "نمایندگی رسمی", en: "Official representation", tr: "Resmi temsil", ru: "Официальное представительство" },
      { fa: "مشاوره تعرفه", en: "Tariff consulting", tr: "Tarife danışmanlığı", ru: "Консультации по тарифам" },
      { fa: "رسیدگی به پرونده‌های معوق", en: "Backlog case handling", tr: "Birikmiş dosya yönetimi", ru: "Работа с отложенными делами" },
    ],
    steps: [
      { fa: "بررسی پرونده", en: "Case review", tr: "Dosya incelemesi", ru: "Анализ дела" },
      { fa: "اقدامات گمرکی", en: "Customs actions", tr: "Gümrük işlemleri", ru: "Таможенные действия" },
      { fa: "بستن پرونده", en: "Case closure", tr: "Dosya kapatma", ru: "Закрытие дела" },
    ],
    countries: [{ fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" }],
    faq: [],
  },
  {
    slug: "freight-logistics",
    title: { fa: "حمل و لجستیک", en: "Freight & Logistics", tr: "Nakliye ve Lojistik", ru: "Перевозки и логистика" },
    summary: { fa: "حمل زمینی، دریایی و هوایی با رهگیری یکپارچه.", en: "Road, sea and air freight with unified tracking.", tr: "Karayolu, deniz ve hava taşımacılığı ile entegre takip.", ru: "Авто-, морские и авиаперевозки с единым отслеживанием." },
    description: { fa: "با شبکه شرکای حمل، بهترین مسیر و هزینه را برای هر محموله پیشنهاد می‌دهیم.", en: "Through our freight partner network, we propose the best route and cost for each shipment.", tr: "Taşıma ortak ağımızla her sevkiyat için en iyi rota ve maliyeti öneriyoruz.", ru: "Через сеть партнёров предлагаем оптимальный маршрут и стоимость для каждой отправки." },
    icon: "truck",
    featured: true,
    tags: [{ fa: "لجستیک", en: "Logistics", tr: "Lojistik", ru: "Логистика" }],
    benefits: [
      { fa: "چندوجهی (زمینی/دریایی/هوایی)", en: "Multimodal options", tr: "Çok modlu seçenekler", ru: "Мультимодальные варианты" },
      { fa: "بیمه محموله", en: "Cargo insurance", tr: "Kargo sigortası", ru: "Страхование груза" },
      { fa: "رهگیری لحظه‌ای", en: "Live tracking", tr: "Canlı takip", ru: "Отслеживание в реальном времени" },
    ],
    steps: [
      { fa: "برنامه‌ریزی مسیر", en: "Route planning", tr: "Rota planlama", ru: "Планирование маршрута" },
      { fa: "رزرو و بارگیری", en: "Booking and loading", tr: "Rezervasyon ve yükleme", ru: "Бронирование и погрузка" },
      { fa: "تحویل نهایی", en: "Final delivery", tr: "Nihai teslimat", ru: "Финальная доставка" },
    ],
    countries: [
      { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" },
      { fa: "خاورمیانه", en: "Middle East", tr: "Orta Doğu", ru: "Ближний Восток" },
      { fa: "اروپا", en: "Europe", tr: "Avrupa", ru: "Европа" },
    ],
    faq: [
      {
        question: { fa: "حداقل حجم محموله چقدر است؟", en: "What is the minimum shipment volume?", tr: "Minimum sevkiyat hacmi nedir?", ru: "Какой минимальный объём отправки?" },
        answer: { fa: "بسته به مسیر، از یک پالت تا محموله‌های FCL پشتیبانی می‌شود.", en: "Depending on route, from one pallet to FCL shipments.", tr: "Rotaya bağlı olarak bir paletten FCL sevkiyatlara kadar.", ru: "В зависимости от маршрута — от одного паллета до FCL." },
      },
    ],
  },
  {
    slug: "market-entry",
    title: { fa: "ورود به بازار", en: "Market Entry", tr: "Pazara Giriş", ru: "Выход на рынок" },
    summary: { fa: "استراتژی ورود به بازارهای جدید با تحلیل مقررات و شریک محلی.", en: "Market entry strategy with regulatory analysis and local partners.", tr: "Mevzuat analizi ve yerel ortaklarla pazara giriş stratejisi.", ru: "Стратегия выхода на рынок с анализом регуляций и локальными партнёрами." },
    description: { fa: "قبل از سرمایه‌گذاری، بازار هدف را از نظر مقررات، رقبا و کانال‌های توزیع بررسی می‌کنیم.", en: "Before investment, we assess target markets for regulations, competition and distribution channels.", tr: "Yatırımdan önce hedef pazarı mevzuat, rekabet ve dağıtım kanalları açısından değerlendiriyoruz.", ru: "Перед инвестициями оцениваем целевой рынок по регуляциям, конкуренции и каналам сбыта." },
    icon: "map",
    featured: false,
    tags: [{ fa: "بازار", en: "Market", tr: "Pazar", ru: "Рынок" }],
    benefits: [
      { fa: "تحلیل مقررات", en: "Regulatory analysis", tr: "Mevzuat analizi", ru: "Анализ регуляций" },
      { fa: "شناسایی شریک محلی", en: "Local partner identification", tr: "Yerel ortak belirleme", ru: "Поиск локальных партнёров" },
      { fa: "نقشه راه اجرایی", en: "Execution roadmap", tr: "Uygulama yol haritası", ru: "Дорожная карта" },
    ],
    steps: [
      { fa: "تحقیق بازار", en: "Market research", tr: "Pazar araştırması", ru: "Исследование рынка" },
      { fa: "طراحی استراتژی", en: "Strategy design", tr: "Strateji tasarımı", ru: "Разработка стратегии" },
      { fa: "اجرای مرحله‌ای", en: "Phased execution", tr: "Aşamalı uygulama", ru: "Поэтапная реализация" },
    ],
    countries: [
      { fa: "عراق", en: "Iraq", tr: "Irak", ru: "Ирак" },
      { fa: "ازبکستان", en: "Uzbekistan", tr: "Özbekistan", ru: "Узбекистан" },
    ],
    faq: [],
  },
  {
    slug: "quality-inspection",
    title: { fa: "بازرسی کیفیت", en: "Quality Inspection", tr: "Kalite Denetimi", ru: "Инспекция качества" },
    summary: { fa: "بازرسی پیش از حمل و کنترل کیفیت در مبدأ.", en: "Pre-shipment and origin quality control.", tr: "Sevkiyat öncesi ve menşe kalite kontrolü.", ru: "Предотгрузочный контроль качества в стране происхождения." },
    description: { fa: "بازرسان ما در محل تولید یا انبار، مطابقت کالا با مشخصات قراردادی را تأیید می‌کنند.", en: "Our inspectors verify product conformity at production site or warehouse.", tr: "Denetçilerimiz üretim veya depoda ürünün sözleşmeye uygunluğunu doğrular.", ru: "Инспекторы проверяют соответствие товара контрактным спецификациям на месте." },
    icon: "shield",
    featured: false,
    tags: [{ fa: "کیفیت", en: "Quality", tr: "Kalite", ru: "Качество" }],
    benefits: [
      { fa: "گزارش تصویری", en: "Photo report", tr: "Fotoğraflı rapor", ru: "Фотоотчёт" },
      { fa: "چک‌لیست استاندارد", en: "Standard checklist", tr: "Standart kontrol listesi", ru: "Стандартный чек-лист" },
      { fa: "تأیید پیش از پرداخت", en: "Pre-payment approval", tr: "Ödeme öncesi onay", ru: "Подтверждение до оплаты" },
    ],
    steps: [
      { fa: "تعریف معیارها", en: "Define criteria", tr: "Kriterleri tanımlayın", ru: "Определение критериев" },
      { fa: "بازرسی میدانی", en: "On-site inspection", tr: "Saha denetimi", ru: "Выездная инспекция" },
      { fa: "گزارش و توصیه", en: "Report and recommendation", tr: "Rapor ve öneri", ru: "Отчёт и рекомендации" },
    ],
    countries: [
      { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" },
      { fa: "چین", en: "China", tr: "Çin", ru: "Китай" },
    ],
    faq: [],
  },
  {
    slug: "trade-consulting",
    title: { fa: "مشاوره تجاری", en: "Trade Consulting", tr: "Ticari Danışmanlık", ru: "Торговый консалтинг" },
    summary: { fa: "مشاوره تخصصی برای تصمیم‌های تجاری بین‌المللی.", en: "Expert advice for international trade decisions.", tr: "Uluslararası ticaret kararları için uzman danışmanlık.", ru: "Экспертные консультации по международной торговле." },
    description: { fa: "از تحلیل هزینه-فایده تا ساختار قرارداد و مدیریت ریسک، در کنار تیم شما هستیم.", en: "From cost-benefit analysis to contract structure and risk management, we work alongside your team.", tr: "Maliyet-fayda analizinden sözleşme yapısına ve risk yönetimine kadar ekibinizin yanındayız.", ru: "От анализа затрат до структуры контракта и управления рисками — работаем с вашей командой." },
    icon: "briefcase",
    featured: false,
    tags: [{ fa: "مشاوره", en: "Consulting", tr: "Danışmanlık", ru: "Консалтинг" }],
    benefits: [
      { fa: "جلسات اختصاصی", en: "Dedicated sessions", tr: "Özel oturumlar", ru: "Индивидуальные сессии" },
      { fa: "تحلیل ریسک", en: "Risk analysis", tr: "Risk analizi", ru: "Анализ рисков" },
      { fa: "پشتیبانی مداوم", en: "Ongoing support", tr: "Sürekli destek", ru: "Постоянная поддержка" },
    ],
    steps: [
      { fa: "جلسه کشف نیاز", en: "Discovery session", tr: "İhtiyaç keşif oturumu", ru: "Сессия выявления потребностей" },
      { fa: "تحلیل و پیشنهاد", en: "Analysis and proposal", tr: "Analiz ve teklif", ru: "Анализ и предложение" },
      { fa: "همراهی اجرا", en: "Execution support", tr: "Uygulama desteği", ru: "Сопровождение реализации" },
    ],
    countries: [
      { fa: "جهانی", en: "Global", tr: "Küresel", ru: "Глобально" },
    ],
    faq: [
      {
        question: { fa: "آیا مشاوره آنلاین هم دارید؟", en: "Is online consulting available?", tr: "Online danışmanlık var mı?", ru: "Доступны ли онлайн-консультации?" },
        answer: { fa: "بله، جلسات ویدیویی به چهار زبان برگزار می‌شود.", en: "Yes, video sessions are held in all four languages.", tr: "Evet, dört dilde video oturumlar düzenlenir.", ru: "Да, видеосессии проводятся на всех четырёх языках." },
      },
    ],
  },
];
