import { ScanScreen } from "../ScanScreen";
import type { CoinbaseWallet } from "@thirdweb-dev/wallets";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
  Wallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { useSupportedWallet } from "../useSupportedWallet";

export const ScanCoinbase: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
}> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const twWalletContext = useThirdwebWallet();
  const { onConnected } = props;
  const coinbaseWalletObj = useSupportedWallet("coinbaseWallet") as Wallet;

  useEffect(() => {
    if (!twWalletContext) {
      return;
    }

    (async () => {
      const wallet = createInstance(coinbaseWalletObj) as InstanceType<
        typeof CoinbaseWallet
      >;

      wallet.getQrUrl().then((uri) => {
        setQrCodeUri(uri || undefined);
      });

      wallet
        .connect({
          chainId: twWalletContext.chainToConnect?.chainId,
        })
        .then(() => {
          twWalletContext.handleWalletConnect(wallet);
          onConnected();
        });
    })();
  }, [createInstance, twWalletContext, onConnected, coinbaseWalletObj]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={coinbaseWalletObj.meta.name}
      walletIconURL={coinbaseWalletObj.meta.iconURL}
    />
  );
};
