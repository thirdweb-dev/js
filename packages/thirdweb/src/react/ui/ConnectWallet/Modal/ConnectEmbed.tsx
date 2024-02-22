import {
  SetModalConfigCtx,
  WalletUIStatesProvider,
} from "../../../providers/wallet-ui-states-provider.js";
import {
  modalMaxWidthCompact,
  defaultTheme,
  reservedScreens,
} from "../constants.js";
import { useSetupScreen } from "./screen.js";
import { type ComponentProps, useContext, useEffect } from "react";
import { Spinner } from "../../components/Spinner.js";
import { Container } from "../../components/basic.js";
import { radius, type Theme } from "../../design-system/index.js";
import { StyledDiv } from "../../design-system/elements.js";
import {
  useCustomTheme,
  CustomThemeProvider,
} from "../../design-system/CustomThemeProvider.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import { useTWLocale } from "../../../providers/locale-provider.js";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useIsAutoConnecting,
} from "../../../providers/wallet-provider.js";
import { ConnectModalContent } from "./ConnectModalContent.js";
import { canFitWideModal } from "../../../utils/canFitWideModal.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Chain } from "viem";

export type ConnectEmbedProps = {
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
   * import { defineChain } from "thirdweb/react";
   *
   * const polygon = defineChain({
   *  id: 137,
   * });
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
   * Enforce that users must sign in with their wallet using [auth](https://portal.thirdweb.com/auth) after connecting their wallet.
   *
   * This requires the `authConfig` prop to be set on the [`ThirdWebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) component.
   */
  auth?: {
    /**
     * specify whether signing in is optional or not.
     *
     * By default it is `false` ( sign in is required ) if `authConfig` is set on [`ThirdWebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
     */
    loginOptional?: boolean;
    /**
     * Callback to be called after user signs in with their wallet
     */
    onLogin?: (token: string) => void;
    /**
     * Callback to be called after user signs out
     */
    onLogout?: () => void;
  };

  /**
   * Callback to be called on successful connection of wallet. The callback is called with the connected account
   *
   * ```tsx
   * <ConnectEmbed
   *  onConnect={(account) => {
   *    console.log("connected to", account)
   *  }}
   * />
   * ```
   *
   * Note that this does not include the sign in, If you want to call a callback after user connects AND signs in with their wallet, use `auth.onLogin` prop instead
   *
   * ```tsx
   * <ConnectEmbed
   *  auth={{
   *   onLogin: () => {
   *     console.log("wallet connected and signed in")
   *   }
   *  }}
   * />
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
};

/**
 * @internal
 */
function useSignInRequired(loginOptional?: boolean) {
  const connectionStatus = useActiveWalletConnectionStatus();

  // TODO
  // const { user } = useUser();
  // const authConfig = useThirdwebAuthContext();

  if (loginOptional === true) {
    return false;
  }

  // return (
  //   !!authConfig?.authUrl && !user?.address && connectionStatus === "connected"
  // );

  console.log(connectionStatus);

  return false;
}

/**
 * Returns `true` if the `<ConnectEmbed />` should be rendered.
 * It returns true if either one of the following conditions are met:
 * - the wallet is not connected
 * - the wallet is connected but the user is not signed in and `auth` is required ( loginOptional is not set to false )
 * @example
 * ```tsx
 * function Example() {
 *   const loginOptional = false;
 *   const showConnectEmbed = useShowConnectEmbed(loginOptional);
 *
 *   if (!showConnectEmbed) {
 *     return <div> Wallet is connected </div>
 *   }
 *
 *   return (
 *     <div>
 *       <ConnectEmbed
 *         auth={{
 *           loginOptional,
 *         }}
 *       />
 *     </div>
 *   );
 * }
 *```
 * @param loginOptional -
 * Specify whether the `<ConnectEmbed />` you want to render has auth enabled or not.
 * If not specified, it is assumed to be `false` ( login is required )
 * @returns `true` if the `<ConnectEmbed />` should be rendered.
 */
export function useShowConnectEmbed(loginOptional?: boolean) {
  const activeAccount = useActiveAccount();
  // const connectionStatus = useConnectionStatus();
  const signInRequired = useSignInRequired(loginOptional);

  return !activeAccount || signInRequired;
}

/**
 * A component that allows the user to connect their wallet.
 *
 * it renders the same UI as the [`ConnectButton`](https://portal.thirdweb.com/react/v4/components/ConnectButton) component's modal - but directly on the page instead of being in a modal.
 *
 * It only renders UI if either one of the following conditions are met:
 * - wallet is not connected
 * - wallet is connected but the user is not signed in and `auth` is required ( loginOptional is not set to false )
 *
 * `ConnectEmbed` uses the [`useShowConnectEmbed`](https://portal.thirdweb.com/react/v4/useShowConnectEmbed) hook internally to determine if it should be rendered or not. You can also use this hook to determine if you should render something else instead of `ConnectEmbed`
 * @example
 * ```tsx
 * function Example() {
 *   const loginOptional = false;
 *   const showConnectEmbed = useShowConnectEmbed(loginOptional);
 *
 *   if (!showConnectEmbed) {
 *     return <div> Wallet is connected </div>
 *   }
 *
 *   return (
 *     <div>
 *       <ConnectEmbed
 *         auth={{
 *           loginOptional,
 *         }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 * @param props -
 * The props for the `ConnectEmbed` component.
 *
 * Refer to the [`ConnectEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/ConnectEmbedProps) type for more details
 * @component
 */
export function ConnectEmbed(props: ConnectEmbedProps) {
  const loginOptional = props.auth?.loginOptional;
  const show = useShowConnectEmbed(loginOptional);

  const contextTheme = useCustomTheme();

  const walletUIStatesProps = {
    theme: props.theme || contextTheme || defaultTheme,
    modalSize: "compact" as const,
    title: undefined,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    isEmbed: true,
    auth: props.auth,
    onConnect: props.onConnect,
    showThirdwebBranding: props.showThirdwebBranding,
  };

  if (show) {
    return (
      <WalletUIStatesProvider {...walletUIStatesProps}>
        <CustomThemeProvider theme={walletUIStatesProps.theme}>
          <ConnectEmbedContent {...props} onConnect={props.onConnect} />
          <SyncedWalletUIStates {...walletUIStatesProps} />
        </CustomThemeProvider>
      </WalletUIStatesProvider>
    );
  }

  return <div></div>;
}

/**
 * @internal
 */
const ConnectEmbedContent = (
  props: ConnectEmbedProps & {
    loginOptional?: boolean;
  },
) => {
  const requiresSignIn = useSignInRequired(props.loginOptional);
  const screenSetup = useSetupScreen();
  const { screen, setScreen, initialScreen } = screenSetup;

  // if showing main screen but signIn is required, switch to signIn screen
  useEffect(() => {
    if (requiresSignIn && screen === reservedScreens.main) {
      setScreen(reservedScreens.signIn);
    }
  }, [requiresSignIn, screen, setScreen]);

  const connectionStatus = useActiveWalletConnectionStatus();
  const isAutoConnecting = useIsAutoConnecting();

  let content = null;

  // show spinner on page load and during auto connecting a wallet
  if (isAutoConnecting || connectionStatus === "unknown") {
    content = (
      <Container
        flex="column"
        center="both"
        style={{
          minHeight: "300px",
        }}
      >
        <Spinner size="xl" color="accentText" />
      </Container>
    );
  } else {
    content = (
      <ConnectModalContent
        screenSetup={screenSetup}
        isOpen={true}
        onClose={() => {
          setScreen(initialScreen);
        }}
        onHide={() => {
          // no op
        }}
        onShow={() => {
          // no op
        }}
      />
    );
  }

  return (
    <EmbedContainer
      className={props.className}
      style={{
        height: "auto",
        maxWidth: modalMaxWidthCompact,
        ...props.style,
      }}
    >
      <DynamicHeight> {content} </DynamicHeight>
    </EmbedContainer>
  );
};

/**
 * @internal
 */
export function SyncedWalletUIStates(
  props: ComponentProps<typeof WalletUIStatesProvider>,
) {
  const setModalConfig = useContext(SetModalConfigCtx);
  const locale = useTWLocale();

  // update modalConfig on props change
  useEffect(() => {
    setModalConfig((c) => ({
      ...c,
      title: props.title || locale.connectWallet.defaultModalTitle,
      theme: props.theme || "dark",
      modalSize: (!canFitWideModal() ? "compact" : props.modalSize) || "wide",
      termsOfServiceUrl: props.termsOfServiceUrl,
      privacyPolicyUrl: props.privacyPolicyUrl,
      welcomeScreen: props.welcomeScreen,
      titleIconUrl: props.titleIconUrl,
      showThirdwebBranding: props.showThirdwebBranding,
    }));
  }, [
    props.title,
    props.theme,
    props.modalSize,
    props.termsOfServiceUrl,
    props.privacyPolicyUrl,
    props.welcomeScreen,
    props.titleIconUrl,
    setModalConfig,
    locale.connectWallet.defaultModalTitle,
    props.showThirdwebBranding,
  ]);

  return <WalletUIStatesProvider {...props} />;
}

const EmbedContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.primaryText,
    background: theme.colors.modalBg,
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    lineHeight: "normal",
    borderRadius: radius.xl,
    border: `1px solid ${theme.colors.borderColor}`,
    overflow: "hidden",
    fontFamily: theme.fontFamily,
    "& *::selection": {
      backgroundColor: theme.colors.primaryText,
      color: theme.colors.modalBg,
    },
  };
});
