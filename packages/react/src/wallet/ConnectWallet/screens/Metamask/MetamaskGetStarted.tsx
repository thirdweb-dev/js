import { Wallet, useSupportedWallet } from "@thirdweb-dev/react-core";
import { GetStartedScreen } from "../GetStartedScreen";

export const MetamaskGetStarted: React.FC<{
  onBack: () => void;
}> = (props) => {
  const wallet = useSupportedWallet("metamask") as Wallet;
  return (
    <GetStartedScreen
      walletIconURL={wallet.meta.iconURL}
      walletName={wallet.meta.name}
      chromeExtensionLink="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      googlePlayStoreLink="https://play.google.com/store/apps/details?id=io.metamask"
      appleStoreLink="https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202"
      onBack={props.onBack}
    />
  );
};
