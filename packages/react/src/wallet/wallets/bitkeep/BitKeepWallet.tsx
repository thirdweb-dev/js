import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import {  BitKeepWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";
import { BitKeepConnectUI } from "./BitKeepConnectUI";

declare global {
  interface Window {
    bitkeep?: any
  }
}

export const bitkeepWallet = (): WalletConfig<BitKeepWallet> => {
  return {
    id: BitKeepWallet.id,
    meta: BitKeepWallet.meta,
    create: (options: WalletOptions) => {
      return new BitKeepWallet({ ...options, qrcode: false });
    },
    connectUI: BitKeepConnectUI,
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return (
          globalThis.window.ethereum?.isBitKeep || 
          !!globalThis.window.bitkeep?.ethereum
        );
      }
      return false;
    },
  };
};
