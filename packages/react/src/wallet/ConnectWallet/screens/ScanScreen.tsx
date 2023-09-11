import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import { ModalHeader, ScreenContainer } from "../../../components/basic";
import {
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { fontSize, iconSize } from "../../../design-system";
import type { Theme } from "../../../design-system/index";
import styled from "@emotion/styled";

export const ScanScreen: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  qrCodeUri?: string;
  walletName: string;
  walletIconURL: string;
  hideBackButton: boolean;
}> = (props) => {
  const walletName = props.walletName.toLowerCase().includes("wallet")
    ? props.walletName
    : `${props.walletName} wallet`;
  return (
    <ScreenContainer>
      <ModalHeader onBack={props.onBack} title={props.walletName} />
      <Spacer y="xl" />

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

        <ModalTitle
          style={{
            textAlign: "center",
          }}
        >
          Scan with {walletName}{" "}
        </ModalTitle>
        <Spacer y="md" />

        <ModalDescription>
          Scan this QR code with your phone <br />
          camera or {walletName} to connect
        </ModalDescription>

        <Spacer y="xl" />

        <LinkButton onClick={props.onGetStarted}>
          {`Don't`} have {walletName}?
        </LinkButton>
      </div>
    </ScreenContainer>
  );
};

const LinkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  color: ${(p) => p.theme.text.accent};
  font-size: ${fontSize.sm};
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.text.neutral};
  }
`;
