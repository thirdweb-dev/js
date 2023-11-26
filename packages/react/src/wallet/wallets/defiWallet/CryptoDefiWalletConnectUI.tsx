import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useCallback, useEffect, useRef, useState } from "react";
import { CryptoDefiWalletScan } from "./CryptoDefiWalletScan";
import { GetStartedScreen } from "../../ConnectWallet/screens/GetStartedScreen";
import type { CryptoDefiWallet } from "@thirdweb-dev/wallets";
import { wait } from "../../../utils/wait";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { WCOpenURI } from "../../ConnectWallet/screens/WCOpenUri";
import { cryptoDefiWalletUris } from "./cryptoDefiWalletUris";

export const CryptoDefiWalletConnectUI = (
  props: ConnectUIProps<CryptoDefiWallet>,
) => {
  const [screen, setScreen] = useState<
    "connecting" | "scanning" | "get-started" | "open-wc-uri"
  >("connecting");
  const locale = useTWLocale().wallets.cryptoDefiWallet;
  const connectingLocale = {
    getStartedLink: locale.getStartedLink,
    instruction: locale.connectionScreen.instruction,
    tryAgain: locale.connectionScreen.retry,
    inProgress: locale.connectionScreen.inProgress,
    failed: locale.connectionScreen.failed,
  };
  const { walletConfig, connected } = props;
  const connect = useConnect();
  const [errorConnecting, setErrorConnecting] = useState(false);

  const hideBackButton = props.supportedWallets.length === 1;

  const connectToExtension = useCallback(async () => {
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

      // if wallet is not injected
      else {
        // on mobile, open the Defi Mobile via wallet connect
        if (isMobile()) {
          setScreen("open-wc-uri");
        } else {
          // on desktop, show the Defi app scan qr code
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
        appUriPrefix={cryptoDefiWalletUris}
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
      <CryptoDefiWalletScan
        onBack={props.goBack}
        onConnected={props.connected}
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
