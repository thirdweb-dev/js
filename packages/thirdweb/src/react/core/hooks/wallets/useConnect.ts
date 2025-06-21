"use client";

import { useCallback, useState } from "react";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { ConnectManagerOptions } from "../../../../wallets/manager/index.js";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";
import { useSetActiveWalletConnectionStatus } from "./useSetActiveWalletConnectionStatus.js";

/**
 * A hook to set a wallet as active wallet
 * @returns A function that lets you connect a wallet.
 * @example
 * ```jsx
 * import { createThirdwebClient } from "thirdweb";
 * import { useConnect } from "thirdweb/react";
 * import { createWallet } from "thirdweb/wallets";
 *
 * const client = createThirdwebClient({
 *   clientId: "YOUR_CLIENT_ID",
 * });
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
 *           await wallet.connect({
 *             client,
 *           });
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
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleConnection = useCallback(
    async (walletOrFn: Wallet | (() => Promise<Wallet>)) => {
      // reset error state
      setError(null);
      setConnectionStatus("connecting");
      if (typeof walletOrFn !== "function") {
        const account = await connect(walletOrFn, options);
        setConnectionStatus("connected");
        return account;
      }

      setIsConnecting(true);
      try {
        const w = await walletOrFn();
        const account = await connect(w, options);
        setConnectionStatus("connected");
        return account;
      } catch (e) {
        console.error(e);
        setError(e as Error);
        setConnectionStatus("disconnected");
      } finally {
        setIsConnecting(false);
      }
      return null;
    },
    [connect, options, setConnectionStatus],
  );

  return { connect: handleConnection, error, isConnecting } as const;
}
