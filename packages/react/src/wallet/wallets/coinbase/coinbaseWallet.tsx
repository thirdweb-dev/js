import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { CoinbaseWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { CoinbaseConnectUI } from "./CoinbaseConnectUI";

type CoinbaseOptions = {
  /**
   * whether to switch to `activeChain` after connecting to the wallet or just stay on the chain that wallet is already connected to
   * default - false
   * @default false
   */
  autoSwitch?: boolean;
};

export const coinbaseWallet = (
  options?: CoinbaseOptions,
): WalletConfig<CoinbaseWallet> => {
  return {
    id: CoinbaseWallet.id,
    meta: {
      name: "Coinbase Wallet",
      iconURL:
        "ipfs://QmcJBHopbwfJcLqJpX2xEufSS84aLbF7bHavYhaXUcrLaH/coinbase.svg",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
        android: "https://play.google.com/store/apps/details?id=org.toshi",
        ios: "https://apps.apple.com/us/app/coinbase-wallet-nfts-crypto/id1278383455",
      },
    },
    create(walletOptions: WalletOptions) {
      return new CoinbaseWallet({ ...walletOptions, headlessMode: true });
    },
    connectUI(props) {
      return <CoinbaseConnectUI {...props} autoSwitch={options?.autoSwitch} />;
    },
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return (
          globalThis.window.ethereum?.isCoinbaseWallet ||
          globalThis.window.ethereum?.providers?.some(
            (p) => p.isCoinbaseWallet,
          ) ||
          false
        );
      }
      return false;
    },
    autoSwitch: options?.autoSwitch,
  };
};
