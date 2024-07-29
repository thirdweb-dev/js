import { useConnectionManager } from "../../providers/connection-manager.js";

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
  const manager = useConnectionManager();
  return manager.activeWalletConnectionStatusStore.setValue;
}
