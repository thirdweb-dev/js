import {
  SetModalConfigCtx,
  WalletUIStatesProvider,
} from "../../../evm/providers/wallet-ui-states-provider";
import { modalMaxWidthCompact, defaultTheme } from "../constants";
import { ConnectModalContent } from "./ConnectModal";
import { useScreen } from "./screen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useConnectionStatus } from "@thirdweb-dev/react-core";
import { DynamicHeight } from "../../../components/DynamicHeight";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../design-system/CustomThemeProvider";
import { ComponentProps, useContext, useEffect } from "react";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { StyledDiv } from "../../../design-system/elements";
import { Theme, radius } from "../../../design-system";

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
};

export const ConnectEmbed = (props: ConnectEmbedProps) => {
  const connectionStatus = useConnectionStatus();

  const { screen, setScreen, initialScreen } = useScreen();
  const modalSize = "compact" as const;

  const content = (
    <ConnectModalContent
      initialScreen={initialScreen}
      screen={screen}
      setScreen={setScreen}
      setHideModal={() => {
        // no op
      }}
    />
  );

  const walletUIStatesProps = {
    theme: props.theme || defaultTheme,
    modalSize: modalSize,
    title: undefined,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    isEmbed: true,
  };

  if (connectionStatus === "connected") {
    return null;
  }

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
