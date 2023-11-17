import { Cross2Icon } from "@radix-ui/react-icons";
import { CrossContainer } from "../../../components/Modal";
import { IconButton } from "../../../components/buttons";
import { iconSize, radius, shadow } from "../../../design-system";
import { WalletUIStatesProvider } from "../../../evm/providers/wallet-ui-states-provider";
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
import { ConnectWalletProps } from "../ConnectWallet";
import { StyledDiv } from "../../../design-system/elements";
import { SyncedWalletUIStates } from "./ConnectEmbed";

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
            width={iconSize.md}
            height={iconSize.md}
            style={{
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
          {modalSize === "compact" ? (
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
