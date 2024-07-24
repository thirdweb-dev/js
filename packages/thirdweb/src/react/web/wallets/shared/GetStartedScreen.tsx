import { useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import { isMobile } from "../../../../utils/web/isMobile.js";
import { openWindow } from "../../../../utils/web/openWindow.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../../wallets/wallet-info.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  iconSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { AppleIcon } from "../../ui/ConnectWallet/icons/AppleIcon.js";
import { ChromeIcon } from "../../ui/ConnectWallet/icons/ChromeIcon.js";
import { PlayStoreIcon } from "../../ui/ConnectWallet/icons/PlayStoreIcon.js";
import { QRCode } from "../../ui/components/QRCode.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { WalletImage } from "../../ui/components/WalletImage.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Text } from "../../ui/components/text.js";
import { StyledButton } from "../../ui/design-system/elements.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";

/**
 * @internal
 */
export const GetStartedScreen: React.FC<{
  onBack?: () => void;
  wallet: Wallet;
  walletInfo: WalletInfo;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showBack?: boolean;
  locale: InjectedWalletLocale;
  client: ThirdwebClient;
}> = ({ wallet, walletInfo, header, footer, onBack, locale, client }) => {
  const [showScreen, setShowScreen] = useState<
    "base" | "android-scan" | "ios-scan"
  >("base");

  const isScanScreen =
    showScreen === "android-scan" || showScreen === "ios-scan";

  const handleBack = onBack
    ? () => {
        if (showScreen === "base") {
          onBack();
        } else {
          setShowScreen("base");
        }
      }
    : undefined;

  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container expand flex="column" p="lg">
        {showScreen === "android-scan" && walletInfo.app.android && (
          <InstallScanScreen
            platformIcon={<PlayStoreIcon size={iconSize.md} />}
            url={walletInfo.app.android}
            platform="Google Play"
            walletName={walletInfo.name}
            walletId={wallet.id}
            onBack={handleBack}
            locale={{
              scanToDownload: locale.getStartedScreen.instruction,
            }}
            client={client}
          />
        )}

        {showScreen === "ios-scan" && walletInfo.app.ios && (
          <InstallScanScreen
            platformIcon={<AppleIcon size={iconSize.md} />}
            url={walletInfo.app.ios}
            platform="App Store"
            walletName={walletInfo.name}
            walletId={wallet.id}
            onBack={handleBack}
            locale={{
              scanToDownload: locale.getStartedScreen.instruction,
            }}
            client={client}
          />
        )}

        {showScreen === "base" && (
          <Container expand flex="column">
            {header || (
              <ModalHeader onBack={handleBack} title={walletInfo.name} />
            )}
            <Spacer y="xl" />

            <Container
              expand
              animate="fadein"
              flex="column"
              center="y"
              style={{
                minHeight: "250px",
              }}
            >
              <Container flex="column" gap="xs">
                {/* Chrome Extension  */}
                {walletInfo.app.chrome && (
                  <ButtonLink
                    onClick={() => {
                      openWindow(walletInfo.app.chrome || "");
                    }}
                  >
                    <ChromeIcon size={iconSize.lg} />
                    <span>{locale.download.chrome}</span>
                  </ButtonLink>
                )}

                {/* Google Play store  */}
                {walletInfo.app.android && (
                  <ButtonLink
                    as="button"
                    onClick={() => {
                      if (isMobile()) {
                        openWindow(walletInfo.app.android || "");
                      } else {
                        setShowScreen("android-scan");
                      }
                    }}
                  >
                    <PlayStoreIcon size={iconSize.lg} />
                    <span>{locale.download.android}</span>
                  </ButtonLink>
                )}

                {/* App Store  */}
                {walletInfo.app.ios && (
                  <ButtonLink
                    as="button"
                    onClick={() => {
                      if (isMobile()) {
                        openWindow(walletInfo.app.ios || "");
                      } else {
                        setShowScreen("ios-scan");
                      }
                    }}
                  >
                    <AppleIcon size={iconSize.lg} />
                    <span>{locale.download.iOS}</span>
                  </ButtonLink>
                )}
              </Container>
            </Container>
          </Container>
        )}

        {!isScanScreen && footer}
      </Container>
    </Container>
  );
};

/**
 * @internal
 */
const InstallScanScreen: React.FC<{
  url: string;
  platform: string;
  walletName: string;
  platformIcon: React.ReactNode;
  walletId: WalletId;
  onBack?: () => void;
  locale: {
    scanToDownload: string;
  };
  client: ThirdwebClient;
}> = (props) => {
  return (
    <Container animate="fadein" expand>
      <ModalHeader title={props.walletName} onBack={props.onBack} />
      <Spacer y="xl" />

      <Container
        flex="column"
        expand
        center="both"
        style={{
          textAlign: "center",
        }}
      >
        <QRCode
          qrCodeUri={props.url}
          QRIcon={
            <WalletImage
              id={props.walletId}
              size={iconSize.xxl}
              client={props.client}
            />
          }
        />

        <Spacer y="xl" />

        <Text multiline center balance>
          {props.locale.scanToDownload}
        </Text>

        <Spacer y="xs" />
      </Container>
    </Container>
  );
};

const ButtonLink = /* @__PURE__ */ StyledButton((_) => {
  const theme = useCustomTheme();
  return {
    all: "unset",
    textDecoration: "none",
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: radius.sm,
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    cursor: "pointer",
    boxSizing: "border-box",
    width: "100%",
    fontWeight: 500,
    color: theme.colors.secondaryButtonText,
    background: theme.colors.secondaryButtonBg,
    transition: "100ms ease",
    "&:hover": {
      background: theme.colors.secondaryButtonHoverBg,
      textDecoration: "none",
      color: theme.colors.primaryText,
    },
  };
});
