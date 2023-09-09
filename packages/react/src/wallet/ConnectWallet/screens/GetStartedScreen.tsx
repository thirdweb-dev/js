import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import { Flex, ModalHeader, ScreenContainer } from "../../../components/basic";
import {
  HelperLink,
  ModalDescription,
} from "../../../components/modalElements";
import { Text } from "../../../components/text";
import { iconSize, radius, spacing } from "../../../design-system";
import type { Theme } from "../../../design-system/index";
import { isMobile } from "../../../evm/utils/isMobile";
import { openWindow } from "../../utils/openWindow";
import styled from "@emotion/styled";
import { useState } from "react";
import { AppleIcon } from "../icons/AppleIcon";
import { ChromeIcon } from "../icons/ChromeIcon";
import { PlayStoreIcon } from "../icons/PlayStoreIcon";

export const GetStartedScreen: React.FC<{
  onBack?: () => void;
  walletName: string;
  walletIconURL: string;
  chromeExtensionLink?: string;
  googlePlayStoreLink?: string;
  appleStoreLink?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showBack?: boolean;
}> = ({
  walletName,
  walletIconURL,
  appleStoreLink,
  googlePlayStoreLink,
  chromeExtensionLink,
  header,
  footer,
  onBack,
}) => {
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
    <ScreenContainer>
      {showScreen === "android-scan" && googlePlayStoreLink && (
        <InstallScanScreen
          platformIcon={<PlayStoreIcon size={iconSize.md} />}
          url={googlePlayStoreLink}
          platform="Google Play"
          walletName={walletName}
          walletIconURL={walletIconURL}
          onBack={handleBack}
        />
      )}

      {showScreen === "ios-scan" && appleStoreLink && (
        <InstallScanScreen
          platformIcon={<AppleIcon size={iconSize.md} />}
          url={appleStoreLink}
          platform="App Store"
          walletName={walletName}
          walletIconURL={walletIconURL}
          onBack={handleBack}
        />
      )}

      {showScreen === "base" && (
        <>
          {header || <ModalHeader onBack={handleBack} title={walletName} />}
          <Spacer y="xl" />

          <Flex flexDirection="column" gap="xs">
            {/* Chrome Extension  */}
            {chromeExtensionLink && (
              <ButtonLink
                onClick={() => {
                  openWindow(chromeExtensionLink);
                }}
              >
                <ChromeIcon size={iconSize.lg} />
                <span>Download Chrome Extension</span>
              </ButtonLink>
            )}

            {/* Google Play store  */}
            {googlePlayStoreLink && (
              <ButtonLink
                as="button"
                onClick={() => {
                  if (isMobile()) {
                    openWindow(googlePlayStoreLink);
                  } else {
                    setShowScreen("android-scan");
                  }
                }}
              >
                <PlayStoreIcon size={iconSize.lg} />
                <span>Download on Google Play</span>
              </ButtonLink>
            )}

            {/* App Store  */}
            {appleStoreLink && (
              <ButtonLink
                as="button"
                onClick={() => {
                  if (isMobile()) {
                    openWindow(appleStoreLink);
                  } else {
                    setShowScreen("ios-scan");
                  }
                }}
              >
                <AppleIcon size={iconSize.lg} />
                <span>Download on App Store</span>
              </ButtonLink>
            )}
          </Flex>
        </>
      )}

      {isScanScreen && (
        <>
          <Spacer y="xl" />
          <HelperLink
            as="button"
            onClick={onBack}
            style={{
              textAlign: "center",
              display: "block",
              width: "100%",
              lineHeight: 1.5,
            }}
          >
            I{`'`}ve finished setting up <br /> {walletName} on mobile
          </HelperLink>
        </>
      )}

      {!isScanScreen && footer}
    </ScreenContainer>
  );
};

const InstallScanScreen: React.FC<{
  url: string;
  platform: string;
  walletName: string;
  platformIcon: React.ReactNode;
  walletIconURL: string;
  onBack?: () => void;
}> = (props) => {
  return (
    <div>
      <ModalHeader title={props.walletName} onBack={props.onBack} />

      <Spacer y="lg" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <QRCode
          qrCodeUri={props.url}
          QRIcon={
            <Img
              src={props.walletIconURL}
              width={iconSize.lg}
              height={iconSize.lg}
            />
          }
        />
        <Spacer y="xl" />

        {/* {props.platformIcon} */}

        <Text color="neutral">
          Install {props.walletName} on {props.platform}
        </Text>

        <Spacer y="lg" />
        <ModalDescription sm>
          Scan QR with your phone to download <br /> {props.walletName} for{" "}
          {props.platform}
        </ModalDescription>
      </div>
    </div>
  );
};

export const ButtonLink = styled.button<{ theme?: Theme }>`
  all: unset;
  text-decoration: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${radius.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  color: ${(p) => p.theme.text.neutral};
  background: ${(p) => p.theme.bg.elevated};
  transition: 100ms ease;
  &:hover {
    background: ${(p) => p.theme.bg.elevatedHover};
    text-decoration: none;
    color: ${(p) => p.theme.text.neutral};
  }
`;
