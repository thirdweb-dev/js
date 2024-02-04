import { useCallback, useEffect, useRef, useState } from "react";
import { useTWLocale } from "../../providers/locale-provider.js";
import type { ConnectUIProps } from "../../types/wallets.js";
import { ConnectingScreen } from "../../ui/ConnectWallet/screens/ConnectingScreen.js";
import { GetStartedScreen } from "../../ui/ConnectWallet/screens/GetStartedScreen.js";
import { wait } from "../../utils/wait.js";

/**
 * @internal
 */
export const InjectedConnectUI = (
  props: ConnectUIProps & {
    links: {
      extension?: string;
      android?: string;
      ios?: string;
    };
  },
) => {
  const [screen, setScreen] = useState<"connecting" | "get-started">(
    "connecting",
  );
  const locale = useTWLocale().wallets.injectedWallet(
    props.walletConfig.metadata.name,
  );

  const { walletConfig, done, screenConfig } = props;
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connectToExtension = useCallback(async () => {
    try {
      connectPrompted.current = true;
      setScreen("connecting");
      setErrorConnecting(false);
      await wait(1000);
      const wallet = walletConfig.create();
      await wallet.connect();
      done(wallet);
    } catch (e) {
      setErrorConnecting(true);
      console.error(e);
    }
  }, [walletConfig, done]);

  const connectPrompted = useRef(false);
  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    const isInjected = walletConfig.isInstalled?.() || false;

    (async () => {
      if (isInjected) {
        connectToExtension();
      } else {
        setScreen("get-started");
      }
    })();
  }, [walletConfig, connectToExtension]);

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
        onBack={screenConfig.goBack}
        walletName={walletConfig.metadata.name}
        walletIconURL={walletConfig.metadata.iconUrl}
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
        walletIconURL={walletConfig.metadata.iconUrl}
        walletName={walletConfig.metadata.name}
        chromeExtensionLink={props.links.extension}
        googlePlayStoreLink={props.links.android}
        appleStoreLink={props.links.ios}
        onBack={() => {
          setScreen("connecting");
        }}
      />
    );
  }

  return null;
};
