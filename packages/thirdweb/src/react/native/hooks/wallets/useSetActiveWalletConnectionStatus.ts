import { useSetActiveWalletConnectionStatusCore } from "../../../core/hooks/wallets/useSetActiveWalletConnectionStatus.js";
import { connectionManager } from "../../index.js";

/**
 * A hook that returns the active wallet's connection status.
 * @example
 * ```jsx
 * function Example() {
 *   const setActiveStatus = useSetActiveWalletConnectionStatus();
 *
 *   // when you want to set the connection status of the wallet
 *   setActiveStatus(status)
 * }
 * ```
 * @returns The active wallet's connection status.
 * @internal
 */
export function useSetActiveWalletConnectionStatus() {
  return useSetActiveWalletConnectionStatusCore(connectionManager);
}
