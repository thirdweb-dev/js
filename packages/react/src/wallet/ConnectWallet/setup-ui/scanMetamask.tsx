import { Skeleton } from "../../../components/Skeleton";
import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { fontSize, iconSize, radius, spacing } from "../../../design-system";
import { Theme, media } from "../../../design-system/index";
import { MetamaskWallet } from "../../wallets";
import { MetamaskIcon } from "../icons/MetamaskIcon";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../shared/modalElements";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";
import * as Dialog from "@radix-ui/react-dialog";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { lazy } from "react";

const QrCode = lazy(() => import("react-qr-code"));

export const ScanMetamask: React.FC<{ onBack: () => void }> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | null>(null);
  const twWalletContext = useThirdwebWallet();

  useEffect(() => {
    if (!twWalletContext) return;

    const metamask = createInstance(MetamaskWallet) as InstanceType<
      typeof MetamaskWallet
    >;

    metamask.connectWithQrCode({
      chainId: twWalletContext.chainIdToConnect || 1,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected(accountAddress) {
        twWalletContext.handleWalletConnect(metamask);
      },
    });
  }, [twWalletContext]);

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
          <QRCodeContainer>
            {qrCodeUri ? (
              <StyledQRCode value={qrCodeUri} />
            ) : (
              <StyledSkeleton height="200px" width="200px" />
            )}
          </QRCodeContainer>

          <QrCodeIconContainer>
            <MetamaskIcon width={iconSize.xl} height={iconSize.xl} />
          </QrCodeIconContainer>
        </div>

        <Spacer y="xl" />

        <ModalTitle>Scan with Metamask Wallet</ModalTitle>
        <Spacer y="md" />

        <ModalDescription>
          Scan this QR code with your phone <br />
          camera or Metamask wallet to connect
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

        <HelperLink href="/foo/bar" target="_blank">
          Don't have Metamask Wallet?
        </HelperLink>
      </div>
    </>
  );
};

const Title = styled(Dialog.Title)<{ theme?: Theme }>`
  font-size: ${fontSize.xl};
  font-weight: 500;
  color: ${(p) => p.theme.text.neutral};
`;

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
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: ${spacing.xxs};
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: ${radius.md};
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
