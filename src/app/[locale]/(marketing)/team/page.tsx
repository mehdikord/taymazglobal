import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CtaSection } from "@/components/home/cta-section";
import { PageHero } from "@/components/shared/page-hero";
import { TeamGrid } from "@/components/team/team-grid";
import type { AppLocale } from "@/i18n/routing";
import { getTeamMembers } from "@/lib/repositories/team";

type TeamPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Team" });
  return { title: translations("metaTitle"), description: translations("metaDescription") };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const team = await getTranslations({ locale, namespace: "Team" });
  const home = await getTranslations({ locale, namespace: "Home" });
  const members = await getTeamMembers();
  const departments = new Set(members.map((member) => member.department)).size;

  return (
    <>
      <section className="relative overflow-hidden border-b bg-brand-navy py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(252,20,34,0.12),transparent_50%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_40%)]" aria-hidden="true" />
        <div className="container-shell relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">{team("eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold text-white sm:text-5xl">{team("title")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">{team("description")}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { value: String(members.length), label: team("statMembers") },
              { value: String(departments), label: team("statDepartments") },
              { value: "4", label: team("statLanguages") },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-3xl font-extrabold text-brand-red">{stat.value}</p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-shell">
          <TeamGrid locale={locale} members={members} />
        </div>
      </section>

      <CtaSection
        title={home("cta.title")}
        description={home("cta.description")}
        primaryLabel={home("cta.primary")}
        secondaryLabel={home("cta.secondary")}
      />
    </>
  );
}
