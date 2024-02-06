import { walletConnect } from "../../../wallets/index.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../types/wallets.js";
import { ScanScreen } from "../../ui/ConnectWallet/screens/ScanScreen.js";
import { useState, useRef, useEffect } from "react";
import { isMobile } from "../../utils/isMobile.js";
import {
  handelWCSessionRequest,
  type PlatformURIs,
} from "../../utils/handleWCSessionRequest.js";

/**
 * QR Scan UI for connecting a specific wallet using WalletConnect protocol.
 * @internal
 */
export const WalletConnectScan: React.FC<{
  onBack?: () => void;
  onGetStarted: () => void;
  connectUIProps: ConnectUIProps;
  projectId?: string;
  platformUris: PlatformURIs;
}> = (props) => {
  const { onBack, onGetStarted, connectUIProps, projectId, platformUris } =
    props;
  const { walletConfig, chainId, done } = connectUIProps;
  const locale = useTWLocale().wallets.injectedWallet(
    walletConfig.metadata.name,
  );
  const { client, dappMetadata } = useThirdwebProviderProps();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const wallet = walletConnect({
      client,
      dappMetadata: dappMetadata,
      metadata: walletConfig.metadata,
      projectId,
    });

    const onSessionRequestSent = isMobile()
      ? () => handelWCSessionRequest(platformUris)
      : undefined;

    wallet
      .connect({
        chainId,
        showQrModal: false,
        onDisplayUri(uri) {
          setQrCodeUri(uri);
        },
        onSessionRequestSent,
      })
      .then(() => {
        done(wallet);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [
    chainId,
    client,
    dappMetadata,
    done,
    platformUris,
    projectId,
    walletConfig.metadata,
  ]);

  return (
    <ScanScreen
      qrScanInstruction={locale.scanScreen.instruction}
      onBack={onBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={walletConfig.metadata.name}
      walletIconURL={walletConfig.metadata.iconUrl}
      getStartedLink={locale.getStartedLink}
    />
  );
};
