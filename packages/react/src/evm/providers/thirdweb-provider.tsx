import {
  ThirdwebProviderCore,
  ThirdwebProviderCoreProps,
  WalletConfig,
} from "@thirdweb-dev/react-core";
import { WalletUIStatesProvider } from "./wallet-ui-states-provider";
import { ConnectModal } from "../../wallet/ConnectWallet/Modal/ConnectModal";
import { ThemeObjectOrType } from "../../design-system";
import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import type { Chain, defaultChains } from "@thirdweb-dev/chains";
import { defaultWallets } from "../../wallet/wallets/defaultWallets";
import { CustomThemeProvider } from "../../design-system/CustomThemeProvider";
import { signerWallet } from "../../wallet/wallets/signerWallet";
import { Signer } from "ethers";
import { en } from "../locales/en";
import { ThirdwebLocaleContext } from "./locale-provider";
import { walletIds } from "@thirdweb-dev/wallets";
import { ThirdwebLocale } from "../locales/types";

export interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "createWalletStorage" | "supportedWallets" | "theme" | "signerWallet"
  > {
  /**
   * Wallets supported by the dApp
   * @defaultValue `[ metamaskWallet(), coinbaseWallet(), walletConnect() ]`
   *
   * @example
   * ```jsx
   * import { metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider
   *  supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
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
   * You can also import `lightTheme` or `darkTheme` functions from `@thirdweb-dev/react` to use the default themes as base and overrides parts of it.
   *
   * @example
   * ```ts
   * import { lightTheme } from "@thirdweb-dev/react";
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   * ```
   */
  theme?: ThemeObjectOrType;

  /**
   * Use a signer instead of `supportedWallets` if you want to provide your own wallet connection logic.
   */
  signer?: Signer;

  /**
   * locale object contains text used for all thirdweb components
   *
   * it allows you to change the language used in UI components or override the texts used in the UI
   *
   * React SDK comes out of the box with Spanish and Japanese locale functions, but you can add support for any language you want just by passing an object with the required strings
   *
   * @example
   *
   * ## Using Built-in Locales
   *
   * ### Using the Spanish locale
   * ```tsx
   * import { ThirdwebProvider, es } from "@thirdweb-dev/react";
   *
   * const spanish = es();
   *
   * <ThirdwebProvider locale={spanish}> <App /> </ThirdwebProvider>
   * ```
   *
   * ### Using the Japanese locale
   * ```tsx
   * import { ThirdwebProvider, jp } from "@thirdweb-dev/react";
   *
   * const japanese = jp();
   *
   * <ThirdwebProvider locale={japanese}> <App /> </ThirdwebProvider>
   * ```
   *
   * ### Using English locale ( default )
   * ```tsx
   * import { ThirdwebProvider, en } from "@thirdweb-dev/react";
   *
   * const english = en();
   *
   * <ThirdwebProvider locale={english}> <App /> </ThirdwebProvider>
   * ```
   *
   * ## Overriding the locale
   *
   * ```tsx
   * import { ThirdwebProvider, en } from "@thirdweb-dev/react";
   *
   * // override some texts
   * const english = en({
   *   connectWallet: {
   *     confirmInWallet: "Confirm in your wallet",
   *   },
   *   wallets: {
   *     metamaskWallet: {
   *       connectionScreen: {
   *         inProgress: "Awaiting Confirmation",
   *         instruction: "Accept connection request in your MetaMask wallet",
   *       },
   *     },
   *   },
   * });
   *
   * <ThirdwebProvider locale={english}>
   *   <App />
   * </ThirdwebProvider>;
   *
   * ```
   *
   * ### Custom locale object
   *
   * ```tsx
   * import { ThirdwebProvider } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider locale={{ .... }}>
   *   <App />
   * </ThirdwebProvider>;
   *```
   *
   */
  locale?: ThirdwebLocale;
}

/**
 * Array of default supported chains by the thirdweb SDK
 */
export type DefaultChains = typeof defaultChains;

/**
 *
 * The `<ThirdwebProvider />` component lets you control what networks you want users to connect to,
 * what types of wallets can connect to your app, and the settings for the [Thirdweb SDK](https://docs.thirdweb.com/typescript).
 *
 * @example
 * You can wrap your application with the provider as follows:
 *
 * ```jsx title="App.jsx"
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   return (
 *     <ThirdwebProvider>
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 * ```
 *
 */
export const ThirdwebProvider = <TChains extends Chain[] = DefaultChains>(
  props: PropsWithChildren<ThirdwebProviderProps<TChains>>,
) => {
  const {
    supportedWallets,
    children,
    signer,
    theme: _theme,
    ...restProps
  } = props;

  const wallets: WalletConfig[] = supportedWallets || defaultWallets;
  const theme = _theme || "dark";

  const signerWalletConfig = useMemo(
    () => (signer ? (signerWallet(signer) as WalletConfig<any>) : undefined),
    [signer],
  );

  // preload the embeddedWallet SDK if present in supportedWallets
  const ewsRef = useRef(false);
  useEffect(() => {
    if (ewsRef.current) {
      return;
    }
    ewsRef.current = true;
    const preloadEmbeddedWallet = async () => {
      const hasEmbeddedWallet = wallets.find(
        (w) => w.id === walletIds.embeddedWallet,
      );
      if (hasEmbeddedWallet && restProps.clientId) {
        // TODO only preload the iframe instead of creating the SDK
        const { EmbeddedWalletSdk } = await import("@thirdweb-dev/wallets");
        new EmbeddedWalletSdk({
          clientId: restProps.clientId,
          chain: "Ethereum",
        });
      }
    };
    preloadEmbeddedWallet();
  }, [restProps.clientId, wallets]);

  return (
    <ThirdwebLocaleContext.Provider value={restProps.locale || en()}>
      <WalletUIStatesProvider theme={theme}>
        <CustomThemeProvider theme={theme}>
          <ThirdwebProviderCore
            {...restProps}
            theme={typeof theme === "string" ? theme : theme.type}
            supportedWallets={wallets}
            signerWallet={signerWalletConfig}
          >
            {children}
            <ConnectModal />
          </ThirdwebProviderCore>
        </CustomThemeProvider>
      </WalletUIStatesProvider>
    </ThirdwebLocaleContext.Provider>
  );
};
