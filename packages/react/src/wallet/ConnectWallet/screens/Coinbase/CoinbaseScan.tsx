import { ScanScreen } from "../ScanScreen";
import { CoinbaseWallet } from "@thirdweb-dev/wallets";
import {
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { useWalletInfo } from "../../walletInfo";

export const ScanCoinbase: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
}> = (props) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const twWalletContext = useThirdwebWallet();
  const { onConnected } = props;
  const coinbaseWalletInfo = useWalletInfo("coinbase", true);
  const cbWalletObj = coinbaseWalletInfo?.wallet;
  const { name, iconURL } = cbWalletObj.meta;

  useEffect(() => {
    (async () => {
      const wallet = createInstance(cbWalletObj) as InstanceType<
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
  }, [createInstance, twWalletContext, onConnected, cbWalletObj]);

  return (
    <ScanScreen
      onBack={props.onBack}
      onGetStarted={props.onGetStarted}
      qrCodeUri={qrCodeUri}
      walletName={name}
      walletIconURL={iconURL}
    />
  );
};
