import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({ cards = 3, label }: { cards?: number; label: string }) {
  return <div aria-busy="true" aria-live="polite" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><span className="sr-only">{label}</span>{Array.from({ length: cards }).map((_, index) => <div key={index} className="rounded-2xl border bg-white p-5"><Skeleton className="aspect-[16/9] w-full" /><Skeleton className="mt-5 h-5 w-2/3" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /></div>)}</div>;
}
