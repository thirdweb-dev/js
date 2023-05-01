import { ScanScreen } from "../ScanScreen";
import {
  useCreateWalletInstance,
  useSupportedWallet,
  useThirdwebWallet,
  Wallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

import type { MetaMaskWallet } from "@thirdweb-dev/wallets";

export const ScanMetamask: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
}> = (props) => {
  const metamaskWallet = useSupportedWallet("metamask") as Wallet;
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const twWalletContext = useThirdwebWallet();
  const { onConnected } = props;

  useEffect(() => {
    const metamask = createInstance(metamaskWallet) as MetaMaskWallet;

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
  }, [createInstance, twWalletContext, onConnected, metamaskWallet]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={metamaskWallet.meta.name}
      walletIconURL={metamaskWallet.meta.iconURL}
    />
  );
};
