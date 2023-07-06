import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { WalletConnect } from "@thirdweb-dev/wallets";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { RainbowScan } from "./RainbowScan";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";

export const RainbowConnectUI = (props: ConnectUIProps<WalletConnect>) => {
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

    // if loading
    (async () => {
      // on mobile, open rainbow app link
      if (isMobile()) {
        setScreen("open-wc-uri");
      } else {
        // on desktop, show the rainbow scan qr code
        setScreen("scanning");
      }
    })();
  }, [walletConfig, close, connect, goBack]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        onBack={props.goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
        supportLink="https://rainbow.me/"
      />
    );
  }

  if (screen === "open-wc-uri") {
    return (
      <WCOpenURI
        onBack={props.goBack}
        onConnected={close}
        walletConfig={walletConfig}
        supportLink="https://rainbow.me/"
        appUriPrefix={{
          ios: "rainbow://",
          android: "https://rnbwapp.com/",
          other: "https://rnbwapp.com/",
        }}
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
      <RainbowScan
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
