import { CoinbaseWallet } from "../../../wallets";
import { GetStartedScreen } from "../GetStartedScreen";

export const CoinbaseGetStarted: React.FC<{ onBack: () => void }> = (props) => {
  return (
    <GetStartedScreen
      walletIconURL={CoinbaseWallet.meta.iconURL}
      walletName="Coinbase"
      chromeExtensionLink="https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad"
      googlePlayStoreLink="https://play.google.com/store/apps/details?id=org.toshi"
      appleStoreLink="https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455"
      onBack={props.onBack}
    />
  );
};
