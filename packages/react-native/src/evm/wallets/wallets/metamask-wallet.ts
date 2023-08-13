import { walletIds } from "@thirdweb-dev/wallets";
import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WCMeta } from "../types/wc";
import { WalletConnectBase } from "./wallet-connect/WalletConnectBase";

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

  setMeta(meta: WCMeta) {
    MetaMaskWallet.meta = meta;
  }
}

type MetaMaskWalletConfig = { projectId?: string };

export const metamaskWallet = (config?: MetaMaskWalletConfig) => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptions) =>
      new MetaMaskWallet({
        ...options,
        walletId: walletIds.metamask,
        projectId: config?.projectId,
      }),
  } satisfies WalletConfig;
};
