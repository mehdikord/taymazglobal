import type { LucideIcon } from "lucide-react";
import { CheckCircle2, CircleDashed, Clock3, PackageCheck, Search, XCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<OrderStatus, { icon: LucideIcon; variant: "neutral" | "warning" | "default" | "success" | "danger" }> = {
  pending: { icon: Clock3, variant: "warning" },
  reviewing: { icon: Search, variant: "default" },
  preparing: { icon: PackageCheck, variant: "warning" },
  inProgress: { icon: CircleDashed, variant: "default" },
  completed: { icon: CheckCircle2, variant: "success" },
  cancelled: { icon: XCircle, variant: "danger" }
};

export async function StatusBadge({ status }: { status: OrderStatus }) {
  const translations = await getTranslations("Status");
  const { icon: Icon, variant } = statusConfig[status];
  return <Badge variant={variant}><Icon aria-hidden="true" className="size-3.5" />{translations(status)}</Badge>;
}
