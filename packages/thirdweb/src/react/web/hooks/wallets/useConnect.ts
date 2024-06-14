import type { ConnectManagerOptions } from "../../../../wallets/manager/index.js";
import { useConnectCore } from "../../../core/hooks/wallets/useConnect.js";
import { connectionManager } from "../../index.js";

/**
 * A hook to set a wallet as active wallet
 * @returns A function that lets you connect a wallet.
 * @example
 * ```jsx
 * import { useConnect } from "thirdweb/react";
 * import { createWallet } from "thirdweb/wallets";
 *
 * function Example() {
 *   const { connect, isConnecting, error } = useConnect();
 *   return (
 *     <button
 *       onClick={() =>
 *         connect(async () => {
 *           // instantiate wallet
 *           const wallet = createWallet("io.metamask");
 *           // connect wallet
 *           await wallet.connect();
 *           // return the wallet
 *           return wallet;
 *         })
 *       }
 *     >
 *       Connect
 *     </button>
 *   );
 * }
 * ```
 * @walletConnection
 */
export function useConnect(options?: ConnectManagerOptions) {
  return useConnectCore(connectionManager, options);
}
