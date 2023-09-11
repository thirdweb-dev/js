import type { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import {
  PhantomWallet,
  getInjectedPhantomProvider,
} from "@thirdweb-dev/wallets";
import { PhantomConnectUI } from "./PhantomConnectUI";

export const phantomWallet = (): WalletConfig<PhantomWallet> => {
  return {
    id: PhantomWallet.id,
    meta: PhantomWallet.meta,
    create: (walletOptions: WalletOptions) => new PhantomWallet(walletOptions),
    connectUI: PhantomConnectUI,
    isInstalled() {
      return !!getInjectedPhantomProvider();
    },
  };
};
