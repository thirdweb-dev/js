import { createAsyncLocalStorage } from "../../core/AsyncStorage";
import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { PropsWithChildren } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { SecureStorage } from "../../core/SecureStorage";
import { useCoinbaseWalletListener } from "../wallets/hooks/useCoinbaseWalletListener";
import { DEFAULT_WALLETS } from "../constants/wallets";
import { DappContextProvider } from "./context-provider";
import { UIContextProvider } from "./ui-context-provider";
import { MainModal } from "../components/MainModal";
import { ThemeProvider } from "../styles/ThemeProvider";
import { walletIds } from "@thirdweb-dev/wallets";
import { ThirdwebStorage } from "../../core/storage/storage";
import { useColorScheme } from "react-native";
import type { Locale } from "../i18n/types";

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
   * import { MetaMaskWallet, CoinbaseWallet } from "@thirdweb-dev/react-native";
   *
   * <ThirdwebProvider
   *  supportedWallets={[MetaMaskWallet, CoinbaseWallet]}
   * />
   * ```
   */
  supportedWallets?: WalletConfig<any>[];

  /**
   * Locale that the app will be displayed in
   * @defaultValue en()
   *
   * @example
   * ```jsx
   * import { en } from "@thirdweb-dev/react-native";
   *
   * <ThirdwebProvider
   *  locale={en()}
   * />
   * ```
   *
   * * ```jsx
   * import { en } from "@thirdweb-dev/react-native";
   *
   * <ThirdwebProvider
   *  locale={'en'}
   * />
   * ```
   *
   * Note that you can override the locales by passing in a custom locale object of type `Locale`
   * ```jsx
   * import { en } from "@thirdweb-dev/react-native";
   *
   * const customLocale = {
   *  ...en(),
   * "connect_wallet": "Connect Wallet"
   * }
   *
   * <ThirdwebProvider
   * locale={customLocale}
   * />
   * ```
   *
   */
  locale?: Locale;
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
  locale = "en",
  ...restProps
}: PropsWithChildren<ThirdwebProviderProps<TChains>>) => {
  const colorScheme = useColorScheme();

  const coinbaseWalletObj = supportedWallets.find(
    (w) => w.id === walletIds.coinbase,
  );
  useCoinbaseWalletListener(
    !!coinbaseWalletObj,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    coinbaseWalletObj?.config?.callbackURL,
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
      <ThemeProvider
        theme={theme ? theme : colorScheme === "dark" ? "dark" : "light"}
      >
        <UIContextProvider locale={locale}>
          <DappContextProvider>
            {children}
            <MainModal />
          </DappContextProvider>
        </UIContextProvider>
      </ThemeProvider>
    </ThirdwebProviderCore>
  );
};
