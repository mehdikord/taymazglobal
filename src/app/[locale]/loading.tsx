import { getTranslations } from "next-intl/server";

import { LoadingState } from "@/components/shared/loading-state";

export default async function Loading() {
  const translations = await getTranslations("States");
  return <div className="container-shell py-16"><LoadingState label={translations("loading")} /></div>;
}
