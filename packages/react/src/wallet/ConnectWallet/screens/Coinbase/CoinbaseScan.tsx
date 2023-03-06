import { CoinbaseWallet } from "../../../wallets";
import { CoinbaseWalletIcon } from "../../icons/CoinbaseWalletIcon";
import { ScanScreen } from "../ScanScreen";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";

export const ScanCoinbase: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
}> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const twWalletContext = useThirdwebWallet();

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
        chainId: twWalletContext.chainIdToConnect || 1,
      })
      .then(() => {
        twWalletContext.handleWalletConnect(coinbaseWallet);
      });
  }, [createInstance, twWalletContext]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName="Coinbase"
      WalletIcon={CoinbaseWalletIcon}
    />
  );
};
