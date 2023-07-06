import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import type { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import { isAndroid, isIOS } from "../../../evm/utils/isMobile";
import { ConnectingScreen } from "./ConnectingScreen";

export const WCOpenURI: React.FC<{
  onBack: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<any>;
  appUriPrepend: {
    ios: string;
    web: string;
  };
  supportLink: string;
}> = ({
  onBack,
  onConnected,
  walletConfig,
  appUriPrepend: appLink,
  supportLink,
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
          window.open(uri, "_blank");
        } else if (isIOS()) {
          window.open(
            `${appLink.ios}://wc?uri=${encodeURIComponent(uri)}`,
            "_blank",
          );
        } else {
          window.open(
            `https://${appLink.web}/wc?uri=${encodeURIComponent(uri)}`,
            "_blank",
          );
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
    appLink,
  ]);

  return (
    <ConnectingScreen
      onBack={onBack}
      walletName={walletConfig.meta.name}
      walletIconURL={walletConfig.meta.iconURL}
      supportLink={supportLink}
    />
  );
};
