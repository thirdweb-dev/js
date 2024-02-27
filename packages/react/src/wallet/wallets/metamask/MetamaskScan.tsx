import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import { useWalletContext } from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type { MetaMaskWallet } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const MetamaskScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<MetaMaskWallet>;
  hideBackButton: boolean;
  setConnectedWallet: ConnectUIProps<MetaMaskWallet>["setConnectedWallet"];
  setConnectionStatus: ConnectUIProps<MetaMaskWallet>["setConnectionStatus"];
  createWalletInstance: () => MetaMaskWallet;
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
  const locale = useTWLocale().wallets.metamaskWallet;

  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();

  const { chainToConnect } = useWalletContext();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const metamask = createWalletInstance();

    metamask.connectWithQrCode({
      chainId: chainToConnect?.chainId,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        setConnectionStatus("connecting");
        setConnectedWallet(metamask);
        onConnected();
      },
    });
  }, [
    setConnectedWallet,
    chainToConnect,
    onConnected,
    walletConfig,
    setConnectionStatus,
    createWalletInstance,
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
