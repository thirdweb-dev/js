import { createContext, useContext } from "react";
import type { ConnectionManager } from "../../../wallets/manager/index.js";

export const ConnectionManagerCtx = createContext<
  ConnectionManager | undefined
>(undefined);

export function useConnectionManager() {
  const connectionManager = useContext(ConnectionManagerCtx);
  if (!connectionManager) {
    throw new Error(
      "useConnectionManager must be used within a ConnectionManager Provider",
    );
  }
  return connectionManager;
}
