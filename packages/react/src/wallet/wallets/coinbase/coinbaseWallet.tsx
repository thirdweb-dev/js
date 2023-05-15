import type { WalletOptions, ConfiguredWallet } from "@thirdweb-dev/react-core";
import { CoinbaseWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { CoinbaseConnectUI } from "./CoinbaseConnectUI";

export const coinbaseWallet = () => {
  const configuredWallet = {
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
    create(options: WalletOptions) {
      return new CoinbaseWallet({ ...options, headlessMode: true });
    },
    connectUI: CoinbaseConnectUI,
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
  } satisfies ConfiguredWallet<CoinbaseWallet>;

  return configuredWallet;
};
