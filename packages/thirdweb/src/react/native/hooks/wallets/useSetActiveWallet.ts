import { useSetActiveWalletCore } from "../../../core/hooks/wallets/useSetActiveWallet.js";
import { connectionManager } from "../../index.js";

/**
 * A hook that lets you set the active wallet.
 * @returns A function that lets you set the active wallet.
 * @example
 * ```jsx
 * import { useSetActiveWallet } from "thirdweb/react";
 *
 * const setActiveAccount = useSetActiveWallet();
 *
 * // later in your code
 * await setActiveAccount(account);
 * ```
 * @walletConnection
 */
export function useSetActiveWallet() {
  return useSetActiveWalletCore(connectionManager);
}
