import { useConnectedWalletsCore } from "../../../core/hooks/wallets/useConnectedWallets.js";
import { connectionManager } from "../../index.js";

/**
 * A hook that returns all connected wallets
 * @returns An array of all connected wallets
 * @example
 * ```jsx
 * import { useConnectedWallets } from "thirdweb/react";
 *
 * const wallets = useConnectedWallets();
 * ```
 * @walletConnection
 */
export function useConnectedWallets() {
  return useConnectedWalletsCore(connectionManager);
}
