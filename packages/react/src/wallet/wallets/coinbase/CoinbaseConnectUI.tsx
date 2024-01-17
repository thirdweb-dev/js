import type { ConnectUIProps } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { CoinbaseScan } from "./CoinbaseScan";
import type { CoinbaseWallet } from "@thirdweb-dev/wallets";
import { wait } from "../../../utils/wait";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const CoinbaseConnectUI = ({
  walletConfig,
  connected,
  goBack,
  supportedWallets,
  setConnectedWallet,
  setConnectionStatus,
  connect,
}: ConnectUIProps<CoinbaseWallet>) => {
  const { meta } = walletConfig;
  const [screen, setScreen] = useState<
    "connecting" | "loading" | "scanning" | "get-started"
  >("loading");
  const locale = useTWLocale().wallets.coinbaseWallet;
  const [errorConnecting, setErrorConnecting] = useState(false);

  const hideBackButton = supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
    try {
      setErrorConnecting(false);
      connectPrompted.current = true;
      await wait(1000);
      setScreen("connecting");
      await connect();
      connected();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [connected, connect]);

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
          connect();
        } else {
          setScreen("scanning");
        }
      }
    })();
  }, [screen, walletConfig, connect, connectToExtension]);

  if (screen === "connecting" || screen === "loading") {
    return (
      <ConnectingScreen
        locale={{
          getStartedLink: locale.getStartedLink,
          instruction: locale.connectionScreen.instruction,
          tryAgain: locale.connectionScreen.retry,
          inProgress: locale.connectionScreen.inProgress,
          failed: locale.connectionScreen.failed,
        }}
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
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
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
        onConnected={connected}
        onGetStarted={() => setScreen("get-started")}
        walletConfig={walletConfig}
        hideBackButton={hideBackButton}
        setConnectedWallet={setConnectedWallet}
        setConnectionStatus={setConnectionStatus}
      />
    );
  }

  return null;
};
