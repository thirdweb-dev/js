import {
  ConfiguredWallet,
  ConnectUIProps,
  useConnect,
} from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { CoinbaseScan } from "./CoinbaseScan";

type CoinbaseConnectUIProps = ConnectUIProps & {
  configuredWallet: ConfiguredWallet;
};

export const CoinbaseConnectUI = (props: CoinbaseConnectUIProps) => {
  const [screen, setScreen] = useState<
    "connecting" | "loading" | "scanning" | "get-started"
  >("loading");
  const { configuredWallet, done } = props;
  const connect = useConnect();
  const { meta } = configuredWallet;

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
          done();
        } catch (e) {
          done();
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
  }, [screen, configuredWallet, done, connect]);

  if (screen === "connecting" || screen === "loading") {
    return (
      <ConnectingScreen
        onBack={props.goBack}
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
        onBack={props.goBack}
      />
    );
  }

  if (screen === "scanning") {
    return (
      <CoinbaseScan
        onBack={props.goBack}
        onConnected={done}
        onGetStarted={() => setScreen("get-started")}
        configuredWallet={configuredWallet}
      />
    );
  }

  return null;
};
