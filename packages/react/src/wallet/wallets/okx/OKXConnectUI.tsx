import { ConnectUIProps } from "@thirdweb-dev/react-core";
import type { OKXWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { isMobile } from "../../../evm/utils/isMobile";
import { wait } from "../../../utils/wait";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { OKXScan } from "./OKXScan";

export const OKXConnectUI = (props: ConnectUIProps<OKXWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started"
  >("connecting");
  const locale = useTWLocale().wallets.okxWallet;
  const { walletConfig, connected, connect } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);

  const hideBackButton = props.supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setErrorConnecting(false);
      setScreen("connecting");
      await wait(1000);
      await connect();
      connected();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [connected, connect]);

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
        locale={{
          getStartedLink: locale.getStartedLink,
          instruction: locale.connectionScreen.instruction,
          tryAgain: locale.connectionScreen.retry,
          inProgress: locale.connectionScreen.inProgress,
          failed: locale.connectionScreen.failed,
        }}
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
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
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
        createWalletInstance={props.createWalletInstance}
        setConnectedWallet={props.setConnectedWallet}
        setConnectionStatus={props.setConnectionStatus}
      />
    );
  }

  return null;
};
