"use client";

import { useSyncExternalStore } from "react";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

/**
 * A hook to check if the auto connect is in progress.
 * @example
 * ```jsx
 * function Example() {
 *   const isAutoConnecting = useIsAutoConnecting();
 *
 *   return <div> ... </div>;
 * }
 * ```
 * @returns A boolean indicating if the auto connect is in progress.
 * @walletConnection
 */
export function useIsAutoConnecting() {
  const manager = useConnectionManagerCtx("useIsAutoConnecting");
  const store = manager.isAutoConnecting;
  return useSyncExternalStore(store.subscribe, store.getValue, store.getValue);
}
