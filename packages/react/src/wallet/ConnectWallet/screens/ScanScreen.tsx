import { useContext } from "react";
import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../../../components/basic";
import { ModalDescription } from "../../../components/modalElements";
import { fontSize, iconSize } from "../../../design-system";
import type { Theme } from "../../../design-system/index";
import styled from "@emotion/styled";
import { ModalConfigCtx } from "../../../evm/providers/wallet-ui-states-provider";

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

      {modalConfig.modalSize === "compact" && <Spacer y="sm" />}

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
                width={iconSize.lg}
                height={iconSize.lg}
                src={props.walletIconURL}
              />
            }
          />

          <Spacer y="xl" />

          <ModalDescription>
            Scan this with {walletName} <br /> or camera app to connect
          </ModalDescription>

          <Spacer y="xl" />
        </div>
      </Container>

      <ScreenBottomContainer
        style={{
          border: modalConfig.modalSize === "compact" ? undefined : "none",
        }}
      >
        <LinkButton
          onClick={props.onGetStarted}
          style={{
            fontSize: fontSize.sm,
            textAlign: "center",
          }}
        >
          {`Don't`} have {walletName}?
        </LinkButton>
      </ScreenBottomContainer>
    </Container>
  );
};

const LinkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  color: ${(p) => p.theme.text.accent};
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.text.neutral};
  }
`;
