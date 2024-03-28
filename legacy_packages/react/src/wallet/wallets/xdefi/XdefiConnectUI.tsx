import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { useCallback, useEffect, useRef, useState } from "react";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import { XDEFIWallet } from "@thirdweb-dev/wallets";
import { wait } from "../../../utils/wait";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const XDefiConnectUI = (props: ConnectUIProps<XDEFIWallet>) => {
  const [screen, setScreen] = useState<"connecting" | "get-started">(
    "connecting",
  );
  const locale = useTWLocale().wallets.xdefiWallet;
  const { walletConfig, connected } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);
  const { connect } = props;

  const hideBackButton = props.supportedWallets.length === 1;
  const { goBack } = props;

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setScreen("connecting");
      setErrorConnecting(false);
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

    (async () => {
      if (isInstalled) {
        connectToExtension();
      }

      // if xdefi is not injected
      else {
        setScreen("get-started");
      }
    })();
  }, [walletConfig, connected, connect, goBack, connectToExtension]);

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
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
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
