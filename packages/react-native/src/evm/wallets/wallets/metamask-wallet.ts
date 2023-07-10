import { walletIds } from "@thirdweb-dev/wallets";
import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WalletConnectV2 } from "./WalletConnectV2";
import { WCMeta } from "../types/wc";

export class MetaMaskWallet extends WalletConnectV2 {
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
