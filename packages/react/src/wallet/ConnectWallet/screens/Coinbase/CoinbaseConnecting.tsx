import { CoinbaseWallet } from "../../../wallets";
import { ConnectingScreen } from "../ConnectingScreen";

export const CoinbaseWalletSetup: React.FC<{ onBack: () => void }> = (
  props,
) => {
  return (
    <ConnectingScreen
      onBack={props.onBack}
      walletName="Coinbase"
      walletIconURL={CoinbaseWallet.meta.iconURL}
      supportLink="https://help.coinbase.com/en/wallet/other-topics/troubleshooting-and-tips"
    />
  );
};
