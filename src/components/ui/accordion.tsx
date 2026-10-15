"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;
export function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) { return <AccordionPrimitive.Item className={cn("border-b last:border-b-0", className)} {...props} />; }
export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) { return <AccordionPrimitive.Header className="flex"><AccordionPrimitive.Trigger className={cn("flex min-h-14 flex-1 items-center justify-between gap-4 py-3 text-start font-bold text-brand-navy transition-colors hover:text-brand-red [&[data-state=open]>svg]:rotate-180", className)} {...props}>{children}<ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform duration-200" /></AccordionPrimitive.Trigger></AccordionPrimitive.Header>; }
export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) { return <AccordionPrimitive.Content className="accordion-content overflow-hidden text-sm text-muted" {...props}><div className={cn("pb-5 leading-7", className)}>{children}</div></AccordionPrimitive.Content>; }
