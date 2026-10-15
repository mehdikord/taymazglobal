import { ArrowUpRight, Mail, MessageCircle, PhoneCall, Send, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { ContactOffices } from "@/components/contact/contact-offices";
import { ContactForm } from "@/components/forms/contact-form";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { AppLocale } from "@/i18n/routing";
import { lookupCity } from "@/lib/geo/cities";
import { buildDotsPath, createProjection, fitDotMap } from "@/lib/geo/dot-map";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import { getOffices } from "@/lib/repositories/offices";
import { getSiteSettings } from "@/lib/repositories/settings";

type ContactPageProps = { params: Promise<{ locale: AppLocale }> };

const MAP_W = 640;
const MAP_H = 400;

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Contact" });
  return { title: translations("metaTitle"), description: translations("metaDescription") };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });
  const [offices, settings] = await Promise.all([getOffices(), getSiteSettings()]);
  const headOffice = offices.find((office) => office.isHeadOffice) ?? offices[0];
  const phone = headOffice?.phone || settings.phones[0] || "";
  const email = headOffice?.email || settings.emails[0] || "";
  const whatsapp = settings.social.whatsapp;
  const telegram = settings.social.telegram;

  const channels: { key: string; href: string; icon: ReactNode; title: string; value: string; hint: string; external?: boolean }[] = [
    ...(phone ? [{ key: "phone", href: `tel:${phone}`, icon: <PhoneCall className="size-5" aria-hidden="true" />, title: t("call"), value: phone, hint: t("callHint") }] : []),
    ...(email ? [{ key: "email", href: `mailto:${email}`, icon: <Mail className="size-5" aria-hidden="true" />, title: t("email"), value: email, hint: t("emailHint") }] : []),
    ...(whatsapp ? [{ key: "whatsapp", href: whatsapp, icon: <MessageCircle className="size-5" aria-hidden="true" />, title: t("whatsapp"), value: "WhatsApp", hint: t("whatsappHint"), external: true }] : []),
    ...(telegram ? [{ key: "telegram", href: telegram, icon: <Send className="size-5" aria-hidden="true" />, title: t("telegram"), value: "Telegram", hint: t("telegramHint"), external: true }] : []),
  ];

  const socials = [
    { key: "linkedin", href: settings.social.linkedin, label: "LinkedIn", icon: <LinkedinIcon className="size-4" /> },
    { key: "instagram", href: settings.social.instagram, label: "Instagram", icon: <InstagramIcon className="size-4" /> },
    { key: "telegram", href: settings.social.telegram, label: "Telegram", icon: <Send className="size-4" aria-hidden="true" /> },
    { key: "whatsapp", href: settings.social.whatsapp, label: "WhatsApp", icon: <MessageCircle className="size-4" aria-hidden="true" /> },
  ].filter((item) => Boolean(item.href));

  const points = offices.map((office) => lookupCity(office.city.en)).filter((geo): geo is NonNullable<typeof geo> => Boolean(geo));
  const map = fitDotMap(points, MAP_W, MAP_H, { minLonSpan: 30, minLatSpan: 18, radius: 2.6 });
  const { px, py } = createProjection(map);
  const dots = buildDotsPath(map);

  return (
    <>
      {/* ── Hero ── */}
      <section className="contact-hero relative isolate overflow-hidden bg-[#050f21] text-white">
        <div aria-hidden="true" className="track-hero-grid absolute inset-0" />
        <div aria-hidden="true" className="track-hero-aura track-hero-aura-one" />
        <div aria-hidden="true" className="track-hero-aura track-hero-aura-two" />
        <div className="container-shell relative pb-24 pt-6 sm:pb-28 sm:pt-8">
          <div className="track-hero-breadcrumbs">
            <Breadcrumbs items={[{ href: "/", label: t("breadcrumbHome") }, { label: t("title") }]} label={t("breadcrumbLabel")} />
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
            <div>
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                {t("heroBadge")}
              </span>
              <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">{t("description")}</p>
            </div>
            <p className="flex items-center gap-2 text-xs font-bold text-slate-400 lg:justify-end">
              <Sparkles className="size-4 text-[#9ec9ff]" aria-hidden="true" />
              {t("formDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Quick channels (overlapping the hero) ── */}
      <section className="relative z-10 -mt-14 sm:-mt-16">
        <div className="container-shell">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <li key={channel.key}>
                <a href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noreferrer" : undefined} className="contact-channel group focus-ring">
                  <span className="contact-channel-icon">{channel.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{channel.title}</span>
                    <span className="mt-0.5 block truncate text-sm font-extrabold text-brand-navy" dir="ltr">{channel.value}</span>
                    <span className="mt-0.5 block text-[11px] text-muted">{channel.hint}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition group-hover:rotate-45 group-hover:text-brand-red" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Form + side info ── */}
      <section className="relative bg-[#f4f7fc] pb-20 pt-10 sm:pb-28 sm:pt-12">
        <div aria-hidden="true" className="track-results-grid absolute inset-0" />
        <div className="container-shell relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
          <div className="contact-card">
            <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red">
              <span aria-hidden="true" className="h-px w-8 bg-brand-red" />
              {t("formEyebrow")}
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">{t("formTitle")}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{t("formDescription")}</p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="contact-card">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("officesTitle")}</h2>
              <div className="mt-4">
                <ContactOffices offices={offices} locale={locale} headOfficeLabel={t("headOfficeBadge")} localTimeLabel={t("localTime")} />
              </div>
            </div>

            {points.length ? (
              <div className="contact-map relative overflow-hidden rounded-[1.5rem] text-white" aria-label={t("mapTitle")} role="img">
                <div aria-hidden="true" className="track-map-grid absolute inset-0" />
                <div className="relative px-4 pt-4">
                  <span className="markets-pill markets-pill-muted">{t("mapTitle")}</span>
                </div>
                <svg className="relative block w-full" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
                  <path className="track-map-dots" d={dots} />
                  {offices.map((office) => {
                    const geo = lookupCity(office.city.en);
                    if (!geo) return null;
                    return (
                      <g key={office.id} transform={`translate(${px(geo.lon).toFixed(1)} ${py(geo.lat).toFixed(1)})`} className={office.isHeadOffice ? "track-node track-node-origin" : "track-node"}>
                        {office.isHeadOffice ? <circle className="track-node-ring" r="11" /> : null}
                        <circle className="track-node-halo" r="11" />
                        <circle className="track-node-core" r={office.isHeadOffice ? 5.5 : 4.5} />
                        <text className="track-node-label" y="-18" textAnchor="middle">{getLocalizedText(office.city, locale)}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : null}

            <div className="contact-card">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{t("faqTitle")}</h2>
              <ul className="mt-3 divide-y divide-slate-100">
                {(["1", "2", "3"] as const).map((n) => (
                  <li key={n} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-extrabold text-brand-navy">{t(`faq.q${n}`)}</p>
                    <p className="mt-1 text-xs leading-6 text-muted">{t(`faq.a${n}`)}</p>
                  </li>
                ))}
              </ul>
            </div>

            {socials.length ? (
              <div className="contact-card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-extrabold text-brand-navy">{t("socialTitle")}</h2>
                  <p className="mt-0.5 text-xs text-muted">{t("socialDescription")}</p>
                </div>
                <ul className="flex gap-2">
                  {socials.map((item) => (
                    <li key={item.key}>
                      <a href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="contact-social focus-ring">{item.icon}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
