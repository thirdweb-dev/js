import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { MetamaskScan } from "./MetamaskScan";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { MetaMaskWallet } from "@thirdweb-dev/wallets";
import { wait } from "../../../utils/wait";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";
import { metamaskUris } from "./metamaskUris";

export const MetamaskConnectUI = (props: ConnectUIProps<MetaMaskWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");
  const { walletConfig, connected } = props;
  const connect = useConnect();
  const [errorConnecting, setErrorConnecting] = useState(false);

  const hideBackButton = props.supportedWallets.length === 1;

  const connectWallet = useCallback(() => {
    const _isInstalled = walletConfig.isInstalled
      ? walletConfig.isInstalled()
      : false;

    (async () => {
      if (_isInstalled) {
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
      }

      // if metamask is not injected
      else {
        // on mobile, open metamask app link
        if (isMobile()) {
          setScreen("open-wc-uri");
        } else {
          // on desktop, show the metamask scan qr code
          setScreen("scanning");
        }
      }
    })();
  }, [connect, connected, walletConfig]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }
    connectWallet();
  }, [connectWallet]);

  const handleGetStarted = () => {
    setScreen("get-started");
  };

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        errorConnecting={errorConnecting}
        onGetStarted={handleGetStarted}
        onRetry={connectWallet}
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
        errorConnecting={errorConnecting}
        onGetStarted={handleGetStarted}
        onRetry={connectWallet}
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        onConnected={connected}
        walletConfig={walletConfig}
        appUriPrefix={metamaskUris}
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
      <MetamaskScan
        onConnectFailed={() => {
          setErrorConnecting(true);
        }}
        onBack={props.goBack}
        onConnected={connected}
        onGetStarted={handleGetStarted}
        hideBackButton={hideBackButton}
        walletConfig={walletConfig}
      />
    );
  }

  return null;
};
