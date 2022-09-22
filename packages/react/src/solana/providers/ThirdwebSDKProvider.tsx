import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { ThirdwebSDK } from "@thirdweb-dev/solana";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface TWSolanaProviderProps {}

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
export const ThirdwebSDKProvider: FC<
  PropsWithChildren<TWSolanaProviderProps>
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
    <TWSolanaContext.Provider value={sdk}>{children}</TWSolanaContext.Provider>
  );
};

export const TWSolanaContext = createContext<ThirdwebSDK | null>(null);
