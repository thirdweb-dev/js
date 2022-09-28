import {
  QueryClientProviderProps,
  QueryClientProviderWithDefault,
} from "../../core/providers/query-client";
import { ComponentWithChildren } from "../../core/types/component";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { ThirdwebSDK } from "@thirdweb-dev/solana";
import { createContext, useContext, useEffect, useState } from "react";

interface ThirdwebSDKProviderProps extends QueryClientProviderProps {
  connection: Connection;
  wallet?: WalletContextState;
}

/**
 * Gives access to the ThirdwebSDK instance and other useful hooks to the rest of the app.
 * Requires to be wrapped with a ConnectionProvider and a WalletProvider from @solana/wallet-adapter-react.
 * @example
 * ```tsx
 * import {
 *   useConnection,
 *   useWallet,
 * } from "@solana/wallet-adapter-react";
 * import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
 *
 * const ThirdwebApp = () => {
 *  const { connection } = useConnection();
 *  const wallet = useWallet();
 *  return (
 *    <ThirdwebSDKProvider connection={connection} wallet={wallet}>
 *      <YourApp />
 *    </ThirdwebSDKProvider>
 * )};
 * ```
 */
export const ThirdwebSDKProvider: ComponentWithChildren<
  ThirdwebSDKProviderProps
> = ({ children, connection, queryClient, wallet }) => {
  const [sdk, setSDK] = useState<ThirdwebSDK | null>(null);

  useEffect(() => {
    if (connection) {
      setSDK(new ThirdwebSDK(connection));
    } else {
      setSDK(null);
    }
  }, [connection]);

  useEffect(() => {
    if (sdk) {
      if (wallet?.publicKey) {
        sdk.wallet.connect(wallet);
      } else {
        sdk.wallet.disconnect();
      }
    }
  }, [sdk, wallet]);

  return (
    <QueryClientProviderWithDefault queryClient={queryClient}>
      <ThirdwebSDKContext.Provider value={sdk}>
        {children}
      </ThirdwebSDKContext.Provider>
    </QueryClientProviderWithDefault>
  );
};

const ThirdwebSDKContext = createContext<ThirdwebSDK | null>(null);

export function useSDK() {
  return useContext(ThirdwebSDKContext);
}
