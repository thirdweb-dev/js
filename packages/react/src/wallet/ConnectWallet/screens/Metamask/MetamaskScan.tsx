import { MetamaskWallet } from "../../../wallets";
import { ScanScreen } from "../ScanScreen";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

export const ScanMetamask: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
}> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>();
  const twWalletContext = useThirdwebWallet();
  const { onConnected } = props;
  useEffect(() => {
    if (!twWalletContext) {
      return;
    }

    const metamask = createInstance(MetamaskWallet) as InstanceType<
      typeof MetamaskWallet
    >;

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
  }, [createInstance, twWalletContext, onConnected]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName="Metamask"
      walletIconURL={MetamaskWallet.meta.iconURL}
    />
  );
};
