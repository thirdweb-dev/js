import type { WalletOptions, ConfiguredWallet } from "@thirdweb-dev/react-core";
import { MetaMaskWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { MetamaskConnectUI } from "./MetamaskConnectUI";

export const metamaskWallet = () => {
  const configuredWallet = {
    id: MetaMaskWallet.id,
    meta: {
      name: "MetaMask",
      iconURL:
        "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        android: "https://play.google.com/store/apps/details?id=io.metamask",
        ios: "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202",
      },
    },
    create: (options: WalletOptions) => {
      return new MetaMaskWallet({ ...options, qrcode: false });
    },
    connectUI(props) {
      return (
        <MetamaskConnectUI {...props} configuredWallet={configuredWallet} />
      );
    },
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return globalThis.window.ethereum.isMetaMask;
      }
      return false;
    },
  } satisfies ConfiguredWallet<MetaMaskWallet>;

  return configuredWallet;
};
