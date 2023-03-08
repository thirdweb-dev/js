import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import { CoinbaseWalletMobile } from "../wallets/wallets/coinbase-wallet-mobile";
import { MetaMaskWallet } from "../wallets/wallets/wallets";
import {
  SupportedWallet,
  ThirdwebProvider as ThirdwebProviderCore,
  ThirdwebProviderProps as ThirdwebProviderCoreProps,
} from "@thirdweb-dev/react-core";
import React, { PropsWithChildren } from "react";

export type ThirdwebProviderProps = PropsWithChildren<
  {
    /**
     * Wallets that will be supported by the dApp
     * @defaultValue [MetaMaskWallet, CoinbaseWalletMobile]
     *
     * @example
     * ```jsx
     * import { MetamaskWallet, CoinbaseWallet, DeviceWallet } from "@thirdweb-dev/react-native";
     *
     * <ThirdwebProvider
     *  supportedWallets={[MetaMaskWallet, CoinbaseWallet, DeviceWallet]}
     * />
     * ```
     */
    supportedWallets?: SupportedWallet[];
    createWalletStorage?: ThirdwebProviderCoreProps["createWalletStorage"];
  } & Omit<
    ThirdwebProviderCoreProps,
    "supportedWallets" | "createWalletStorage"
  >
>;

/**
 *
 * The `<ThirdwebProvider />` component lets you control what networks you want users to connect to,
 * what types of wallets can connect to your app, and the settings for the [Thirdweb SDK](https://docs.thirdweb.com/typescript).
 *
 * @example
 * You can wrap your application with the provider as follows:
 *
 * import { ThirdwebProvider } from "@thirdweb-dev/react-native";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider>
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 *
 */
export function ThirdwebProvider({
  children,
  createWalletStorage,
  thirdwebApiKey = DEFAULT_API_KEY,
  supportedWallets,
  ...props
}: ThirdwebProviderProps) {
  return (
    <ThirdwebProviderCore
      {...props}
      thirdwebApiKey={thirdwebApiKey}
      supportedWallets={
        supportedWallets?.length
          ? supportedWallets
          : [MetaMaskWallet, CoinbaseWalletMobile]
      }
      createWalletStorage={
        createWalletStorage ? createWalletStorage : createAsyncLocalStorage
      }
    >
      {children}
    </ThirdwebProviderCore>
  );
}
