import type { LegalSection } from "@/types";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "collection",
    title: { fa: "جمع‌آوری اطلاعات", en: "Information collection", tr: "Bilgi toplama", ru: "Сбор информации" },
    paragraphs: [
      { fa: "ما اطلاعاتی که در فرم‌های تماس، ثبت‌نام و سفارش وارد می‌کنید را برای پاسخگویی و ارائه خدمات جمع‌آوری می‌کنیم.", en: "We collect information you submit through contact, registration and order forms to respond and provide services.", tr: "İletişim, kayıt ve sipariş formlarından gönderdiğiniz bilgileri yanıtlamak ve hizmet sunmak için topluyoruz.", ru: "Мы собираем данные из контактных форм, регистрации и заказов для ответа и оказания услуг." },
      { fa: "در نسخه Mock، داده‌ها فقط در مرورگر شما ذخیره می‌شوند و به سرور ارسال نمی‌گردند.", en: "In the Mock version, data is stored only in your browser and not sent to a server.", tr: "Mock sürümde veriler yalnızca tarayıcınızda saklanır, sunucuya gönderilmez.", ru: "В Mock-версии данные хранятся только в браузере и не отправляются на сервер." },
    ],
  },
  {
    id: "usage",
    title: { fa: "استفاده از اطلاعات", en: "Use of information", tr: "Bilgi kullanımı", ru: "Использование информации" },
    paragraphs: [
      { fa: "اطلاعات برای پاسخ به درخواست‌ها، پیگیری سفارش و بهبود تجربه کاربری استفاده می‌شود.", en: "Information is used to respond to requests, track orders and improve user experience.", tr: "Bilgiler taleplere yanıt, sipariş takibi ve kullanıcı deneyimini iyileştirmek için kullanılır.", ru: "Информация используется для ответов на запросы, отслеживания заказов и улучшения UX." },
    ],
  },
  {
    id: "cookies",
    title: { fa: "کوکی‌ها", en: "Cookies", tr: "Çerezler", ru: "Cookies" },
    paragraphs: [
      { fa: "localStorage برای نگهداری session نمایشی و سفارش‌های Mock استفاده می‌شود.", en: "localStorage is used for mock session and order persistence.", tr: "Mock oturum ve sipariş kalıcılığı için localStorage kullanılır.", ru: "localStorage используется для mock-сессии и сохранения заказов." },
    ],
  },
  {
    id: "contact",
    title: { fa: "تماس", en: "Contact", tr: "İletişim", ru: "Контакты" },
    paragraphs: [
      { fa: "برای سؤالات حریم خصوصی با info@taymazglobal.com تماس بگیرید.", en: "For privacy questions contact info@taymazglobal.com.", tr: "Gizlilik soruları için info@taymazglobal.com.", ru: "По вопросам конфиденциальности: info@taymazglobal.com." },
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: { fa: "دامنه استفاده", en: "Scope of use", tr: "Kullanım kapsamı", ru: "Область использования" },
    paragraphs: [
      { fa: "این وب‌سایت نسخه Mock است و برای نمایش قابلیت‌ها طراحی شده، نه معاملات واقعی.", en: "This website is a Mock version designed to demonstrate capabilities, not real transactions.", tr: "Bu site gerçek işlemler için değil, yetenekleri göstermek için tasarlanmış Mock sürümdür.", ru: "Этот сайт — Mock-версия для демонстрации возможностей, не для реальных сделок." },
    ],
  },
  {
    id: "orders",
    title: { fa: "سفارش‌ها", en: "Orders", tr: "Siparişler", ru: "Заказы" },
    paragraphs: [
      { fa: "ثبت سفارش در Mock به معنای قرارداد تجاری نیست. هیچ پرداخت آنلاین انجام نمی‌شود.", en: "Order submission in Mock does not constitute a commercial contract. No online payment is processed.", tr: "Mock'ta sipariş göndermek ticari sözleşme oluşturmaz. Online ödeme yapılmaz.", ru: "Оформление заказа в Mock не является коммерческим договором. Онлайн-оплата не производится." },
    ],
  },
  {
    id: "liability",
    title: { fa: "مسئولیت", en: "Liability", tr: "Sorumluluk", ru: "Ответственность" },
    paragraphs: [
      { fa: "محتوای نمونه‌کارها و آمارها برای نمایش هستند و ممکن است با واقعیت متفاوت باشند.", en: "Portfolio content and statistics are illustrative and may differ from reality.", tr: "Portföy içeriği ve istatistikler gösterim amaçlıdır, gerçeklikten farklı olabilir.", ru: "Контент портфолио и статистика носят демонстрационный характер." },
    ],
  },
  {
    id: "changes",
    title: { fa: "تغییرات", en: "Changes", tr: "Değişiklikler", ru: "Изменения" },
    paragraphs: [
      { fa: "ما حق به‌روزرسانی این شرایط را بدون اطلاع قبلی محفوظ می‌داریم.", en: "We reserve the right to update these terms without prior notice.", tr: "Bu koşulları önceden haber vermeden güncelleme hakkımız saklıdır.", ru: "Мы оставляем за собой право обновлять условия без предварительного уведомления." },
    ],
  },
];
