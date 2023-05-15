import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type { MetaMaskWallet } from "@thirdweb-dev/wallets";
import type { WalletConfig } from "@thirdweb-dev/react-core";

export const MetamaskScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  metamaskWalletConf: WalletConfig<MetaMaskWallet>;
}> = ({
  onBack,
  onConnected,
  onGetStarted,
  metamaskWalletConf: configuredWallet,
}) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { setConnectedWallet, chainToConnect } = useWalletContext();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const metamask = createInstance(configuredWallet);

    metamask.connectWithQrCode({
      chainId: chainToConnect?.chainId,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        setConnectedWallet(metamask);
        onConnected();
      },
    });
  }, [
    createInstance,
    setConnectedWallet,
    chainToConnect,
    onConnected,
    configuredWallet,
  ]);

  return (
    <ScanScreen
      onBack={onBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={configuredWallet.meta.name}
      walletIconURL={configuredWallet.meta.iconURL}
    />
  );
};
