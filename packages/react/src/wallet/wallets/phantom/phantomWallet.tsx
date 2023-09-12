import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import {
  PhantomWallet,
  getInjectedPhantomProvider,
} from "@thirdweb-dev/wallets";
import { PhantomConnectUI } from "./PhantomConnectUI";

type PhantomWalletOptions = {
  /**
   * If true, the wallet will be tagged as "reccomended" in ConnectWallet Modal
   */
  recommended?: boolean;
};

export const phantomWallet = (
  options?: PhantomWalletOptions,
): WalletConfig<PhantomWallet> => {
  return {
    recommended: options?.recommended,
    id: PhantomWallet.id,
    meta: PhantomWallet.meta,
    create: (walletOptions: WalletOptions) => new PhantomWallet(walletOptions),
    connectUI: PhantomConnectUI,
    isInstalled() {
      return !!getInjectedPhantomProvider();
    },
  };
};
