import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import {
  BackButton,
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { fontSize, iconSize, spacing, Theme } from "../../../design-system";
import { MetaMaskWallet } from "@thirdweb-dev/wallets";
import { Apple, Chrome, GooglePlay } from "../iconURLs";
import { ButtonLink } from "./GetStartedScreen";
import styled from "@emotion/styled";
import { useState } from "react";
import { isMobile } from "../../../evm/utils/isMobile";

const walletName = MetaMaskWallet.meta.name;
const walletIconURL = MetaMaskWallet.meta.iconURL;
const chromeExtensionLink =
  "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
const googlePlayStoreLink =
  "https://play.google.com/store/apps/details?id=io.metamask";
const appleStoreLink =
  "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202";

export const GetStartedWithWallets: React.FC<{
  onBack: () => void;
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
          platformIcon={
            <Img src={GooglePlay} width={iconSize.md} height={iconSize.md} />
          }
          url={googlePlayStoreLink}
          platform="Android"
          walletName={walletName}
          walletIconURL={walletIconURL}
        />
      )}

      {showScreen === "ios-scan" && (
        <ScanScreen
          platformIcon={
            <Img src={Apple} width={iconSize.md} height={iconSize.md} />
          }
          url={appleStoreLink}
          platform="iOS"
          walletName={walletName}
          walletIconURL={walletIconURL}
        />
      )}

      {showScreen === "base" && (
        <>
          <Spacer y="lg" />

          <ModalTitle> Get started with EVM wallets </ModalTitle>
          <Spacer y="md" />

          <ModalDescription>
            An EVM Wallet is your gateway to interact with web3 apps on Ethereum
            and other custom blockchains.
          </ModalDescription>

          <Spacer y="xl" />

          {/* Recommendation */}
          <div
            style={{
              display: "flex",
              gap: spacing.md,
              alignItems: "center",
            }}
          >
            <SecondaryText>We recommend</SecondaryText>
            <div
              style={{
                display: "flex",
                gap: spacing.xs,
                alignItems: "center",
              }}
            >
              <Img
                src={walletIconURL}
                width={iconSize.md}
                height={iconSize.md}
              />
              <NeutralText>MetaMask</NeutralText>
            </div>
          </div>

          <Spacer y="md" />

          {/* Buttons */}
          <div>
            {/* Chrome Extension  */}
            <ButtonLink target="_blank" href={chromeExtensionLink}>
              <Img src={Chrome} width={iconSize.lg} height={iconSize.lg} />
              <span>Download Chrome Extension</span>
            </ButtonLink>
            <Spacer y="xs" />

            {/* Google Play store  */}
            <ButtonLink
              as="button"
              target="_blank"
              onClick={() => {
                if (isMobile()) {
                  window.open(googlePlayStoreLink, "_blank");
                } else {
                  setShowScreen("android-scan");
                }
              }}
            >
              <Img src={GooglePlay} width={iconSize.lg} height={iconSize.lg} />
              <span>Download on Google Play</span>
            </ButtonLink>
            <Spacer y="xs" />

            {/* App Store  */}
            <ButtonLink
              as="button"
              target="_blank"
              onClick={() => {
                if (isMobile()) {
                  window.open(appleStoreLink, "_blank");
                } else {
                  setShowScreen("ios-scan");
                }
              }}
            >
              <Img src={Apple} width={iconSize.lg} height={iconSize.lg} />
              <span>Download on App Store</span>
            </ButtonLink>
          </div>

          <Spacer y="xl" />

          <HelperLink
            target="_blank"
            href="https://ethereum.org/en/wallets/find-wallet/"
            style={{
              textAlign: "center",
            }}
          >
            Learn more about wallets
          </HelperLink>
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
            I{`'`}ve finished setting up my {walletName} mobile wallet
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

const SecondaryText = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.secondary};
  margin: 0;
`;

const NeutralText = styled.p<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.neutral};
  margin: 0;
`;
