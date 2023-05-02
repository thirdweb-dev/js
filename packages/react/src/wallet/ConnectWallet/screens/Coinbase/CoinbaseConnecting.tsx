import { ConnectingScreen } from "../ConnectingScreen";
import { useWalletInfo } from "../../walletInfo";

export const CoinbaseWalletSetup: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const coinbase = useWalletInfo("coinbase", true);

  return (
    <ConnectingScreen
      onBack={onBack}
      walletName={coinbase.wallet.meta.name}
      walletIconURL={coinbase.wallet.meta.iconURL}
      supportLink="https://help.coinbase.com/en/wallet/other-topics/troubleshooting-and-tips"
    />
  );
};
