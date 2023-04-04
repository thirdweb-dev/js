import { ConnectingScreen } from "../ConnectingScreen";
import { useSupportedWallet } from "../useSupportedWallet";
import { Wallet } from "@thirdweb-dev/react-core";

export const MetamaskConnecting: React.FC<{
  onBack: () => void;
}> = (props) => {
  const metamask = useSupportedWallet("metamask") as Wallet;
  return (
    <ConnectingScreen
      onBack={props.onBack}
      walletName={metamask.meta.name}
      walletIconURL={metamask.meta.iconURL}
      supportLink="https://support.metamask.io/hc/en-us/articles/4406430256539-User-Guide-Troubleshooting"
    />
  );
};
