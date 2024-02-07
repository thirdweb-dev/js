import {
  SetModalConfigCtx,
  WalletUIStatesProvider,
} from "../../../providers/wallet-ui-states-provider.js";
import {
  modalMaxWidthCompact,
  defaultTheme,
  reservedScreens,
} from "../constants.js";
import { useScreen } from "./screen.js";
import { type ComponentProps, useContext, useEffect } from "react";
import { Spinner } from "../../components/Spinner.js";
import { Container } from "../../components/basic.js";
import type { WalletConfig } from "../../../types/wallets.js";
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
import { isMobile } from "../../../utils/isMobile.js";
import { ConnectModalContent } from "./ConnectModalContent.js";

export type ConnectEmbedProps = {
  /**
   * Chain Id to connect to
   */
  chainId?: number | bigint;

  /**
   * Class name to be added to the root element of ConnectEmbed
   */
  className?: string;

  /**
   * theme for the ConnectEmbed
   *
   * If a theme is set on the [`ThirdWebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) component, it will be used as the default theme for all thirdweb components, else the default will be "dark"
   *
   * theme can be set to either "dark" or "light" or a custom theme object.
   *
   * You can also import `lightTheme` or `darkTheme` functions from `@thirdweb-dev/react` to use the default themes as base and overrides parts of it.
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
   * Callback to be called on successful connection of wallet
   *
   * ```tsx
   * <ConnectEmbed
   *  onConnect={() => {
   *    console.log("wallet connected")
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
   *
   */
  onConnect?: () => void;
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
 * it renders the same UI as the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component's modal - but directly on the page instead of being in a modal.
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
 * The props for the component.
 *
 * ### className
 * Class name to be added to the root element of ConnectEmbed
 *
 * ### theme
 * theme for the ConnectEmbed
 *
 * If a theme is set on the [`ThirdWebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) component, it will be used as the default theme for all thirdweb components, else the default will be "dark"
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
 * ### style
 * CSS styles to be applied to the root element of ConnectEmbed
 *
 * ### termsOfServiceUrl
 * If provided, Embed will show a Terms of Service message at the bottom with below link
 *
 * ### privacyPolicyUrl
 * If provided, Embed will show a Privacy Policy message at the bottom with below link
 *
 * ### auth
 * Enforce that users must sign in with their wallet using [auth](https://portal.thirdweb.com/auth) after connecting their wallet.
 *
 * This requires the `authConfig` prop to be set on the [`ThirdWebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) component.
 *
 * The `auth` prop accepts an object with the following properties:
 * - `loginOptional` - specify whether signing in is optional or not. By default it is `false` ( sign in is required ) if `authConfig` is set on [`ThirdWebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)
 * - `onLogin` - Callback to be called after user signs in with their wallet
 * - `onLogout` - Callback to be called after user signs out
 *
 * ### onConnect
 * Callback to be called on successful connection of wallet
 *
 * ```tsx
 * <ConnectEmbed
 *  onConnect={() => {
 *    console.log("wallet connected")
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
 * @returns ConnectEmbed component
 */
export function ConnectEmbed(props: ConnectEmbedProps) {
  const loginOptional = props.auth?.loginOptional;
  const requiresSignIn = useSignInRequired(loginOptional);
  const show = useShowConnectEmbed(loginOptional);
  const { screen, setScreen, initialScreen } = useScreen();

  // if showing main screen but signIn is required, switch to signIn screen
  useEffect(() => {
    if (requiresSignIn && screen === reservedScreens.main) {
      setScreen(reservedScreens.signIn);
    }
  }, [requiresSignIn, screen, setScreen]);

  if (show) {
    return (
      <ConnectEmbedContent
        {...props}
        onClose={() => {
          setScreen(initialScreen);
        }}
        screen={screen}
        setScreen={setScreen}
        initialScreen={initialScreen}
        onConnect={props.onConnect}
      />
    );
  }

  return <div></div>;
}

/**
 * @internal
 */
const ConnectEmbedContent = (
  props: Omit<ConnectEmbedProps, "onConnect"> & {
    onClose: () => void;
    screen: string | WalletConfig;
    setScreen: (screen: string | WalletConfig) => void;
    initialScreen: string | WalletConfig;
    onConnect?: () => void;
  },
) => {
  const modalSize = "compact" as const;
  const connectionStatus = useActiveWalletConnectionStatus();
  const isAutoConnecting = useIsAutoConnecting();
  const contextTheme = useCustomTheme();

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
        initialScreen={props.initialScreen}
        screen={props.screen}
        setScreen={props.setScreen}
        isOpen={true}
        onClose={props.onClose}
        onHide={() => {
          // no op
        }}
        onShow={() => {
          // no op
        }}
        chainId={props.chainId ? BigInt(props.chainId) : undefined}
      />
    );
  }

  const walletUIStatesProps = {
    theme: props.theme || contextTheme || defaultTheme,
    modalSize: modalSize,
    title: undefined,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    isEmbed: true,
    auth: props.auth,
    onConnect: props.onConnect,
    chainId: props.chainId ? BigInt(props.chainId) : undefined,
  };

  return (
    <WalletUIStatesProvider {...walletUIStatesProps}>
      <CustomThemeProvider theme={walletUIStatesProps.theme}>
        <EmbedContainer
          className={props.className}
          style={{
            height: "auto",
            maxWidth: modalMaxWidthCompact,
            ...props.style,
          }}
        >
          <DynamicHeight> {content} </DynamicHeight>
          <SyncedWalletUIStates {...walletUIStatesProps} />
        </EmbedContainer>
      </CustomThemeProvider>
    </WalletUIStatesProvider>
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
      modalSize: (isMobile() ? "compact" : props.modalSize) || "wide",
      termsOfServiceUrl: props.termsOfServiceUrl,
      privacyPolicyUrl: props.privacyPolicyUrl,
      welcomeScreen: props.welcomeScreen,
      titleIconUrl: props.titleIconUrl,
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
