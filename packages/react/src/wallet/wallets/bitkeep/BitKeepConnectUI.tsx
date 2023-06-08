import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useEffect, useRef, useState } from "react";
import { BitKeepScan } from "./BitKeepScan";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { BitKeepWallet } from "@thirdweb-dev/wallets";

export const BitKeepConnectUI = (props: ConnectUIProps<BitKeepWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started"
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

      // if bitkeep is not injected
      else {
        // on mobile, open bitkeep app link
        if (isMobile()) {
          window.open(
            `https://bitkeep.com/en/download?type=0`,
          );
        } else {
          // on desktop, show the bitkeep scan qr code
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
        supportLink="https://bitkeep.com"
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
      <BitKeepScan
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
