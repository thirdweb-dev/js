import type { WalletAdapter } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  ThirdwebSDKProvider,
  ThirdwebAuthConfig,
} from "@thirdweb-dev/react-core/solana";
import { getUrlForNetwork, Network } from "@thirdweb-dev/sdk/solana";
import { PropsWithChildren } from "react";

interface ThirdwebProviderProps {
  network: Network;
  wallets?: WalletAdapter[];
  autoConnect?: boolean;
  authConfig?: ThirdwebAuthConfig;
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
> = ({
  network,
  wallets = DEFAULT_WALLETS,
  autoConnect = true,
  authConfig,
  children,
}) => {
  const clusterUrl = getUrlForNetwork(network);
  return (
    <ConnectionProvider endpoint={clusterUrl}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <ThirdwebWrapperProvider network={network} authConfig={authConfig}>
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
  PropsWithChildren<{ network?: Network; authConfig?: ThirdwebAuthConfig }>
> = ({ network, authConfig, children }) => {
  const wallet = useWallet();
  return (
    <ThirdwebSDKProvider
      network={network}
      wallet={wallet}
      authConfig={authConfig}
    >
      {children}
    </ThirdwebSDKProvider>
  );
};
