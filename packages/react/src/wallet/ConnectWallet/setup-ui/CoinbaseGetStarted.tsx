import { iconSize } from "../../../design-system";
import { CoinbaseWalletIcon } from "../icons/CoinbaseWalletIcon";
import { GetStartedScreen } from "./GetStartedScreen";

export const CoinbaseGetStarted: React.FC<{ onBack: () => void }> = (props) => {
  return (
    <GetStartedScreen
      walletIcon={
        <CoinbaseWalletIcon width={iconSize.xl} height={iconSize.xl} />
      }
      walletName="Coinbase"
      chromeExtensionLink="https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad"
      googlePlayStoreLink="https://play.google.com/store/apps/details?id=org.toshi"
      appleStoreLink="https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455"
      onBack={props.onBack}
    />
  );
};
