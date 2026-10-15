"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LEAD_STATUS_LABELS } from "@/lib/admin/helpers";
import type { LeadStatus } from "@/lib/repositories/leads.admin";

type LeadStatusChangerProps = {
  leadId: string;
  currentStatus: LeadStatus;
  action: (id: string, status: LeadStatus) => Promise<{ ok: boolean; error?: string }>;
};

const STATUS_FLOW: LeadStatus[] = ["new", "in_review", "contacted", "closed"];

export function LeadStatusChanger({ leadId, currentStatus, action }: LeadStatusChangerProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleChange(status: LeadStatus) {
    setBusy(true);
    const result = await action(leadId, status);
    setBusy(false);
    if (result.ok) {
      toast.success(`وضعیت به «${LEAD_STATUS_LABELS[status]}» تغییر کرد`);
      router.refresh();
    } else {
      toast.error(result.error ?? "خطا");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {STATUS_FLOW.map((status) => {
        const active = status === currentStatus;
        return (
          <Button
            key={status}
            variant={active ? "primary" : "outline"}
            size="sm"
            disabled={busy}
            onClick={() => handleChange(status)}
          >
            {LEAD_STATUS_LABELS[status]}
          </Button>
        );
      })}
    </div>
  );
}
