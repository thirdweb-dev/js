import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import {
  BackButton,
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { fontSize, iconSize, radius, spacing } from "../../../design-system";
import { Theme } from "../../../design-system/index";
import { AppleStoreIcon } from "../icons/AppleStoreIcon";
import { ChromeIcon } from "../icons/ChromeIcon";
import { GooglePlayStoreIcon } from "../icons/GooglePlayStoreIcon";
import styled from "@emotion/styled";
import { useState } from "react";

export const GetStartedScreen: React.FC<{
  onBack: () => void;
  walletName: string;
  walletIconURL: string;
  chromeExtensionLink: string;
  googlePlayStoreLink: string;
  appleStoreLink: string;
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

      {showScreen === "android-scan" && (
        <ScanScreen
          platformIcon={<GooglePlayStoreIcon size={iconSize.md} />}
          url={props.googlePlayStoreLink}
          platform="Android"
          walletName={props.walletName}
          walletIconURL={props.walletIconURL}
        />
      )}

      {showScreen === "ios-scan" && (
        <ScanScreen
          platformIcon={<AppleStoreIcon size={iconSize.md} />}
          url={props.appleStoreLink}
          platform="iOS"
          walletName={props.walletName}
          walletIconURL={props.walletIconURL}
        />
      )}

      {showScreen === "base" && (
        <>
          <Spacer y="lg" />

          <Img
            src={props.walletIconURL}
            width={iconSize.xl}
            height={iconSize.xl}
            alt=""
          />

          <Spacer y="md" />

          <ModalTitle>Get started with {props.walletName}</ModalTitle>
          <Spacer y="md" />

          <ModalDescription>
            Download your preferred option and then refresh this page.
          </ModalDescription>
          <Spacer y="xl" />

          {/* Chrome Extension  */}
          <ButtonLink target="_blank" href={props.chromeExtensionLink}>
            <ChromeIcon size={iconSize.lg} />
            <span>Download Chrome Extension</span>
          </ButtonLink>
          <Spacer y="xs" />

          {/* Google Play store  */}
          <ButtonLink
            as="button"
            target="_blank"
            onClick={() => {
              setShowScreen("android-scan");
            }}
          >
            <GooglePlayStoreIcon size={iconSize.lg} />
            <span>Download for Android</span>
          </ButtonLink>
          <Spacer y="xs" />

          {/* Apple Store  */}
          <ButtonLink
            as="button"
            target="_blank"
            onClick={() => {
              setShowScreen("ios-scan");
            }}
          >
            <AppleStoreIcon size={iconSize.lg} />
            <span>Download for iOS</span>
          </ButtonLink>
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
            I{`'`}ve finished setting up my {props.walletName} mobile wallet
          </HelperLink>
        </>
      )}
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
        <ModalTitle
          style={{
            fontSize: fontSize.xl,
          }}
        >
          Install {props.walletName} for {props.platform}
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

const ButtonLink = styled.a<{ theme?: Theme }>`
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
  }
`;
