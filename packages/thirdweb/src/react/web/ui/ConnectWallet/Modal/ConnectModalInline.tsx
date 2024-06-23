"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import {
  type Theme,
  iconSize,
  radius,
  shadow,
} from "../../../../core/design-system/index.js";
import type { SiweAuthOptions } from "../../../../core/hooks/auth/useSiweAuth.js";
import { WalletUIStatesProvider } from "../../../providers/wallet-ui-states-provider.js";
import { canFitWideModal } from "../../../utils/canFitWideModal.js";
import { DynamicHeight } from "../../components/DynamicHeight.js";
import { CrossContainer } from "../../components/Modal.js";
import { IconButton } from "../../components/buttons.js";
import { StyledDiv } from "../../design-system/elements.js";
import type { LocaleId } from "../../types.js";
import type { ConnectButton_connectModalOptions } from "../ConnectButtonProps.js";
import {
  modalMaxWidthCompact,
  modalMaxWidthWide,
  wideModalMaxHeight,
} from "../constants.js";
import type { ConnectLocale } from "../locale/types.js";
import type { WelcomeScreen } from "../screens/types.js";
import { ConnectModalContent } from "./ConnectModalContent.js";
import { useSetupScreen } from "./screen.js";

/**
 * @internal
 */
export type ConnectModalInlineProps = {
  chainId?: bigint;
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
  accountAbstraction: SmartWalletOptions | undefined;
  auth: SiweAuthOptions | undefined;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  connectModal: Omit<ConnectButton_connectModalOptions, "size"> & {
    size: "compact" | "wide";
  };
  isEmbed: boolean;
  localeId: LocaleId;
  onConnect: ((wallet: Wallet) => void) | undefined;
  recommendedWallets: Wallet[] | undefined;
  showAllWallets: boolean | undefined;
  wallets: Wallet[];
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
};

/**
 * @internal
 */
export const ConnectModalInline = (props: ConnectModalInlineProps) => {
  const modalSize =
    !canFitWideModal() || props.wallets.length === 1
      ? "compact"
      : props.modalSize;

  return (
    <WalletUIStatesProvider theme={props.theme} isOpen={true}>
      <ConnectModalInlineContent
        className={props.className}
        modalSize={modalSize}
        connectModal={props.connectModal}
        wallets={props.wallets}
        accountAbstraction={props.accountAbstraction}
        auth={props.auth}
        chain={props.chain}
        client={props.client}
        connectLocale={props.connectLocale}
        isEmbed={props.isEmbed}
        localeId={props.localeId}
        onConnect={props.onConnect}
        recommendedWallets={props.recommendedWallets}
        showAllWallets={props.showAllWallets}
        chains={props.chains}
        walletConnect={props.walletConnect}
      />
    </WalletUIStatesProvider>
  );
};

function ConnectModalInlineContent(props: {
  className?: string;
  modalSize?: "compact" | "wide";
  style?: React.CSSProperties;
  accountAbstraction: SmartWalletOptions | undefined;
  auth: SiweAuthOptions | undefined;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  client: ThirdwebClient;
  connectLocale: ConnectLocale;
  connectModal: Omit<ConnectButton_connectModalOptions, "size"> & {
    size: "compact" | "wide";
  };
  isEmbed: boolean;
  localeId: LocaleId;
  onConnect: ((wallet: Wallet) => void) | undefined;
  recommendedWallets: Wallet[] | undefined;
  showAllWallets: boolean | undefined;
  wallets: Wallet[];
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
}) {
  const screenSetup = useSetupScreen({
    connectModal: props.connectModal,
    wallets: props.wallets,
  });

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
        accountAbstraction={props.accountAbstraction}
        auth={props.auth}
        chain={props.chain}
        client={props.client}
        connectLocale={props.connectLocale}
        connectModal={props.connectModal}
        isEmbed={props.isEmbed}
        localeId={props.localeId}
        onConnect={props.onConnect}
        recommendedWallets={props.recommendedWallets}
        showAllWallets={props.showAllWallets}
        wallets={props.wallets}
        chains={props.chains}
        walletConnect={props.walletConnect}
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

const ConnectModalInlineContainer = /* @__PURE__ */ StyledDiv((_) => {
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
