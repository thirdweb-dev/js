import { ScanScreen } from "../ScanScreen";
import { CoinbaseWallet, walletIds } from "@thirdweb-dev/wallets";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { WalletInfo } from "../../../types";

export const ScanCoinbase: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  walletsInfo: WalletInfo[];
}> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const twWalletContext = useThirdwebWallet();
  const { onConnected } = props;
  const coinbaseWalletInfo = props.walletsInfo.find(
    (w) => w.wallet.id === walletIds.coinbase,
  ) as WalletInfo;

  useEffect(() => {
    (async () => {
      const wallet = createInstance(coinbaseWalletInfo.wallet) as InstanceType<
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
  }, [createInstance, twWalletContext, onConnected, coinbaseWalletInfo]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={coinbaseWalletInfo.wallet.meta.name}
      walletIconURL={coinbaseWalletInfo.wallet.meta.iconURL}
    />
  );
};
