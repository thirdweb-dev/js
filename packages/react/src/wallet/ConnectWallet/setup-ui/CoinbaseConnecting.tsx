import { iconSize } from "../../../design-system";
import { CoinbaseWalletIcon } from "../icons/CoinbaseWalletIcon";
import { ConnectingScreen } from "./ConnectingScreen";

export const CoinbaseWalletSetup: React.FC<{ onBack: () => void }> = (
  props,
) => {
  return (
    <ConnectingScreen
      onBack={props.onBack}
      walletName="Coinbase"
      icon={<CoinbaseWalletIcon width={iconSize.xl} height={iconSize.xl} />}
      supportLink="https://help.coinbase.com/en/wallet/other-topics/troubleshooting-and-tips"
    />
  );
};
