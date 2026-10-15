import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

type PaginationProps = React.ComponentProps<"nav"> & { label: string };
export function Pagination({ className, label, ...props }: PaginationProps) { return <nav aria-label={label} className={cn("flex w-full justify-center", className)} {...props} />; }
export function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) { return <ul className={cn("flex items-center gap-1", className)} {...props} />; }
export function PaginationItem(props: React.ComponentProps<"li">) { return <li {...props} />; }
type PaginationLinkProps = React.ComponentProps<"a"> & { isActive?: boolean };
export function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) { return <a aria-current={isActive ? "page" : undefined} className={cn(buttonVariants({ variant: isActive ? "secondary" : "ghost", size: "icon" }), className)} {...props} />; }
export function PaginationPrevious({ className, children, ...props }: React.ComponentProps<"a">) { return <a className={cn(buttonVariants({ variant: "ghost", size: "md" }), className)} {...props}><ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />{children}</a>; }
export function PaginationNext({ className, children, ...props }: React.ComponentProps<"a">) { return <a className={cn(buttonVariants({ variant: "ghost", size: "md" }), className)} {...props}>{children}<ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" /></a>; }
