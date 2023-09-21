import { useContext } from "react";
import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import { fontSize, iconSize } from "../../../design-system";
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
}> = (props) => {
  const modalConfig = useContext(ModalConfigCtx);
  const walletName = props.walletName.toLowerCase().includes("wallet")
    ? props.walletName
    : `${props.walletName} wallet`;
  return (
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title={props.walletName} />
      </Container>

      {modalConfig.modalSize === "compact" && <Spacer y="xs" />}

      <Container expand flex="column" px="lg" center="both">
        <div
          style={{
            textAlign: "center",
          }}
        >
          <QRCode
            qrCodeUri={props.qrCodeUri}
            size={310}
            QRIcon={
              <Img
                width={iconSize.xxl}
                height={iconSize.xxl}
                src={props.walletIconURL}
              />
            }
          />

          <Spacer y="lg" />

          <Text center multiline>
            Scan this with {walletName} <br /> or camera app to connect
          </Text>

          <Spacer y="lg" />
        </div>
      </Container>

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
          {`Don't`} have {walletName}?
        </Button>
      </ScreenBottomContainer>
    </Container>
  );
};
