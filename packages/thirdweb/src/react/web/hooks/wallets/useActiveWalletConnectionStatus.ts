import { useActiveWalletConnectionStatusCore } from "../../../core/hooks/wallets/useActiveWalletConnectionStatus.js";
import { connectionManager } from "../../index.js";

/**
 * A hook that returns the active account's connection status.
 * @example
 * ```jsx
 * import { useActiveWalletConnectionStatus } from "thirdweb/react";
 *
 * function Example() {
 *   const status = useActiveWalletConnectionStatus();
 *   console.log(status);
 *   return <div> ... </div>;
 * }
 * ```
 * @returns The active wallet's connection status.
 * @walletConnection
 */
export function useActiveWalletConnectionStatus() {
  return useActiveWalletConnectionStatusCore(connectionManager);
}
