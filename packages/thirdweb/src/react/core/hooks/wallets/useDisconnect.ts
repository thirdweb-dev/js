import { useConnectionManager } from "../../providers/connection-manager.js";

/**
 * Disconnect from given account
 * @example
 * ```jsx
 * import { useDisconnect, useActiveWallet } from "thirdweb/react";
 *
 * function Example() {
 *   const { disconnect } = useDisconnect();
 *   const wallet = useActiveWallet();
 *
 *   return (
 *     <button onClick={() => disconnect(wallet)}>
 *       Disconnect
 *     </button>
 *   );
 * }
 * ```
 * @walletConnection
 * @returns An object with a function to disconnect an account
 */
export function useDisconnect() {
  const manager = useConnectionManager();
  const disconnect = manager.disconnectWallet;
  return { disconnect };
}
