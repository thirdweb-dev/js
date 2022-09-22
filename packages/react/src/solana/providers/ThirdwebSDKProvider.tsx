import { Adapter } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ThirdwebSDK } from "@thirdweb-dev/solana";
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

interface ThirdwebSDKProviderProps {
  connection: Connection;
  wallet: Adapter;
}

/**
 * Gives access to the ThirdwebSDK instance and other useful hooks to the rest of the app.
 * Requires to be wrapped with a ConnectionProvider and a WalletProvider from @solana/wallet-adapter-react.
 * @example
 * ```tsx
 * import {
 *   ConnectionProvider,
 *   WalletProvider,
 * } from "@solana/wallet-adapter-react";
 * import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
 *
 * const App = () => {
 *  return (
 *      <ConnectionProvider endpoint={endpoint}>
 *          <WalletProvider wallets={wallets} autoConnect>
 *              <ThirdwebSDKProvider>
 *                  <YourApp />
 *              </ThirdwebProvider>
 *          </WalletProvider>
 *      </ConnectionProvider>
 * )};
 * ```
 */
export const ThirdwebSDKBaseProvider: FC<
  PropsWithChildren<ThirdwebSDKProviderProps>
> = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [sdk, setSDK] = useState<ThirdwebSDK | null>(null);

  useEffect(() => {
    if (connection) {
      setSDK(new ThirdwebSDK(connection));
    }
  }, [connection]);

  useEffect(() => {
    if (sdk) {
      if (wallet.publicKey) {
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
