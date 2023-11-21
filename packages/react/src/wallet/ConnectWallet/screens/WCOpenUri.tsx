import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import type { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { isAndroid, isIOS } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "./ConnectingScreen";
import { openWindow } from "../../utils/openWindow";

export const WCOpenURI: React.FC<{
  onBack: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<any>;
  appUriPrefix: {
    ios: string;
    android: string;
    other: string;
  };
  // supportLink: string;
  errorConnecting: boolean;
  onRetry: () => void;
  hideBackButton: boolean;
  onGetStarted: () => void;
  locale: {
    getStartedLink: string;
    tryAgain: string;
    instruction: string;
    failed: string;
    inProgress: string;
  };
}> = ({
  onBack,
  onConnected,
  walletConfig,
  appUriPrefix,
  onRetry,
  errorConnecting,
  hideBackButton,
  onGetStarted,
  locale,
}) => {
  const createInstance = useCreateWalletInstance();
  const { setConnectedWallet, chainToConnect, setConnectionStatus } =
    useWalletContext();

  const connectStarted = useRef(false);
  useEffect(() => {
    if (connectStarted.current) {
      return;
    }
    connectStarted.current = true;

    const wallet = createInstance(walletConfig) as WalletConnect;

    setConnectionStatus("connecting");
    wallet.connectWithQrCode({
      chainId: chainToConnect?.chainId,
      onQrCodeUri(uri) {
        if (isAndroid()) {
          openWindow(
            `${appUriPrefix.android}wc?uri=${encodeURIComponent(uri)}`,
          );
        } else if (isIOS()) {
          openWindow(`${appUriPrefix.ios}wc?uri=${encodeURIComponent(uri)}`);
        } else {
          openWindow(`${appUriPrefix.other}wc?uri=${encodeURIComponent(uri)}`);
        }
      },
      onConnected() {
        setConnectedWallet(wallet);
        onConnected();
      },
    });
  }, [
    createInstance,
    setConnectedWallet,
    chainToConnect,
    onConnected,
    walletConfig,
    setConnectionStatus,
    appUriPrefix,
  ]);

  return (
    <ConnectingScreen
      locale={locale}
      hideBackButton={hideBackButton}
      onBack={onBack}
      walletName={walletConfig.meta.name}
      walletIconURL={walletConfig.meta.iconURL}
      errorConnecting={errorConnecting}
      onRetry={onRetry}
      onGetStarted={onGetStarted}
    />
  );
};
