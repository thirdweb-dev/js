import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { TrustWallet } from "@thirdweb-dev/wallets";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { TrustScan } from "./TrustScan";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";

export const TrustConnectUI = (props: ConnectUIProps<TrustWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");
  const { walletConfig, close } = props;
  const connect = useConnect();
  const hideBackButton = props.supportedWallets.length === 1;

  const { goBack } = props;

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
        try {
          connectPrompted.current = true;
          setScreen("connecting");
          await connect(walletConfig);
          close();
        } catch (e) {
          goBack();
        }
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
  }, [walletConfig, close, connect, goBack]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
        supportLink="https://community.trustwallet.com/c/helpcenter/8"
      />
    );
  }

  if (screen === "open-wc-uri") {
    return (
      <WCOpenURI
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        onConnected={close}
        walletConfig={walletConfig}
        appUriPrefix={{
          ios: "trust://",
          android: "https://link.trustwallet.com/",
          other: "https://link.trustwallet.com/",
        }}
        supportLink="https://support.trustwallet.com/en/support/home"
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
        onBack={() => {
          setScreen("scanning");
        }}
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
