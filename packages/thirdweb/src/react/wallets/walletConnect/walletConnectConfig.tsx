import {
  walletConnectMetadata,
  walletConnect,
  type WalletConnectConnectionOptions,
} from "../../../wallets/index.js";
import type { WalletConnect } from "../../../wallets/wallet-connect/index.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps, WalletConfig } from "../../types/wallets.js";
import { Img } from "../../ui/components/Img.js";
import { QRCode } from "../../ui/components/QRCode.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { Spinner } from "../../ui/components/Spinner.js";
import { Container, ModalHeader, Line } from "../../ui/components/basic.js";
import { Button } from "../../ui/components/buttons.js";
import { iconSize } from "../../ui/design-system/index.js";
import { wait } from "../../utils/wait.js";
import { useState, useRef, useEffect } from "react";
import { Text } from "../../ui/components/text.js";
import { isMobile } from "../../utils/isMobile.js";
import { HeadlessConnectUI } from "../headlessConnectUI.js";

export type WalletConnectConfigOptions = {
  projectId?: string;
  qrModalOptions?: WalletConnectConnectionOptions["qrModalOptions"];
  recommended?: boolean;
};

/**
 * Integrate MetaMask wallet connection into your app.
 * @param options - Options for configuring the MetaMask wallet.
 * @example
 * ```tsx
 * <ThirdwebProvider
 *  client={client}>
 *  wallets={[  metamaskConfig() ]}
 *  <App />
 * </ThirdwebProvider>
 * ```
 * @returns WalletConfig object to be passed into `ThirdwebProvider`
 */
export const walletConnectConfig = (
  options?: WalletConnectConfigOptions,
): WalletConfig => {
  const config: WalletConfig = {
    metadata: walletConnectMetadata,
    create(createOptions) {
      return walletConnect({
        client: createOptions.client,
        dappMetadata: createOptions.dappMetadata,
      });
    },
    connectUI(props) {
      if (isMobile()) {
        return <HeadlessConnectUI {...props} />;
      }

      return (
        <ConnectUI
          {...props}
          wcConfig={{
            projectId: options?.projectId,
            qrModalOptions: options?.qrModalOptions,
          }}
        />
      );
    },
    recommended: options?.recommended,
  };

  return config;
};

const ConnectUI = (
  props: ConnectUIProps & {
    wcConfig: {
      projectId?: string;
      qrModalOptions?: WalletConnectConnectionOptions["qrModalOptions"];
    };
  },
) => {
  const locale = useTWLocale().wallets.walletConnect;
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { chain, done, createInstance, walletConfig } = props;
  const [isWCModalOpen, setIsWCModalOpen] = useState(false);
  const { setModalVisibility } = props.screenConfig;

  const handleWCModalConnect = async () => {
    try {
      setQrCodeUri(undefined);
      setIsWCModalOpen(true);
      wait(1000).then(() => {
        setModalVisibility(false);
      });

      // TODO: fix the type in ConnectUIProps
      const wallet = createInstance() as WalletConnect;

      await wallet.connect({
        chain: chain,
        showQrModal: true,
        qrModalOptions: props.wcConfig.qrModalOptions,
        optionalChains: props.chains,
      });

      done(wallet);
      setModalVisibility(true);
    } catch {
      setModalVisibility(true);
      setIsWCModalOpen(false);
    }
  };

  return (
    <Container fullHeight animate="fadein" flex="column">
      <Container p="lg">
        <ModalHeader
          onBack={props.screenConfig.goBack}
          title={walletConfig.metadata.name}
        />
      </Container>

      <Spacer y="sm" />

      <Container flex="column" center={"both"} px="lg" expand>
        {isWCModalOpen ? (
          <Container
            style={{
              minHeight: "300px",
            }}
            flex="column"
            center="both"
          >
            <Spinner size="xl" color="accentText" />
          </Container>
        ) : (
          <WalletConnectQRScanConnect
            {...props}
            qrCodeUri={qrCodeUri}
            setQrCodeUri={setQrCodeUri}
          />
        )}
      </Container>

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

function WalletConnectQRScanConnect(
  props: ConnectUIProps & {
    qrCodeUri?: string;
    setQrCodeUri: (uri: string) => void;
    wcConfig: {
      projectId?: string;
      qrModalOptions?: WalletConnectConnectionOptions["qrModalOptions"];
    };
  },
) {
  const {
    qrCodeUri,
    walletConfig,
    createInstance,
    done,
    chain,
    setQrCodeUri,
    chains,
  } = props;

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const wallet = createInstance() as WalletConnect;

    wallet
      .connect({
        chain,
        onDisplayUri(uri) {
          setQrCodeUri(uri);
        },
        optionalChains: chains,
        showQrModal: false,
      })
      .then(() => {
        done(wallet);
      });
  }, [chain, chains, createInstance, done, setQrCodeUri]);

  return (
    <QRCode
      qrCodeUri={qrCodeUri}
      QRIcon={
        <Img
          width={iconSize.xxl}
          height={iconSize.xxl}
          src={walletConfig.metadata.iconUrl}
        />
      }
    />
  );
}
