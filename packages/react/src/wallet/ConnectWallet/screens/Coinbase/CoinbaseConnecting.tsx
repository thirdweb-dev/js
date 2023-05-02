import { walletIds } from "@thirdweb-dev/wallets";
import { WalletInfo } from "../../../types";
import { ConnectingScreen } from "../ConnectingScreen";

export const CoinbaseWalletSetup: React.FC<{
  onBack: () => void;
  walletsInfo: WalletInfo[];
}> = ({ onBack, walletsInfo }) => {
  const coinbase = walletsInfo.find(
    (w) => w.wallet.id === walletIds.coinbase,
  ) as WalletInfo;

  return (
    <ConnectingScreen
      onBack={onBack}
      walletName={coinbase.wallet.meta.name}
      walletIconURL={coinbase.wallet.meta.iconURL}
      supportLink="https://help.coinbase.com/en/wallet/other-topics/troubleshooting-and-tips"
    />
  );
};
