import {
  SetModalConfigCtx,
  WalletUIStatesProvider,
} from "../../../evm/providers/wallet-ui-states-provider";
import {
  modalMaxWidthCompact,
  defaultTheme,
  reservedScreens,
} from "../constants";
import { ConnectModalContent } from "./ConnectModal";
import { useScreen } from "./screen";
import { isMobile } from "../../../evm/utils/isMobile";
import { DynamicHeight } from "../../../components/DynamicHeight";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../design-system/CustomThemeProvider";
import { ComponentProps, useContext, useEffect } from "react";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { StyledDiv } from "../../../design-system/elements";
import { Theme, radius } from "../../../design-system";
import {
  WalletConfig,
  useConnectionStatus,
  useThirdwebAuthContext,
  useUser,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { Container } from "../../../components/basic";
import { Spinner } from "../../../components/Spinner";

export type ConnectEmbedProps = {
  className?: string;
  theme?: "dark" | "light" | Theme;

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
   * This requires the `authConfig` prop to be set on the `ThirdWebProvider` component.
   */
  auth?: {
    /**
     * specify whether signing in is optional or not.
     *
     * By default it is `true` if `authConfig` is set on `ThirdWebProvider`
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
};

/**
 * @internal
 */
function useSignInRequired(loginOptional?: boolean) {
  const connectionStatus = useConnectionStatus();
  const { user } = useUser();
  const authConfig = useThirdwebAuthContext();

  if (loginOptional === false) {
    return false;
  }

  return (
    !!authConfig?.authUrl && !user?.address && connectionStatus === "connected"
  );
}

/**
 * Returns `true` if the `<ConnectEmbed />` should be rendered.
 * It returns true if either one of the following conditions are met:
 * - the wallet is not connected
 * - the wallet is connected but the user is not signed in and `auth` is required ( loginOptional is not set to false )
 *
 * @param loginOptional -
 * Specify whether the `<ConnectEmbed />` you want to render has auth enabled or not.
 * If not specified, it is assumed to be `false` ( login is required )
 *
 */
export function useShowConnectEmbed(loginOptional?: boolean) {
  const connectionStatus = useConnectionStatus();
  const signInRequired = useSignInRequired(loginOptional);

  return connectionStatus !== "connected" || signInRequired;
}

export const ConnectEmbed = (props: ConnectEmbedProps) => {
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
      />
    );
  }

  return null;
};

const ConnectEmbedContent = (
  props: Omit<ConnectEmbedProps, "onConnect"> & {
    onClose: () => void;
    screen: string | WalletConfig;
    setScreen: (screen: string | WalletConfig) => void;
    initialScreen: string | WalletConfig;
  },
) => {
  const modalSize = "compact" as const;
  const connectionStatus = useConnectionStatus();
  const { isAutoConnecting } = useWalletContext();

  let content = (
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
    />
  );

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
  }

  const walletUIStatesProps = {
    theme: props.theme || defaultTheme,
    modalSize: modalSize,
    title: undefined,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    isEmbed: true,
    auth: props.auth,
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
