import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold", {
  variants: {
    variant: {
      default: "border-brand-navy/10 bg-brand-navy-soft text-brand-navy",
      neutral: "border-border bg-surface text-muted",
      success: "border-success/20 bg-success/10 text-success",
      warning: "border-warning/25 bg-warning/10 text-amber-700",
      danger: "border-danger/20 bg-danger/10 text-danger"
    }
  },
  defaultVariants: { variant: "default" }
});

type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
