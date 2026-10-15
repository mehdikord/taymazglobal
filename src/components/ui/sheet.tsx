"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sheetVariants = cva("fixed z-50 bg-white p-6 shadow-2xl outline-none transition duration-300 data-[state=closed]:opacity-0 data-[state=open]:opacity-100", {
  variants: {
    side: {
      start: "inset-y-0 start-0 w-[min(88vw,24rem)] border-e data-[state=closed]:-translate-x-full rtl:data-[state=closed]:translate-x-full",
      end: "inset-y-0 end-0 w-[min(88vw,24rem)] border-s data-[state=closed]:translate-x-full rtl:data-[state=closed]:-translate-x-full",
      top: "inset-x-0 top-0 border-b data-[state=closed]:-translate-y-full",
      bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:translate-y-full"
    }
  },
  defaultVariants: { side: "end" }
});

type SheetContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & VariantProps<typeof sheetVariants> & { closeLabel: string };

export function SheetContent({ side, className, children, closeLabel, ...props }: SheetContentProps) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-brand-navy-dark/50 backdrop-blur-sm" /><DialogPrimitive.Content className={cn(sheetVariants({ side }), className)} {...props}>{children}<DialogPrimitive.Close className="absolute end-4 top-4 grid size-11 place-items-center rounded-xl text-muted hover:bg-surface hover:text-brand-navy focus-visible:outline-3 focus-visible:outline-brand-red"><X aria-hidden="true" className="size-5" /><span className="sr-only">{closeLabel}</span></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>;
}
export function SheetHeader({ className, ...props }: React.ComponentProps<"div">) { return <div className={cn("flex flex-col gap-2 pe-12", className)} {...props} />; }
export function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) { return <DialogPrimitive.Title className={cn("text-xl font-extrabold text-brand-navy", className)} {...props} />; }
export function SheetDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) { return <DialogPrimitive.Description className={cn("text-sm leading-7 text-muted", className)} {...props} />; }
