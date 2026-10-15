import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("focus-ring min-h-28 w-full resize-y rounded-xl border bg-white px-3.5 py-3 text-sm text-foreground placeholder:text-muted/70 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70", className)} {...props} />;
}
