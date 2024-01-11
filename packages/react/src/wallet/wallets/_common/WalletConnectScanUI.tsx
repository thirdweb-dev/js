import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import { useWalletContext } from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type {
  ConnectionStatus,
  WalletConfig,
  WalletInstance,
} from "@thirdweb-dev/react-core";
import { WCConnectableWallet } from "./WCConnectableWallet";
import { ExtensionAndQRScreensLocale } from "../../../evm/locales/types";

export const WalletConnectScanUI: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  hideBackButton: boolean;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setConnectedWallet: (wallet: WalletInstance) => void;
  walletLocale: ExtensionAndQRScreensLocale;
  createWalletInstance: () => WCConnectableWallet;
  meta: WalletConfig["meta"];
}> = (props) => {
  const {
    onBack,
    onConnected,
    onGetStarted,
    hideBackButton,
    setConnectionStatus,
    setConnectedWallet,
    createWalletInstance,
  } = props;

  const locale = props.walletLocale;
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { chainToConnect } = useWalletContext();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const wallet = createWalletInstance();

    wallet.connectWithQrCode({
      chainId: chainToConnect?.chainId,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        setConnectionStatus("connecting");
        setConnectedWallet(wallet);
        onConnected();
      },
    });
  }, [
    createWalletInstance,
    setConnectedWallet,
    chainToConnect,
    onConnected,
    setConnectionStatus,
  ]);

  return (
    <ScanScreen
      qrScanInstruction={locale.scanScreen.instruction}
      onBack={onBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={props.meta.name}
      walletIconURL={props.meta.iconURL}
      hideBackButton={hideBackButton}
      getStartedLink={locale.getStartedLink}
    />
  );
};
