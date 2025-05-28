import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import type { WelcomeScreen } from "../../../web/ui/ConnectWallet/screens/types.js";
import type { LocaleId } from "../../../web/ui/types.js";
import type { Theme } from "../../design-system/index.js";
import type { SiweAuthOptions } from "../auth/useSiweAuth.js";

export type ConnectEmbedProps = {
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
   * By default - ConnectEmbed UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the ConnectEmbed UI by setting the `locale` prop.
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
   *    <ConnectEmbed
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
   * The `ConnectEmbed` also shows a "All wallets" button at the end of wallet list which allows user to connect to any of the 500+ wallets
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
   * <ConnectEmbed client={client} autoConnect={{ timeout: 10000 }} />
   * ```
   */
  autoConnect?:
    | {
        timeout: number;
      }
    | boolean;

  /**
   * The [`Chain`](https://portal.thirdweb.com/references/typescript/v5/Chain) object of the blockchain you want the wallet to connect to
   *
   * If a `chain` is not specified, Wallet will be connected to whatever is the default set in the wallet.
   *
   * If a `chain` is specified, Wallet will be prompted to switch to given chain after connection if it is not already connected to it.
   * This ensures that the wallet is connected to the correct blockchain before interacting with your app.
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   * @example
   * ```tsx
   * import { polygon } from "thirdweb/chains";
   *
   * function Example() {
   *  return <div> <ConnectEmbed chain={polygon} /> </div>
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
   * - They will be displayed in the network selector in the `ConnectEmbed`'s details modal post connection
   * - They will be sent to wallet at the time of connection if the wallet supports requesting multiple chains ( example: WalletConnect ) so that users can switch between the chains post connection easily
   *
   * ```tsx
   * <ConnectEmbed chains={[ethereum, polygon, optimism]} />
   * ```
   *
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   *
   * ```tsx
   * import { defineChain } from "thirdweb/react";
   *
   * const polygon = defineChain({
   *   id: 137,
   * });
   * ```
   */
  chains?: Chain[];

  /**
   * Class name to be added to the root element of ConnectEmbed
   */
  className?: string;

  /**
   * Set the theme for the `ConnectEmbed` component. By default it is set to `"dark"`
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
   *  return <ConnectEmbed theme={customTheme} />
   * }
   * ```
   */
  theme?: "dark" | "light" | Theme;

  /**
   * CSS styles to be applied to the root element of ConnectEmbed
   */
  style?: React.CSSProperties;

  /**
   * If provided, Embed will show a Terms of Service message at the bottom with below link
   */
  termsOfServiceUrl?: string;

  /**
   * If provided, Embed will show a Privacy Policy message at the bottom with below link
   */
  privacyPolicyUrl?: string;

  /**
   * If provided, users will be required to accept the Terms of Service before connecting an in-app wallet.
   */
  requireApproval?: boolean;

  /**
   * Callback to be called on successful connection of wallet - including auto-connect.
   * The callback is called with the connected wallet
   *
   * ```tsx
   * <ConnectEmbed
   *  onConnect={(wallet) => {
   *    console.log("connected to", wallet)
   *  }}
   * />
   * ```
   * ```
   */
  onConnect?: (wallet: Wallet) => void;

  /**
   * By default, A "Powered by Thirdweb" branding is shown at the bottom of the embed.
   *
   * If you want to hide it, set this to `false`
   * @example
   * ```tsx
   * <ConnectEmbed showThirdwebBranding={false} />
   * ```
   */
  showThirdwebBranding?: boolean;

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
   * <ConnectEmbed
   *   accountAbstraction={{
   *    factoryAddress: "0x123...",
   *    chain: sepolia,
   *    gasless: true;
   *   }}
   * />
   */
  accountAbstraction?: SmartWalletOptions;

  /**
   * Wallets to show as recommended in the `ConnectEmbed` UI
   */
  recommendedWallets?: Wallet[];

  /**
   * By default, `ConnectEmbed` shows a "All Wallets" button that shows a list of 500+ wallets.
   *
   * You can disable this button by setting `showAllWallets` prop to `false`
   */
  showAllWallets?: boolean;

  /**
   * All wallet IDs included in this array will be hidden from the wallet selection list.
   */
  hiddenWallets?: WalletId[];

  /**
   * ConnectEmbed supports two modal size variants: `compact` and `wide`.
   *
   * By default it is set to `compact`, you can set it to `wide` if you want to show a wider modal.
   *
   * Note that if the screen width can not fit the wide modal, the `compact` version will be shown regardless of this `modalSize` options provided
   */
  modalSize?: "compact" | "wide";

  /**
   * Enable SIWE (Sign in with Ethererum) by passing an object of type `SiweAuthOptions` to
   * enforce the users to sign a message after connecting their wallet to authenticate themselves.
   *
   * Refer to the [`SiweAuthOptions`](https://portal.thirdweb.com/references/typescript/v5/SiweAuthOptions) for more details
   */
  auth?: SiweAuthOptions;

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
   * <ConnectEmbed welcomeScreen={welcomeScreen} />
   * ```
   *
   * #### 2. Render Custom Component
   *
   * ```tsx
   * <ConnectEmbed welcomeScreen={() => <YourComponent />} />
   * ```
   */
  welcomeScreen?: WelcomeScreen;

  /**
   * Set custom title and icon to show for the embed
   *
   * Set it to `true` to show the default title and icon
   */
  header?:
    | {
        title?: string;
        titleIcon?: string;
      }
    | true;
};
