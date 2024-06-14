import { useActiveWalletCore } from "../../../core/hooks/wallets/useActiveWallet.js";
import { connectionManager } from "../../index.js";

/**
 * A hook that returns the active wallet
 * @returns The active `Wallet` or `undefined` if no active wallet is set.
 * @example
 * ```jsx
 * import { useActiveWallet } from "thirdweb/react";
 *
 * const wallet = useActiveWallet();
 * ```
 * @walletConnection
 */
export function useActiveWallet() {
  return useActiveWalletCore(connectionManager);
}
