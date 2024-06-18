import { useActiveWalletChainCore } from "../../../core/hooks/wallets/useActiveWalletChain.js";
import { connectionManager } from "../../index.js";

/**
 * A hook that returns the chain the active wallet is connected to
 * @returns The chain the active wallet is connected to or null if no active wallet.
 * @example
 * ```jsx
 * import { useActiveWalletChain } from "thirdweb/react";
 *
 * const activeChain = useActiveWalletChain();
 * ```
 * @walletConnection
 */
export function useActiveWalletChain() {
  return useActiveWalletChainCore(connectionManager);
}
