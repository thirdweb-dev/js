import { WalletInfo } from "../../../types";
import { GetStartedScreen } from "../GetStartedScreen";

export const CoinbaseGetStarted: React.FC<{
  onBack: () => void;
  walletsInfo: WalletInfo[];
}> = ({ onBack, walletsInfo }) => {
  const coinbaseWalletObj = walletsInfo.find(
    (w) => w.wallet.id === "coinbaseWallet",
  ) as WalletInfo;

  return (
    <GetStartedScreen
      walletIconURL={coinbaseWalletObj.wallet.meta.iconURL}
      walletName={coinbaseWalletObj.wallet.meta.name}
      chromeExtensionLink="https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad"
      googlePlayStoreLink="https://play.google.com/store/apps/details?id=org.toshi"
      appleStoreLink="https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455"
      onBack={onBack}
    />
  );
};
