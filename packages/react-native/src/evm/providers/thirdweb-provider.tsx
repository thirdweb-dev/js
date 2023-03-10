import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import { DEFAULT_API_KEY } from "../constants/rpc";
import {
  MetaMaskWallet,
  RainbowWallet,
  TrustWallet,
} from "../wallets/wallets/all";
import { CoinbaseWallet } from "../wallets/wallets/coinbase-wallet";
import {
  SupportedWallet as SupportedWalletCore,
  ThirdwebProvider as ThirdwebProviderCore,
  ThirdwebProviderProps as ThirdwebProviderCoreProps,
} from "@thirdweb-dev/react-core";
import React, { PropsWithChildren, useMemo } from "react";

export type ImplementedWallet =
  | typeof MetaMaskWallet
  | typeof RainbowWallet
  | typeof CoinbaseWallet
  | typeof TrustWallet;

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
    supportedWallets?: ImplementedWallet[];
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
  const supportedWalletsRN = useMemo(() => {
    const wallets = supportedWallets?.length
      ? supportedWallets
      : [MetaMaskWallet, CoinbaseWallet];

    return wallets as SupportedWalletCore[];
  }, [supportedWallets]);

  return (
    <ThirdwebProviderCore
      {...props}
      thirdwebApiKey={thirdwebApiKey}
      supportedWallets={supportedWalletsRN}
      createWalletStorage={
        createWalletStorage ? createWalletStorage : createAsyncLocalStorage
      }
    >
      {children}
    </ThirdwebProviderCore>
  );
}
