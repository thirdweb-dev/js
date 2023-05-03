import { ConnectingScreen } from "../ConnectingScreen";
import { useWalletInfo } from "../../walletInfo";

export const MetamaskConnecting: React.FC<{
  onBack: () => void;
}> = (props) => {
  const metamaskInfo = useWalletInfo("metamask", true);
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
