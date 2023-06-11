import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { ZerionWallet, assertWindowEthereum } from "@thirdweb-dev/wallets";

export const zerionWallet = (): WalletConfig<ZerionWallet> => {
  return {
    id: ZerionWallet.id,
    meta: ZerionWallet.meta,
    create: (options: WalletOptions) => {
      return new ZerionWallet(options);
    },
    isInstalled() {
      if (assertWindowEthereum(globalThis.window)) {
        return globalThis.window.ethereum.isZerion;
      }
      return false;
    },
  };
};
