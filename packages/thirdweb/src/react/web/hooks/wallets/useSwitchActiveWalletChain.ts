import { useSwitchActiveWalletChainCore } from "../../../core/hooks/wallets/useSwitchActiveWalletChain.js";
import { connectionManager } from "../../index.js";

/**
 * Switch to blockchain with given chain id in the active wallet.
 * @returns A function to switch to blockchain with given chain id in the active wallet.
 * @example
 * ```jsx
 * import { useSwitchActiveWalletChain } from "thirdweb/react";
 * import { sepolia } from "thirdweb/chains";
 *
 * const switchChain = useSwitchActiveWalletChain();
 *
 * // later in your code
 * <button onClick={() => switchChain(sepolia)}>Switch Chain</button>
 * ```
 * @walletConnection
 */
export function useSwitchActiveWalletChain() {
  return useSwitchActiveWalletChainCore(connectionManager);
}
