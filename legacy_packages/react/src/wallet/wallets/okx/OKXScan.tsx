import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import { useWalletContext } from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type { OKXWallet } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const OKXScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<OKXWallet>;
  hideBackButton: boolean;
  createWalletInstance: () => OKXWallet;
  setConnectedWallet: ConnectUIProps<OKXWallet>["setConnectedWallet"];
  setConnectionStatus: ConnectUIProps<OKXWallet>["setConnectionStatus"];
}> = (props) => {
  const {
    onBack,
    onConnected,
    onGetStarted,
    walletConfig,
    hideBackButton,
    setConnectedWallet,
    setConnectionStatus,
    createWalletInstance,
  } = props;
  const locale = useTWLocale().wallets.okxWallet;
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { chainToConnect } = useWalletContext();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const wallet = createWalletInstance();

    setConnectionStatus("connecting");
    wallet.connectWithQrCode({
      chainId: chainToConnect?.chainId,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        setConnectedWallet(wallet);
        onConnected();
      },
    });
  }, [
    createWalletInstance,
    setConnectedWallet,
    chainToConnect,
    onConnected,
    walletConfig,
    setConnectionStatus,
  ]);

  return (
    <ScanScreen
      qrScanInstruction={locale.scanScreen.instruction}
      onBack={onBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={walletConfig.meta.name}
      walletIconURL={walletConfig.meta.iconURL}
      hideBackButton={hideBackButton}
      getStartedLink={locale.getStartedLink}
    />
  );
};
