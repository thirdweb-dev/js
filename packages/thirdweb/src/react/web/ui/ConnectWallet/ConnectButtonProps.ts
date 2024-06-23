import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { SiweAuthOptions } from "../../../core/hooks/auth/useSiweAuth.js";
import type { LocaleId } from "../types.js";
import type { NetworkSelectorProps } from "./NetworkSelector.js";
import type { SupportedTokens } from "./defaultTokens.js";
import type { WelcomeScreen } from "./screens/types.js";

export type PayUIOptions = {
  /**
   * Prefill the Buy Token amount, chain and/or token.
   * You can also disable the edits for the prefilled values using `allowEdits` - By default all are editable
   *
   * For example, if you want to allow changing the amount, but disable changing the token and chain,
   * you can set `allowEdits` to `{ amount: true, token: false, chain: false }`
   *
   * If no `token` object is not specified, native token will be prefilled by default
   */
  prefillBuy?: {
    chain: Chain;
    token?: {
      name: string;
      symbol: string;
      address: string;
      icon?: string;
    };
    amount?: string;
    allowEdits?: {
      amount: boolean;
      token: boolean;
      chain: boolean;
    };
  };

  /**
   * Configure options for buying tokens using other token ( aka Swap )
   *
   * By default, the "Crypto" option is enabled. You can disable it by setting `buyWithCrypto` to `false`
   *
   * You can prefill the source token and chain using `prefillSource`
   * You can also disable the edits for the prefilled values by setting `prefillSource.allowEdits` - By default all are editable
   *
   * For example, if you want to allow selecting chain and but disable selecting token, you can set `allowEdits` to `{ token: false, chain: true }`
   */
  buyWithCrypto?:
    | false
    | {
        prefillSource?: {
          chain: Chain;
          token?: {
            name: string;
            symbol: string;
            address: string;
            icon?: string;
          };
          allowEdits?: {
            token: boolean;
            chain: boolean;
          };
        };
      };

  /**
   * By default "Credit card" option is enabled. you can disable it by setting `buyWithFiat` to `false`
   *
   * You can also enable the test mode for the on-ramp provider to test on-ramp without using real credit card.
   */
  buyWithFiat?:
    | {
        testMode?: boolean;
      }
    | false;

  /**
   * Extra details to store with the purchase.
   *
   * This details will be stored with the purchase and can be retrieved later via the status API or Webhook
   */
  purchaseData?: object;
};

/**
 * Options for configuring the `ConnectButton`'s Connect Button
 * @connectWallet
 */
export type ConnectButton_connectButtonOptions = {
  /**
   * Set a custom label for the button. The default is `"Connect"`
   * @example
   * ```tsx
   * <ConnectButton connectButton={{
   *    label: "Sign in"
   * }} />
   * ```
   */
  label?: React.ReactNode;

  /**
   * CSS class to apply to the button element
   *
   * For some CSS properties, you may need to use the `!important` to override the default styles
   *
   * ```tsx
   * <ConnectButton connectButton={{
   *   className: "my-custom-class",
   * }} />
   * ```
   */
  className?: string;

  /**
   * CSS styles to apply to the connectButton element
   * @example
   * ```tsx
   * <ConnectButton connectButton={{
   *   style: {
   *     color: "red",
   *   },
   * }} />
   * ```
   */
  style?: React.CSSProperties;
};

/**
 * Options for configuring the `ConnectButton`'s Details Modal
 * @connectWallet
 */
export type ConnectButton_detailsModalOptions = {
  /**
   * Show a "Request Testnet funds" link in `ConnectButton` Details Modal when user is connected to a testnet.
   *
   * By default it is `false`, If you want to show the "Request Testnet funds" link when user is connected to a testnet, set this prop to `true`
   * @example
   * ```tsx
   * <ConnectButton showTestnetFaucet={true} />
   * ```
   */
  showTestnetFaucet?: boolean;

  /**
   * customize the Network selector shown in the `ConnectButton` Details Modal
   */
  networkSelector?: NetworkSelectorProps;

  /**
   * Hide the "Disconnect Wallet" button in the `ConnectButton` Details Modal.
   *
   * By default it is `false`
   * @example
   * ```tsx
   * <ConnectButton detailsModal={{
   *  hideDisconnect: true
   * }} />
   * ```
   */
  hideDisconnect?: boolean;

  /**
   * Render custom UI at the bottom of the `ConnectButton` Details Modal
   * @param props - props passed to the footer component which includes a function to close the modal
   * @example
   * ```tsx
   * <ConnectButton
   *  detailsModal={{
   *    footer(props) {
   *      const { close } = props;
   *      return <div> ... </div>
   *    }
   *  }}
   * />
   * ```
   */
  footer?: (props: { close: () => void }) => JSX.Element;

  /**
   * Configure options for thirdweb Pay.
   *
   * thirdweb Pay allows users to buy tokens using crypto or fiat currency.
   */
  payOptions?: PayUIOptions;
};

/**
 * Options for configuring the `ConnectButton`'s Details Button
 * @connectWallet
 */
export type ConnectButton_detailsButtonOptions = {
  /**
   * CSS class to apply to the details button element
   */
  className?: string;

  /**
   * CSS styles to apply to the details button element
   */
  style?: React.CSSProperties;

  /**
   * Render a custom button to display connected wallet details instead of the default one
   *
   * ```tsx
   * <ConnectButton
   *  detailsButton={{
   *    render() {
   *      return <button> .... </button>
   *    }
   *  }}
   * />
   * ```
   */
  render?: () => JSX.Element;

  /**
   * Display the balance of a token instead of the native token in `ConnectButton` details button.
   * @example
   * ```tsx
   * <ConnectButton detailsButton={{
   *    displayBalanceToken:{
   *      // show USDC balance when connected to Ethereum mainnet or Polygon
   *      [ethereum.id]: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
   *      [polygon.id]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
   *    }
   *  })
   * />
   * ```
   */
  displayBalanceToken?: Record<number, string>;
};

/**
 * Options for configuring the `ConnectButton`'s Connect Modal
 * @connectWallet
 */
export type ConnectButton_connectModalOptions = {
  /**
   * Title to show in `ConnectButton`'s Modal
   *
   * The default is `"Connect"`
   */
  title?: string;

  /**
   * Replace the default thirdweb icon next to Modal title with your own icon
   *
   * Set to empty string (`""`) to hide the icon
   * @example
   * ```tsx
   * <ConnectButton modal={{
   *  titleIconUrl: "https://your-icon-url.png"
   * }} />
   * ```
   */
  titleIcon?: string;

  /**
   * Set the size of the connect modal on desktop - `"compact"` or `"wide"`
   *
   * Modal size is always `compact` on mobile
   *
   * By default it is `"wide"` for desktop.
   */
  size?: "compact" | "wide";

  /**
   * URL of the "terms of service" page
   *
   * If provided, Modal will show a Terms of Service message at the bottom with below link
   * @example
   * ```tsx
   * <ConnectButton connectModal={{
   *   termsOfServiceUrl: "https://your-terms-of-service-url.com"
   * }} />
   * ```
   */
  termsOfServiceUrl?: string;

  /**
   * URL of the "privacy policy" page
   *
   * If provided, Modal will show a Privacy Policy message at the bottom with below link
   * @example
   * ```tsx
   * <ConnectButton connectModal={{
   *  privacyPolicyUrl="https://your-privacy-policy-url.com"
   * }} />
   * ```
   */
  privacyPolicyUrl?: string;

  /**
   * Customize the welcome screen. This prop is only applicable when modalSize prop is set to "wide". On "wide" Modal size, a welcome screen is shown on the right side of the modal.
   *
   * This screen can be customized in two ways
   *
   * #### 1. Customize Metadata and Image
   * ```tsx
   * const welcomeScreen = {
   *  title: "your title",
   *  subtitle: "your subtitle",
   *  img: {
   *   src: "https://your-image-url.png",
   *   width: 300,
   *   height: 50,
   *  },
   * }
   *
   * <ConnectButton connectModal={{
   *  welcomeScreen: welcomeScreen,
   * }} />
   * ```
   *
   * #### 2. Render Custom Component
   *
   * ```tsx
   * <ConnectButton
   *  connectModal={{
   *    welcomeScreen: () => <YourCustomComponent />
   *  }}
   * />
   * ```
   */
  welcomeScreen?: WelcomeScreen;

  /**
   * By default `ConnectButton`'s Modal shows "Powered by Thirdweb" branding at the bottom of the Modal.
   *
   * If you want to hide the branding, set this prop to `false`
   * @example
   * ```tsx
   * <ConnectButton connectModal={{
   *  showThirdwebBranding: false
   * }} />
   *```
   */
  showThirdwebBranding?: boolean;
};

/**
 * Props for the [`ConnectButton`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton) component
 * @connectWallet
 */
export type ConnectButtonProps = {
  /**
   * A client is the entry point to the thirdweb SDK.
   * It is required for all other actions.
   * You can create a client using the `createThirdwebClient` function. Refer to the [Creating a Client](https://portal.thirdweb.com/typescript/v5/client) documentation for more information.
   *
   * You must provide a `clientId` or `secretKey` in order to initialize a client. Pass `clientId` if you want for client-side usage and `secretKey` for server-side usage.
   *
   * ```tsx
   * import { createThirdwebClient } from "thirdweb";
   *
   * const client = createThirdwebClient({
   *  clientId: "<your_client_id>",
   * })
   * ```
   */
  client: ThirdwebClient;

  /**
   * By default - ConnectButton UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the ConnectButton UI by setting the `locale` prop.
   *
   * Refer to the [`LocaleId`](https://portal.thirdweb.com/references/typescript/v5/LocaleId) type for supported locales.
   */
  locale?: LocaleId;

  /**
   * Array of supported wallets. If not provided, default wallets will be used.
   * @example
   * ```tsx
   * import { AutoConnect } from "thirdweb/react";
   * import { createWallet, inAppWallet } from "thirdweb/wallets";
   *
   * const wallets = [
   *   inAppWallet(),
   *   createWallet("io.metamask"),
   *   createWallet("com.coinbase.wallet"),
   *   createWallet("me.rainbow"),
   * ];
   *
   * function Example() {
   *  return (
   *    <ConnectButton
   *      client={client}
   *      wallets={wallets}
   *    />
   *  )
   * }
   * ```
   *
   * If no wallets are specified. The component will show All the EIP-6963 compliant installed wallet extensions, as well as below default wallets:
   *
   * ```tsx
   * const defaultWallets = [
   *  inAppWallet(),
   *  createWallet("io.metamask"),
   *  createWallet("com.coinbase.wallet"),
   *  createWallet("me.rainbow"),
   *  createWallet("io.zerion.wallet"),
   * ]
   * ```
   *
   * The `ConnectButton` also shows a "All wallets" button at the end of wallet list which allows user to connect to any of the 350+ wallets
   */
  wallets?: Wallet[];

  /**
   * When the user has connected their wallet to your site, this configuration determines whether or not you want to automatically connect to the last connected wallet when user visits your site again in the future.
   *
   * By default it is set to `{ timeout: 15000 }` meaning that autoConnect is enabled and if the autoConnection does not succeed within 15 seconds, it will be cancelled.
   *
   * If you want to disable autoConnect, set this prop to `false`.
   *
   * If you want to customize the timeout, you can assign an object with a `timeout` key to this prop.
   * ```tsx
   * <ConnectButton client={client} autoConnect={{ timeout: 10000 }} />
   * ```
   */
  autoConnect?:
    | {
        timeout: number;
      }
    | boolean;

  /**
   * Metadata of the app that will be passed to connected wallet. Setting this is highly recommended.
   *
   * Some wallets display this information to the user when they connect to your app.
   * @example
   * ```ts
   * {
   *   name: "My App",
   *   url: "https://my-app.com",
   *   description: "some description about your app",
   *   logoUrl: "https://path/to/my-app/logo.svg",
   * };
   * ```
   */
  appMetadata?: AppMetadata;

  /**
   * The [`Chain`](https://portal.thirdweb.com/references/typescript/v5/Chain) object of the blockchain you want the wallet to connect to
   *
   * If a `chain` is not specified, Wallet will be connected to whatever is the default set in the wallet.
   *
   * If a `chain` is specified, Wallet will be prompted to switch to given chain after connection if it is not already connected to it.
   * This ensures that the wallet is connected to the correct blockchain before interacting with your app.
   *
   * The `ConnectButton` also shows a "Switch Network" button until the wallet is connected to the specified chain. Clicking on the "Switch Network" button triggers the wallet to switch to the specified chain.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   * @example
   * ```tsx
   * import { polygon } from "thirdweb/chains";
   *
   * function Example() {
   *  return <div> <ConnectButton chain={polygon} /> </div>
   * }
   * ```
   */
  chain?: Chain;

  /**
   * Array of chains that your app supports.
   *
   * This is only relevant if your app is a multi-chain app and works across multiple blockchains.
   * If your app only works on a single blockchain, you should only specify the `chain` prop.
   *
   * Given list of chains will used in various ways:
   * - They will be displayed in the network selector in the `ConnectButton`'s details modal post connection
   * - They will be sent to wallet at the time of connection if the wallet supports requesting multiple chains ( example: WalletConnect ) so that users can switch between the chains post connection easily
   *
   * ```tsx
   * <ConnectButton chains={[ethereum, polygon, optimism]} />
   * ```
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   *
   * ```tsx
   * import { defineChain } from "thirdweb/chains";
   *
   * const polygon = defineChain({
   *   id: 137,
   * });
   * ```
   */
  chains?: Chain[];

  /**
   * Set the theme for the `ConnectButton` component. By default it is set to `"dark"`
   *
   * theme can be set to either `"dark"`, `"light"` or a custom theme object.
   * You can also import [`lightTheme`](https://portal.thirdweb.com/references/typescript/v5/lightTheme)
   * or [`darkTheme`](https://portal.thirdweb.com/references/typescript/v5/darkTheme)
   * functions from `thirdweb/react` to use the default themes as base and overrides parts of it.
   * @example
   * ```ts
   * import { lightTheme } from "thirdweb/react";
   *
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   *
   * function Example() {
   *  return <ConnectButton theme={customTheme} />
   * }
   * ```
   */
  theme?: "dark" | "light" | Theme;

  /**
   * Configurations for the button element that is shown when wallet is not connected
   * @example
   * ```tsx
   * <ConnectButton
   *   connectButton={{
   *       label: "Connect",
   *       className: "my-custom-class",
   *       style: {
   *         borderRadius: "10px",
   *       },
   *   }}
   * />;
   * ```
   */
  connectButton?: ConnectButton_connectButtonOptions;

  /**
   * Configuration for the "Switch Network" button.
   * This button is rendered when the wallet is connected, but it is not connected to the `chain` prop provided in `ConnectButton` component
   * @example
   * ```tsx
   * <ConnectButton
   *   switchButton={{
   *     label: "Wrong Network",
   *     className: "my-custom-class",
   *     style: {
   *       backgroundColor: "red",
   *     },
   *   }}
   * />;
   * ```
   */
  switchButton?: {
    /**
     * Set a custom label for the "Switch Network" button
     */
    label?: string;

    /**
     * CSS styles to apply to the switch button element
     */
    style?: React.CSSProperties;

    /**
     * CSS class to apply to the switch button element
     */
    className?: string;
  };

  signInButton?: {
    /**
     * Set a custom label for the sign-in button
     * @example
     * ```tsx
     * <ConnectButton
     *   signInButton={{
     *     label: "Sign in now!"
     *   }}
     * />
     * ```
     */
    label?: string;

    /**
     * CSS styles to apply to the sign-in button element
     * @example
     * ```tsx
     * <ConnectButton
     *   signInButton={{
     *     style: {
     *       color: "purple",
     *     }
     *   }}
     * />
     * ```
     */
    style?: React.CSSProperties;

    /**
     * CSS class to apply to the sign-in button element
     * @example
     * ```tsx
     * <ConnectButton
     *   signInButton={{
     *     className: "my-class-name"
     *   }}
     * />
     * ```
     */
    className?: string;
  };

  /**
   * Configurations for the `ConnectButton`'s Modal that is shown for connecting a wallet
   * Refer to the [`ConnectButton_connectModalOptions`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton_connectModalOptions) type for more details
   * @example
   * ```tsx
   * <ConnectButton connectModal={{ size: "compact" }} />
   */
  connectModal?: ConnectButton_connectModalOptions;

  /**
   * Configurations for the Details Button that is shown when wallet is connected
   * Refer to the [`ConnectButton_detailsButtonOptions`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton_detailsButtonOptions) type for more details
   * @example
   * ```tsx
   * <ConnectButton
   *   detailsButton={{
   *     className: "my-custom-class",
   *     style: { borderRadius: "10px" },
   *   }}
   * />;
   * ```
   */
  detailsButton?: ConnectButton_detailsButtonOptions;

  /**
   * Configurations for the Details Modal that is shown when wallet is connected and user clicks on the details button to see the connected wallet details
   * Refer to the [`ConnectButton_detailsModalOptions`](https://portal.thirdweb.com/references/typescript/v5/ConnectButton_detailsModalOptions) type for more details
   */
  detailsModal?: ConnectButton_detailsModalOptions;

  /**
   * Customize the tokens shown in the "Send Funds" screen in Details Modal for various networks.
   *
   * By default, The "Send Funds" screen shows a few popular tokens for default chains and the native token. For other chains it only shows the native token.
   * @example
   *
   * supportedTokens prop allows you to customize this list as shown below which shows  "Dai Stablecoin" when users wallet is connected to the "Base" mainnet.
   *
   * ```tsx
   * import { ConnectButton } from 'thirdweb/react';
   *
   * function Example() {
   *   return (
   * 		<ConnectButton
   * 			supportedTokens={{
   *        // when connected to "Base" mainnet - show balance of DAI stablecoin
   * 				84532: [
   * 					{
   * 						address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // token contract address
   * 						name: 'Dai Stablecoin',
   * 						symbol: 'DAI',
   * 						icon: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
   * 					},
   * 				],
   * 			}}
   * 		/>
   * 	);
   * }
   * ```
   */
  supportedTokens?: SupportedTokens;

  /**
   * Called on connection of a wallet - including auto connect.
   * The callback is called with the connected wallet as an argument.
   *
   * ```tsx
   * <ConnectButton
   *  onConnect={(wallet) => {
   *    console.log("connected to", wallet)
   *  }}
   * />
   * ```
   */
  onConnect?: (wallet: Wallet) => void;

  /**
   * Called when the user disconnects the wallet by clicking on the "Disconnect Wallet" button in the `ConnectButton`'s Details Modal.
   *
   * ```tsx
   * <ConnectButton
   *  onDisconnect={({ wallet, account }) => {
   *    console.log("disconnected", wallet, account)
   *  }}
   * />
   * ```
   */
  onDisconnect?: (info: {
    wallet: Wallet;
    account: Account;
  }) => void;

  /**
   * Configure options for WalletConnect
   *
   * By default WalletConnect uses the thirdweb's default project id.
   * Setting your own project id is recommended.
   *
   * You can create a project id by signing up on [walletconnect.com](https://walletconnect.com/)
   */
  walletConnect?: {
    projectId?: string;
  };

  /**
   * Enable Account abstraction for all wallets. This will connect to the users's smart account based on the connected personal wallet and the given options.
   *
   * This allows to sponsor gas fees for your user's transaction using the thirdweb account abstraction infrastructure.
   *
   * ```tsx
   * <ConnectButton
   *   accountAbstraction={{
   *    factoryAddress: "0x123...",
   *    chain: sepolia,
   *    gasless: true;
   *   }}
   * />
   */
  accountAbstraction?: SmartWalletOptions;

  /**
   * Wallets to show as recommended in the `ConnectButton`'s Modal
   */
  recommendedWallets?: Wallet[];

  /**
   * By default, ConnectButton modal shows a "All Wallets" button that shows a list of 350+ wallets.
   *
   * You can disable this button by setting `showAllWallets` prop to `false`
   */
  showAllWallets?: boolean;

  /**
   * Enable SIWE (Sign in with Ethererum) by passing an object of type `SiweAuthOptions` to
   * enforce the users to sign a message after connecting their wallet to authenticate themselves.
   *
   * Refer to the [`SiweAuthOptions`](https://portal.thirdweb.com/references/typescript/v5/SiweAuthOptions) for more details
   */
  auth?: SiweAuthOptions;
};
