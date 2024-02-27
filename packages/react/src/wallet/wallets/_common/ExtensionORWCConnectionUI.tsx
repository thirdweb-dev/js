import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { wait } from "../../../utils/wait";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";
import { WalletConnectScanUI } from "./WalletConnectScanUI";
import { WCConnectableWallet } from "./WCConnectableWallet";
import { ExtensionAndQRScreensLocale } from "../../../evm/locales/types";

export const ExtensionOrWCConnectionUI = (props: {
  walletConnectUris: {
    ios: string;
    android: string;
    other: string;
  };
  walletLocale: ExtensionAndQRScreensLocale;
  meta: WalletConfig["meta"];
  isInstalled?: () => boolean;
  supportedWallets: WalletConfig[];
  connect: ConnectUIProps<WCConnectableWallet>["connect"];
  connected: ConnectUIProps<WCConnectableWallet>["connected"];
  goBack: ConnectUIProps<WCConnectableWallet>["goBack"];
  setConnectedWallet: ConnectUIProps<WCConnectableWallet>["setConnectedWallet"];
  setConnectionStatus: ConnectUIProps<WCConnectableWallet>["setConnectionStatus"];
  createWalletInstance: () => WCConnectableWallet;
}) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");

  const {
    connected,
    connect,
    supportedWallets,
    isInstalled,
    meta,
    createWalletInstance,
    setConnectedWallet,
    setConnectionStatus,
    goBack,
    walletConnectUris,
    walletLocale: locale,
  } = props;

  const connectingLocale = {
    getStartedLink: locale.getStartedLink,
    instruction: locale.connectionScreen.instruction,
    tryAgain: locale.connectionScreen.retry,
    inProgress: locale.connectionScreen.inProgress,
    failed: locale.connectionScreen.failed,
  };

  const [errorConnecting, setErrorConnecting] = useState(false);
  const hideBackButton = supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      setScreen("connecting");
      await wait(1000);
      await connect();
      connected();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [connected, connect]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    const isInstalledVal = isInstalled ? isInstalled() : false;

    // if loading
    (async () => {
      if (isInstalledVal) {
        connectToExtension();
      }

      // if wallet is not injected
      else {
        // on mobile, open the Coin98 Mobile via wallet connect
        if (isMobile()) {
          setScreen("open-wc-uri");
        } else {
          // on desktop, show the Coin98 app scan qr code
          setScreen("scanning");
        }
      }
    })();
  }, [connectToExtension, isInstalled]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        locale={connectingLocale}
        errorConnecting={errorConnecting}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onRetry={connectToExtension}
        hideBackButton={hideBackButton}
        onBack={goBack}
        walletName={meta.name}
        walletIconURL={meta.iconURL}
      />
    );
  }

  if (screen === "open-wc-uri") {
    return (
      <WCOpenURI
        locale={connectingLocale}
        onRetry={() => {
          // NOOP - TODO make onRetry optional
        }}
        errorConnecting={errorConnecting}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        hideBackButton={hideBackButton}
        onBack={goBack}
        onConnected={connected}
        appUriPrefix={walletConnectUris}
        createWalletInstance={createWalletInstance}
        meta={meta}
        setConnectedWallet={(w) => {
          setConnectedWallet(w as WCConnectableWallet);
        }}
        setConnectionStatus={setConnectionStatus}
      />
    );
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
        walletIconURL={meta.iconURL}
        walletName={meta.name}
        chromeExtensionLink={meta.urls?.chrome}
        googlePlayStoreLink={meta.urls?.android}
        appleStoreLink={meta.urls?.ios}
        onBack={goBack}
      />
    );
  }

  if (screen === "scanning") {
    return (
      <WalletConnectScanUI
        onBack={goBack}
        onConnected={connected}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        hideBackButton={hideBackButton}
        createWalletInstance={createWalletInstance}
        meta={meta}
        setConnectedWallet={(w) => {
          setConnectedWallet(w as WCConnectableWallet);
        }}
        setConnectionStatus={setConnectionStatus}
        walletLocale={locale}
      />
    );
  }

  return null;
};
