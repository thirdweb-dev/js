import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

interface ThirdwebSDKProviderProps {
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
export const ThirdwebSDKProvider: FC<
  PropsWithChildren<ThirdwebSDKProviderProps>
> = ({ children, connection, wallet }) => {
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
    <ThirdwebSDKContext.Provider value={sdk}>
      {children}
    </ThirdwebSDKContext.Provider>
  );
};

export const ThirdwebSDKContext = createContext<ThirdwebSDK | null>(null);
