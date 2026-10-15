import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return <div className="relative"><select className={cn("focus-ring min-h-11 w-full appearance-none rounded-xl border bg-white px-3.5 pe-10 text-sm text-foreground disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-70", className)} {...props}>{children}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted" /></div>;
}
