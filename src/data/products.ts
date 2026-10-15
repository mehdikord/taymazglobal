import type { Product } from "@/types";

const G1 = "from-slate-700 via-slate-500 to-slate-300";
const G2 = "from-amber-600 via-orange-400 to-amber-200";
const G3 = "from-brand-navy via-blue-600 to-brand-navy-soft";
const G4 = "from-violet-600 via-purple-400 to-fuchsia-200";
const G5 = "from-teal-700 via-cyan-500 to-teal-200";
const G6 = "from-indigo-700 via-indigo-500 to-sky-200";

export const PRODUCTS: Product[] = [
  {
    slug: "industrial-steel-pipes",
    title: { fa: "لوله فولادی صنعتی", en: "Industrial Steel Pipes", tr: "Endüstriyel Çelik Boru", ru: "Промышленные стальные трубы" },
    summary: { fa: "لوله‌های فولادی گالوانیزه و سیاه برای پروژه‌های ساختمانی و صنعتی.", en: "Galvanized and black steel pipes for construction and industrial projects.", tr: "İnşaat ve endüstriyel projeler için galvanizli ve siyah çelik borular.", ru: "Оцинкованные и чёрные стальные трубы для строительных и промышленных проектов." },
    description: { fa: "تأمین لوله فولادی با استانداردهای ASTM و EN، بازرسی کیفیت پیش از حمل و بسته‌بندی مناسب صادرات.", en: "Steel pipe supply to ASTM and EN standards, pre-shipment quality inspection and export-ready packaging.", tr: "ASTM ve EN standartlarında çelik boru tedariki, sevkiyat öncesi kalite denetimi ve ihracata uygun paketleme.", ru: "Поставка стальных труб по стандارتам ASTM и EN, предотгрузочная инспекция и экспортная упаковка." },
    type: "physical", categorySlug: "construction", priceType: "range", price: 450, priceMax: 1200, currency: "USD", featured: true,
    tags: [{ fa: "فولاد", en: "Steel", tr: "Çelik", ru: "Сталь" }, { fa: "صادرات", en: "Export", tr: "İhracat", ru: "Экспорт" }],
    specs: [
      { label: { fa: "قطر", en: "Diameter", tr: "Çap", ru: "Диаметр" }, value: { fa: "½ تا 24 اینچ", en: "½ to 24 inch", tr: "½ - 24 inç", ru: "½–24 дюйма" } },
      { label: { fa: "استاندارد", en: "Standard", tr: "Standart", ru: "Стандарт" }, value: { fa: "ASTM A53 / EN 10255", en: "ASTM A53 / EN 10255", tr: "ASTM A53 / EN 10255", ru: "ASTM A53 / EN 10255" } },
      { label: { fa: "حداقل سفارش", en: "MOQ", tr: "Min. sipariş", ru: "Мин. заказ" }, value: { fa: "5 تن", en: "5 tons", tr: "5 ton", ru: "5 тонн" } },
    ],
    media: [
      { id: "1", type: "image", alt: { fa: "لوله فولادی", en: "Steel pipes", tr: "Çelik borular", ru: "Стальные трубы" }, gradient: G1, imageUrl: "/images/products/industrial-steel-pipes.webp" },
      { id: "2", type: "image", alt: { fa: "انبار لوله", en: "Pipe warehouse", tr: "Boru deposu", ru: "Склад труб" }, gradient: "from-zinc-600 via-zinc-400 to-zinc-200" },
      { id: "3", type: "video", alt: { fa: "بازرسی کیفیت", en: "Quality inspection", tr: "Kalite denetimi", ru: "Инспекция качества" }, gradient: G1 },
    ],
  },
  {
    slug: "cement-clinker",
    title: { fa: "کلینکر سیمان", en: "Cement Clinker", tr: "Çimento Klinkeri", ru: "Цементный клинкер" },
    summary: { fa: "کلینکر سیمان پرتلند با کیفیت صادراتی.", en: "Export-grade Portland cement clinker.", tr: "İhracat kalitesinde Portland çimento klinkeri.", ru: "Портландцементный клинкер экспортного качества." },
    description: { fa: "تأمین کلینکر از کارخانه‌های معتبر ترکیه با گواهی آنالیز و حمل فله یا کیسه‌ای.", en: "Clinker from certified Turkish plants with analysis certificate, bulk or bagged shipping.", tr: "Sertifikalı Türk tesislerinden analiz sertifikalı klinker, dökme veya çuval sevkiyat.", ru: "Клинкер с сертифицированных турецких заводов с сертификатом анализа, навалом или в мешках." },
    type: "physical", categorySlug: "construction", priceType: "inquiry", featured: false,
    tags: [{ fa: "سیمان", en: "Cement", tr: "Çimento", ru: "Цемент" }],
    specs: [
      { label: { fa: "نوع", en: "Type", tr: "Tip", ru: "Тип" }, value: { fa: "پرتلند Type I", en: "Portland Type I", tr: "Portland Tip I", ru: "Портланд Type I" } },
      { label: { fa: "بسته‌بندی", en: "Packaging", tr: "Paketleme", ru: "Упаковка" }, value: { fa: "فله / 50kg", en: "Bulk / 50kg", tr: "Dökme / 50kg", ru: "Навал / 50 кг" } },
    ],
    media: [{ id: "1", type: "image", alt: { fa: "کلینکر", en: "Clinker", tr: "Klinker", ru: "Клинкер" }, gradient: G1, imageUrl: "/images/products/cement-clinker.webp" }],
  },
  {
    slug: "food-grade-packaging",
    title: { fa: "بسته‌بندی مواد غذایی", en: "Food-Grade Packaging", tr: "Gıda Ambalajı", ru: "Пищевая упаковка" },
    summary: { fa: "راهکار بسته‌بندی استاندارد برای صادرات مواد غذایی.", en: "Standard packaging solutions for food exports.", tr: "Gıda ihracatı için standart ambalaj çözümleri.", ru: "Стандартная упаковка для экспорта продуктов питания." },
    description: { fa: "طراحی و تأمین بسته‌بندی مطابق استانداردهای FDA و اتحادیه اروپا برای محصولات غذایی صادراتی.", en: "Design and supply packaging compliant with FDA and EU standards for exported food products.", tr: "İhracat gıda ürünleri için FDA ve AB uyumlu ambalaj tasarımı ve tedariki.", ru: "Разработка и поставка упаковки по стандартам FDA и ЕС для экспорта продуктов питания." },
    type: "service", categorySlug: "food", priceType: "inquiry", featured: true,
    tags: [{ fa: "بسته‌بندی", en: "Packaging", tr: "Ambalaj", ru: "Упаковка" }, { fa: "صادرات", en: "Export", tr: "İhracat", ru: "Экспорт" }],
    specs: [
      { label: { fa: "استاندارد", en: "Standard", tr: "Standart", ru: "Стандарт" }, value: { fa: "FDA / EU", en: "FDA / EU", tr: "FDA / AB", ru: "FDA / ЕС" } },
      { label: { fa: "نوع", en: "Type", tr: "Tip", ru: "Тип" }, value: { fa: "خدمت طراحی و تأمین", en: "Design & supply service", tr: "Tasarım ve tedarik hizmeti", ru: "Услуга проектирования и поставки" } },
    ],
    media: [
      { id: "1", type: "image", alt: { fa: "بسته‌بندی غذایی", en: "Food packaging", tr: "Gıda ambalajı", ru: "Пищевая упаковка" }, gradient: G2, imageUrl: "/images/products/food-grade-packaging.webp" },
      { id: "2", type: "image", alt: { fa: "برچسب صادراتی", en: "Export labels", tr: "İhracat etiketleri", ru: "Экспортные этикетки" }, gradient: "from-orange-500 via-amber-300 to-yellow-100" },
    ],
  },
  {
    slug: "dried-fruits-export",
    title: { fa: "میوه خشک صادراتی", en: "Export Dried Fruits", tr: "İhracat Kuru Meyve", ru: "Экспорт сухофруктов" },
    summary: { fa: "انجیر، زردآلو و کشمش با بسته‌بندی صادراتی.", en: "Figs, apricots and raisins with export packaging.", tr: "İhracat ambalajlı incir, kayısı ve kuru üzüm.", ru: "Инжир, абрикосы и изюм в экспортной упаковке." },
    description: { fa: "تأمین میوه خشک از باغ‌های ترکیه با کنترل رطوبت، بسته‌بندی و مجوزهای صادراتی.", en: "Dried fruit from Turkish orchards with moisture control, packaging and export permits.", tr: "Türk bahçelerinden nem kontrolü, paketleme ve ihracat izinleriyle kuru meyve.", ru: "Сухофрукты из турецких садов с контролем влажности, упаковкой и экспортными разрешениями." },
    type: "physical", categorySlug: "food", priceType: "fixed", price: 3.2, currency: "USD", featured: false,
    tags: [{ fa: "میوه خشک", en: "Dried fruit", tr: "Kuru meyve", ru: "Сухофрукты" }],
    specs: [
      { label: { fa: "واحد", en: "Unit", tr: "Birim", ru: "Единица" }, value: { fa: "کیلوگرم", en: "Kilogram", tr: "Kilogram", ru: "Килограмм" } },
      { label: { fa: "حداقل سفارش", en: "MOQ", tr: "Min. sipariş", ru: "Мин. заказ" }, value: { fa: "500 کیلو", en: "500 kg", tr: "500 kg", ru: "500 кг" } },
    ],
    media: [{ id: "1", type: "image", alt: { fa: "میوه خشک", en: "Dried fruits", tr: "Kuru meyveler", ru: "Сухофрукты" }, gradient: G2, imageUrl: "/images/products/dried-fruits-export.webp" }],
  },
  {
    slug: "textile-machinery",
    title: { fa: "ماشین‌آلات نساجی", en: "Textile Machinery", tr: "Tekstil Makineleri", ru: "Текстильное оборудование" },
    summary: { fa: "تجهیزات نساجی با پشتیبانی نصب و راه‌اندازی.", en: "Textile equipment with installation support.", tr: "Kurulum desteğiyle tekstil ekipmanları.", ru: "Текстильное оборудование с поддержкой установки." },
    description: { fa: "تأمین ماشین‌آلات بافندگی و رنگرزی از تولیدکنندگان اروپایی و ترکیه با خدمات نصب و آموزش.", en: "Weaving and dyeing machinery from European and Turkish manufacturers with installation and training.", tr: "Avrupa ve Türk üreticilerden dokuma ve boyama makineleri, kurulum ve eğitimle.", ru: "Ткацкое и красильное оборудование от европейских и турецких производителей с установкой и обучением." },
    type: "physical", categorySlug: "machinery", priceType: "inquiry", featured: true,
    tags: [{ fa: "نساجی", en: "Textile", tr: "Tekstil", ru: "Текстиль" }, { fa: "ماشین‌آلات", en: "Machinery", tr: "Makine", ru: "Оборудование" }],
    specs: [
      { label: { fa: "گارانتی", en: "Warranty", tr: "Garanti", ru: "Гарантия" }, value: { fa: "12 ماه", en: "12 months", tr: "12 ay", ru: "12 месяцев" } },
      { label: { fa: "نصب", en: "Installation", tr: "Kurulum", ru: "Установка" }, value: { fa: "اختیاری", en: "Optional", tr: "Opsiyonel", ru: "Опционально" } },
    ],
    media: [
      { id: "1", type: "image", alt: { fa: "ماشین نساجی", en: "Textile machine", tr: "Tekstil makinesi", ru: "Текстильная машина" }, gradient: G3, imageUrl: "/images/products/textile-machinery.webp" },
      { id: "2", type: "video", alt: { fa: "راه‌اندازی", en: "Commissioning", tr: "Devreye alma", ru: "Ввод в эксплуатацию" }, gradient: G3 },
    ],
  },
  {
    slug: "industrial-pumps",
    title: { fa: "پمپ صنعتی", en: "Industrial Pumps", tr: "Endüstriyel Pompa", ru: "Промышленные насосы" },
    summary: { fa: "پمپ‌های سانتریفیوژ و پیستونی برای صنایع مختلف.", en: "Centrifugal and piston pumps for various industries.", tr: "Çeşitli endüstriler için santrifüj ve piston pompalar.", ru: "Центробежные и поршневые насосы для разных отраслей." },
    description: { fa: "تأمین پمپ با مشخصات فنی دقیق، تست عملکرد و حمل با بیمه کامل.", en: "Pump supply with precise specs, performance testing and fully insured shipping.", tr: "Hassas özelliklerle pompa tedariki, performans testi ve tam sigortalı sevkiyat.", ru: "Поставка насосов с точными характеристиками, испытаниями и полной страховкой перевозки." },
    type: "physical", categorySlug: "machinery", priceType: "range", price: 800, priceMax: 15000, currency: "USD", featured: false,
    tags: [{ fa: "پمپ", en: "Pump", tr: "Pompa", ru: "Насос" }],
    specs: [
      { label: { fa: "دبی", en: "Flow rate", tr: "Debi", ru: "Производительность" }, value: { fa: "تا 500 m³/h", en: "Up to 500 m³/h", tr: "500 m³/h'ye kadar", ru: "До 500 м³/ч" } },
    ],
    media: [{ id: "1", type: "image", alt: { fa: "پمپ صنعتی", en: "Industrial pump", tr: "Endüstriyel pompa", ru: "Промышленный насос" }, gradient: G3, imageUrl: "/images/products/industrial-pumps.webp" }],
  },
  {
    slug: "cotton-fabric-rolls",
    title: { fa: "رول پارچه پنبه‌ای", en: "Cotton Fabric Rolls", tr: "Pamuklu Kumaş Ruloları", ru: "Рулоны хлопчатобумажной ткани" },
    summary: { fa: "پارچه پنبه‌ای با کیفیت صادراتی و رنگ‌بندی متنوع.", en: "Export-quality cotton fabric in various colors.", tr: "Çeşitli renklerde ihracat kalitesinde pamuklu kumaş.", ru: "Хлопчатобумажная ткань экспортного качества в разных цветах." },
    description: { fa: "تأمین پارچه از کارخانه‌های نساجی ترکیه با نمونه رنگ و کنترل کیفیت.", en: "Fabric from Turkish textile mills with color samples and quality control.", tr: "Renk numuneleri ve kalite kontrolüyle Türk tekstil fabrikalarından kumaş.", ru: "Ткань с турецких фабрик с образцами цветов и контролем качества." },
    type: "physical", categorySlug: "textiles", priceType: "fixed", price: 4.5, currency: "USD", featured: false,
    tags: [{ fa: "پارچه", en: "Fabric", tr: "Kumaş", ru: "Ткань" }],
    specs: [
      { label: { fa: "عرض", en: "Width", tr: "En", ru: "Ширина" }, value: { fa: "150-180 سانتی‌متر", en: "150-180 cm", tr: "150-180 cm", ru: "150–180 см" } },
      { label: { fa: "واحد", en: "Unit", tr: "Birim", ru: "Единица" }, value: { fa: "متر", en: "Meter", tr: "Metre", ru: "Метр" } },
    ],
    media: [{ id: "1", type: "image", alt: { fa: "پارچه پنبه‌ای", en: "Cotton fabric", tr: "Pamuklu kumaş", ru: "Хлопковая ткань" }, gradient: G4, imageUrl: "/images/products/cotton-fabric-rolls.webp" }],
  },
  {
    slug: "polyester-yarn",
    title: { fa: "نخ پلی‌استر", en: "Polyester Yarn", tr: "Polyester İplik", ru: "Полиэстеровая пряжа" },
    summary: { fa: "نخ پلی‌استر صنعتی برای بافندگی و دوخت.", en: "Industrial polyester yarn for weaving and sewing.", tr: "Dokuma ve dikim için endüstriyel polyester iplik.", ru: "Промышленная полиэстеровая пряжа для ткачества и шитья." },
    description: { fa: "تأمین نخ با denier و رنگ‌های سفارشی، بسته‌بندی مخروطی استاندارد.", en: "Yarn supply with custom denier and colors, standard cone packaging.", tr: "Özel denier ve renklerle iplik tedariki, standart konik paketleme.", ru: "Поставка пряжи с индивидуальным denier и цветами, стандартная конусная упаковка." },
    type: "physical", categorySlug: "textiles", priceType: "inquiry", featured: false,
    tags: [{ fa: "نخ", en: "Yarn", tr: "İplik", ru: "Пряжа" }],
    specs: [{ label: { fa: "Denier", en: "Denier", tr: "Denier", ru: "Denier" }, value: { fa: "75-300", en: "75-300", tr: "75-300", ru: "75–300" } }],
    media: [{ id: "1", type: "image", alt: { fa: "نخ پلی‌استر", en: "Polyester yarn", tr: "Polyester iplik", ru: "Полиэстеровая пряжа" }, gradient: G4, imageUrl: "/images/products/polyester-yarn.webp" }],
  },
  {
    slug: "industrial-solvents",
    title: { fa: "حلال‌های صنعتی", en: "Industrial Solvents", tr: "Endüstriyel Solventler", ru: "Промышленные растворители" },
    summary: { fa: "حلال‌های شیمیایی با مجوز حمل و MSDS کامل.", en: "Chemical solvents with transport permits and full MSDS.", tr: "Taşıma izinleri ve tam MSDS ile kimyasal solventler.", ru: "Химические растворители с разрешениями на перевозку и полным MSDS." },
    description: { fa: "تأمین حلال‌های صنعتی با رعایت مقررات IMDG و بسته‌بندی ایمن.", en: "Industrial solvent supply compliant with IMDG regulations and safe packaging.", tr: "IMDG düzenlemelerine uygun ve güvenli paketlemeyle endüstriyel solvent tedariki.", ru: "Поставка растворителей по IMDG с безопасной упаковкой." },
    type: "physical", categorySlug: "chemicals", priceType: "inquiry", featured: false,
    tags: [{ fa: "شیمیایی", en: "Chemical", tr: "Kimyasal", ru: "Химия" }],
    specs: [{ label: { fa: "مدارک", en: "Documents", tr: "Belgeler", ru: "Документы" }, value: { fa: "MSDS / COA", en: "MSDS / COA", tr: "MSDS / COA", ru: "MSDS / COA" } }],
    media: [{ id: "1", type: "image", alt: { fa: "حلال صنعتی", en: "Industrial solvent", tr: "Endüstriyel solvent", ru: "Промышленный растворитель" }, gradient: G5, imageUrl: "/images/products/industrial-solvents.webp" }],
  },
  {
    slug: "epoxy-resin",
    title: { fa: "رزین اپوکسی", en: "Epoxy Resin", tr: "Epoksi Reçine", ru: "Эпоксидная смола" },
    summary: { fa: "رزین اپوکسی صنعتی برای پوشش و چسب.", en: "Industrial epoxy resin for coating and adhesive.", tr: "Kaplama ve yapıştırıcı için endüstriyel epoksi reçine.", ru: "Промышленная эпоксидная смола для покрытий и клея." },
    description: { fa: "تأمین رزین اپوکسی با درجه خلوص بالا و بسته‌بندی مناسب حمل بین‌المللی.", en: "High-purity epoxy resin with international shipping packaging.", tr: "Yüksek saflıkta epoksi reçine, uluslararası sevkiyata uygun paketleme.", ru: "Эпоксидная смола высокой чистоты с упаковкой для международной перевозки." },
    type: "physical", categorySlug: "chemicals", priceType: "fixed", price: 6.8, currency: "USD", featured: true,
    tags: [{ fa: "رزین", en: "Resin", tr: "Reçine", ru: "Смола" }],
    specs: [{ label: { fa: "بسته‌بندی", en: "Packaging", tr: "Paketleme", ru: "Упаковка" }, value: { fa: "بشکه 200L", en: "200L drum", tr: "200L varil", ru: "Бочка 200 л" } }],
    media: [{ id: "1", type: "image", alt: { fa: "رزین اپوکسی", en: "Epoxy resin", tr: "Epoksi reçine", ru: "Эпоксидная смола" }, gradient: G5, imageUrl: "/images/products/epoxy-resin.webp" }],
  },
  {
    slug: "plc-controllers",
    title: { fa: "کنترلر PLC", en: "PLC Controllers", tr: "PLC Kontrolörleri", ru: "ПЛК-контроллеры" },
    summary: { fa: "کنترلرهای PLC برندهای معتبر اروپایی.", en: "PLC controllers from reputable European brands.", tr: "Saygın Avrupa markalarından PLC kontrolörleri.", ru: "ПЛК-контроллеры от известных европейских брендов." },
    description: { fa: "تأمین PLC با پشتیبانی فنی، برنامه‌ریزی و راه‌اندازی در محل.", en: "PLC supply with technical support, programming and on-site commissioning.", tr: "Teknik destek, programlama ve yerinde devreye alma ile PLC tedariki.", ru: "Поставка ПЛК с техподдержкой, программированием и пусконаладкой на месте." },
    type: "physical", categorySlug: "electronics", priceType: "range", price: 200, priceMax: 5000, currency: "EUR", featured: false,
    tags: [{ fa: "اتوماسیون", en: "Automation", tr: "Otomasyon", ru: "Автоматизация" }],
    specs: [{ label: { fa: "برند", en: "Brand", tr: "Marka", ru: "Бренд" }, value: { fa: "Siemens / Schneider", en: "Siemens / Schneider", tr: "Siemens / Schneider", ru: "Siemens / Schneider" } }],
    media: [{ id: "1", type: "image", alt: { fa: "کنترلر PLC", en: "PLC controller", tr: "PLC kontrolör", ru: "ПЛК-контроллер" }, gradient: G6, imageUrl: "/images/products/plc-controllers.webp" }],
  },
  {
    slug: "industrial-sensors",
    title: { fa: "سنسور صنعتی", en: "Industrial Sensors", tr: "Endüstriyel Sensörler", ru: "Промышленные датчики" },
    summary: { fa: "سنسورهای فشار، دما و سطح برای خطوط تولید.", en: "Pressure, temperature and level sensors for production lines.", tr: "Üretim hatları için basınç, sıcaklık ve seviye sensörleri.", ru: "Датчики давления, температуры и уровня для производственных линий." },
    description: { fa: "تأمین سنسور با کالیبراسیون و گواهی مطابقت.", en: "Sensor supply with calibration and conformity certificate.", tr: "Kalibrasyon ve uygunluk sertifikasıyla sensör tedariki.", ru: "Поставка датчиков с калибровкой и сертификатом соответствия." },
    type: "physical", categorySlug: "electronics", priceType: "inquiry", featured: false,
    tags: [{ fa: "سنسور", en: "Sensor", tr: "Sensör", ru: "Датчик" }],
    specs: [{ label: { fa: "خروجی", en: "Output", tr: "Çıkış", ru: "Выход" }, value: { fa: "4-20mA / 0-10V", en: "4-20mA / 0-10V", tr: "4-20mA / 0-10V", ru: "4–20 мА / 0–10 В" } }],
    media: [{ id: "1", type: "image", alt: { fa: "سنسور صنعتی", en: "Industrial sensor", tr: "Endüstriyel sensör", ru: "Промышленный датчик" }, gradient: G6, imageUrl: "/images/products/industrial-sensors.webp" }],
  },
  {
    slug: "customs-clearance-service",
    title: { fa: "خدمت ترخیص گمرکی", en: "Customs Clearance Service", tr: "Gümrük Müşavirlik Hizmeti", ru: "Услуга таможенного оформления" },
    summary: { fa: "ترخیص کالا از گمرک ترکیه با تیم متخصص.", en: "Goods clearance at Turkish customs with expert team.", tr: "Uzman ekiple Türkiye gümrüğünde mal çıkışı.", ru: "Таможенное оформление в Турции с командой экспертов." },
    description: { fa: "خدمت ترخیص شامل بررسی تعرفه، ثبت اظهارنامه و پیگیری تا تحویل.", en: "Clearance service includes tariff review, declaration filing and delivery tracking.", tr: "Gümrük hizmeti tarife incelemesi, beyanname ve teslimat takibini kapsar.", ru: "Услуга включает проверку тарифа, декларирование и отслеживание доставки." },
    type: "service", categorySlug: "machinery", priceType: "inquiry", featured: false,
    tags: [{ fa: "گمرک", en: "Customs", tr: "Gümrük", ru: "Таможня" }],
    specs: [{ label: { fa: "مکان", en: "Location", tr: "Konum", ru: "Место" }, value: { fa: "ترکیه", en: "Türkiye", tr: "Türkiye", ru: "Турция" } }],
    media: [{ id: "1", type: "image", alt: { fa: "ترخیص گمرکی", en: "Customs clearance", tr: "Gümrük işlemleri", ru: "Таможенное оформление" }, gradient: G3, imageUrl: "/images/products/customs-clearance-service.webp" }],
  },
  {
    slug: "insulated-panels",
    title: { fa: "پانل عایق ساندویچی", en: "Insulated Sandwich Panels", tr: "Sandviç Panel", ru: "Сэндвич-панели" },
    summary: { fa: "پانل‌های عایق برای سوله و ساختمان صنعتی.", en: "Insulated panels for warehouses and industrial buildings.", tr: "Depo ve endüstriyel binalar için yalıtımlı paneller.", ru: "Утеплённые панели для складов и промышленных зданий." },
    description: { fa: "تأمین پانل ساندویچی با ضخامت و رنگ سفارشی، حمل با کانتینر اختصاصی.", en: "Sandwich panel supply with custom thickness and color, dedicated container shipping.", tr: "Özel kalınlık ve renkte sandviç panel, özel konteyner sevkiyatı.", ru: "Поставка сэндвич-панелей с индивидуальной толщиной и цветом, доставка в контейнерах." },
    type: "physical", categorySlug: "construction", priceType: "range", price: 18, priceMax: 45, currency: "USD", featured: true,
    tags: [{ fa: "عایق", en: "Insulation", tr: "Yalıtım", ru: "Изоляция" }],
    specs: [
      { label: { fa: "ضخامت", en: "Thickness", tr: "Kalınlık", ru: "Толщина" }, value: { fa: "50-150 میلی‌متر", en: "50-150 mm", tr: "50-150 mm", ru: "50–150 мм" } },
      { label: { fa: "واحد", en: "Unit", tr: "Birim", ru: "Единица" }, value: { fa: "متر مربع", en: "Square meter", tr: "Metrekare", ru: "Кв. метр" } },
    ],
    media: [
      { id: "1", type: "image", alt: { fa: "پانل ساندویچی", en: "Sandwich panel", tr: "Sandviç panel", ru: "Сэндвич-панель" }, gradient: G1, imageUrl: "/images/products/insulated-panels.webp" },
      { id: "2", type: "image", alt: { fa: "نصب پانل", en: "Panel installation", tr: "Panel montajı", ru: "Монтаж панелей" }, gradient: "from-gray-600 via-gray-400 to-gray-200" },
    ],
  },
];
