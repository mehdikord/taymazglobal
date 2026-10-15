import "server-only";

import { revalidatePath } from "next/cache";

export * from "./helpers";
export type { Locale } from "./helpers";

export function revalidateFrontend(paths: string[]): void {
  for (const path of [...paths, "/"]) revalidatePath(path);
}
