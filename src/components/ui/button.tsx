import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-red/20 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand-red text-white shadow-[0_10px_24px_-14px_rgba(252,20,34,0.9)] hover:bg-brand-red-dark",
        secondary: "bg-brand-navy text-white shadow-[0_10px_24px_-14px_rgba(18,57,119,0.8)] hover:bg-brand-navy-dark",
        outline: "border border-border bg-white text-brand-navy hover:border-brand-navy/30 hover:bg-brand-navy-soft",
        ghost: "text-brand-navy hover:bg-brand-navy-soft",
        danger: "bg-danger text-white hover:bg-red-700"
      },
      size: {
        sm: "min-h-9 rounded-lg px-3 text-xs",
        md: "px-5 py-2.5",
        lg: "min-h-12 rounded-xl px-6 text-base",
        icon: "size-11 p-0"
      }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, type = "button", ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} type={asChild ? undefined : type} {...props} />;
}
