import { walletIds } from "@thirdweb-dev/wallets";
import { WalletOptions, WalletConfig } from "@thirdweb-dev/react-core";
import { WalletConnectV1 } from "./WalletConnectV1";
import { WCMeta } from "../types/wc";

export class MetaMaskWallet extends WalletConnectV1 {
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

export const metamaskWallet = () => {
  return {
    id: MetaMaskWallet.id,
    meta: MetaMaskWallet.meta,
    create: (options: WalletOptions) =>
      new MetaMaskWallet({ ...options, walletId: walletIds.metamask }),
  } satisfies WalletConfig;
};
