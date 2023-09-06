import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import { Flex } from "../../../components/basic";
import {
  BackButton,
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { iconSize, radius, spacing } from "../../../design-system";
import type { Theme } from "../../../design-system/index";
import { isMobile } from "../../../evm/utils/isMobile";
import { openWindow } from "../../utils/openWindow";
import { Apple, Chrome, GooglePlay } from "../iconURLs";
import styled from "@emotion/styled";
import { useState } from "react";

export const GetStartedScreen: React.FC<{
  onBack: () => void;
  walletName: string;
  walletIconURL: string;
  chromeExtensionLink?: string;
  googlePlayStoreLink?: string;
  appleStoreLink?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hideBackButton?: boolean;
}> = ({
  walletName,
  walletIconURL,
  appleStoreLink,
  googlePlayStoreLink,
  chromeExtensionLink,
  header,
  footer,
  onBack,
  hideBackButton,
}) => {
  const [showScreen, setShowScreen] = useState<
    "base" | "android-scan" | "ios-scan"
  >("base");

  const isScanScreen =
    showScreen === "android-scan" || showScreen === "ios-scan";

  const hideBack = hideBackButton && showScreen === "base";

  return (
    <>
      {!hideBack && (
        <BackButton
          style={
            isScanScreen
              ? {
                  position: "absolute",
                  top: spacing.lg,
                  left: spacing.lg,
                }
              : undefined
          }
          onClick={() => {
            if (showScreen === "base") {
              onBack();
            } else {
              setShowScreen("base");
            }
          }}
        />
      )}

      {showScreen === "android-scan" && googlePlayStoreLink && (
        <ScanScreen
          platformIcon={
            <Img src={GooglePlay} width={iconSize.md} height={iconSize.md} />
          }
          url={googlePlayStoreLink}
          platform="Google Play"
          walletName={walletName}
          walletIconURL={walletIconURL}
        />
      )}

      {showScreen === "ios-scan" && appleStoreLink && (
        <ScanScreen
          platformIcon={
            <Img width={iconSize.md} height={iconSize.md} src={Apple} />
          }
          url={appleStoreLink}
          platform="App Store"
          walletName={walletName}
          walletIconURL={walletIconURL}
        />
      )}

      {showScreen === "base" && (
        <>
          {!hideBack && <Spacer y="lg" />}

          {header || (
            <>
              <Img
                src={walletIconURL}
                width={iconSize.xl}
                height={iconSize.xl}
                alt=""
              />

              <Spacer y="lg" />

              <ModalTitle>Get started with {walletName}</ModalTitle>
              <Spacer y="sm" />

              <ModalDescription>
                Download your preferred option and refresh this page
              </ModalDescription>
            </>
          )}
          <Spacer y="xl" />

          <Flex flexDirection="column" gap="xs">
            {/* Chrome Extension  */}
            {chromeExtensionLink && (
              <ButtonLink
                onClick={() => {
                  openWindow(chromeExtensionLink);
                }}
              >
                <Img width={iconSize.lg} height={iconSize.lg} src={Chrome} />
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
                <Img
                  width={iconSize.lg}
                  height={iconSize.lg}
                  src={GooglePlay}
                />
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
                <Img width={iconSize.lg} height={iconSize.lg} src={Apple} />
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
            }}
          >
            I{`'`}ve finished setting up my {walletName} on mobile
          </HelperLink>
        </>
      )}

      {!isScanScreen && footer}
    </>
  );
};

const ScanScreen: React.FC<{
  url: string;
  platform: string;
  walletName: string;
  platformIcon: React.ReactNode;
  walletIconURL: string;
}> = (props) => {
  return (
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

      <div
        style={{
          display: "flex",
          gap: spacing.sm,
          alignItems: "center",
        }}
      >
        {props.platformIcon}
        <ModalTitle>
          Install {props.walletName} on {props.platform}
        </ModalTitle>
      </div>

      <Spacer y="lg" />
      <ModalDescription>
        Scan QR with your phone to download <br /> {props.walletName} for{" "}
        {props.platform}
      </ModalDescription>
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
    background: ${(p) => p.theme.bg.highlighted};
    text-decoration: none;
    color: ${(p) => p.theme.text.neutral};
  }
`;
