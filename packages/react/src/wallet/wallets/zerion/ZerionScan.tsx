import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type { ZerionWallet } from "@thirdweb-dev/wallets";
import type { WalletConfig } from "@thirdweb-dev/react-core";

export const ZerionScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<ZerionWallet>;
}> = ({ onBack, onConnected, onGetStarted, walletConfig }) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { setConnectedWallet, chainToConnect, setConnectionStatus } =
    useWalletContext();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const zerion = createInstance(walletConfig);

    setConnectionStatus("connecting");
    zerion.connectWithQrCode({
      chainId: chainToConnect?.chainId,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        setConnectedWallet(zerion);
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
  ]);

  return (
    <ScanScreen
      onBack={onBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={walletConfig.meta.name}
      walletIconURL={walletConfig.meta.iconURL}
    />
  );
};
