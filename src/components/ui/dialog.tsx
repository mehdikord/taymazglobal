"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & { closeLabel: string };

export function DialogContent({ className, children, closeLabel, ...props }: DialogContentProps) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-brand-navy-dark/55 opacity-100 backdrop-blur-sm transition-opacity duration-200 data-[state=closed]:opacity-0" /><DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 w-[min(calc(100%_-_2rem),34rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 opacity-100 shadow-2xl outline-none transition-opacity duration-200 data-[state=closed]:opacity-0", className)} {...props}>{children}<DialogPrimitive.Close className="absolute end-4 top-4 grid size-11 place-items-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-brand-navy focus-visible:outline-3 focus-visible:outline-brand-red"><X aria-hidden="true" className="size-5" /><span className="sr-only">{closeLabel}</span></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>;
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 pe-10", className)} {...props} />;
}
export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-xl font-extrabold text-brand-navy", className)} {...props} />;
}
export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm leading-7 text-muted", className)} {...props} />;
}
