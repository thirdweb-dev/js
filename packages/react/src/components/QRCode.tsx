import { media, radius, shadow, spacing } from "../design-system";
import { FadeIn } from "./FadeIn";
import { Skeleton } from "./Skeleton";
import styled from "@emotion/styled";
import { lazy, Suspense } from "react";

const ReactQrCode = lazy(() => import("react-qr-code"));

export const QRCode: React.FC<{
  qrCodeUri?: string;
  QRIcon?: React.ReactNode;
}> = (props) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Suspense fallback={<QRSkeleton height="200px" width="200px" />}>
        {props.qrCodeUri ? (
          <FadeIn>
            <QRCodeContainer>
              <StyledReactQrCode value={props.qrCodeUri} />
            </QRCodeContainer>
          </FadeIn>
        ) : (
          <QRSkeleton height="200px" width="200px" />
        )}
      </Suspense>

      {props.QRIcon && (
        <QrCodeIconContainer>{props.QRIcon}</QrCodeIconContainer>
      )}
    </div>
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

const StyledReactQrCode = styled(ReactQrCode)`
  width: 200px;
  height: 200px;
  border-radius: ${radius.md};

  ${media.mobile} {
    width: 150px;
    height: 150px;
  }
`;

const QRSkeleton = styled(Skeleton)`
  width: 200px;
  height: 200px;
  border-radius: ${radius.md};
  ${media.mobile} {
    width: 150px;
    height: 150px;
  }
`;
