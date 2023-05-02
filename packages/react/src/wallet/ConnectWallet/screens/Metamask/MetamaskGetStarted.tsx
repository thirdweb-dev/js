import { GetStartedScreen } from "../GetStartedScreen";
import { walletIds } from "@thirdweb-dev/wallets";
import { WalletInfo } from "../../../types";

export const MetamaskGetStarted: React.FC<{
  onBack: () => void;
  walletsInfo: WalletInfo[];
}> = (props) => {
  const walletInfo = props.walletsInfo.find(
    (w) => w.wallet.id === walletIds.metamask,
  ) as WalletInfo;

  const { name, iconURL } = walletInfo?.wallet.meta;

  return (
    <GetStartedScreen
      walletIconURL={iconURL}
      walletName={name}
      chromeExtensionLink="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      googlePlayStoreLink="https://play.google.com/store/apps/details?id=io.metamask"
      appleStoreLink="https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202"
      onBack={props.onBack}
    />
  );
};
