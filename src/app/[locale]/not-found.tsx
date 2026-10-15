import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundContent } from "@/components/not-found/not-found-content";

export default async function NotFound() {
  const translations = await getTranslations("NotFound");
  const locale = await getLocale();

  return (
    <NotFoundContent
      title={translations("title")}
      subtitle={translations("subtitle")}
      description={translations("description")}
      backToHome={translations("backToHome")}
      goToServices={translations("goToServices")}
      goToContact={translations("goToContact")}
      lostRoute={translations("lostRoute")}
      activeNetwork={translations("activeNetwork")}
      globalCoverage={translations("globalCoverage")}
      locale={locale}
    />
  );
}