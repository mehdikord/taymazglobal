import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { LoginForm } from "@/components/forms/login-form";
import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/shared/loading-state";
import type { AppLocale } from "@/i18n/routing";

type LoginPageProps = { params: Promise<{ locale: AppLocale }> };

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Auth" });
  return { title: translations("loginTitle"), description: translations("loginDescription") };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const auth = await getTranslations({ locale, namespace: "Auth" });

  return (
    <>
      <PageHero eyebrow={auth("eyebrow")} title={auth("loginTitle")} description={auth("loginDescription")} className="py-10 sm:py-12" />
      <section className="py-12 sm:py-16">
        <div className="container-shell max-w-md">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <Suspense fallback={<LoadingState label={auth("loginTitle")} cards={1} />}>
                <LoginForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
