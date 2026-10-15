import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { LEGAL_NAVIGATION } from "@/lib/constants";
import { lookupCity } from "@/lib/geo/cities";
import { buildDotsPath, createProjection, type DotMapConfig } from "@/lib/geo/dot-map";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { SiteSettings } from "@/lib/repositories/settings";
import type { Office } from "@/types";
import { BackToTop } from "./back-to-top";
import { LanguageSwitcher } from "./language-switcher";
import { SiteLogo } from "./site-logo";

const MAP: DotMapConfig = { lon0: -12, lon1: 100, lat0: 10, lat1: 68, width: 1120, height: 580, step: 1.6, radius: 3 };
const { px, py } = createProjection(MAP);
const DOTS_PATH = buildDotsPath(MAP);

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

type SiteFooterProps = {
  settings?: SiteSettings;
  offices?: Office[];
};

export async function SiteFooter({ settings, offices = [] }: SiteFooterProps) {
  const locale = (await getLocale()) as AppLocale;
  const footer = await getTranslations("Footer");
  const navigation = await getTranslations("Navigation");
  const email = settings?.emails[0] ?? footer("email");
  const phone = settings?.phones[0] ?? "";
  const social = settings?.social;
  const year = new Date().getFullYear();

  const socialLinks = [
    { key: "whatsapp", href: social?.whatsapp, icon: MessageCircle, label: "WhatsApp" },
    { key: "telegram", href: social?.telegram, icon: Send, label: "Telegram" },
    { key: "instagram", href: social?.instagram, icon: InstagramIcon, label: "Instagram" },
    { key: "linkedin", href: social?.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
  ].filter((item) => Boolean(item.href));

  const companyLinks = [
    { href: "/about", label: navigation("about") },
    { href: "/team", label: footer("team") },
    { href: "/portfolio", label: navigation("portfolio") },
    { href: "/contact", label: navigation("contact") },
  ];
  const solutionLinks = [
    { href: "/services", label: navigation("services") },
    { href: "/products", label: navigation("products") },
    { href: "/track", label: navigation("track") },
    { href: "/contact", label: footer("consultation") },
  ];

  return (
    <footer className="site-footer relative isolate overflow-hidden bg-[#050f21] text-white">
      <div aria-hidden="true" className="footer-grid absolute inset-0" />
      <div aria-hidden="true" className="footer-aura footer-aura-one" />
      <div aria-hidden="true" className="footer-aura footer-aura-two" />
      <div aria-hidden="true" className="footer-topline absolute inset-x-0 top-0 h-px" />

      {/* Decorative office map */}
      <svg aria-hidden="true" className="footer-map absolute hidden lg:block" viewBox={`0 0 ${MAP.width} ${MAP.height}`}>
        <path className="footer-map-dots" d={DOTS_PATH} />
        {offices.map((office, index) => {
          const geo = lookupCity(office.city.en);
          if (!geo) return null;
          const x = px(geo.lon);
          const y = py(geo.lat);
          return (
            <g key={office.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} className={office.isHeadOffice ? "footer-office footer-office-hub" : "footer-office"}>
              <circle className="footer-office-ring" r="10" style={{ animationDelay: `${index * 0.6}s` }} />
              <circle className="footer-office-core" r={office.isHeadOffice ? 5 : 3.5} />
            </g>
          );
        })}
      </svg>

      <div className="container-shell relative">
        {/* ── Main grid ── */}
        <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Brand */}
          <div className="lg:col-span-4">
            <SiteLogo className="[&>span:last-child]:text-white" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">{footer("tagline")}</p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="footer-live-dot" />
              {footer("networkNote")}
            </p>

            <h2 className="footer-heading mt-8">{footer("channels")}</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`mailto:${email}`} className="footer-channel group focus-ring">
                  <span className="footer-channel-icon"><Mail className="size-4" aria-hidden="true" /></span>
                  <span className="min-w-0 truncate" dir="ltr">{email}</span>
                  <ArrowUpRight className="ms-auto size-3.5 shrink-0 opacity-40 transition group-hover:rotate-45 group-hover:opacity-100" aria-hidden="true" />
                </a>
              </li>
              {phone ? (
                <li>
                  <a href={`tel:${phone}`} className="footer-channel group focus-ring">
                    <span className="footer-channel-icon"><Phone className="size-4" aria-hidden="true" /></span>
                    <span className="min-w-0 truncate tabular-nums" dir="ltr">{phone}</span>
                    <ArrowUpRight className="ms-auto size-3.5 shrink-0 opacity-40 transition group-hover:rotate-45 group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
              ) : null}
            </ul>

            {socialLinks.length ? (
              <div className="mt-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">{footer("followUs")}</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {socialLinks.map(({ key, href, icon: Icon, label }) => (
                    <li key={key}>
                      <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="footer-social focus-ring">
                        <Icon className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-1 lg:col-span-4">
            <div>
              <h2 className="footer-heading">{footer("company")}</h2>
              <ul className="mt-4 space-y-1">
                {companyLinks.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="footer-link group focus-ring">
                      <span className="footer-link-dot" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="footer-heading">{footer("services")}</h2>
              <ul className="mt-4 space-y-1">
                {solutionLinks.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="footer-link group focus-ring">
                      <span className="footer-link-dot" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Offices */}
          <div className="lg:col-span-4">
            <h2 className="footer-heading">{footer("offices")}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {offices.map((office) => (
                <li key={office.id} className="footer-office-card">
                  <span className={office.isHeadOffice ? "footer-office-pin footer-office-pin-hub" : "footer-office-pin"}>
                    <MapPin className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white">{getLocalizedText(office.city, locale)}</span>
                      {office.isHeadOffice ? <span className="footer-hq">{footer("headOfficeBadge")}</span> : null}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-400">{getLocalizedText(office.country, locale)} · {getLocalizedText(office.hours, locale)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom relative flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">{footer("copyright", { year })}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <nav aria-label={footer("legal")} className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
              {LEGAL_NAVIGATION.map((item) => (
                <Link key={item.key} href={item.href} className="inline-flex min-h-9 items-center transition hover:text-white focus-ring">
                  {footer(item.key)}
                </Link>
              ))}
            </nav>
            <div className="footer-lang"><LanguageSwitcher compact /></div>
            <BackToTop label={footer("backToTop")} />
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="footer-wordmark pointer-events-none select-none" dir="ltr">TAYMAZ</div>
    </footer>
  );
}
