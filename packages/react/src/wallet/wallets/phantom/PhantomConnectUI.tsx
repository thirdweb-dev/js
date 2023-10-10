import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { PhantomWallet } from "@thirdweb-dev/wallets";
import { wait } from "../../../utils/wait";

export const PhantomConnectUI = (props: ConnectUIProps<PhantomWallet>) => {
  const [screen, setScreen] = useState<"connecting" | "get-started">(
    "connecting",
  );
  const { walletConfig, connected } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);
  const connect = useConnect();

  const hideBackButton = props.supportedWallets.length === 1;
  const { goBack } = props;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setScreen("connecting");
      setErrorConnecting(false);
      await wait(1000);
      await connect(walletConfig);
      connected();
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [walletConfig, connected, connect]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    const isInstalled = walletConfig.isInstalled
      ? walletConfig.isInstalled()
      : false;

    (async () => {
      if (isInstalled) {
        connectToExtension();
      }

      // if phantom is not injected
      else {
        setScreen("get-started");
      }
    })();
  }, [walletConfig, connected, connect, goBack, connectToExtension]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        hideBackButton={hideBackButton}
        onBack={props.goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        onRetry={() => {
          connectToExtension();
        }}
        errorConnecting={errorConnecting}
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
          props.goBack();
        }}
      />
    );
  }

  return null;
};
