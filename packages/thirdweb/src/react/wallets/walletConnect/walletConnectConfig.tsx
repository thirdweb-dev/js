import {
  walletConnectMetadata,
  type WalletConnect,
  walletConnect,
} from "../../../wallets/wallet-connect/index.js";
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
import type { WalletConnectConnectionOptions } from "../../../wallets/wallet-connect/types.js";

export type WalletConnectConfigOptions = {
  /**
   * WalletConnect requires a `projectId` that can be obtained at https://cloud.walletconnect.com/
   *
   * If you don't pass a `projectId`, a default `projectId` will be used that is created by thirdweb.
   *
   * Refer to [WalletConnect docs](https://docs.walletconnect.com) for more info
   */
  projectId?: string;
  /**
   * Options for Configuring the QR Code Modal appearance and behavior.
   * This is only relevant if you are opening the official WalletConnect QR Code Modal by setting `showQrModal` to `true`.
   */
  qrModalOptions?: WalletConnectConnectionOptions["qrModalOptions"];
  /**
   * If `true`, WalletConnect will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
};

/**
 * Integrate WalletConnect connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in [`ThirdwebProvider`](https://portal.thirdweb.com/typescript/v5/react/ThirdwebProvider).
 * @param options - Options for configuring the WalletConnect
 * Refer to [`WalletConnectConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/WalletConnectConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ThirdwebProvider, walletConnect } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ThirdwebProvider client={client} wallets={[walletConnect()]}>
 *       <App />
 *     </ThirdwebProvider>
 *   );
 * }
 * ```
 * @returns `WalletConfig` object to be passed into `ThirdwebProvider`
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
  const { walletConfig } = props;
  const { chain, done, createInstance, chains } = props.connection;
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
        optionalChains: chains,
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
  const { qrCodeUri, walletConfig, setQrCodeUri } = props;
  const { createInstance, done, chain, chains } = props.connection;

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
