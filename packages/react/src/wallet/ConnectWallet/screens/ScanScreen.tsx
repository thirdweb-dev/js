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
import { IconFC } from "../icons/types";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";

export const ScanScreen: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  qrCodeUri?: string;
  walletName: string;
  WalletIcon: IconFC;
}> = (props) => {
  const { WalletIcon } = props;
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
          QRIcon={<WalletIcon size={iconSize.lg} />}
        />

        <Spacer y="xl" />

        <ModalTitle>Scan with {props.walletName} Wallet</ModalTitle>
        <Spacer y="md" />

        <ModalDescription>
          Scan this QR code with your phone <br />
          camera or {props.walletName} wallet to connect
        </ModalDescription>

        <Spacer y="md" />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Spinner size="md" color={blue.blue10} />
        </div>

        <Spacer y="xl" />

        <LinkButton onClick={props.onGetStarted}>
          {`Don't`} have {props.walletName} Wallet?
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
`;
