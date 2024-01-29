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
import packageJson from "../../../package.json";
import { detectOS } from "../utils/isMobile";

export interface ThirdwebProviderProps<TChains extends Chain[]>
  extends Omit<
    ThirdwebProviderCoreProps<TChains>,
    "createWalletStorage" | "supportedWallets" | "theme" | "signerWallet"
  > {
  /**
   * Wallets supported by the dApp
   *
   * If no wallets are provided, the default wallets will be used which is equivalent to the following:
   *
   * ```tsx
   * [
   *  metamaskWallet(),
   *  coinbaseWallet(),
   *  walletConnect(),
   *  trustWallet(),
   *  rainbowWallet(),
   *  zerionWallet(),
   *  phantomWallet(),
   * ]
   * ```
   *
   * ```jsx
   * import { metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
   *
   * <ThirdwebProvider
   *  supportedWallets={[
   *    metamaskWallet(),
   *    coinbaseWallet(),
   *    walletConnect()
   *  ]}
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
 *     <ThirdwebProvider clientId="YOUR_CLIENT_ID" activeChain="ethereum">
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * };
 * ```
 *
 * @param props -
 * The props for the component.
 *
 * ### activeChain (optional)
 * The activeChain prop determines which chain you want your app to be operating on.
 *
 * There are 1000+ chains available in the `@thirdweb-dev/chains` package. Import the chain you want and pass it to the `activeChain` prop.
 *
 * You can override the imported object or pass a custom chain object with required properties.
 *
 * ### supportedChains (optional)
 * An array of chains supported by your app.
 * There are 1000+ chains available in the `@thirdweb-dev/chains` package. You can import the chain you want and pass it to the `supportedChains` prop in an array.
 *
 * If not provided, it will default to the default supported chains supported by the thirdweb SDK.
 *
 * ```tsx
 * import { Ethereum, Polygon } from "@thirdweb-dev/chains";
 *
 * function Example() {
 *  return (
 *    <ThirdwebSDKProvider supportedChains={[ Ethereum, Polygon ]} activeChain={Ethereum}>
 *       <App />
 *    </ThirdwebSDKProvider>
 *  )
 * }
 * ```
 *
 * ### clientId (optional)
 * The clientId prop is required to use the thirdweb infrastructure services with the SDK.
 *
 * You can get a client ID by creating an API key on [thirdweb dashboard](https://thirdweb.com/dashboard/settings/api-keys)
 *
 * ### supportedWallets (optional)
 * Wallets supported by the dApp
 *
 * If no wallets are provided, the default wallets will be used which is equivalent to the following:
 *
 * ```tsx
 * [
 *  metamaskWallet(),
 *  coinbaseWallet(),
 *  walletConnect(),
 *  trustWallet(),
 *  rainbowWallet(),
 *  zerionWallet(),
 *  phantomWallet(),
 * ]
 * ```
 *
 * ```jsx
 * import { metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
 *
 * <ThirdwebProvider
 *  supportedWallets={[
 *    metamaskWallet(),
 *    coinbaseWallet(),
 *    walletConnect()
 *  ]}
 * />
 * ```
 *
 * ### theme (optional)
 * Set the theme for all thirdweb components
 *
 * By default it is set to "dark".
 *
 * theme can be set to either "dark" or "light" or a custom theme object.
 *
 * You can also import `lightTheme` or `darkTheme` functions from `@thirdweb-dev/react` to use the default themes as base and overrides parts of it.
 *
 * ```ts
 * import { lightTheme } from "@thirdweb-dev/react";
 * const customTheme = lightTheme({
 *  colors: {
 *    modalBg: 'red'
 *  }
 * })
 * ```
 *
 * ### locale (optional)
 * locale object contains text used for all thirdweb components
 *
 * it allows you to change the language used in UI components or override the texts used in the UI
 *
 * React SDK comes out of the box with Spanish and Japanese locale functions, but you can add support for any language you want just by passing an object with the required strings
 *
 * #### Using Built-in Locales
 *
 * ##### Using the Spanish locale
 * ```tsx
 * import { ThirdwebProvider, es } from "@thirdweb-dev/react";
 *
 * const spanish = es();
 *
 * <ThirdwebProvider locale={spanish}> <App /> </ThirdwebProvider>
 * ```
 *
 * ##### Using the Japanese locale
 * ```tsx
 * import { ThirdwebProvider, jp } from "@thirdweb-dev/react";
 *
 * const japanese = jp();
 *
 * <ThirdwebProvider locale={japanese}> <App /> </ThirdwebProvider>
 * ```
 *
 * ##### Using English locale ( default )
 * ```tsx
 * import { ThirdwebProvider, en } from "@thirdweb-dev/react";
 *
 * const english = en();
 *
 * <ThirdwebProvider locale={english}> <App /> </ThirdwebProvider>
 * ```
 *
 * ##### Overriding the locale
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
 * #### Custom locale object
 *
 * ```tsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 *
 * <ThirdwebProvider locale={{ .... }}>
 *   <App />
 * </ThirdwebProvider>;
 * ```
 *
 * ### dAppMeta (optional)
 * Metadata to pass to wallet connect and walletlink wallet connect. (Used to show *which* dApp is being connected to in mobile wallets that support it)
 * Defaults to just the name being passed as `thirdweb powered dApp`.
 *
 * ### autoConnect (optional)
 * When the user has connected their wallet to your site, this flag determines whether or not you want to automatically connect to the last connected wallet when user visits your site again in the future.
 * Defaults to `true`.
 *
 * ### sdkOptions (optional)
 * Override any of the default values for the SDK. Gas settings, gasless transactions, RPC configuration, and more.
 * ```tsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 *
 * const sdkOptions = {
 *   readonlySettings: {
 *     rpcUrl: "<rpc-url>", // force read calls to go through your own RPC url
 *     chainId: 1, // reduce RPC calls by specifying your chain ID
 *   },
 *   gasSettings: {
 *     maxPriceInGwei: 123, // Maximum gas price for transactions (default 300 gwei)
 *     speed: "fastest", // the tx speed setting: 'standard'|'fast|'fastest' (default: 'fastest')
 *   },
 *   gasless: {
 *     // By specifying a gasless configuration - all transactions will get forwarded to enable gasless transactions
 *     openzeppelin: {
 *       relayerUrl: "<open-zeppelin-relayer-url>", // your OZ Defender relayer URL
 *       relayerForwarderAddress: "<open-zeppelin-forwarder-address>", // the OZ defender relayer address (defaults to the standard one)
 *     },
 *     biconomy: {
 *       apiId: "biconomy-api-id", // your Biconomy API Id
 *       apiKey: "biconomy-api-key", // your Biconomy API Key
 *       deadlineSeconds: 123, // your Biconomy timeout preference
 *     },
 *   },
 *   infuraApiKey: "<infura-api-key>", // your Infura API key
 *   alchemyApiKey: "<alchemy-api-key>", // your Alchemy API key
 * };
 *
 * function Example() {
 *   return (
 *     <ThirdwebProvider sdkOptions={sdkOptions}>
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 *
 * ### authConfig (optional)
 * The configuration object for setting up [Auth](https://portal.thirdweb.com/wallets/auth); allowing users to sign in with their wallet.
 * It takes an object with the following properties:
 * - `authUrl` - The backend URL of the authentication endpoints. For example, if your endpoints are at `/api/auth/login`, `/api/auth/logout`, etc. then this should be set to `/api/auth`
 * - `domain` - The frontend domain used to generate the login payload. This domain should match the domain used on your auth backend.
 * - `secureStorage` - Secure storage to use when working with JWT tokens. By default auth uses cookies so no need to set this unless you want to specifically use JWT tokens
 *
 * ```tsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 *
 * function MyApp() {
 *   return (
 *     <ThirdwebProvider
 *       authConfig={{
 *         authUrl: "/api/auth",
 *         domain: "https://example.com",
 *       }}
 *     >
 *       <YourApp />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 *
 * ### signer (optional)
 * Use a signer instead of `supportedWallets` if you want to provide your own wallet connection logic.
 *
 * ### storageInterface
 * Override the default [Storage](/storage) interface used by the SDK.
 *
 * Allows you to create an instance of `ThirdwebStorage` with your own customized config, and pass it to the SDK. This requires the `@thirdweb-dev/storage` package to be installed.
 *
 * [Learn more about storage](https://portal.thirdweb.com/infrastructure/storage/overview)
 *
 * ```jsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 * import {
 * 	ThirdwebStorage,
 * 	StorageDownloader,
 * 	IpfsUploader,
 * } from "@thirdweb-dev/storage";
 *
 * // Configure a custom ThirdwebStorage instance
 * const storage = new ThirdwebStorage({
 * 	uploader: new IpfsUploader(),
 * 	downloader: new StorageDownloader(),
 * 	gatewayUrls: {
 * 		"ipfs://": [
 * 			"https://gateway.ipfscdn.io/ipfs/",
 * 			"https://cloudflare-ipfs.com/ipfs/",
 * 			"https://ipfs.io/ipfs/",
 * 		],
 * 	},
 * });
 *
 * // Provide the custom storage instance to the SDK
 * function MyApp() {
 * 	return (
 * 		<ThirdwebProvider storageInterface={storage}>
 * 			<YourApp />
 * 		</ThirdwebProvider>
 * 	);
 * }
 * ```
 *
 * ### queryClient (optional)
 * If you are using [React Query](https://react-query.tanstack.com/) and have your own `QueryClient`,
 * you can pass it as the `queryClient` prop to use this client instead of the SDK's default client.
 *
 * ```jsx
 * import { ThirdwebProvider } from "@thirdweb-dev/react";
 * import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 *
 * function MyApp() {
 * 	// Your React Query client (or client from other library such as wagmi)
 * 	const queryClient = new QueryClient();
 *
 * 	return (
 * 		<QueryClientProvider client={queryClient}>
 * 			<ThirdwebProvider queryClient={queryClient}>
 * 				<YourApp />
 * 			</ThirdwebProvider>
 * 		</QueryClientProvider>
 * 	);
 * }
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

  if (typeof globalThis !== "undefined") {
    (globalThis as any).X_SDK_NAME = packageJson.name;
    (globalThis as any).X_SDK_PLATFORM = "react";
    (globalThis as any).X_SDK_VERSION = packageJson.version;
    (globalThis as any).X_SDK_OS = detectOS();
  }

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
