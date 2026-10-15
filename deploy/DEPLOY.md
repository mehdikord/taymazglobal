# راه‌اندازی روی سرور (npm + next start + systemd)

این پروژه با `npm` مدیریت می‌شود و روی سرور با `next build` و `next start` به‌صورت یک سرویس دائمی اجرا می‌شود.
هیچ `output` خاصی (standalone / export) در `next.config.ts` تنظیم نشده و لازم هم نیست.

## پیش‌نیازها

- Node.js 20.9 یا بالاتر (پیشنهادی: Node 22 LTS) و npm 10+
- MySQL / MariaDB با یک دیتابیس خالی برای پروژه
- nginx به‌عنوان پروکسی معکوس (اختیاری ولی توصیه‌شده)

## ۱. کد و متغیرهای محیطی

```bash
sudo mkdir -p /var/www/taymaz && sudo chown $USER /var/www/taymaz
# کد پروژه را در /var/www/taymaz قرار دهید (git clone / rsync)
cd /var/www/taymaz
cp .env.example .env
nano .env
```

مقادیر `.env` روی سرور:

```
DATABASE_URL="mysql://USER:PASSWORD@127.0.0.1:3306/taymaz"
JWT_SECRET="یک رشته‌ی تصادفی طولانی"
NODE_ENV="production"
```

> اتصال به دیتابیس فقط در زمان اجرا (`next start`) لازم است؛ `next build` به دیتابیس نیاز ندارد.
> اگر `DATABASE_URL` تنظیم نشده باشد، سرور در اولین درخواست با پیام واضح خطا می‌دهد.

## ۲. نصب وابستگی‌ها و ساخت

```bash
cd /var/www/taymaz
npm ci            # نصب دقیق طبق package-lock.json (postinstall به‌طور خودکار prisma generate را اجرا می‌کند)
npm run db:migrate  # اجرای مایگریشن‌ها روی دیتابیس (فقط بار اول یا بعد از تغییر مایگریشن‌ها)
npm run build
```

## ۳. سرویس systemd

```bash
sudo cp deploy/taymaz.service /etc/systemd/system/taymaz.service
# در فایل سرویس: User، WorkingDirectory و مسیر npm را مطابق سرور خود تنظیم کنید (which npm)
sudo chown -R www-data:www-data /var/www/taymaz
sudo systemctl daemon-reload
sudo systemctl enable --now taymaz
sudo systemctl status taymaz
journalctl -u taymaz -f
```

سایت روی `http://127.0.0.1:3000` بالا می‌آید.

## ۴. nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/taymaz
sudo ln -s /etc/nginx/sites-available/taymaz /etc/nginx/sites-enabled/taymaz
sudo nginx -t && sudo systemctl reload nginx
# SSL رایگان:
sudo certbot --nginx -d taymazglobal.com -d www.taymazglobal.com
```

## ۵. به‌روزرسانی نسخه‌ی جدید

```bash
cd /var/www/taymaz
git pull            # یا rsync کد جدید
npm ci
npm run db:migrate  # در صورت وجود مایگریشن جدید
npm run build
sudo systemctl restart taymaz
```

## نکات

- پوشه‌ی `uploads/` (فایل‌های آپلودشده در پنل ادمین) باید بین استقرارها حفظ شود؛ آن را حذف نکنید.
- تمام صفحات سایت به‌صورت داینامیک رندر می‌شوند، بنابراین تغییرات پنل ادمین بلافاصله در سایت دیده می‌شود.
- اگر `npm ci` اخطار allow-scripts داد: اسکریپت‌های نصب لازم (prisma, esbuild, …) در بخش `allowScripts` فایل `package.json` تأیید شده‌اند و خودکار اجرا می‌شوند.
