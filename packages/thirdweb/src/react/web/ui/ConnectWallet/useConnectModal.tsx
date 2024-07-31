import { useCallback, useContext, useMemo, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../wallets/types.js";
import type { Theme } from "../../../core/design-system/index.js";
import { SetRootElementContext } from "../../../core/providers/RootElementContext.js";
import { WalletUIStatesProvider } from "../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../utils/canFitWideModal.js";
import { getDefaultWallets } from "../../wallets/defaultWallets.js";
import type { LocaleId } from "../types.js";
import ConnectModal from "./Modal/ConnectModal.js";
import { getConnectLocale } from "./locale/getConnectLocale.js";
import type { ConnectLocale } from "./locale/types.js";
import type { WelcomeScreen } from "./screens/types.js";

/**
 * hook that allows you to open the Connect UI in a Modal to prompt the user to connect wallet.
 * @example
 * ```tsx
 * import { createThirdwebClient } from "thirdweb";
 * import { useConnectModal } from "thirdweb/react";
 *
 * const client = createThirdwebClient({
 *  clientId: "<your_client_id>",
 * });
 *
 * function Example() {
 *   const { connect, isConnecting } = useConnectModal();
 *
 *   async function handleConnect() {
 *      const wallet = await connect({ client }); // opens the connect modal
 *      console.log('connected to', wallet);
 *   }
 *
 *   return <button onClick={handleConnect}> Connect </button>
 * }
 * ```
 *
 * The returned `connect` method takes an object of type [UseConnectModalOptions](https://portal.thirdweb.com/references/typescript/v5/ConnectButtonProps)
 * as an argument to customize the Connect Modal UI. Refer to [UseConnectModalOptions](https://portal.thirdweb.com/references/typescript/v5/ConnectButtonProps) to see the available options.
 *
 * @walletConnection
 */
export function useConnectModal() {
  const setRootEl = useContext(SetRootElementContext);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(
    (props: UseConnectModalOptions) => {
      function cleanup() {
        setIsConnecting(false);
        setRootEl(undefined);
      }

      return new Promise<Wallet>((resolve, reject) => {
        setIsConnecting(true);
        getConnectLocale(props.locale || "en_US")
          .then((locale) => {
            setRootEl(
              <Modal
                {...props}
                onConnect={(w) => {
                  resolve(w);
                  cleanup();
                }}
                onClose={() => {
                  reject();
                  cleanup();
                }}
                connectLocale={locale}
              />,
            );
          })
          .catch(() => {
            reject();
            cleanup();
          });
      });
    },
    [setRootEl],
  );

  return { connect, isConnecting };
}

function Modal(
  props: UseConnectModalOptions & {
    onConnect: (wallet: Wallet) => void;
    onClose: () => void;
    connectLocale: ConnectLocale;
  },
) {
  const wallets = useMemo(
    () =>
      props.wallets ||
      getDefaultWallets({
        appMetadata: props.appMetadata,
        chains: props.chains,
      }),
    [props.wallets, props.appMetadata, props.chains],
  );

  const size = useMemo(() => {
    return !canFitWideModal() || wallets.length === 1
      ? "compact"
      : props.size || "wide";
  }, [props.size, wallets.length]);
  const meta = useMemo(() => {
    return {
      privacyPolicyUrl: props.privacyPolicyUrl,
      showThirdwebBranding: props.showThirdwebBranding,
      termsOfServiceUrl: props.termsOfServiceUrl,
      title: props.title,
      titleIconUrl: props.titleIcon,
    };
  }, [
    props.privacyPolicyUrl,
    props.showThirdwebBranding,
    props.termsOfServiceUrl,
    props.title,
    props.titleIcon,
  ]);

  return (
    <WalletUIStatesProvider theme={props.theme} isOpen={true}>
      <ConnectModal
        onClose={props.onClose}
        shouldSetActive={props.setActive === undefined ? true : props.setActive}
        accountAbstraction={props.accountAbstraction}
        // TODO: not set up in `useConnectModal` for some reason?
        auth={undefined}
        chain={props.chain}
        client={props.client}
        connectLocale={props.connectLocale}
        meta={meta}
        size={size}
        welcomeScreen={props.welcomeScreen}
        isEmbed={false}
        localeId={props.locale || "en_US"}
        onConnect={props.onConnect}
        recommendedWallets={props.recommendedWallets}
        showAllWallets={props.showAllWallets}
        wallets={wallets}
        chains={props.chains}
        walletConnect={props.walletConnect}
      />
    </WalletUIStatesProvider>
  );
}

/**
 * Options for configuring Connect Modal for [`useConnectModal`](https://portal.thirdweb.com/references/typescript/v5/useConnectModal) hook
 * @connectWallet
 */
export type UseConnectModalOptions = {
  /**
   * Whether to set the connected wallet as active wallet or not
   *
   * By default, It is set to `true`
   *
   * You can set it to `false` and use the retunred wallet from the `connect` method if you want to connect wallet without setting it as active wallet
   *
   * @example
   * ```ts
   * function Example() {
   *  const { connect } = useConnectModal();
   *  return <button> onClick={async () => {
   *  const wallet = await connect({ setActive: false, client });
   * }}>
   *  Connect
   * </button>
   * }
   * ```
   */
  setActive?: boolean;

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
   * By default - Connect Modal UI uses the `en-US` locale for english language users.
   *
   * You can customize the language used in the Connect Modal UI by setting the `locale` prop.
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
   *  const { connect } = useConnectModal();
   *  return <button> onClick={() => connect({ wallets, client })}> Connect </button>
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
   * Connect Modal also shows a "All wallets" button at the end of wallet list which allows user to connect to any of the 350+ wallets
   */
  wallets?: Wallet[];

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
   * You can create a `Chain` object using the [`defineChain`](https://portal.thirdweb.com/references/typescript/v5/defineChain) function.
   * At minimum, you need to pass the `id` of the blockchain to `defineChain` function to create a `Chain` object.
   * ```
   */
  chain?: Chain;

  /**
   * Array of chains that your app supports.
   *
   * This is only relevant if your app is a multi-chain app and works across multiple blockchains.
   * If your app only works on a single blockchain, you should only specify the `chain` prop.
   *
   * Given list of chains will be sent to wallet at the time of connection if the wallet supports requesting multiple chains ( example: WalletConnect ) so that users can switch between the chains post connection easily
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
   * Set the theme for the Connect Modal. By default it is set to `"dark"`
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
   * ```
   */
  theme?: "dark" | "light" | Theme;

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
   * * function Example() {
   *  const { connect } = useConnectModal();
   *
   * async function handleConnect() {
   *  await connect({
   *    client,
   *    accountAbstraction: {
   *      factoryAddress: "0x123...",
   *      chain: sepolia,
   *      sponsorGas: true
   *    }
   *  })
   * }
   *
   *  return (
   *  <button> onClick={handleConnect}>
   *    Connect
   *  </button>
   * )
   *
   * }
   * ```
   */
  accountAbstraction?: SmartWalletOptions;

  /**
   * Wallets to show as recommended in the Connect Modal
   */
  recommendedWallets?: Wallet[];

  /**
   * By default, Connect modal shows a "All Wallets" button that shows a list of 350+ wallets.
   *
   * You can disable this button by setting `showAllWallets` prop to `false`
   */
  showAllWallets?: boolean;

  /**
   * Title to show in Connect Modal
   *
   * The default is `"Connect"`
   */
  title?: string;

  /**
   * Replace the default thirdweb icon next to Modal title with your own icon
   *
   * Set to empty string (`""`) to hide the icon
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
   */
  termsOfServiceUrl?: string;

  /**
   * URL of the "privacy policy" page
   *
   * If provided, Modal will show a Privacy Policy message at the bottom with below link
   */
  privacyPolicyUrl?: string;

  /**
   * Customize the welcome screen. This prop is only applicable when modal size prop is set to "wide". On "wide" Modal size, a welcome screen is shown on the right side of the modal.
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
   * ```
   *
   * #### 2. Render Custom Component
   *
   * ```tsx
   * const welcomeScreen = () => <YourCustomComponent />
   * ```
   */
  welcomeScreen?: WelcomeScreen;

  /**
   * By default Connect Modal shows "Powered by Thirdweb" branding at the bottom of the Modal.
   *
   * If you want to hide the branding, set this prop to `false`
   */
  showThirdwebBranding?: boolean;
};
