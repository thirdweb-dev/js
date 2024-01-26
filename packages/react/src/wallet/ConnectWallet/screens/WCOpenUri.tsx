import { useWalletContext } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import type { WalletConnect } from "@thirdweb-dev/wallets";
import type {
  ConnectUIProps,
  WalletConfig,
  WalletInstance,
} from "@thirdweb-dev/react-core";
import { isAndroid, isIOS } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "./ConnectingScreen";
import { openWindow } from "../../utils/openWindow";

export const WCOpenURI: React.FC<{
  onBack: () => void;
  onConnected: () => void;
  createWalletInstance: () => WalletInstance;
  setConnectedWallet: ConnectUIProps<WalletInstance>["setConnectedWallet"];
  setConnectionStatus: ConnectUIProps<WalletInstance>["setConnectionStatus"];
  appUriPrefix: {
    ios: string;
    android: string;
    other: string;
  };
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
  meta: WalletConfig["meta"];
}> = (props) => {
  const {
    createWalletInstance,
    setConnectionStatus,
    setConnectedWallet,
    onBack,
    onConnected,
    appUriPrefix,
    onRetry,
    errorConnecting,
    hideBackButton,
    onGetStarted,
    locale,
    meta,
  } = props;

  const { chainToConnect } = useWalletContext();

  const connectStarted = useRef(false);
  useEffect(() => {
    if (connectStarted.current) {
      return;
    }
    connectStarted.current = true;

    const wallet = createWalletInstance() as WalletConnect;

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
    setConnectedWallet,
    chainToConnect,
    onConnected,
    setConnectionStatus,
    appUriPrefix,
    createWalletInstance,
  ]);

  return (
    <ConnectingScreen
      locale={locale}
      hideBackButton={hideBackButton}
      onBack={onBack}
      walletName={meta.name}
      walletIconURL={meta.iconURL}
      errorConnecting={errorConnecting}
      onRetry={onRetry}
      onGetStarted={onGetStarted}
    />
  );
};
