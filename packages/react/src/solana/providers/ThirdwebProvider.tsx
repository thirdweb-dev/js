import { ThirdwebSDKProvider } from "./ThirdwebSDKProvider";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { getUrlForNetwork, Network } from "@thirdweb-dev/sdk/solana";
import { PropsWithChildren } from "react";

interface ThirdwebProviderProps {
  endpoint: Network;
  wallets?: WalletAdapter[];
  autoConnect?: boolean;
}

const DEFAULT_WALLETS = [new PhantomWalletAdapter()];

/**
 * Gives access to the ThirdwebSDK instance and other useful hooks to the rest of the app.
 * Requires to be wrapped with a ConnectionProvider and a WalletProvider from @solana/wallet-adapter-react.
 * @example
 * ```tsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
 *
 * const App = () => {
 *  return (
 *     <ThirdwebProvider endpoint="devnet">
 *       <YourApp />
 *     </ThirdwebProvider>
 * )};
 * ```
 * @beta
 */
export const ThirdwebProvider: React.FC<
  PropsWithChildren<ThirdwebProviderProps>
> = ({ endpoint, wallets, autoConnect, children }) => {
  const clusterUrl = getUrlForNetwork(endpoint);
  return (
    <ConnectionProvider endpoint={clusterUrl}>
      <WalletProvider
        wallets={wallets || DEFAULT_WALLETS}
        autoConnect={autoConnect || true}
      >
        <ThirdwebWrapperProvider>{children}</ThirdwebWrapperProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/**
 * @internal
 */
export const ThirdwebWrapperProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  return (
    <ThirdwebSDKProvider connection={connection} wallet={wallet}>
      {children}
    </ThirdwebSDKProvider>
  );
};
