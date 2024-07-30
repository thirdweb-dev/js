import { useCallback, useState } from "react";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { ConnectManagerOptions } from "../../../../wallets/manager/index.js";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";

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
  const manager = useConnectionManagerCtx("useConnect");
  const { connect } = manager;
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleConnection = useCallback(
    async (walletOrFn: Wallet | (() => Promise<Wallet>)) => {
      // reset error state
      setError(null);
      if (typeof walletOrFn !== "function") {
        return await connect(walletOrFn, options);
      }

      setIsConnecting(true);
      try {
        const w = await walletOrFn();
        return await connect(w, options);
      } catch (e) {
        console.error(e);
        setError(e as Error);
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [connect, options],
  );

  return { connect: handleConnection, isConnecting, error } as const;
}
