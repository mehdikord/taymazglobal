"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { TeamMemberCard } from "@/components/team/team-member-card";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { TeamDepartment, TeamMember } from "@/types";

type TeamGridProps = {
  locale: AppLocale;
  members: TeamMember[];
};

export function TeamGrid({ locale, members }: TeamGridProps) {
  const team = useTranslations("Team");
  const departments = useMemo<TeamDepartment[]>(
    () => [...new Set(members.map((member) => member.department))],
    [members],
  );
  const [active, setActive] = useState<TeamDepartment | "all">("all");

  const visibleMembers = useMemo(
    () => (active === "all" ? members : members.filter((member) => member.department === active)),
    [active, members],
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2 border-b pb-6">
        <DepartmentTab active={active === "all"} onClick={() => setActive("all")} label={team("allDepartments")} />
        {departments.map((department) => (
          <DepartmentTab
            key={department}
            active={active === department}
            onClick={() => setActive(department)}
            label={team(`departments.${department}`)}
          />
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function DepartmentTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300",
        active ? "bg-brand-navy text-white shadow-[0_10px_24px_-12px_rgba(18,57,119,0.8)]" : "text-muted hover:bg-surface hover:text-brand-navy",
      )}
    >
      {label}
      {active && <span className="absolute inset-x-4 -bottom-[1.35rem] h-0.5 rounded-full bg-brand-red" aria-hidden="true" />}
    </button>
  );
}
