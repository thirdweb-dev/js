import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useEffect, useRef, useState } from "react";
import { RainbowScan } from "./RainbowScan";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { RainbowWallet } from "@thirdweb-dev/wallets";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";
import { rainbowWalletUris } from "./rainbowWalletUris";

export const RainbowConnectUI = (props: ConnectUIProps<RainbowWallet>) => {
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

      // if rainbow is not injected
      else {
        // on mobile, open rainbow app link
        if (isMobile()) {
          setScreen("open-wc-uri");
        } else {
          // on desktop, show the rainbow scan qr code
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
        supportLink="https://support.rainbow.io/hc/en-us/articles/4406430256539-User-Guide-Troubleshooting"
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
        supportLink="https://support.rainbow.io/hc/en-us/articles/4406430256539-User-Guide-Troubleshooting"
        appUriPrefix={rainbowWalletUris}
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
      <RainbowScan
        onBack={goBack}
        onConnected={close}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        hideBackButton={hideBackButton}
        walletConfig={walletConfig}
      />
    );
  }

  return null;
};
