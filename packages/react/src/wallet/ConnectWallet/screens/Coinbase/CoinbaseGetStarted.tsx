import { GetStartedScreen } from "../GetStartedScreen";
import { useWalletInfo } from "../../walletInfo";

export const CoinbaseGetStarted: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const coinbaseWalletObj = useWalletInfo("coinbase", true);
  const { name, iconURL } = coinbaseWalletObj.wallet.meta;

  return (
    <GetStartedScreen
      walletIconURL={iconURL}
      walletName={name}
      chromeExtensionLink="https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad"
      googlePlayStoreLink="https://play.google.com/store/apps/details?id=org.toshi"
      appleStoreLink="https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455"
      onBack={onBack}
    />
  );
};
