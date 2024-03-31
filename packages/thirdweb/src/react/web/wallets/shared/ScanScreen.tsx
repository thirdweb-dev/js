import { useContext } from "react";
import { ModalConfigCtx } from "../../providers/wallet-ui-states-provider.js";
import { QRCode } from "../../ui/components/QRCode.js";
import { Spacer } from "../../ui/components/Spacer.js";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { iconSize, spacing, fontSize } from "../../ui/design-system/index.js";
import { Text } from "../../ui/components/text.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { WalletImage } from "../../ui/components/WalletImage.js";

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
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={props.walletName} />
      </Container>

      <Spacer y="sm" />

      <Container expand flex="column" px="lg" center="both">
        <div
          style={{
            textAlign: "center",
          }}
        >
          <QRCode
            qrCodeUri={props.qrCodeUri}
            QRIcon={<WalletImage size={iconSize.xxl} id={props.walletId} />}
          />

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
      </Container>

      <Spacer y="lg" />

      {props.onGetStarted && (
        <ScreenBottomContainer
          style={{
            border: modalConfig.modalSize === "compact" ? undefined : "none",
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
