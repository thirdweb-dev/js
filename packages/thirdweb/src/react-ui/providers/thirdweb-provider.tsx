import { en } from "../ui/locales/en.js";
import { LazyConnectModal } from "../ui/ConnectWallet/Modal/LazyConnectModal.js";
import type { ThirdwebProviderProps as ThirdwebProviderPropsReact } from "../../react/providers/thirdweb-provider.js";
import { ThirdwebProvider as ThirdwebProviderReact } from "../../react/providers/thirdweb-provider.js";
import type { ThirdwebLocale } from "../ui/locales/types.js";
import { defaultWallets } from "../wallets/defaultWallets.js";
import type { WalletConfig } from "../../react/types/wallets.js";
import { WalletUIStatesProvider } from "./wallet-ui-states-provider.js";
import { ThirdwebLocaleContext } from "./locale-provider.js";

/**
 * The ThirdwebProvider is component is a provider component that sets up the React Query client and Wallet Connection Manager.
 * To you thirdweb React SDK's hooks and components, you have to wrap your App component in a ThirdwebProvider.
 *
 * `ThirdwebProvider` requires a `client` prop which you can create using the `createThirdwebClient` function.  You must provide a `clientId` or `secretKey` in order to initialize a `client`.
 * You can create an Api key for free at from the [Thirdweb Dashboard](https://thirdweb.com/create-api-key).
 * @param props - The props for the ThirdwebProvider
 * @example
 * ```jsx
 * import { createThirdwebClient } from "thirdweb";
 * import { ThirdwebProvider } from "thirdweb/react";
 *
 * const client = createThirdwebClient({
 *  clientId: "<your_client_id>",
 * })
 *
 * function Example() {
 *  return (
 *    <ThirdwebProvider client={client}>
 *      <App />
 *    </ThirdwebProvider>
 *   )
 * }
 * ```
 * @component
 */
export function ThirdwebProvider(props: ThirdwebProviderProps) {
  return (
    <ThirdwebProviderReact wallets={props.wallets || defaultWallets} {...props}>
      <WalletUIStatesProvider theme="dark">
        <ThirdwebLocaleContext.Provider value={props.locale || en()}>
          <LazyConnectModal />
          {props.children}
        </ThirdwebLocaleContext.Provider>
      </WalletUIStatesProvider>
    </ThirdwebProviderReact>
  );
}

export type ThirdwebProviderProps = Omit<
  ThirdwebProviderPropsReact,
  "wallets"
> & {
  /**
   * `locale` prop allows you to change the language used in UI components or override the texts used in various thirdweb UI components.
   *
   * Below locale functions are available out of the box, but you can add support for any language you want by passing an object of type [`ThirdwebLocale`](https://portal.thirdweb.com/references/typescript/v5/ThirdwebLocale)
   *
   * - English - [`en`](https://portal.thirdweb.com/references/typescript/v5/en)
   * - Spanish - [`es`](https://portal.thirdweb.com/references/typescript/v5/es)
   * - Japanese - [`ja`](https://portal.thirdweb.com/references/typescript/v5/ja)
   * - Tagalog - [`tl`](https://portal.thirdweb.com/references/typescript/v5/tl)
   *
   * #### Using Built-in Locales
   *
   * ```tsx
   * import { ThirdwebProvider, es } from "thirdweb/react";
   *
   * const spanish = es();
   *
   * function Example() {
   *  return (
   *   <ThirdwebProvider locale={spanish}>
   *      <App />
   *   </ThirdwebProvider>
   *  )
   * }
   * ```
   *
   * ##### Overriding the locale
   *
   * ```tsx
   * import { ThirdwebProvider, en } from "thirdweb/react";
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
   * function Example() {
   *  return (
   *   <ThirdwebProvider locale={english}>
   *      <App />
   *   </ThirdwebProvider>
   *  )
   * }
   * ```
   *
   * #### Custom locale object
   *
   * ```tsx
   * import { ThirdwebProvider } from "thirdweb/react";
   *
   * function Example() {
   *  return (
   *   <ThirdwebProvider locale={customObject}>
   *      <App />
   *   </ThirdwebProvider>
   *  )
   * }
   * ```
   */
  locale?: ThirdwebLocale;

  /**
   * Array of supported wallets. If not provided, default wallets will be used.
   *
   * Wallets provided here appear in the `ConnectButton`'s Modal or in `ConnectEmbed` component's UI
   * @example
   * ```tsx
   * import { metamaskConfig, coinbaseConfig, walletConnectConfig } from "thirdweb/react";
   *
   * function Example() {
   *  return (
   *    <ThirdwebProvider client={client}
   *       wallets={[
   *         metamaskConfig(),
   *         coinbaseConfig(),
   *         walletConnectConfig(),
   *       ]}>
   *      <App />
   *    </ThirdwebProvider>
   *  )
   * }
   * ```
   *
   * If no wallets are specified. Below wallets will be used by default:
   *
   * - [Embedded Wallet](https://portal.thirdweb.com/references/typescript/v5/embeddedWalletConfig)
   * - [MataMask Wallet](https://portal.thirdweb.com/references/typescript/v5/metamaskConfig)
   * - [Coinbase Wallet](https://portal.thirdweb.com/references/typescript/v5/coinbaseConfig)
   * - [WalletConnect](https://portal.thirdweb.com/references/typescript/v5/walletConnectConfig)
   * - [rainbowConfig](https://portal.thirdweb.com/references/typescript/v5/rainbowConfig)
   * - [zerionConfig](https://portal.thirdweb.com/references/typescript/v5/zerionConfig)
   */
  wallets?: WalletConfig[];
};
