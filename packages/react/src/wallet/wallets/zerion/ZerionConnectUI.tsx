import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ZerionWallet } from "@thirdweb-dev/wallets";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { ZerionScan } from "./ZerionScan";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";

export const ZerionConnectUI = (props: ConnectUIProps<ZerionWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");
  const { walletConfig, close } = props;
  const connect = useConnect();

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
  }, [walletConfig, close, connect, goBack]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        onBack={props.goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
        supportLink="https://help.zerion.io/en/"
      />
    );
  }

  if (screen === "open-wc-uri") {
    return (
      <WCOpenURI
        onBack={props.goBack}
        onConnected={close}
        walletConfig={walletConfig}
        appUriPrefix={{
          ios: "zerion://",
          android: "https://link.zerion.io/pt3gdRP0njb/",
          other: "https://link.zerion.io/pt3gdRP0njb/",
        }}
        supportLink="https://help.zerion.io/en/"
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
      <ZerionScan
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
