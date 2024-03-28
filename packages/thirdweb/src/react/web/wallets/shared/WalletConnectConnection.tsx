import { ScanScreen } from "./ScanScreen.js";
import { useState, useRef, useEffect, useCallback } from "react";
import { isAndroid, isIOS, isMobile } from "../../../core/utils/isMobile.js";
import { handelWCSessionRequest } from "../../../core/utils/handleWCSessionRequest.js";
import { ConnectingScreen } from "./ConnectingScreen.js";
import { openWindow } from "../../../core/utils/openWindow.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../../wallets/wallet-info.js";
import type { WCSupportedWalletIds } from "../../../../wallets/__generated__/wallet-ids.js";

/**
 * QR Scan UI for connecting a specific wallet on desktop.
 * shows a "Connecting" screen and opens the app on mobile.
 * @internal
 */
export const WalletConnectConnection: React.FC<{
  onBack?: () => void;
  onGetStarted: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet<WCSupportedWalletIds>;
  walletInfo: WalletInfo;
  done: () => void;
}> = (props) => {
  const { onBack, onGetStarted, wallet, walletInfo, locale, done } = props;
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const [errorConnecting, setErrorConnecting] = useState(false);
  const { chain, chains, client, walletConnect } = useWalletConnectionCtx();

  const connect = useCallback(() => {
    setErrorConnecting(false);

    const platformUris = {
      ios: walletInfo.mobile.native || "",
      android: walletInfo.mobile.universal || "",
      other: walletInfo.mobile.universal || "",
    };

    const onSessionRequestSent = isMobile()
      ? () => handelWCSessionRequest(platformUris)
      : undefined;

    wallet
      .connect({
        chain,
        client: client,
        walletConnect: {
          projectId: walletConnect?.projectId,
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
          optionalChains: chains,
        },
      })
      .then(() => {
        done();
      })
      .catch((e) => {
        setErrorConnecting(true);
        console.error(e);
      });
  }, [
    walletConnect,
    walletInfo.mobile.native,
    walletInfo.mobile.universal,
    wallet,
    chain,
    client,
    chains,
    done,
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
        walletName={walletInfo.name}
        walletId={wallet.id}
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
      walletName={walletInfo.name}
      walletId={wallet.id}
      getStartedLink={locale.getStartedLink}
    />
  );
};
