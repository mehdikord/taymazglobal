import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn("focus-ring min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-foreground placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70", className)} {...props} />;
}
