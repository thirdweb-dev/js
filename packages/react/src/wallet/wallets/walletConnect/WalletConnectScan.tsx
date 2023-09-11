import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { QRCode } from "../../../components/QRCode";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import {
  ModalHeader,
  Container,
  ScreenBottomContainer,
} from "../../../components/basic";
import { iconSize } from "../../../design-system";
import { Text } from "../../../components/text";

export const WalletConnectScan: React.FC<{
  onBack: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<WalletConnect>;
  hideBackButton: boolean;
  modalSize: "wide" | "compact";
}> = ({ onBack, onConnected, walletConfig, modalSize }) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { setConnectedWallet, chainToConnect, setConnectionStatus } =
    useWalletContext();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const rainbow = createInstance(walletConfig);

    setConnectionStatus("connecting");
    rainbow.connectWithQrCode({
      chainId: chainToConnect?.chainId,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        setConnectedWallet(rainbow);
        onConnected();
      },
    });
  }, [
    createInstance,
    setConnectedWallet,
    chainToConnect,
    onConnected,
    walletConfig,
    setConnectionStatus,
  ]);

  return (
    <Container fullHeight flex="column">
      <Container p="lg" flex="column" expand>
        <ModalHeader onBack={onBack} title="WalletConnect" />
        {modalSize === "compact" && <Spacer y="xl" />}

        <Container flex="column" center="both" expand>
          <QRCode
            qrCodeUri={qrCodeUri}
            QRIcon={
              <Img
                width={iconSize.lg}
                height={iconSize.lg}
                src={walletConfig.meta.iconURL}
              />
            }
          />

          <Spacer y="lg" />
        </Container>
      </Container>
      <ScreenBottomContainer
        style={{
          borderTop: modalSize === "wide" ? "none" : undefined,
        }}
      >
        <Text center>Scan this with your wallet app </Text>
      </ScreenBottomContainer>
    </Container>
  );
};
