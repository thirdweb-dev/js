import { CoinbaseWallet } from "@thirdweb-dev/wallets";
import {
  ConfiguredWallet,
  useCreateWalletInstance,
  useThirdwebWallet,
} from "@thirdweb-dev/react-core";
import { useEffect, useState } from "react";
import { ScanScreen } from "../../ConnectWallet/screens/ScanScreen";

export const CoinbaseScan: React.FC<{
  onBack: () => void;
  onGetStarted: () => void;
  onConnected: () => void;
  configuredWallet: ConfiguredWallet;
}> = ({ configuredWallet, onConnected, onGetStarted, onBack }) => {
  const createInstance = useCreateWalletInstance();
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const twWalletContext = useThirdwebWallet();

  useEffect(() => {
    (async () => {
      const wallet = createInstance(configuredWallet) as InstanceType<
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
