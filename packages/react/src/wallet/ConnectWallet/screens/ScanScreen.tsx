import { Img } from "../../../components/Img";
import { QRCode } from "../../../components/QRCode";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import {
  BackButton,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { fontSize, iconSize, spacing } from "../../../design-system";
import { Theme } from "../../../design-system/index";
import styled from "@emotion/styled";

export const ScanScreen: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  qrCodeUri?: string;
  walletName: string;
  walletIconURL: string;
}> = (props) => {
  const walletName = props.walletName.toLowerCase().includes("wallet")
    ? props.walletName
    : `${props.walletName} wallet`;
  return (
    <>
      <BackButton
        onClick={props.onBack}
        style={{
          position: "absolute",
          zIndex: 10,
          left: spacing.lg,
          top: spacing.lg,
        }}
      />
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

        <Spacer y="md" />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Spinner size="md" color="link" />
        </div>

        <Spacer y="xl" />

        <LinkButton onClick={props.onGetStarted}>
          {`Don't`} have {walletName}?
        </LinkButton>
      </div>
    </>
  );
};

const LinkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  color: ${(p) => p.theme.link.primary};
  font-size: ${fontSize.sm};
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.link.primaryHover};
  }
`;
