import type { WalletOptions, ConfiguredWallet } from "@thirdweb-dev/react-core";
import { MetaMaskWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { MetamaskConnectUI } from "./MetamaskConnectUI";

export const metamaskWallet = (): ConfiguredWallet<MetaMaskWallet> => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptions) => {
      return new MetaMaskWallet({ ...options, qrcode: false });
    },
    connectUI: MetamaskConnectUI,
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return globalThis.window.ethereum.isMetaMask;
      }
      return false;
    },
  };
};
