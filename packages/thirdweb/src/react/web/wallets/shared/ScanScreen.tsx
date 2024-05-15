import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useConnectUI } from "../../../core/hooks/others/useWalletConnectionCtx.js";
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
import { fontSize, iconSize, spacing } from "../../ui/design-system/index.js";

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
  const { connectModal, client } = useConnectUI();
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
            QRIcon={
              <WalletImage
                size={iconSize.xxl}
                id={props.walletId}
                client={client}
              />
            }
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
            border: connectModal.size === "compact" ? undefined : "none",
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
