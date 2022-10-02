import { ThirdwebSDKProvider } from "./base";
import type { WalletAdapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { getUrlForNetwork, Network } from "@thirdweb-dev/sdk/solana";
import { PropsWithChildren } from "react";

interface ThirdwebProviderProps {
  network: Network;
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
 *     <ThirdwebProvider network="devnet">
 *       <YourApp />
 *     </ThirdwebProvider>
 * )};
 * ```
 * @beta
 */
export const ThirdwebProvider: React.FC<
  PropsWithChildren<ThirdwebProviderProps>
> = ({ network, wallets = DEFAULT_WALLETS, autoConnect = true, children }) => {
  const clusterUrl = getUrlForNetwork(network);
  return (
    <ConnectionProvider endpoint={clusterUrl}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <ThirdwebWrapperProvider network={network}>
          {children}
        </ThirdwebWrapperProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/**
 * @internal
 */
export const ThirdwebWrapperProvider: React.FC<
  PropsWithChildren<{ network?: Network }>
> = ({ network, children }) => {
  const wallet = useWallet();
  return (
    <ThirdwebSDKProvider network={network} wallet={wallet}>
      {children}
    </ThirdwebSDKProvider>
  );
};
