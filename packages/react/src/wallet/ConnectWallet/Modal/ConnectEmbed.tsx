import { Theme, radius } from "../../../design-system";
import styled from "@emotion/styled";
import {
  SetModalConfigCtx,
  WalletUIStatesProvider,
} from "../../../evm/providers/wallet-ui-states-provider";
import {
  wideModalMaxHeight,
  modalMaxWidthCompact,
  modalMaxWidthWide,
  defaultTheme,
} from "../constants";
import { ConnectModalContent } from "./ConnectModal";
import { useScreen } from "./screen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useConnectionStatus, useWallets } from "@thirdweb-dev/react-core";
import { DynamicHeight } from "../../../components/DynamicHeight";
import { CustomThemeProvider } from "../../../design-system/CustomThemeProvider";
import { ComponentProps, useContext, useEffect } from "react";
import { ConnectWalletProps } from "../ConnectWallet";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const ConnectEmbed = (
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
  >,
) => {
  const connectionStatus = useConnectionStatus();

  const { screen, setScreen, initialScreen } = useScreen();
  const walletConfigs = useWallets();
  const modalSize =
    (isMobile() || walletConfigs.length === 1 ? "compact" : props.modalSize) ||
    "compact";

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
    title: props.modalTitle,
    termsOfServiceUrl: props.termsOfServiceUrl,
    privacyPolicyUrl: props.privacyPolicyUrl,
    welcomeScreen: props.welcomeScreen,
    titleIconUrl: props.modalTitleIconUrl,
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
        </EmbedContainer>
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

const EmbedContainer = styled.div<{ theme?: Theme }>`
  color: ${(p) => p.theme.colors.primaryText};
  width: 100%;
  box-sizing: border-box;
  position: relative;
  line-height: normal;
  border-radius: ${radius.xl};
  border: 1px solid ${(p) => p.theme.colors.borderColor};
  overflow: hidden;
  font-family: ${(p) => p.theme.fontFamily};
  & *::selection {
    background-color: ${(p) => p.theme.colors.primaryText};
    color: ${(p) => p.theme.colors.modalBg};
  }
`;
