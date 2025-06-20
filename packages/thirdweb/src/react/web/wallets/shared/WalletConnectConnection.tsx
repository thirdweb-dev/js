import { useCallback, useEffect, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { wait } from "../../../../utils/promise/wait.js";
import { formatWalletConnectUrl } from "../../../../utils/url.js";
import { isAndroid, isIOS, isMobile } from "../../../../utils/web/isMobile.js";
import { openWindow } from "../../../../utils/web/openWindow.js";
import type { WCSupportedWalletIds } from "../../../../wallets/__generated__/wallet-ids.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WalletInfo } from "../../../../wallets/wallet-info.js";
import type { InjectedWalletLocale } from "../injected/locale/types.js";
import { ConnectingScreen } from "./ConnectingScreen.js";
import { ScanScreen } from "./ScanScreen.js";

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
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  client: ThirdwebClient;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  size: "compact" | "wide";
}> = (props) => {
  const { onBack, onGetStarted, wallet, walletInfo, locale, done } = props;
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connect = useCallback(() => {
    setErrorConnecting(false);

    wallet
      .connect({
        chain: props.chain,
        client: props.client,
        walletConnect: {
          onDisplayUri(uri) {
            const preferNative =
              walletInfo.mobile.native || walletInfo.mobile.universal;
            try {
              if (isMobile()) {
                if (isAndroid()) {
                  if (preferNative) {
                    openWindow(
                      formatWalletConnectUrl(preferNative, uri).redirect,
                    );
                  }
                } else if (isIOS()) {
                  if (preferNative) {
                    openWindow(
                      formatWalletConnectUrl(preferNative, uri).redirect,
                    );
                  }
                } else {
                  const preferUniversal =
                    walletInfo.mobile.universal || walletInfo.mobile.native;
                  if (preferUniversal) {
                    openWindow(
                      formatWalletConnectUrl(preferUniversal, uri).redirect,
                    );
                  }
                }
              } else {
                setQrCodeUri(uri);
              }
            } catch {
              setErrorConnecting(true);
            }
          },
          optionalChains: props.chains,
          projectId: props.walletConnect?.projectId,
          showQrModal: false,
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
    props.walletConnect,
    walletInfo.mobile.native,
    walletInfo.mobile.universal,
    wallet,
    props.chain,
    props.client,
    props.chains,
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
        client={props.client}
        errorConnecting={errorConnecting}
        locale={{
          failed: locale.connectionScreen.failed,
          getStartedLink: locale.getStartedLink,
          inProgress: locale.connectionScreen.inProgress,
          instruction: locale.connectionScreen.instruction,
          tryAgain: locale.connectionScreen.retry,
        }}
        onBack={onBack}
        onGetStarted={onGetStarted}
        onRetry={connect}
        size={props.size}
        walletId={wallet.id}
        walletName={walletInfo.name}
      />
    );
  }

  return (
    <ScanScreen
      client={props.client}
      connectModalSize={props.size}
      error={errorConnecting}
      getStartedLink={locale.getStartedLink}
      onBack={onBack}
      onGetStarted={onGetStarted}
      onRetry={connect}
      qrCodeUri={qrCodeUri}
      qrScanInstruction={locale.scanScreen.instruction}
      walletId={wallet.id}
      walletName={walletInfo.name}
    />
  );
};

/**
 * QR Scan UI for connecting a specific wallet on desktop.
 * shows a "Connecting" screen and opens the app on mobile.
 * @internal
 */
export const WalletConnectStandaloneConnection: React.FC<{
  onBack?: () => void;
  locale: InjectedWalletLocale;
  wallet: Wallet<"walletConnect">;
  walletInfo: WalletInfo;
  done: () => void;
  setModalVisibility: (value: boolean) => void;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  client: ThirdwebClient;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  size: "compact" | "wide";
}> = (props) => {
  const { onBack, wallet, walletInfo, locale, done, setModalVisibility } =
    props;
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connect = useCallback(() => {
    setErrorConnecting(false);

    if (isMobile()) {
      let wcModalClosed = false;

      // show spinner while the wallet connect modal loads in the background
      wait(2000).then(() => {
        // don't hide the modal if wc closed already
        if (!wcModalClosed) {
          setModalVisibility(false);
        }
      });

      wallet
        .connect({
          chain: props.chain,
          client: props.client,
          optionalChains: props.chains,
          projectId: props.walletConnect?.projectId,
          showQrModal: true,
        })
        .then(() => {
          wcModalClosed = true;
          setModalVisibility(true);
          done();
        })
        .catch((e) => {
          wcModalClosed = true;
          setModalVisibility(true);
          setErrorConnecting(true);
          console.error(e);
        });
    } else {
      wallet
        .connect({
          chain: props.chain,
          client: props.client,
          onDisplayUri(uri) {
            const platformUris = {
              android: walletInfo.mobile.universal || "",
              ios: walletInfo.mobile.native || "",
              other: walletInfo.mobile.universal || "",
            };

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
          optionalChains: props.chains,
          projectId: props.walletConnect?.projectId,
          showQrModal: false,
        })
        .then(() => {
          done();
        })
        .catch((e) => {
          setErrorConnecting(true);
          console.error(e);
        });
    }
  }, [
    props.walletConnect,
    walletInfo.mobile.native,
    walletInfo.mobile.universal,
    wallet,
    props.chain,
    props.client,
    props.chains,
    done,
    setModalVisibility,
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
        client={props.client}
        errorConnecting={errorConnecting}
        locale={{
          failed: locale.connectionScreen.failed,
          getStartedLink: locale.getStartedLink,
          inProgress: locale.connectionScreen.inProgress,
          instruction: locale.connectionScreen.instruction,
          tryAgain: locale.connectionScreen.retry,
        }}
        onBack={onBack}
        onRetry={connect}
        size={props.size}
        walletId={wallet.id}
        walletName={walletInfo.name}
      />
    );
  }

  return (
    <ScanScreen
      client={props.client}
      connectModalSize={props.size}
      error={errorConnecting}
      getStartedLink={locale.getStartedLink}
      onBack={onBack}
      onRetry={connect}
      qrCodeUri={qrCodeUri}
      qrScanInstruction={locale.scanScreen.instruction}
      walletId={wallet.id}
      walletName={walletInfo.name}
    />
  );
};
