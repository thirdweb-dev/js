import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";
import {
  useCreateWalletInstance,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

import { MetaMaskWallet } from "@thirdweb-dev/wallets";
import { ConfiguredWallet } from "@thirdweb-dev/react-core";

export const MetamaskScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  configuredWallet: ConfiguredWallet;
}> = ({ onBack, onConnected, onGetStarted, configuredWallet }) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const twWalletContext = useWalletContext();

  useEffect(() => {
    const metamask = createInstance(configuredWallet) as MetaMaskWallet;

    metamask.connectWithQrCode({
      chainId: twWalletContext.chainToConnect?.chainId,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        twWalletContext.handleWalletConnect(metamask);
        onConnected();
      },
    });
  }, [createInstance, twWalletContext, onConnected, configuredWallet]);

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
