import { GetStartedScreen } from "../GetStartedScreen";
import { Wallet, useSupportedWallet } from "@thirdweb-dev/react-core";

export const CoinbaseGetStarted: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const coinbaseWalletObj = useSupportedWallet("coinbaseWallet") as Wallet;
  return (
    <GetStartedScreen
      walletIconURL={coinbaseWalletObj.meta.iconURL}
      walletName={coinbaseWalletObj.meta.name}
      chromeExtensionLink="https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad"
      googlePlayStoreLink="https://play.google.com/store/apps/details?id=org.toshi"
      appleStoreLink="https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455"
      onBack={onBack}
    />
  );
};
