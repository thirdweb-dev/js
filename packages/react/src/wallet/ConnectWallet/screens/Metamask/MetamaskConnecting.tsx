import { walletIds } from "@thirdweb-dev/wallets";
import { ConnectingScreen } from "../ConnectingScreen";
import { WalletInfo } from "../../../types";

export const MetamaskConnecting: React.FC<{
  onBack: () => void;
  walletsInfo: WalletInfo[];
}> = (props) => {
  const metamaskInfo = props.walletsInfo.find(
    (w) => w.wallet.id === walletIds.metamask,
  ) as WalletInfo;
  const { name, iconURL } = metamaskInfo.wallet.meta;
  return (
    <ConnectingScreen
      onBack={props.onBack}
      walletName={name}
      walletIconURL={iconURL}
      supportLink="https://support.metamask.io/hc/en-us/articles/4406430256539-User-Guide-Troubleshooting"
    />
  );
};
