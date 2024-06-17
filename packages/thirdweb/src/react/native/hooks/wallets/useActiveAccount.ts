import { useActiveAccountCore } from "../../../core/hooks/wallets/useActiveAccount.js";
import { connectionManager } from "../../index.js";

/**
 * A hook that returns the active account
 * @returns The active `Account` or `undefined` if no active account is set.
 * @example
 * ```jsx
 * import { useActiveAccount } from "thirdweb/react";
 *
 * const activeAccount = useActiveAccount();
 * ```
 * @walletConnection
 */
export function useActiveAccount() {
  return useActiveAccountCore(connectionManager);
}
