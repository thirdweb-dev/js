import { iconSize } from "../../../../design-system";
import { MetamaskIcon } from "../../icons/MetamaskIcon";
import { ConnectingScreen } from "../ConnectingScreen";

export const MetamaskConnecting: React.FC<{ onBack: () => void }> = (props) => {
  return (
    <ConnectingScreen
      onBack={props.onBack}
      walletName="Metamask"
      icon={<MetamaskIcon width={iconSize.xl} height={iconSize.xl} />}
      supportLink="https://support.metamask.io/hc/en-us/articles/4406430256539-User-Guide-Troubleshooting"
    />
  );
};
