import { Cross2Icon } from "@radix-ui/react-icons";
import { CrossContainer } from "../../../components/Modal";
import { IconButton } from "../../../components/buttons";
import { iconSize, radius, shadow } from "../../../design-system";
import {
  SetModalConfigCtx,
  WalletUIStatesProvider,
} from "../../../evm/providers/wallet-ui-states-provider";
import {
  wideModalMaxHeight,
  modalMaxWidthCompact,
  modalMaxWidthWide,
} from "../constants";
import { ConnectModalContent } from "./ConnectModal";
import { useScreen } from "./screen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useWallets } from "@thirdweb-dev/react-core";
import { DynamicHeight } from "../../../components/DynamicHeight";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../design-system/CustomThemeProvider";
import { ComponentProps, useContext, useEffect } from "react";
import { ConnectWalletProps } from "../ConnectWallet";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { StyledDiv } from "../../../design-system/elements";

export const ConnectModalInline = (
  props: Omit<
    ConnectWalletProps,
    | "detailsBtn"
    | "dropdownPosition"
    | "auth"
    | "networkSelector"
    | "hideTestnetFaucet"
    | "switchToActiveChain"
    | "supportedTokens"
    | "hideSwitchToPersonalWallet"
  > & {
    onModalHide?: () => void;
  },
) => {
  const { screen, setScreen, initialScreen } = useScreen();
  const walletConfigs = useWallets();
  const modalSize =
    isMobile() || walletConfigs.length === 1 ? "compact" : props.modalSize;
  const ctxTheme = useCustomTheme();

  const content = (
    <>
      <ConnectModalContent
        initialScreen={initialScreen}
        screen={screen}
        setScreen={setScreen}
        setHideModal={() => {
          if (props.onModalHide) {
            props.onModalHide();
          }
        }}
      />

      {/* close icon */}
      <CrossContainer>
        <IconButton type="button" aria-label="Close">
          <Cross2Icon
            style={{
              width: iconSize.md,
              height: iconSize.md,
              color: "inherit",
            }}
          />
        </IconButton>
      </CrossContainer>
    </>
  );

  const walletUIStatesProps = {
    theme: props.theme || ctxTheme,
    modalSize: modalSize,
    title: props.modalTitle,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    welcomeScreen: props.welcomeScreen,
    titleIconUrl: props.modalTitleIconUrl,
  };

  return (
    <WalletUIStatesProvider {...walletUIStatesProps}>
      <CustomThemeProvider theme={walletUIStatesProps.theme}>
        <ConnectModalInlineContainer
          className={props.className}
          style={{
            height: modalSize === "compact" ? "auto" : wideModalMaxHeight,
            maxWidth:
              modalSize === "compact"
                ? modalMaxWidthCompact
                : modalMaxWidthWide,
          }}
        >
          {props.modalSize === "compact" ? (
            <DynamicHeight> {content} </DynamicHeight>
          ) : (
            content
          )}
          <SyncedWalletUIStates {...walletUIStatesProps} />
        </ConnectModalInlineContainer>
      </CustomThemeProvider>
    </WalletUIStatesProvider>
  );
};

function SyncedWalletUIStates(
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

const ConnectModalInlineContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    background: theme.colors.modalBg,
    color: theme.colors.primaryText,
    transition: "background 0.2s ease",
    borderRadius: radius.xl,
    width: "100%",
    boxSizing: "border-box",
    boxShadow: shadow.lg,
    position: "relative",
    border: `1px solid ${theme.colors.borderColor}`,
    lineHeight: "normal",
    overflow: "hidden",
    fontFamily: theme.fontFamily,
    "& *::selection": {
      backgroundColor: theme.colors.primaryText,
      color: theme.colors.modalBg,
    },
  };
});
