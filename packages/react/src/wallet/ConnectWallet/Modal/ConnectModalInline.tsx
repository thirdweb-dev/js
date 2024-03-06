import { Cross2Icon } from "@radix-ui/react-icons";
import { CrossContainer } from "../../../components/Modal";
import { IconButton } from "../../../components/buttons";
import { Theme, iconSize, radius, shadow } from "../../../design-system";
import { WalletUIStatesProvider } from "../../../evm/providers/wallet-ui-states-provider";
import {
  wideModalMaxHeight,
  modalMaxWidthCompact,
  modalMaxWidthWide,
} from "../constants";
import { ConnectModalContent } from "./ConnectModal";
import { useSetupScreen } from "./screen";
import { useWallets } from "@thirdweb-dev/react-core";
import { DynamicHeight } from "../../../components/DynamicHeight";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../design-system/CustomThemeProvider";
import { StyledDiv } from "../../../design-system/elements";
import { SyncedWalletUIStates } from "./ConnectEmbed";
import { WelcomeScreen } from "../screens/types";
import { canFitWideModal } from "../../../evm/utils/canFitWIdeModal";

/**
 * @internal
 */
export type ConnectModalInlineProps = {
  className?: string;
  theme?: "dark" | "light" | Theme;
  modalTitle?: string;
  modalTitleIconUrl?: string;
  style?: React.CSSProperties;
  modalSize?: "compact" | "wide";
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  welcomeScreen?: WelcomeScreen;
  showThirdwebBranding?: boolean;
};

/**
 * @internal
 */
export const ConnectModalInline = (props: ConnectModalInlineProps) => {
  const walletConfigs = useWallets();
  const modalSize =
    !canFitWideModal() || walletConfigs.length === 1
      ? "compact"
      : props.modalSize;
  const ctxTheme = useCustomTheme();

  const walletUIStatesProps = {
    theme: props.theme || ctxTheme,
    modalSize: modalSize,
    title: props.modalTitle,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    welcomeScreen: props.welcomeScreen,
    titleIconUrl: props.modalTitleIconUrl,
    showThirdwebBranding: props.showThirdwebBranding,
  };

  return (
    <WalletUIStatesProvider {...walletUIStatesProps}>
      <CustomThemeProvider theme={walletUIStatesProps.theme}>
        <ConnectModalInlineContent
          className={props.className}
          modalSize={modalSize}
        />
        <SyncedWalletUIStates {...walletUIStatesProps} />
      </CustomThemeProvider>
    </WalletUIStatesProvider>
  );
};

function ConnectModalInlineContent(props: {
  className?: string;
  modalSize?: "compact" | "wide";
  style?: React.CSSProperties;
}) {
  const screenSetup = useSetupScreen();

  const content = (
    <>
      <ConnectModalContent
        screenSetup={screenSetup}
        onHide={() => {
          // no op
        }}
        isOpen={true}
        onClose={() => {
          // no op
        }}
        onShow={() => {
          // no op
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

  return (
    <ConnectModalInlineContainer
      className={props.className}
      style={{
        height: props.modalSize === "compact" ? "auto" : wideModalMaxHeight,
        maxWidth:
          props.modalSize === "compact"
            ? modalMaxWidthCompact
            : modalMaxWidthWide,
        ...props.style,
      }}
    >
      {props.modalSize === "compact" ? (
        <DynamicHeight> {content} </DynamicHeight>
      ) : (
        content
      )}
    </ConnectModalInlineContainer>
  );
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
