import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { PhantomWallet } from "@thirdweb-dev/wallets";

export const PhantomConnectUI = (props: ConnectUIProps<PhantomWallet>) => {
  const [screen, setScreen] = useState<"connecting" | "get-started">(
    "connecting",
  );
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

      // if phantom is not injected
      else {
        setScreen("get-started");
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
        supportLink="https://help.phantom.app"
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
