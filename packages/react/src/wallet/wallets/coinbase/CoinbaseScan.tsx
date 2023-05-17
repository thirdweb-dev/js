import type { CoinbaseWallet } from "@thirdweb-dev/wallets";
import {
  WalletConfig,
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";

export const CoinbaseScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<CoinbaseWallet>;
  hideBackButton?: boolean;
  autoSwitch?: boolean;
}> = ({
  walletConfig,
  onConnected,
  onGetStarted,
  onBack,
  hideBackButton,
  autoSwitch,
}) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const { setConnectedWallet, setConnectionStatus, activeChain } =
    useWalletContext();

  const scanStarted = useRef(false);

  useEffect(() => {
    if (scanStarted.current) {
      return;
    }

    scanStarted.current = true;

    (async () => {
      const wallet = createInstance(walletConfig) as InstanceType<
        typeof CoinbaseWallet
      >;

      const uri = await wallet.getQrUrl();
      setQrCodeUri(uri || undefined);

      setConnectionStatus("connecting");
      try {
        const connectParams = {
          chainId: autoSwitch ? activeChain?.chainId : undefined,
        };
        await wallet.connect(connectParams);
        setConnectedWallet(wallet, connectParams);
        onConnected();
      } catch {
        setConnectionStatus("disconnected");
      }
    })();
  }, [
    createInstance,
    onConnected,
    walletConfig,
    setConnectedWallet,
    setConnectionStatus,
    autoSwitch,
    activeChain?.chainId,
  ]);

  return (
    <ScanScreen
      onBack={onBack}
      onGetStarted={onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={walletConfig.meta.name}
      walletIconURL={walletConfig.meta.iconURL}
      hideBackButton={hideBackButton}
    />
  );
};
