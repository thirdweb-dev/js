import { MetamaskWallet } from "../../../wallets";
import { ConnectingScreen } from "../ConnectingScreen";

export const MetamaskConnecting: React.FC<{ onBack: () => void }> = (props) => {
  return (
    <ConnectingScreen
      onBack={props.onBack}
      walletName={MetamaskWallet.meta.name}
      walletIconURL={MetamaskWallet.meta.iconURL}
      supportLink="https://support.metamask.io/hc/en-us/articles/4406430256539-User-Guide-Troubleshooting"
    />
  );
};
