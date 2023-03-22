import { CoinbaseWallet } from "../../../wallets";
import { ScanScreen } from "../ScanScreen";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

export const ScanCoinbase: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
}> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const twWalletContext = useThirdwebWallet();
  const { onConnected } = props;

  useEffect(() => {
    if (!twWalletContext) {
      return;
    }

    const coinbaseWallet = createInstance(CoinbaseWallet) as InstanceType<
      typeof CoinbaseWallet
    >;

    coinbaseWallet.getQrCode().then((uri) => {
      setQrCodeUri(uri || undefined);
    });

    coinbaseWallet
      .connect({
        chainId: twWalletContext.chainToConnect?.chainId,
      })
      .then(() => {
        twWalletContext.handleWalletConnect(coinbaseWallet);
        onConnected();
      });
  }, [createInstance, twWalletContext, onConnected]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName="Coinbase"
      walletIconURL={CoinbaseWallet.meta.iconURL}
    />
  );
};
