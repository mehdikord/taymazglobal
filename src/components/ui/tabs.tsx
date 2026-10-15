"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) { return <TabsPrimitive.List className={cn("inline-flex min-h-11 items-center gap-1 rounded-xl bg-surface p-1", className)} {...props} />; }
export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) { return <TabsPrimitive.Trigger className={cn("min-h-9 rounded-lg px-4 text-sm font-bold text-muted transition-colors focus-visible:outline-3 focus-visible:outline-brand-red data-[state=active]:bg-white data-[state=active]:text-brand-navy data-[state=active]:shadow-sm", className)} {...props} />; }
export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) { return <TabsPrimitive.Content className={cn("mt-5 focus-visible:outline-3 focus-visible:outline-brand-red", className)} {...props} />; }
