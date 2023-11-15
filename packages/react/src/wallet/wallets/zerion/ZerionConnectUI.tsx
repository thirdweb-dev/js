import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ZerionWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { ZerionScan } from "./ZerionScan";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const ZerionConnectUI = (props: ConnectUIProps<ZerionWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");
  const locale = useTWLocale().wallets.zerionWallet;
  const { walletConfig, connected } = props;
  const connect = useConnect();
  const hideBackButton = props.supportedWallets.length === 1;
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connectingLocale = {
    getStartedLink: locale.getStartedLink,
    instruction: locale.connectionScreen.instruction,
    tryAgain: locale.connectionScreen.retry,
    inProgress: locale.connectionScreen.inProgress,
    failed: locale.connectionScreen.failed,
  };

  const connectToExtension = useCallback(async () => {
    try {
      setErrorConnecting(false);
      connectPrompted.current = true;
      setScreen("connecting");
      await connect(walletConfig);
      connected();
    } catch (e) {
      setErrorConnecting(true);
    }
  }, [connect, connected, walletConfig]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    const isInstalled = walletConfig.isInstalled
      ? walletConfig.isInstalled()
      : false;

    // if loading
    (async () => {
      if (isInstalled) {
        connectToExtension();
      }

      // if zerion is not injected
      else {
        // on mobile, open zerion app link
        if (isMobile()) {
          setScreen("open-wc-uri");
        } else {
          // on desktop, show the metamask scan qr code
          setScreen("scanning");
        }
      }
    })();
  }, [connectToExtension, walletConfig]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        locale={connectingLocale}
        hideBackButton={hideBackButton}
        onGetStarted={() => setScreen("get-started")}
        onRetry={connectToExtension}
        onBack={props.goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
        errorConnecting={errorConnecting}
      />
    );
  }

  if (screen === "open-wc-uri") {
    return (
      <WCOpenURI
        locale={connectingLocale}
        onRetry={() => {
          // NO OP
        }}
        onGetStarted={() => setScreen("get-started")}
        errorConnecting={errorConnecting}
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        onConnected={props.connected}
        walletConfig={walletConfig}
        appUriPrefix={{
          ios: "zerion://",
          android: "https://link.zerion.io/pt3gdRP0njb/",
          other: "https://link.zerion.io/pt3gdRP0njb/",
        }}
      />
    );
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
        walletIconURL={walletConfig.meta.iconURL}
        walletName={walletConfig.meta.name}
        chromeExtensionLink={walletConfig.meta.urls?.chrome}
        googlePlayStoreLink={walletConfig.meta.urls?.android}
        appleStoreLink={walletConfig.meta.urls?.ios}
        onBack={props.goBack}
      />
    );
  }

  if (screen === "scanning") {
    return (
      <ZerionScan
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        onConnected={props.connected}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        walletConfig={walletConfig}
      />
    );
  }

  return null;
};
