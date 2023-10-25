import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { RainbowScan } from "./RainbowScan";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { RainbowWallet } from "@thirdweb-dev/wallets";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";
import { wait } from "../../../utils/wait";
import { rainbowWalletUris } from "./rainbowWalletUris";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const RainbowConnectUI = (props: ConnectUIProps<RainbowWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");
  const { walletConfig, connected } = props;
  const connect = useConnect();
  const [errorConnecting, setErrorConnecting] = useState(false);
  const locale = useTWLocale().wallets.rainbowWallet;

  const connectingLocale = {
    getStartedLink: locale.getStartedLink,
    instruction: locale.connecting.instruction,
    tryAgain: locale.connecting.tryAgain,
    inProgress: locale.connecting.inProgress,
    failed: locale.connecting.failed,
  };

  const hideBackButton = props.supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
    try {
      setErrorConnecting(false);
      connectPrompted.current = true;
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
  }, [connectToExtension, walletConfig]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        locale={connectingLocale}
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

  if (screen === "open-wc-uri") {
    return (
      <WCOpenURI
        locale={connectingLocale}
        onRetry={() => {
          // NOOP - TODO make onRetry optional
        }}
        errorConnecting={errorConnecting}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        onConnected={connected}
        walletConfig={walletConfig}
        appUriPrefix={rainbowWalletUris}
      />
    );
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={{
          scanToDownload: locale.getStarted.scanToDownload,
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
      <RainbowScan
        onBack={props.goBack}
        onConnected={connected}
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
