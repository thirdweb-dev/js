import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { OKXScan } from "./OKXScan";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import type { OKXWallet } from "@thirdweb-dev/wallets";
import { wait } from "../../../utils/wait";

export const OKXConnectUI = (props: ConnectUIProps<OKXWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started"
  >("connecting");
  const { walletConfig, connected } = props;
  const connect = useConnect();
  const [errorConnecting, setErrorConnecting] = useState(false);

  const hideBackButton = props.supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      setScreen("connecting");
      await wait(1000);
      await connect(walletConfig);
      connected();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [connected, connect, walletConfig]);

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

      // if wallet is not injected
      else {
        // on mobile, deep link to the okx app
        if (isMobile()) {
          window.open(
            `okx://wallet/dapp/details?dappUrl=${window.location.toString()}`,
          );
        } else {
          // on desktop, show the OKX scan qr code
          setScreen("scanning");
        }
      }
    })();
  }, [connectToExtension, walletConfig]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        errorConnecting={errorConnecting}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onRetry={connectToExtension}
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
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
      <OKXScan
        onBack={props.goBack}
        onConnected={props.connected}
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
