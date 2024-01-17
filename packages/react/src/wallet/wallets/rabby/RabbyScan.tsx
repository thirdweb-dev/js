import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef, useState } from "react";
import type { RabbyWallet } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { useTWLocale } from "../../../evm/providers/locale-provider";

export const RabbyScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  walletConfig: WalletConfig<RabbyWallet>;
  hideBackButton: boolean;
  setConnectedWallet: ConnectUIProps<RabbyWallet>["setConnectedWallet"];
  setConnectionStatus: ConnectUIProps<RabbyWallet>["setConnectionStatus"];
}> = (props) => {
  const {
    onBack,
    onConnected,
    onGetStarted,
    walletConfig,
    hideBackButton,
    setConnectedWallet,
    setConnectionStatus,
  } = props;

  const locale = useTWLocale().wallets.rabbyWallet;
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const { chainToConnect } = useWalletContext();

  const scanStarted = useRef(false);
  useEffect(() => {
    if (scanStarted.current) {
      return;
    }
    scanStarted.current = true;

    const wallet = createInstance(walletConfig);

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
    createInstance,
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
