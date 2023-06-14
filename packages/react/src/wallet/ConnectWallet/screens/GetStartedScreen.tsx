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
}> = (props) => {
  const [showScreen, setShowScreen] = useState<
    "base" | "android-scan" | "ios-scan"
  >("base");

  const isScanScreen =
    showScreen === "android-scan" || showScreen === "ios-scan";

  return (
    <>
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
            props.onBack();
          } else {
            setShowScreen("base");
          }
        }}
      />

      {showScreen === "android-scan" && props.googlePlayStoreLink && (
        <ScanScreen
          platformIcon={
            <Img src={GooglePlay} width={iconSize.md} height={iconSize.md} />
          }
          url={props.googlePlayStoreLink}
          platform="Google Play"
          walletName={props.walletName}
          walletIconURL={props.walletIconURL}
        />
      )}

      {showScreen === "ios-scan" && props.appleStoreLink && (
        <ScanScreen
          platformIcon={
            <Img width={iconSize.md} height={iconSize.md} src={Apple} />
          }
          url={props.appleStoreLink}
          platform="App Store"
          walletName={props.walletName}
          walletIconURL={props.walletIconURL}
        />
      )}

      {showScreen === "base" && (
        <>
          <Spacer y="lg" />

          {props.header || (
            <>
              <Img
                src={props.walletIconURL}
                width={iconSize.xl}
                height={iconSize.xl}
                alt=""
              />

              <Spacer y="lg" />

              <ModalTitle>Get started with {props.walletName}</ModalTitle>
              <Spacer y="sm" />

              <ModalDescription>
                Download your preferred option and refresh this page
              </ModalDescription>
            </>
          )}
          <Spacer y="xl" />

          <Flex flexDirection="column" gap="xs">
            {/* Chrome Extension  */}
            {props.chromeExtensionLink && (
              <ButtonLink
                onClick={() => {
                  window.open(props.chromeExtensionLink, "_blank");
                }}
              >
                <Img width={iconSize.lg} height={iconSize.lg} src={Chrome} />
                <span>Download Chrome Extension</span>
              </ButtonLink>
            )}

            {/* Google Play store  */}
            {props.googlePlayStoreLink && (
              <ButtonLink
                as="button"
                onClick={() => {
                  if (isMobile()) {
                    window.open(props.googlePlayStoreLink, "_blank");
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
            {props.appleStoreLink && (
              <ButtonLink
                as="button"
                onClick={() => {
                  if (isMobile()) {
                    window.open(props.appleStoreLink, "_blank");
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
            onClick={props.onBack}
            style={{
              textAlign: "center",
              display: "block",
              width: "100%",
            }}
          >
            I{`'`}ve finished setting up my {props.walletName} on mobile
          </HelperLink>
        </>
      )}

      {!isScanScreen && props.footer}
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
