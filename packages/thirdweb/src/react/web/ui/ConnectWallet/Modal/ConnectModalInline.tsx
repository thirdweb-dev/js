"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  type Theme,
  iconSize,
  radius,
  shadow,
} from "../../../../core/design-system/index.js";
import { useConnectUI } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { WalletUIStatesProvider } from "../../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../../utils/canFitWideModal.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import { CrossContainer } from "../../components/Modal.js";
import { IconButton } from "../../components/buttons.js";
import { StyledDiv } from "../../design-system/elements.js";
import {
  modalMaxWidthCompact,
  modalMaxWidthWide,
  wideModalMaxHeight,
} from "../constants.js";
import type { WelcomeScreen } from "../screens/types.js";
import { ConnectModalContent } from "./ConnectModalContent.js";
import { useSetupScreen } from "./screen.js";

/**
 * @internal
 */
export type ConnectModalInlineProps = {
  chainId?: bigint;
  chains?: (bigint | number)[];
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
  const walletConfigs = useConnectUI().wallets;
  const modalSize =
    !canFitWideModal() || walletConfigs.length === 1
      ? "compact"
      : props.modalSize;

  return (
    <WalletUIStatesProvider theme={props.theme} isOpen={true}>
      <ConnectModalInlineContent
        className={props.className}
        modalSize={modalSize}
      />
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
        shouldSetActive={true}
        screenSetup={screenSetup}
        setModalVisibility={() => {
          // noop
        }}
        isOpen={true}
        onClose={() => {
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
