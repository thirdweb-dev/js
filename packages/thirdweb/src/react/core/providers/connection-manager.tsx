"use client";

import { createContext, useContext } from "react";
import type { ConnectionManager } from "../../../wallets/manager/index.js";

export const ConnectionManagerCtx = createContext<
  ConnectionManager | undefined
>(undefined);

/**
 * @internal
 */
export function useConnectionManager() {
  const connectionManager = useConnectionManagerCtx("useConnectionManager");
  if (!connectionManager) {
    throw new Error(
      "useConnectionManager must be used within a <ThirdwebProvider> Provider",
    );
  }
  return connectionManager;
}

/**
 * Use this instead of `useConnectionManager` to throw a more specific error message when used outside of a provider.
 * @internal
 */
export function useConnectionManagerCtx(hookname: string) {
  const manager = useContext(ConnectionManagerCtx);
  if (!manager) {
    throw new Error(`${hookname} must be used within <ThirdwebProvider>`);
  }

  return manager;
}
