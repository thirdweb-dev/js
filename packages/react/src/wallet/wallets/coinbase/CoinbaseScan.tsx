import type { CoinbaseWallet } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  WalletConfig,
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const CoinbaseScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<CoinbaseWallet>;
  hideBackButton: boolean;
  setConnectedWallet: ConnectUIProps<CoinbaseWallet>["setConnectedWallet"];
  setConnectionStatus: ConnectUIProps<CoinbaseWallet>["setConnectionStatus"];
}> = ({
  walletConfig,
  onConnected,
  onGetStarted,
  onBack,
  hideBackButton,
  setConnectionStatus,
  setConnectedWallet,
}) => {
  const locale = useTWLocale().wallets.coinbaseWallet;
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const { chainToConnect } = useWalletContext();

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
        await wallet.connect({
          chainId: chainToConnect?.chainId,
        });

        setConnectedWallet(wallet);
        onConnected();
      } catch {
        setConnectionStatus("disconnected");
      }
    })();
  }, [
    createInstance,
    onConnected,
    walletConfig,
    chainToConnect?.chainId,
    setConnectedWallet,
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
