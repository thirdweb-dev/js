import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { TrustWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { TrustScan } from "./TrustScan";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";
import { trustWalletUris } from "./trustWalletUris";

export const TrustConnectUI = (props: ConnectUIProps<TrustWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");
  const { walletConfig, close } = props;
  const connect = useConnect();
  const hideBackButton = props.supportedWallets.length === 1;
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connectToExtension = useCallback(async () => {
    try {
      setErrorConnecting(false);
      connectPrompted.current = true;
      setScreen("connecting");
      await connect(walletConfig);
      close();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [close, connect, walletConfig]);

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

      // if trust is not injected
      else {
        // on mobile, open trust app link
        if (isMobile()) {
          setScreen("open-wc-uri");
        } else {
          // on desktop, show the trust scan qr code
          setScreen("scanning");
        }
      }
    })();
  }, [connectToExtension, walletConfig]);

  const handleGetStarted = () => {
    setScreen("get-started");
  };

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        onRetry={connectToExtension}
        errorConnecting={errorConnecting}
        onGetStarted={handleGetStarted}
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
        // supportLink="https://community.trustwallet.com/c/helpcenter/8"
      />
    );
  }

  if (screen === "open-wc-uri") {
    return (
      <WCOpenURI
        onRetry={() => {
          // NOOP - TODO make onRetry optional
        }}
        errorConnecting={errorConnecting}
        onGetStarted={handleGetStarted}
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        onConnected={close}
        walletConfig={walletConfig}
        appUriPrefix={trustWalletUris}
        // supportLink="https://support.trustwallet.com/en/support/home"
      />
    );
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
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
      <TrustScan
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        onConnected={close}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        walletConfig={walletConfig}
      />
    );
  }

  return null;
};
