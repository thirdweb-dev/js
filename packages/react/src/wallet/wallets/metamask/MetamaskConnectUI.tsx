import {
  ConfiguredWallet,
  ConnectUIProps,
  useConnect,
} from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useEffect, useRef, useState } from "react";
import { MetamaskScan } from "./MetamaskScan";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";

type MetamaskConnectUIProps = ConnectUIProps & {
  configuredWallet: ConfiguredWallet;
};

export const MetamaskConnectUI = (props: MetamaskConnectUIProps) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started"
  >("connecting");
  const { configuredWallet, close } = props;
  const connect = useConnect();

  const { goBack } = props;

  const connectPrompted = useRef(false);
  useEffect(() => {
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
        }
      }

      // if metamask is not injected
      else {
        // on mobile, open metamask app link
        if (isMobile()) {
          window.open(
            `https://metamask.app.link/dapp/${window.location.toString()}`,
          );
        } else {
          // on desktop, show the metamask scan qr code
          setScreen("scanning");
        }
      }
    })();
  }, [configuredWallet, close, connect, goBack]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        onBack={props.goBack}
        walletName={configuredWallet.meta.name}
        walletIconURL={configuredWallet.meta.iconURL}
        supportLink="https://support.metamask.io/hc/en-us/articles/4406430256539-User-Guide-Troubleshooting"
      />
    );
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        walletIconURL={configuredWallet.meta.iconURL}
        walletName={configuredWallet.meta.name}
        chromeExtensionLink={configuredWallet.meta.urls?.chrome}
        googlePlayStoreLink={configuredWallet.meta.urls?.android}
        appleStoreLink={configuredWallet.meta.urls?.ios}
        onBack={props.goBack}
      />
    );
  }

  if (screen === "scanning") {
    return (
      <MetamaskScan
        onBack={props.goBack}
        onConnected={close}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        configuredWallet={configuredWallet}
      />
    );
  }

  return null;
};
