import { ThirdwebSDKBaseProvider } from "./ThirdwebSDKProvider";
import { Adapter } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Network, ThirdwebSDK } from "@thirdweb-dev/solana";
import { createContext, FC, PropsWithChildren } from "react";

interface ThirdwebProviderProps {
  endpoint: Network;
  wallets?: Adapter[];
  autoConnect?: boolean;
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
 *              <ThirdwebProvider endpoint="devnet">
 *                  <YourApp />
 *              </ThirdwebProvider>
 * )};
 * ```
 */
export const ThirdwebProvider: FC<PropsWithChildren<ThirdwebProviderProps>> = ({
  children,
  endpoint,
  wallets,
  autoConnect,
}) => {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets || [new PhantomWalletAdapter()]}
        autoConnect={autoConnect || true}
      >
        <ThirdwebSDKProvider>{children}</ThirdwebSDKProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ThirdwebProviderContext = createContext<ThirdwebSDK | null>(null);
