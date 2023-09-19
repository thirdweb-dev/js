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
import { Theme, fontSize, iconSize, spacing } from "../../../design-system";
import { Text } from "../../../components/text";
import styled from "@emotion/styled";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useClipboard } from "../../../evm/components/hooks/useCopyClipboard";
import { Button } from "../../../components/buttons";

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
    <Container
      fullHeight
      flex="column"
      style={{
        minHeight: "450px",
      }}
    >
      <Container
        p="lg"
        flex="column"
        expand
        style={{
          paddingBottom: 0,
        }}
      >
        <ModalHeader onBack={onBack} title="WalletConnect" />
        <Spacer y="xl" />

        <Container flex="column" center="both" expand>
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
        </Container>
      </Container>

      <Spacer y="lg" />

      <Container flex="row" center="x">
        <CopyButton
          text={qrCodeUri || ""}
          tip="Copy QRI to clipboard"
          hide={!qrCodeUri}
        />
      </Container>

      <Spacer y="lg" />

      <ScreenBottomContainer
        style={{
          borderTop: modalSize === "wide" ? "none" : undefined,
        }}
      >
        <Text multiline center>
          Scan this with your wallet <br />
          or camera app to connect{" "}
        </Text>
      </ScreenBottomContainer>
    </Container>
  );
};

export const CopyButton: React.FC<{
  text: string;
  tip: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  hide?: boolean;
}> = (props) => {
  const { hasCopied, onCopy } = useClipboard(props.text);

  return (
    <Button
      variant="outline"
      onClick={onCopy}
      style={{
        padding: spacing.xs,
        fontSize: fontSize.xs,
        opacity: props.hide ? 0 : 1,
        transition: "opacity 400ms ease",
      }}
    >
      <Container flex="row" center="both" gap="xs" color="secondaryText">
        {hasCopied ? <CheckIconStyled /> : <CopyIcon />}
        Copy
      </Container>
    </Button>
  );
};

const CheckIconStyled = /* @__PURE__ */ styled(CheckIcon)<{ theme?: Theme }>`
  color: ${(p) => p.theme.colors.success};
`;
