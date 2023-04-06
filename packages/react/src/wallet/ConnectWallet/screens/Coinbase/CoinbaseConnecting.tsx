import { ConnectingScreen } from "../ConnectingScreen";
import { useSupportedWallet } from "../useSupportedWallet";
import { Wallet } from "@thirdweb-dev/react-core";

export const CoinbaseWalletSetup: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const coinbaseWalletObj = useSupportedWallet("coinbaseWallet") as Wallet;
  return (
    <ConnectingScreen
      onBack={onBack}
      walletName={coinbaseWalletObj.meta.name}
      walletIconURL={coinbaseWalletObj.meta.iconURL}
      supportLink="https://help.coinbase.com/en/wallet/other-topics/troubleshooting-and-tips"
    />
  );
};
