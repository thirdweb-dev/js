import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { CoinbaseScan } from "./CoinbaseScan";
import type { CoinbaseWallet } from "@thirdweb-dev/wallets";

export const CoinbaseConnectUI = ({
  configuredWallet,
  close,
  goBack,
}: ConnectUIProps<CoinbaseWallet>) => {
  const connect = useConnect();
  const { meta } = configuredWallet;
  const [screen, setScreen] = useState<
    "connecting" | "loading" | "scanning" | "get-started"
  >("loading");

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (screen !== "loading") {
      return;
    }

    if (connectPrompted.current) {
      return;
    }

    const isInstalled = configuredWallet.isInstalled
      ? configuredWallet.isInstalled()
      : false;

    // if loading
    (async () => {
      if (isInstalled) {
        try {
          connectPrompted.current = true;
          setScreen("connecting");
          await connect(configuredWallet);
          close();
        } catch (e) {
          goBack();
          console.error(e);
        }
      }

      // if metamask is not injected
      else {
        if (isMobile()) {
          // coinbase will redirect to download page for coinbase wallet apps
          connect(configuredWallet);
        } else {
          setScreen("scanning");
        }
      }
    })();
  }, [screen, configuredWallet, close, connect, goBack]);

  if (screen === "connecting" || screen === "loading") {
    return (
      <ConnectingScreen
        onBack={goBack}
        walletName={meta.name}
        walletIconURL={meta.iconURL}
        supportLink="https://help.coinbase.com/en/wallet/other-topics/troubleshooting-and-tips"
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
        onBack={goBack}
      />
    );
  }

  if (screen === "scanning") {
    return (
      <CoinbaseScan
        onBack={goBack}
        onConnected={close}
        onGetStarted={() => setScreen("get-started")}
        configuredWallet={configuredWallet}
      />
    );
  }

  return null;
};
