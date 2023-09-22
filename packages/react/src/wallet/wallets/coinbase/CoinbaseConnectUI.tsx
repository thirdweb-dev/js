import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { CoinbaseScan } from "./CoinbaseScan";
import type { CoinbaseWallet } from "@thirdweb-dev/wallets";
import { wait } from "../../../utils/wait";

export const CoinbaseConnectUI = ({
  walletConfig,
  connected,
  goBack,
  supportedWallets,
}: ConnectUIProps<CoinbaseWallet>) => {
  const connect = useConnect();
  const { meta } = walletConfig;
  const [screen, setScreen] = useState<
    "connecting" | "loading" | "scanning" | "get-started"
  >("loading");
  const [errorConnecting, setErrorConnecting] = useState(false);

  const hideBackButton = supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
    try {
      setErrorConnecting(false);
      connectPrompted.current = true;
      await wait(1000);
      setScreen("connecting");
      await connect(walletConfig);
      connected();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [connected, connect, walletConfig]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (screen !== "loading") {
      return;
    }

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

      // if metamask is not injected
      else {
        if (isMobile()) {
          // coinbase will redirect to download page for coinbase wallet apps
          connect(walletConfig);
        } else {
          setScreen("scanning");
        }
      }
    })();
  }, [screen, walletConfig, connect, connectToExtension]);

  if (screen === "connecting" || screen === "loading") {
    return (
      <ConnectingScreen
        errorConnecting={errorConnecting}
        onGetStarted={() => setScreen("get-started")}
        onRetry={connectToExtension}
        hideBackButton={hideBackButton}
        onBack={goBack}
        walletName={meta.name}
        walletIconURL={meta.iconURL}
      />
    );
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        walletIconURL={meta.iconURL}
        walletName={meta.name}
        chromeExtensionLink={meta.urls?.chrome}
        googlePlayStoreLink={meta.urls?.android}
        appleStoreLink={meta.urls?.ios}
        onBack={() => {
          goBack();
        }}
      />
    );
  }

  if (screen === "scanning") {
    return (
      <CoinbaseScan
        onBack={goBack}
        onConnected={close}
        onGetStarted={() => setScreen("get-started")}
        walletConfig={walletConfig}
        hideBackButton={hideBackButton}
      />
    );
  }

  return null;
};
