"use client";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import {
  fontSize,
  iconSize,
  spacing,
} from "../../../core/design-system/index.js";
import { AccentFailIcon } from "../../ui/ConnectWallet/icons/AccentFailIcon.js";
import { QRCode } from "../../ui/components/QRCode.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { WalletImage } from "../../ui/components/WalletImage.js";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { Text } from "../../ui/components/text.js";

/**
 * @internal
 */
export const ScanScreen: React.FC<{
  onBack?: () => void;
  onGetStarted?: () => void;
  qrCodeUri?: string;
  walletName: string;
  walletId: WalletId;
  qrScanInstruction: string;
  getStartedLink: string;
  error: boolean;
  onRetry: () => void;
  connectModalSize: "compact" | "wide";
  client: ThirdwebClient;
}> = (props) => {
  const { connectModalSize, client } = props;
  const [linkCopied, setLinkCopied] = useState(false);

  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={props.walletName} />
      </Container>

      <Spacer y="sm" />

      <Container expand flex="column" px="lg" center="both">
        {!props.error && (
          <div
            style={{
              textAlign: "center",
            }}
          >
            <QRCode
              qrCodeUri={props.qrCodeUri}
              QRIcon={
                <WalletImage
                  size={iconSize.xxl}
                  id={props.walletId}
                  client={client}
                />
              }
            />

            <Spacer y="xs" />

            <Button
              disabled={props.qrCodeUri === undefined}
              variant="link"
              style={{
                fontSize: "12px",
                opacity: props.qrCodeUri === undefined ? 0.5 : 1,
                cursor: props.qrCodeUri === undefined ? "default" : "pointer",
              }}
              onClick={() => {
                navigator.clipboard
                  .writeText(props.qrCodeUri as string) // should always be string since the button is disabled otherwise
                  .then(() => {
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 3000); // reset the check icon after 3 seconds
                  })
                  .catch((err) => {
                    console.error("Failed to copy link to clipboard", err);
                  });
              }}
            >
              {linkCopied ? (
                <CheckIcon width={14} height={14} />
              ) : (
                <CopyIcon width={14} height={14} />
              )}
              <span style={{ padding: "0 4px" }}>Copy Link</span>
            </Button>

            <Spacer y="lg" />

            <Text
              center
              multiline
              balance
              style={{
                paddingInline: spacing.lg,
              }}
            >
              {props.qrScanInstruction}
            </Text>
          </div>
        )}

        {props.error && (
          <Container
            animate="fadein"
            style={{
              width: "100%",
            }}
          >
            <Spacer y="xxl" />
            <Container flex="row" center="x">
              <AccentFailIcon size={iconSize["3xl"]} />
            </Container>
            <Spacer y="lg" />
            <Text center size="lg" color="primaryText">
              Connection Failed
            </Text>
            <Spacer y="3xl" />

            <Button fullWidth variant="accent" onClick={props.onRetry}>
              Try again
            </Button>
          </Container>
        )}
      </Container>

      <Spacer y="lg" />

      {props.onGetStarted && (
        <ScreenBottomContainer
          style={{
            border: connectModalSize === "compact" ? undefined : "none",
          }}
        >
          <Button
            variant="link"
            onClick={props.onGetStarted}
            style={{
              fontSize: fontSize.sm,
              textAlign: "center",
            }}
          >
            {props.getStartedLink}
          </Button>
        </ScreenBottomContainer>
      )}
    </Container>
  );
};
