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
import { useScreen } from "./screen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useWallets } from "@thirdweb-dev/react-core";
import { DynamicHeight } from "../../../components/DynamicHeight";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../../../design-system/CustomThemeProvider";
import { StyledDiv } from "../../../design-system/elements";
import { SyncedWalletUIStates } from "./ConnectEmbed";
import { WelcomeScreen } from "../screens/types";

/**
 * @internal
 */
export type ConnectModalInlineProps = {
  className?: string;
  theme?: "dark" | "light" | Theme;

  /**
   * Set a custom title for the modal
   * @defaultValue "Connect"
   */
  modalTitle?: string;

  /**
   * Replace the thirdweb icon next to modalTitle and set your own iconUrl
   *
   * Set to empty string to hide the icon
   */
  modalTitleIconUrl?: string;

  style?: React.CSSProperties;

  /**
   * Set the size of the modal - `compact` or `wide` on desktop
   *
   * Modal size is always `compact` on mobile
   *
   * @defaultValue "wide"
   */
  modalSize?: "compact" | "wide";

  /**
   * If provided, Modal will show a Terms of Service message at the bottom with below link
   */
  termsOfServiceUrl?: string;

  /**
   * If provided, Modal will show a Privacy Policy message at the bottom with below link
   */
  privacyPolicyUrl?: string;

  /**
   * Customize the welcome screen
   *
   * Either provide a component to replace the default screen entirely
   *
   * or an object with title, subtitle and imgSrc to change the content of the default screen
   */
  welcomeScreen?: WelcomeScreen;
};

/**
 * @internal
 */
export const ConnectModalInline = (props: ConnectModalInlineProps) => {
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
            ...props.style,
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
