import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { MetaMaskWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { MetamaskConnectUI } from "./MetamaskConnectUI";

type MetamaskOptions = {
  /**
   * whether to switch to `activeChain` after connecting to the wallet or just stay on the chain that wallet is already connected to
   * default - false
   * @default false
   */
  autoSwitch?: boolean;
};

export const metamaskWallet = (
  options?: MetamaskOptions,
): WalletConfig<MetaMaskWallet> => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (walletOptions: WalletOptions) => {
      return new MetaMaskWallet({ ...walletOptions, qrcode: false });
    },
    connectUI: MetamaskConnectUI,
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return globalThis.window.ethereum.isMetaMask;
      }
      return false;
    },
    autoSwitch: options?.autoSwitch,
  };
};
