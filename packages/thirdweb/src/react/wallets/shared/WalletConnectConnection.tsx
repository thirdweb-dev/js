import { walletConnect } from "../../../wallets/index.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../types/wallets.js";
import { ScanScreen } from "./ScanScreen.js";
import { useState, useRef, useEffect, useCallback } from "react";
import { isAndroid, isIOS, isMobile } from "../../utils/isMobile.js";
import {
  handelWCSessionRequest,
  type PlatformURIs,
} from "../../utils/handleWCSessionRequest.js";
import { ConnectingScreen } from "./ConnectingScreen.js";
import { openWindow } from "../../utils/openWindow.js";

/**
 * QR Scan UI for connecting a specific wallet on desktop.
 * shows a "Connecting" screen and opens the app on mobile.
 * @internal
 */
export const WalletConnectConnection: React.FC<{
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
  const [errorConnecting, setErrorConnecting] = useState(false);
  const optionalChains = connectUIProps.chains;

  const connect = useCallback(() => {
    const wallet = walletConnect({
      client,
      dappMetadata: dappMetadata,
      metadata: walletConfig.metadata,
      projectId,
    });

    setErrorConnecting(false);

    const onSessionRequestSent = isMobile()
      ? () => handelWCSessionRequest(platformUris)
      : undefined;

    wallet
      .connect({
        chainId,
        showQrModal: false,
        onDisplayUri(uri) {
          setQrCodeUri(uri);
          if (isMobile()) {
            if (isAndroid()) {
              openWindow(
                `${platformUris.android}wc?uri=${encodeURIComponent(uri)}`,
              );
            } else if (isIOS()) {
              openWindow(
                `${platformUris.ios}wc?uri=${encodeURIComponent(uri)}`,
              );
            } else {
              openWindow(
                `${platformUris.other}wc?uri=${encodeURIComponent(uri)}`,
              );
            }
          }
        },
        onSessionRequestSent,
        optionalChains,
      })
      .then(() => {
        done(wallet);
      })
      .catch((e) => {
        setErrorConnecting(true);
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
    optionalChains,
  ]);

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;
    connect();
  }, [connect]);

  if (isMobile()) {
    return (
      <ConnectingScreen
        locale={{
          getStartedLink: locale.getStartedLink,
          instruction: locale.connectionScreen.instruction,
          tryAgain: locale.connectionScreen.retry,
          inProgress: locale.connectionScreen.inProgress,
          failed: locale.connectionScreen.failed,
        }}
        onBack={onBack}
        walletName={walletConfig.metadata.name}
        walletIconURL={walletConfig.metadata.iconUrl}
        errorConnecting={errorConnecting}
        onRetry={connect}
        onGetStarted={onGetStarted}
      />
    );
  }

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
