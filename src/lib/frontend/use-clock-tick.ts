import { useSyncExternalStore } from "react";

const CLOCK_INTERVAL = 15_000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, CLOCK_INTERVAL);
  return () => window.clearInterval(id);
}

const getSnapshot = () => Math.floor(Date.now() / CLOCK_INTERVAL);
const getServerSnapshot = () => null;

/** Ticks every 15s on the client; `null` on the server so SSR markup matches before hydration. */
export function useClockTick(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
