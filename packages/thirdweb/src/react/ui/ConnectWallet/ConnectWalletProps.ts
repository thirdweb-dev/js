import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import { type Theme } from "../design-system/index.js";
import type { NetworkSelectorProps } from "./NetworkSelector.js";
import { type SupportedTokens } from "./defaultTokens.js";
import type { WelcomeScreen } from "./screens/types.js";

/**
 * Options for configuring the ConnectWallet's Connect Button
 */
export type ConnectWallet_ConnectButtonOptions = {
  /**
   * Set a custom label for the button. The default is `"Connect"`
   * @example
   * ```tsx
   * <ConnectWallet button={{
   *    label: "Sign in"
   * }} />
   * ```
   */
  label?: string;

  /**
   * CSS class to apply to the button element
   *
   * For some CSS properties, you may need to use the `!important` to override the default styles
   *
   * ```tsx
   * <ConnectWallet button={{
   *  className="my-custom-class"
   * }} />
   * ```
   */
  className?: string;

  /**
   * CSS styles to apply to the connectButton element
   */
  style?: React.CSSProperties;
};

/**
 * Options for configuring the ConnectWallet's Details Modal
 */
export type ConnectWallet_DetailsModalOptions = {
  /**
   * Show a "Request Testnet funds" link in ConnectWallet Details Modal when user is connected to a testnet.
   *
   * By default it is `false`, If you want to show the "Request Testnet funds" link when user is connected to a testnet, set this prop to `true`
   * @example
   * ```tsx
   * <ConnectWallet showTestnetFaucet={true} />
   * ```
   */
  showTestnetFaucet?: boolean;

  /**
   * customize the Network selector shown in the ConnectWallet Details Modal
   */
  networkSelector?: Omit<NetworkSelectorProps, "theme" | "onClose" | "open">;

  /**
   * Hide the "Switch to Personal wallet" option in the Connect Wallet details modal which is shown when wallet is connected to either Smart Wallet or Safe.
   *
   * By default it is `false`
   * @example
   * ```tsx
   * <ConnectWallet detailsModal={{
   *    hideSwitchToPersonalWallet: true
   *  }}
   * />
   * ```
   */
  hideSwitchToPersonalWallet?: boolean;

  /**
   * Hide the "Disconnect Wallet" button in the ConnectWallet Details Modal.
   *
   * By default it is `false`
   * @example
   * ```tsx
   * <ConnectWallet detailsModal={{
   *  hideDisconnect: true
   * }} />
   * ```
   */
  hideDisconnect?: boolean;

  /**
   * Render custom UI at the bottom of the ConnectWallet Details Modal
   * @param props - props passed to the footer component which includes a function to close the modal
   * @example
   * ```tsx
   * <ConnectWallet
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
};

/**
 * Options for configuring the ConnectWallet's Details Button
 */
export type ConnectWallet_DetailsButtonOptions = {
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
   * <ConnectWallet
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
   * Display the balance of a token instead of the native token in ConnectWallet details button.
   * @example
   * ```tsx
   * <ConnectWallet detailsButton={{
   *    balanceToken:{
   *      // show USDC balance when connected to Ethereum mainnet
   *      1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
   *    }
   *  })
   * />
   * ```
   */
  displayBalanceToken?: Record<number, string>;
};

/**
 * Options for configuring the ConnectWallet's Connect Modal
 */
export type ConnectWallet_ConnectModalOptions = {
  /**
   * Title of ConnectWallet Modal
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
   * <ConnectWallet modal={{
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
   * <ConnectWallet connectModal={{
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
   * <ConnectWallet connectModal={{
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
   * <ConnectWallet connectModal={{
   *  welcomeScreen: welcomeScreen,
   * }} />
   * ```
   *
   * #### 2. Render Custom Component
   *
   * ```tsx
   * <ConnectWallet
   *  connectModal={{
   *    welcomeScreen: () => <YourCustomComponent />
   *  }}
   * />
   * ```
   */
  welcomeScreen?: WelcomeScreen;

  /**
   * By default ConnectWallet shows "Powered by Thirdweb" branding at the bottom of the ConnectWallet Modal.
   *
   * If you want to hide the branding, set this prop to `false`
   * @example
   * ```tsx
   * <ConnectWallet connectModal={{
   *  showThirdwebBranding: false
   * }} />
   *```
   */
  showThirdwebBranding?: boolean;
};

/**
 * Props for the `ConnectWallet` component
 */
export type ConnectWalletProps = {
  /**
   * chain Id of the blockchain that your app operates on.
   *
   * If a chain Id is specified, Wallet will be prompted to switch to given chain id after connecting if it is not already connected to it. This ensures that the wallet is connected to the correct network before interacting with your app.
   * @example
   * ```tsx
   * <ConnectWallet chainId={137} />
   * ```
   */
  chainId?: bigint | number;

  /**
   * Array of chain ids that your app supports.
   *
   * This is only relevant if your app is a multi-chain app and works across multiple blockchains. If your app only works on a single blockchain, you should only specify the `chainId` prop.
   *
   * Given list of chain ids will used in various ways:
   * - They will be displayed in the network selector in the ConnectWallet modal
   * - They will be sent to wallet at the time of connection if the wallet supports it so that users can switch between the chains post connection
   *
   * ```tsx
   * <ConnectWallet chains={[1, 137, 10]} />
   * ```
   */
  chains?: (bigint | number)[];

  /**
   * Set the theme for the button and modal. By default it is set to `"dark"`
   *
   * theme can be set to either `"dark"`, `"light"` or a custom theme object. You can also import `lightTheme` or `darkTheme` functions from `thirdweb/react` to use the default themes as base and overrides parts of it.
   * @example
   * ```ts
   * import { lightTheme } from "thirdweb/react";
   *
   * const customTheme = lightTheme({
   *  colors: {
   *    modalBg: 'red'
   *  }
   * })
   * ```
   */
  theme?: "dark" | "light" | Theme;

  /**
   * Configurations for the button element that is shown when wallet is not connected
   */
  connectButton?: ConnectWallet_ConnectButtonOptions;

  /**
   * Configuration for the "Switch Network" button. This button is rendered when the wallet is connected, but it is not connected to the `chainId` prop provided in `ConnectWallet` component
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

  /**
   * Configurations for the ConnectWallet Modal that is shown for connecting a wallet
   */
  connectModal?: ConnectWallet_ConnectModalOptions;

  /**
   * Configurations for the Details Button that is shown when wallet is connected
   */
  detailsButton?: ConnectWallet_DetailsButtonOptions;

  /**
   * Configurations for the Details Modal that is shown when wallet is connected and user clicks on the details button to see the connected wallet details
   */
  detailsModal?: ConnectWallet_DetailsModalOptions;

  /**
   * Customize the tokens shown in the "Send Funds" screen for various networks.
   *
   * By default, The "Send Funds" screen shows a few popular tokens for default chains and the native token. For other chains it only shows the native token.
   * @example
   *
   * supportedTokens prop allows you to customize this list as shown below which shows  "Dai Stablecoin" when users wallet is connected to the "Base" mainnet.
   *
   * ```tsx
   * import { ConnectWallet } from 'thirdweb/react';
   *
   * function Example() {
   *   return (
   * 		<ConnectWallet
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
   * Callback to be called on successful connection of wallet. The callback is called with the connected account
   *
   * ```tsx
   * <ConnectWallet
   *  onConnect={(account) => {
   *    console.log("connected to", account)
   *  }}
   * />
   * ```
   *
   * Note that this does not include the sign in, If you want to call a callback after user connects AND signs in with their wallet, use `auth.onLogin` prop instead
   *
   * ```tsx
   * <ConnectWallet
   *  auth={{
   *   onLogin: () => {
   *     console.log("wallet connected and signed in")
   *   }
   *  }}
   * />
   * ```
   *
   */
  onConnect?: (wallet: Wallet) => void;
};
