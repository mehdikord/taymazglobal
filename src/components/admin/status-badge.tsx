import { Badge } from "@/components/ui/badge";

export type StatusTone = "default" | "neutral" | "success" | "warning" | "danger";

const STATUS_TONES: Record<string, StatusTone> = {
  pending_approval: "warning",
  preparing: "default",
  in_transit: "default",
  completed: "success",
  cancelled: "danger",
  new: "warning",
  in_review: "default",
  contacted: "default",
  closed: "neutral",
  active: "success",
  inactive: "neutral",
  enabled: "success",
  disabled: "neutral",
};

type StatusBadgeProps = {
  status?: string;
  label?: string;
  tone?: StatusTone;
};

export function StatusBadge({ status, label, tone }: StatusBadgeProps) {
  const resolved = tone ?? STATUS_TONES[status ?? ""] ?? "neutral";
  return <Badge variant={resolved}>{label ?? status ?? "—"}</Badge>;
}
