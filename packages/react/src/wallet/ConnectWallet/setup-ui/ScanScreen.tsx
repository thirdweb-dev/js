import { FadeIn } from "../../../components/FadeIn";
import { Skeleton } from "../../../components/Skeleton";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { fontSize, radius, shadow, spacing } from "../../../design-system";
import { Theme, media } from "../../../design-system/index";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
} from "../shared/modalElements";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";
import { lazy } from "react";

const QrCode = lazy(() => import("react-qr-code"));

export const ScanScreen: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  qrCodeUri?: string;
  walletName: string;
  QRIcon: React.ReactNode;
}> = (props) => {
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
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {props.qrCodeUri ? (
            <FadeIn>
              <QRCodeContainer>
                <StyledQRCode value={props.qrCodeUri} />
              </QRCodeContainer>
            </FadeIn>
          ) : (
            <StyledSkeleton height="200px" width="200px" />
          )}

          <QrCodeIconContainer>{props.QRIcon}</QrCodeIconContainer>
        </div>

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
          Don't have {props.walletName} Wallet?
        </LinkButton>
      </div>
    </>
  );
};

const QrCodeIconContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: ${radius.md};
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 4px;
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: ${spacing.xxs};
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: ${radius.md};
  box-shadow: ${shadow.md};
`;

const StyledQRCode = styled(QrCode)`
  width: 200px;
  height: 200px;
  border-radius: ${radius.md};

  ${media.mobile} {
    width: 150px;
    height: 150px;
  }
`;

const StyledSkeleton = styled(Skeleton)`
  width: 200px;
  height: 200px;
  border-radius: ${radius.md};
  ${media.mobile} {
    width: 150px;
    height: 150px;
  }
`;

const LinkButton = styled.button<{ theme?: Theme }>`
  all: unset;
  color: ${(p) => p.theme.link.primary};
  font-size: ${fontSize.sm};
  cursor: pointer;
`;
