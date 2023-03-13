import { MetamaskWallet } from "../../../wallets";
import { MetamaskIcon } from "../../icons/MetamaskIcon";
import { ScanScreen } from "../ScanScreen";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

export const ScanMetamask: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
}> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const twWalletContext = useThirdwebWallet();

  useEffect(() => {
    if (!twWalletContext) {
      return;
    }

    const metamask = createInstance(MetamaskWallet) as InstanceType<
      typeof MetamaskWallet
    >;

    metamask.connectWithQrCode({
      chainId: twWalletContext.chainIdToConnect || 1,
      onQrCodeUri(uri) {
        setQrCodeUri(uri);
      },
      onConnected() {
        twWalletContext.handleWalletConnect(metamask);
      },
    });
  }, [createInstance, twWalletContext]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName="Metamask"
      WalletIcon={MetamaskIcon}
    />
  );
};
