import * as React from "react";

import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-sm font-bold text-brand-navy peer-disabled:cursor-not-allowed peer-disabled:opacity-60", className)} {...props} />;
}
