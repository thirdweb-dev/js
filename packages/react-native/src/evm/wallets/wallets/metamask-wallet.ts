import { walletIds } from "@thirdweb-dev/wallets";
import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WCMeta } from "../types/wc";
import { WalletConnectBase } from "./wallet-connect/WalletConnectBase";
import { WalletConnectConfig } from "./wallet-connect/wallet-connect";

export class MetaMaskWallet extends WalletConnectBase {
  static id = walletIds.metamask;
  static meta = {
    name: "MetaMask",
    iconURL:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
    links: {
      native: "metamask:",
      universal: "https://metamask.app.link",
    },
  };

  getMeta(): WCMeta {
    return MetaMaskWallet.meta;
  }
}

export const metamaskWallet = (config?: WalletConnectConfig) => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptions) =>
      new MetaMaskWallet({
        ...options,
        walletId: walletIds.metamask,
        projectId: config?.projectId,
      }),
    recommended: config?.recommended,
  } satisfies WalletConfig;
};
