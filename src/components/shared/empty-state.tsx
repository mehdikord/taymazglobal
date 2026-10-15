import { Inbox } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function EmptyState({ title, description, actionLabel, actionHref }: { title?: string; description?: string; actionLabel?: string; actionHref?: string }) {
  const translations = await getTranslations("States");
  return <div className="rounded-2xl border border-dashed bg-surface px-6 py-12 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-brand-navy shadow-[var(--shadow-soft)]"><Inbox aria-hidden="true" /></span><h2 className="mt-5 text-xl font-extrabold text-brand-navy">{title ?? translations("emptyTitle")}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">{description ?? translations("emptyDescription")}</p>{actionHref && actionLabel && <Button asChild className="mt-6"><Link href={actionHref}>{actionLabel}</Link></Button>}</div>;
}
