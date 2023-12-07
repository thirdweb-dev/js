import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type { WalletConnect } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { QRCode } from "../../../components/QRCode";
import { Img } from "../../../components/Img";
import { Spacer } from "../../../components/Spacer";
import { ModalHeader, Container, Line } from "../../../components/basic";
import { iconSize } from "../../../design-system";
import { Text } from "../../../components/text";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { Button } from "../../../components/buttons";
import { Spinner } from "../../../components/Spinner";
import { wait } from "../../../utils/wait";

export const WalletConnectScan: React.FC<{
  onBack: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<WalletConnect>;
  hideBackButton: boolean;
  modalSize: "wide" | "compact";
  hide: ConnectUIProps["hide"];
  show: ConnectUIProps["show"];
}> = ({ onBack, onConnected, walletConfig, hide, show }) => {
  const locale = useTWLocale().wallets.walletConnect;
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { setConnectedWallet, chainToConnect, setConnectionStatus } =
    useWalletContext();
  const [isOpeningWCModal, setIsOpeningWCModal] = useState(false);

  const handleWCModalConnect = async () => {
    const walletInstance = createInstance(walletConfig);

    setConnectionStatus("connecting");

    try {
      setIsOpeningWCModal(true);
      wait(1000).then(() => {
        setIsOpeningWCModal(false);
        hide();
      });

      await walletInstance.connectWithModal({
        chainId: chainToConnect?.chainId,
      });

      setConnectedWallet(walletInstance);
      onConnected();
    } catch {
      // show error
    }

    show();
  };

  return (
    <Container fullHeight animate="fadein" flex="column">
      <Container p="lg">
        <ModalHeader onBack={onBack} title={walletConfig.meta.name} />
      </Container>

      <Spacer y="sm" />

      <Container flex="column" center={"both"} px="lg" expand>
        {isOpeningWCModal ? (
          <Container
            style={{
              minHeight: "300px",
            }}
            flex="row"
            center="both"
          >
            <Spinner size="xl" color="accentText" />
          </Container>
        ) : (
          <WalletConnectQRScanConnect
            createInstance={createInstance}
            onConnected={onConnected}
            qrCodeUri={qrCodeUri}
            setConnectedWallet={setConnectedWallet}
            setConnectionStatus={setConnectionStatus}
            setQrCodeUri={setQrCodeUri}
            walletConfig={walletConfig}
            chainIdToConnect={chainToConnect?.chainId}
          />
        )}
      </Container>

      {/* <Spacer y="xl" /> */}

      {/* <Spacer y="lg" />

      <Container flex="row" center="x">
        <CopyButton
          text={qrCodeUri || ""}
          tip="Copy QRI to clipboard"
          hide={!qrCodeUri}
        />
      </Container> */}

      <Container p="lg">
        <Text multiline center balance>
          {locale.scanInstruction}
        </Text>
      </Container>

      <Line />
      <Container py="lg" flex="row" center="x">
        <Button variant="link" onClick={handleWCModalConnect}>
          {"Open Official WalletConnect Modal"}
        </Button>
      </Container>
    </Container>
  );
};

function WalletConnectQRScanConnect(props: {
  qrCodeUri: string | undefined;
  setQrCodeUri: (uri: string) => void;
  walletConfig: WalletConfig<WalletConnect>;
  onConnected: () => void;
  setConnectedWallet: (wallet: WalletConnect) => void;
  createInstance: (walletConfig: WalletConfig<WalletConnect>) => WalletConnect;
  setConnectionStatus: (
    status: "disconnected" | "connecting" | "connected",
  ) => void;
  chainIdToConnect?: number;
}) {
  const {
    qrCodeUri,
    walletConfig,
    onConnected,
    setConnectedWallet,
    createInstance,
    setQrCodeUri,
    chainIdToConnect,
    setConnectionStatus,
  } = props;

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const walletInstance = createInstance(walletConfig);

    setConnectionStatus("connecting");
    walletInstance.connectWithQrCode({
      chainId: chainIdToConnect,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        setConnectedWallet(walletInstance);
        onConnected();
      },
    });
  }, [
    createInstance,
    setConnectedWallet,
    chainIdToConnect,
    onConnected,
    walletConfig,
    setConnectionStatus,
    setQrCodeUri,
  ]);

  return (
    <QRCode
      qrCodeUri={qrCodeUri}
      QRIcon={
        <Img
          width={iconSize.xxl}
          height={iconSize.xxl}
          src={walletConfig.meta.iconURL}
        />
      }
    />
  );
}

// export const CopyButton: React.FC<{
//   text: string;
//   tip: string;
//   side?: "top" | "bottom" | "left" | "right";
//   align?: "start" | "center" | "end";
//   hide?: boolean;
// }> = (props) => {
//   const { hasCopied, onCopy } = useClipboard(props.text);

//   return (
//     <Button
//       variant="outline"
//       onClick={onCopy}
//       style={{
//         padding: spacing.xs,
//         fontSize: fontSize.xs,
//       }}
//     >
//       <Container flex="row" center="both" gap="xs" color="secondaryText">
//         {hasCopied ? <CheckIconStyled /> : <CopyIcon />}
//         Copy
//       </Container>
//     </Button>
//   );
// };

// const CheckIconStyled = /* @__PURE__ */ styled(CheckIcon)<{ theme?: Theme }>`
//   color: ${(p) => p.theme.colors.success};
// `;
