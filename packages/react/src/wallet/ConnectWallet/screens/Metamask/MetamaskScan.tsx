import { ScanScreen } from "../ScanScreen";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

import { MetaMaskWallet } from "@thirdweb-dev/wallets";
import { useWalletInfo } from "../../walletInfo";

export const ScanMetamask: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
}> = (props) => {
  const metamaskInfo = useWalletInfo("metamask", true);
  const { wallet } = metamaskInfo;

  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const twWalletContext = useThirdwebWallet();
  const { onConnected } = props;

  useEffect(() => {
    const metamask = createInstance(wallet) as MetaMaskWallet;

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
  }, [createInstance, twWalletContext, onConnected, wallet]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={wallet.meta.name}
      walletIconURL={wallet.meta.iconURL}
    />
  );
};
