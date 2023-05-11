import {
  ConfiguredWallet,
  ConnectUIProps,
  useConnect,
} from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";

type FrameConnectUIProps = ConnectUIProps & {
  configuredWallet: ConfiguredWallet;
};

export const FrameConnectUI = (props: FrameConnectUIProps) => {
  const [screen, setScreen] = useState<"connecting" | "get-started">(
    "connecting",
  );
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
      // if injected or not mobile we connect
      if (isInstalled || !isMobile) {
        try {
          connectPrompted.current = true;
          setScreen("connecting");
          await connect(configuredWallet);
          close();
        } catch (e) {
          goBack();
        }
      }

      // on mobile we open the website
      else if (isMobile()) {
        window.open("https://frame.sh");
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

  return null;
};
