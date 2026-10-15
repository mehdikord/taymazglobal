"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getLocalizedText } from "@/lib/i18n/get-localized-text";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/types";

type TeamMemberCardProps = {
  member: TeamMember;
  locale: AppLocale;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamMemberCard({ member, locale }: TeamMemberCardProps) {
  const team = useTranslations("Team");
  const common = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const name = getLocalizedText(member.name, locale);
  const role = getLocalizedText(member.role, locale);
  const bio = getLocalizedText(member.bio, locale);
  const department = team(`departments.${member.department}`);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="team-card group w-full text-start focus-visible:outline-3 focus-visible:outline-brand-red"
      >
        <article className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-[var(--shadow-soft)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_56px_-24px_rgba(18,57,119,0.35)]">
          <div className="absolute -end-8 -top-8 size-32 rounded-full bg-surface transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
          <div className="relative flex items-start gap-4">
            <div className={cn("team-avatar flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-extrabold text-white shadow-lg", member.accent)}>
              {getInitials(name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-red">{department}</p>
              <h3 className="mt-1 text-lg font-extrabold text-brand-navy transition-colors group-hover:text-brand-red">{name}</h3>
              <p className="mt-1 text-sm text-muted">{role}</p>
            </div>
          </div>
          <p className="relative mt-4 line-clamp-2 text-sm leading-7 text-muted">{bio}</p>
          <p className="relative mt-4 text-xs font-bold text-brand-red opacity-0 transition-opacity group-hover:opacity-100">{team("viewBio")}</p>
        </article>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent closeLabel={common("closeMenu")} className="!w-[min(calc(100%_-_2rem),28rem)]">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className={cn("flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-extrabold text-white", member.accent)}>
                {getInitials(name)}
              </div>
              <div>
                <DialogTitle>{name}</DialogTitle>
                <DialogDescription>{role}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <p className="text-sm leading-8 text-muted">{bio}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {member.linkedIn && (
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold text-brand-navy hover:bg-surface">
                <LinkedinIcon className="size-4 text-brand-red" />
                LinkedIn
              </a>
            )}
            <a href="mailto:info@taymazglobal.com" className="inline-flex min-h-10 items-center gap-2 rounded-xl border px-4 text-sm font-bold text-brand-navy hover:bg-surface">
              <Mail aria-hidden="true" className="size-4 text-brand-red" />
              {team("contact")}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
