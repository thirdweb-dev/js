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
import { ThemeProvider, ThemeType } from "../styles/ThemeProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { walletIds } from "@thirdweb-dev/wallets";
import { ThirdwebStorage } from "../../core/storage/storage";
import type { Locale } from "../i18n/types";

interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "supportedWallets" | "secretKey" | "signer" | "theme"
  > {
  /**
   * Wallets that will be supported by the dApp
   *
   * If no wallets are set, default wallets are used which is equivalent to the following:
   *
   * ```ts
   * [
   *  metamaskWallet(),
   *  rainbowWallet(),
   *  trustWallet()
   * ]
   *```
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
   * Set the theme for all thirdweb components
   *
   * By default it is set to "dark".
   *
   * theme can be set to either "dark" or "light" or a custom theme object.
   *
   * You can also import `lightTheme` or `darkTheme` functions from `@thirdweb-dev/react-native` to use the default themes as base and overrides parts of it.
   *
   * @example
   * ```ts
   * import { darkTheme } from "@thirdweb-dev/react-native";
   * const customTheme = darkTheme({
   *  colors: {
   *      accentButtonColor: 'black',
   *  },
   * })
   * ```
   */
  theme?: ThemeType;

  /**
   * Locale that the app will be displayed in
   *
   * By default it is set to `en()`
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
   * ```jsx
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
 * Array of default supported chains by the thirdweb SDK
 */
export type DefaultChains = typeof defaultChains;

/**
 *
 * The `<ThirdwebProvider />` component lets you control what networks you want users to connect to,
 * what types of wallets can connect to your app, and the settings for the Thirdweb SDK.
 *
 * @example
 * You can wrap your application with the provider as follows:
 *
 * ```jsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react-native";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider>
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 * ```
 */
export const ThirdwebProvider = <TChains extends Chain[] = DefaultChains>(
  props: PropsWithChildren<ThirdwebProviderProps<TChains>>,
) => {
  const {
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
  } = props;

  const coinbaseWalletObj = supportedWallets.find(
    (w) => w.id === walletIds.coinbase,
  );
  useCoinbaseWalletListener(
    !!coinbaseWalletObj,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    coinbaseWalletObj?.config?.callbackURL,
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
      <ThemeProvider theme={theme ? theme : "dark"}>
        <UIContextProvider locale={locale}>
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
