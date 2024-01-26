import { useContext } from "react";
import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import { fontSize, iconSize, spacing } from "../../../design-system";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";
import { Text } from "../../../components/text";
import { Button } from "../../../components/buttons";

export const ScanScreen: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  qrCodeUri?: string;
  walletName: string;
  walletIconURL: string;
  hideBackButton: boolean;
  qrScanInstruction: string;
  getStartedLink: string;
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader
          onBack={props.hideBackButton ? undefined : props.onBack}
          title={props.walletName}
        />
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
              <Img
                width={iconSize.xxl}
                height={iconSize.xxl}
                src={props.walletIconURL}
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
    </Container>
  );
};
