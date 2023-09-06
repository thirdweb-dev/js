import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { PropsWithChildren, useMemo } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { SecureStorage } from "../../core/SecureStorage";
import { useCoinbaseWalletListener } from "../wallets/hooks/useCoinbaseWalletListener";
import { DEFAULT_WALLETS } from "../constants/wallets";
import { DappContextProvider } from "./context-provider";
import { UIContextProvider } from "./ui-context-provider";
import { MainModal } from "../components/MainModal";
import { ThemeProvider } from "../styles/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { walletIds } from "@thirdweb-dev/wallets";
import { ThirdwebStorage } from "../../core/storage/storage";

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "supportedWallets" | "secretKey" | "signer"
  > {
  /**
   * Wallets that will be supported by the dApp
   * @defaultValue [MetaMaskWallet, CoinbaseWallet]
   *
   * @example
   * ```jsx
   * import { MetaMaskWallet, CoinbaseWallet } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider
   *  supportedWallets={[MetaMaskWallet, CoinbaseWallet]}
   * />
   * ```
   */
  supportedWallets?: WalletConfig<any>[];
}

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
export const ThirdwebProvider = <
  TChains extends Chain[] = typeof defaultChains,
>({
  children,
  createWalletStorage = createAsyncLocalStorage,
  supportedWallets = DEFAULT_WALLETS,
  authConfig,
  theme,
  storageInterface,
  clientId,
  sdkOptions,
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  useCoinbaseWalletListener(
    !!supportedWallets.find((w) => w.id === walletIds.coinbase),
  );

  const hasMagicConfig = useMemo(
    () => !!supportedWallets.find((wc) => wc.id === walletIds.magicLink),
    [supportedWallets],
  );

  return (
    <ThirdwebProviderCore
      supportedWallets={supportedWallets}
      storageInterface={
        storageInterface ||
        new ThirdwebStorage({
          clientId: clientId,
          // @ts-expect-error - TODO: fix this (it does exist)
          gatewayUrls: sdkOptions?.gatewayUrls,
        })
      }
      authConfig={
        authConfig
          ? authConfig.secureStorage
            ? authConfig
            : { ...authConfig, secureStorage: new SecureStorage("auth") }
          : undefined
      }
      createWalletStorage={createWalletStorage}
      clientId={clientId}
      {...sdkOptions}
      {...restProps}
    >
      <ThemeProvider theme={theme}>
        <UIContextProvider>
          {hasMagicConfig ? (
            <SafeAreaProvider>
              <DappContextProvider>
                {children}
                <MainModal />
              </DappContextProvider>
            </SafeAreaProvider>
          ) : (
            <DappContextProvider>
              {children}
              <MainModal />
            </DappContextProvider>
          )}
        </UIContextProvider>
      </ThemeProvider>
    </ThirdwebProviderCore>
  );
};
